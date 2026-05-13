const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY || 'your_jwt_secret_key'; // Secret key for JWT

const normalizeHeaderValue = (value) => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

const getGatewayIdentity = (req) => {
  const headers = req.headers || {};
  const userId = normalizeHeaderValue(
    headers['x-wso2-user-id'] ||
    headers['x-wso2-username'] ||
    headers['x-wso2-user'] ||
    headers['x-end-user-username'] ||
    headers['x-authenticated-user']
  );

  const role = String(
    normalizeHeaderValue(
      headers['x-wso2-role'] ||
      headers['x-wso2-user-role'] ||
      headers['x-user-role'] ||
      'user'
    )
  ).toLowerCase();

  const email = normalizeHeaderValue(headers['x-wso2-email'] || headers['x-user-email']);
  const username = normalizeHeaderValue(headers['x-wso2-username'] || headers['x-end-user-username']);

  if (!userId && !username && !email && !headers['x-jwt-assertion']) {
    return null;
  }

  return {
    userId: userId || username || email,
    username,
    email,
    role,
    isWSO2Token: true,
    isGatewayTrusted: true,
  };
};

const buildUserFromClaims = (claims, fallbackRole = 'user') => {
  if (!claims || typeof claims !== 'object') {
    return null;
  }

  const claimRole = claims.role || claims.roles || claims['http://wso2.org/claims/role'];
  const scope = claims.scope;
  const scopeText = Array.isArray(scope) ? scope.join(' ') : String(scope || '');
  const resolvedRole = String(claimRole || (scopeText.toLowerCase().includes('admin') ? 'admin' : fallbackRole)).toLowerCase();

  return {
    userId: claims.sub || claims.client_id || claims.username || claims.email,
    username: claims.username || claims.preferred_username || claims['http://wso2.org/claims/username'],
    email: claims.email || claims['http://wso2.org/claims/emailaddress'],
    role: resolvedRole,
    isWSO2Token: true,
    claims,
  };
};

const mergeGatewayContext = (baseUser, req) => {
  const gatewayIdentity = getGatewayIdentity(req);

  if (!gatewayIdentity) {
    return baseUser;
  }

  return {
    ...baseUser,
    ...gatewayIdentity,
    role: gatewayIdentity.role || baseUser.role || 'user',
    userId: gatewayIdentity.userId || baseUser.userId,
    username: gatewayIdentity.username || baseUser.username,
    email: gatewayIdentity.email || baseUser.email,
    isGatewayTrusted: true,
  };
};

// Middleware to authenticate the token (accepts both local JWT and WSO2 tokens)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

  if (token) {
    // Try to verify as local JWT first
    jwt.verify(token, SECRET_KEY, { ignoreExpiration: false }, (err, decoded) => {
      if (!err) {
        // Successfully verified as local JWT
        req.user = decoded;
        return next();
      }

      // If local JWT verification fails, try to decode as WSO2 token (don't verify signature in dev)
      try {
        const decodedToken = jwt.decode(token);
        if (decodedToken) {
          // WSO2 token decoded successfully
          console.log('✓ Using WSO2 token for user:', decodedToken.sub || decodedToken.client_id);
          req.user = mergeGatewayContext(buildUserFromClaims(decodedToken), req);
          return next();
        }
      } catch (e) {
        // Token decode failed
      }

      return res.status(403).json({ message: 'Invalid or expired token' });
    });

    return;
  }

  const backendJwt = req.headers['x-jwt-assertion'];
  if (backendJwt) {
    try {
      const decodedAssertion = jwt.decode(backendJwt);
      if (decodedAssertion) {
        console.log('✓ Using backend JWT assertion for user:', decodedAssertion.sub || decodedAssertion.client_id || decodedAssertion.username);
        req.user = mergeGatewayContext(buildUserFromClaims(decodedAssertion), req);
        return next();
      }
    } catch (error) {
      // Ignore decode failures and fall through to gateway headers
    }
  }

  const gatewayIdentity = getGatewayIdentity(req);
  if (gatewayIdentity) {
    console.log('✓ Using gateway identity for user:', gatewayIdentity.userId || gatewayIdentity.username || gatewayIdentity.email);
    req.user = gatewayIdentity;
    return next();
  }

  return res.status(401).json({ message: 'Access token required' });
};

// Middleware to check if the user is an admin
const checkAdminRole = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied, admin only' });
  }
  next();
};

module.exports = { authenticateToken, checkAdminRole };

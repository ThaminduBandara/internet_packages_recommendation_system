export const getApiToken = () => {
  const accessToken = localStorage.getItem("access_token");
  const token = localStorage.getItem("token");
  const result = accessToken || token;
  console.log("🔐 getApiToken():", {
    hasAccessToken: !!accessToken,
    hasToken: !!token,
    returning: result ? result.substring(0, 30) + "..." : "NONE"
  });
  return result;
};

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch (error) {
    return {};
  }
};

export const getGatewayContextHeaders = () => {
  const user = getStoredUser();
  const headers = {};

  if (user._id || user.userId || user.id) {
    headers["X-WSO2-User-Id"] = String(user._id || user.userId || user.id);
  }

  if (user.username) {
    headers["X-WSO2-Username"] = user.username;
  }

  if (user.email) {
    headers["X-WSO2-Email"] = user.email;
  }

  if (user.role) {
    headers["X-WSO2-Role"] = String(user.role).toLowerCase();
  }

  return headers;
};

export const buildAuthHeaders = (token = getApiToken()) => {
  if (!token) {
    console.warn("❌ buildAuthHeaders: No token available!", {
      hasAccessToken: !!localStorage.getItem("access_token"),
      hasLocalToken: !!localStorage.getItem("token")
    });
    return {};
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };
  console.log("✅ buildAuthHeaders: Created headers with token:", token.substring(0, 30) + "...");
  return headers;
};

export const clearAuthTokens = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
};

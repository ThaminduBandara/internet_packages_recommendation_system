# Internet Packages Recommendation System

A full-stack web application for browsing, managing, and recommending internet packages. The project is split into a React frontend, a Node.js/Express backend, and MongoDB for persistence.

## Project Layout

- `frontend/` - React application for the user interface
- `backend/` - Express API, MongoDB models, controllers, and authentication middleware
- `docker-compose.yaml` - Local multi-container setup for frontend, backend, and MongoDB
- `Jenkinsfile` - CI/CD pipeline for building, pushing, and deploying Docker images
- `terraform/` - Infrastructure configuration

## Prerequisites

- Node.js and npm
- Docker and Docker Compose
- A running MongoDB instance, or Docker Compose for local development

## Environment Variables

The backend reads its configuration from `backend/.env`.

Required values:

- `MONGO_URI` - MongoDB connection string
- `SECRET_KEY` - JWT signing secret
- `PORT` - Backend port, defaults to `4000`
- `HOST` - Host to bind to, defaults to `0.0.0.0`

The frontend uses:

- `REACT_APP_API_URL` - Base URL for the backend API

For WSO2 API Manager integration, set `REACT_APP_API_URL` to your WSO2 gateway URL, for example `http://localhost:8280/packages/v1`.

## Run Locally Without Docker

Start the backend:

```bash
cd backend
npm install
npm start
```

Start the frontend in a separate terminal:

```bash
cd frontend
npm install
npm start
```

By default, the frontend runs on `http://localhost:3000` and the backend runs on `http://localhost:4000`.

## Run With Docker Compose

From the project root:

```bash
docker compose up --build
```

This starts:

- frontend on `http://localhost:3000`
- backend on `http://localhost:4000`
- MongoDB on `localhost:27017`

If you are using WSO2 API Manager, publish the backend API in WSO2 with a gateway base such as `http://localhost:8280/packages/v1`, then rebuild the frontend so it points to that gateway URL instead of `http://localhost:4000`.

### WSO2 API Manager Setup

If WSO2 API Manager is already installed on your machine, you do not need to add it as a container in this project. Instead:

1. Start WSO2 API Manager locally.
2. Publish the backend endpoint as an API in the Publisher.
3. Use the backend URL as `http://localhost:4000/api` in WSO2 so the gateway forwards to your Express app.
4. Set the frontend API base URL to the WSO2 gateway endpoint, for example `http://localhost:8280/packages/v1`.
5. Rebuild the frontend so the React app sends requests through WSO2.

The backend is configured to bind to `0.0.0.0`, which allows Docker and WSO2 to reach it reliably.

## CI/CD

The Jenkins pipeline builds multi-architecture Docker images for the frontend and backend, pushes them to Docker Hub, and deploys the updated containers to the target EC2 host.

## API Overview

The backend exposes a health-style root response at `/` and mounts application routes under `/api`.

## Notes

- The frontend is a Create React App project.
- The backend uses Express, Mongoose, JWT, and CORS.
- If you change the backend port or host, update the frontend API URL and Docker configuration accordingly.
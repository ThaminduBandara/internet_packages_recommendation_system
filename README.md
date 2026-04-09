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
- `HOST` - Host to bind to, defaults to `localhost`

The frontend uses:

- `REACT_APP_API_URL` - Base URL for the backend API

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

## CI/CD

The Jenkins pipeline builds multi-architecture Docker images for the frontend and backend, pushes them to Docker Hub, and deploys the updated containers to the target EC2 host.

## API Overview

The backend exposes a health-style root response at `/` and mounts application routes under `/api`.

## Notes

- The frontend is a Create React App project.
- The backend uses Express, Mongoose, JWT, and CORS.
- If you change the backend port or host, update the frontend API URL and Docker configuration accordingly.
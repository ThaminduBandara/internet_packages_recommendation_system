pipeline {
  agent any

  environment {
    DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
    FRONTEND_IMAGE = "thamindubandara/internet_packages_recommendation_system-frontend"
    BACKEND_IMAGE  = "thamindubandara/internet_packages_recommendation_system-backend"
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: 'main', url: 'https://github.com/ThaminduBandara/internet_packages_recommendation_system.git'
      }
    }

    stage('Docker Diagnostics') {
      steps {
        sh 'echo "--- Docker Version ---"; docker --version'
        sh 'echo "--- Docker Info ---"; docker info'
      }
    }

    stage('Login to Docker Hub') {
      steps {
        sh '''
        echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin
        '''
      }
    }

    stage('Build and Push Frontend Image') {
      steps {
        dir('frontend') {
          sh '''
          docker build -t ${FRONTEND_IMAGE}:latest .
          docker push ${FRONTEND_IMAGE}:latest
          '''
        }
      }
    }

    stage('Build and Push Backend Image') {
      steps {
        dir('backend') {
          sh '''
          docker build -t ${BACKEND_IMAGE}:latest .
          docker push ${BACKEND_IMAGE}:latest
          '''
        }
      }
    }

    stage('Cleanup') {
      steps {
        sh 'docker system prune -f || true'
      }
    }
  }

  post {
    success {
      echo "Build and push completed successfully!"
    }
    failure {
      echo "Build failed — check console output for errors."
    }
  }
}


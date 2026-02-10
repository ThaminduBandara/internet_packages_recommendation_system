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
        git branch: 'main',
            url: 'https://github.com/ThaminduBandara/internet_packages_recommendation_system.git'
      }
    }

    stage('Docker Diagnostics') {
      steps {
        sh 'docker --version'
        sh 'docker info'
      }
    }

    stage('Login to Docker Hub') {
      steps {
        sh '''
          echo $DOCKERHUB_CREDENTIALS_PSW | \
          docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin
        '''
      }
    }

    stage('Build and Push Frontend Image') {
      steps {
        dir('frontend') {
          sh '''
            docker buildx build \
              --platform linux/amd64,linux/arm64 \
              -t ${FRONTEND_IMAGE}:latest \
              --push .
          '''
        }
      }
    }

    stage('Build and Push Backend Image') {
      steps {
        dir('backend') {
          sh '''
            docker buildx build \
              --platform linux/amd64,linux/arm64 \
              -t ${BACKEND_IMAGE}:latest \
              --push .
          '''
        }
      }
    }

    stage('Deploy to EC2') {
      steps {
        sshagent(['ec2-ssh-key']) {
          sh '''
            ssh -o StrictHostKeyChecking=no ubuntu@3.6.90.33 "
              cd /home/ubuntu/iprs &&
              docker compose pull &&
              docker compose up -d
            "
          '''
        }
      }
    }
  }

  post {
    success {
      echo " CI/CD pipeline completed successfully!"
    }
    failure {
      echo " Pipeline failed — check logs above."
    }
  }
}

pipeline {
    agent any

    environment {
        // Ensure the PATH includes the directories for Node.js and npm
        // PATH = "${PATH}:/usr/bin:/usr/local/bin"  // Adjust as needed
        // Docker image name
        DOCKER_IMAGE = "nikhil112/web-app:${env.BUILD_NUMBER}"
    }

    stages {
        stage('Clone Repository') {
            steps {
                // Pull the source code from GitHub
                git credentialsId: 'github-credentials', url: 'https://github.com/nik8839/simple-web-app.git'
            }
        }

        stage('Install Node.js Dependencies') {
            steps {
                // Install Node.js dependencies
                sh 'npm install'
            }
        }

        stage('Run Unit Tests') {
            steps {
                // Run the unit tests
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image using the Dockerfile in the repo
                    sh 'docker build -t $DOCKER_IMAGE .'
                }
            }
        }

        stage('Run Docker Container') {
            steps {
                script {
                    // Run the built Docker container and perform any tests
                    sh '''
                    docker run -d --name nodejs-container -p 8080:8080 $DOCKER_IMAGE
                    sleep 5  # Allow the container to start
                    curl -f http://localhost:8080 || exit 1  # Replace with your app's endpoint
                    docker stop nodejs-container
                    docker rm nodejs-container
                    '''
                }
            }
        }

        stage('Push Docker Image to Docker Hub') {
            when {
                expression { return env.BRANCH_NAME == 'main' }  // Only push from the main branch
            }
            steps {
                script {
                    // Log in to Docker Hub and push the image using stored credentials
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKERHUB_USERNAME', passwordVariable: 'DOCKERHUB_PASSWORD')]) {
                        sh 'echo $DOCKERHUB_PASSWORD | docker login -u $DOCKERHUB_USERNAME --password-stdin'
                        sh 'docker push $DOCKER_IMAGE'
                    }
                }
            }
        }
    }

    post {
        always {
            // Clean up any Docker images and containers after the build
            sh 'docker system prune -f'
        }
    }
}

pipeline {
    agent any

    stages {

        stage('Build') {
            steps {
                bat 'echo Compiling'
            }
        }

        stage('Test') {
            steps {
                bat 'echo Running Tests'
            }
        }

        stage('Deploy') {
            steps {
                bat 'echo Deploying application'
            }
        }

        stage('End') {
            steps {
                bat 'echo Pipeline completed'
            }
        }

    }
}

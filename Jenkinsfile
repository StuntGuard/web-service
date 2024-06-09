pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh 'docker build -t asia-southeast2-docker.pkg.dev/capstone-project-424205/stuntguard-main/stuntguard-app .'
        echo 'Success Build'
      }
    }

    stage('Push To Artifact Registry') {
      steps {
        sh 'docker push asia-southeast2-docker.pkg.dev/capstone-project-424205/stuntguard-main/stuntguard-app'
        echo 'Success To Push Images'
      }
    }

    stage('Deploy to Cloud Run') {
      steps {
        sh '''gcloud run deploy stuntguard-api \\
    --set-env-vars SECRET_TOKEN="1eYh7bZ8S1Q9K7cJ6X8mN2F4L5V3bW1gZ6O0T3P4J9R5D2S1Q7K4L8A2M1N3C5D6" \\
    --set-env-vars DB_NAME="stuntguard" \\
    --set-env-vars DB_USER="stuntguard" \\
    --set-env-vars DB_PASS="stuntguard" \\
    --set-env-vars DB_HOST="34.101.252.113" \\
    --set-env-vars GCLOUD_PROJECT_ID="capstone-project-424205" \\
    --set-env-vars GCLOUD_STORAGE_BUCKET="stuntguard" \\
    --set-env-vars GCLOUD_STORAGE_OBJECT_URL="https://storage.googleapis.com/stuntguard/images/" \\
    --set-env-vars GCLOUD_STORAGE_MODEL_URL="https://storage.googleapis.com/stuntguard/models/model.json" \\
    --image asia-southeast2-docker.pkg.dev/capstone-project-424205/stuntguard-app \\
    --platform managed \\
    --region asia-southeast2 \\
    --allow-unauthenticated
'''
        echo 'Success to Deploy'
      }
    }

    stage('End') {
      steps {
        echo 'Everything is Good'
      }
    }

  }
}
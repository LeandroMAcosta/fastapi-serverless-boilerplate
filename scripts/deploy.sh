#!/bin/bash

set -e

# Default values
# AWS_PROFILE=${AWS_PROFILE:-default}
AWS_PROFILE=fastapi-serverless-boilerplate
ENVIRONMENT=${ENVIRONMENT:-dev}

# Function to display usage
usage() {
    echo "Usage: $0 [-p profile] [-e environment]"
    echo "  -p: AWS profile (default: default)"
    echo "  -e: Environment (default: dev)"
    exit 1
}

# Parse command line arguments
while getopts "p:e:" opt; do
    case $opt in
        p) AWS_PROFILE="$OPTARG";;
        e) ENVIRONMENT="$OPTARG";;
        *) usage;;
    esac
done

# Export AWS profile for all commands
export AWS_PROFILE

echo "Using AWS Profile: $AWS_PROFILE"
echo "Deploying to environment: $ENVIRONMENT"

# Deploy backend
echo "Deploying backend..."
cd infrastructure
terraform init
terraform plan -var="aws_profile=$AWS_PROFILE" -var="environment=$ENVIRONMENT"
terraform apply -auto-approve -var="aws_profile=$AWS_PROFILE" -var="environment=$ENVIRONMENT"

# Get outputs from Terraform
COGNITO_USER_POOL_ID=$(terraform output -raw cognito_user_pool_id)
COGNITO_CLIENT_ID=$(terraform output -raw cognito_client_id)
API_ENDPOINT=$(terraform output -raw api_endpoint)
S3_BUCKET=$(terraform output -raw frontend_bucket)
CLOUDFRONT_DISTRIBUTION_ID=$(terraform output -raw cloudfront_distribution_id)

# Deploy frontend
echo "Deploying frontend..."
cd ../frontend
export AWS_REGION=$(aws configure get region --profile $AWS_PROFILE)
export COGNITO_USER_POOL_ID
export COGNITO_CLIENT_ID
export API_ENDPOINT
export S3_BUCKET
export CLOUDFRONT_DISTRIBUTION_ID

npm install
npm run build

aws s3 sync build/ s3://${S3_BUCKET} --delete

aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_DISTRIBUTION_ID} --paths "/*"

echo "Deployment completed successfully!" 
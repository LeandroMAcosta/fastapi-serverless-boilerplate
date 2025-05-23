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


# Random hash for lambda zip file to enforce cache busting and redeploy
HASH=$(date +%s)
echo "Hash: $HASH"

# Create build directory if it doesn't exist
mkdir -p build

# Build backend
echo "Building backend..."
cd backend
pip install --platform manylinux2014_x86_64 --target=./package --implementation cp --python-version 3.12 --only-binary=:all: --upgrade -r requirements.txt
cp -r *.py core api ./package/
cd package
rm -f ../../build/lambda-${HASH}.zip || true
zip -r ../../build/lambda-${HASH}.zip .
cd ../..


# Deploy backend
echo "Deploying backend..."
cd infrastructure
terraform init
terraform plan -var="aws_profile=$AWS_PROFILE" -var="environment=$ENVIRONMENT"
terraform apply -auto-approve -var="aws_profile=$AWS_PROFILE" -var="environment=$ENVIRONMENT" -var="hash=${HASH}"



# Get outputs from Terraform
COGNITO_USER_POOL_ID=$(terraform output -raw cognito_user_pool_id)
COGNITO_CLIENT_ID=$(terraform output -raw cognito_client_id)
API_ENDPOINT=$(terraform output -raw api_endpoint)
S3_BUCKET=$(terraform output -raw frontend_bucket)
CLOUDFRONT_DISTRIBUTION_ID=$(terraform output -raw cloudfront_distribution_id)
AWS_REGION=$(aws configure get region --profile $AWS_PROFILE)

# Create .env file for frontend
echo "Creating .env file for frontend..."
cat > ../frontend/.env << EOL
REACT_APP_AWS_REGION=${AWS_REGION}
REACT_APP_COGNITO_USER_POOL_ID=${COGNITO_USER_POOL_ID}
REACT_APP_COGNITO_CLIENT_ID=${COGNITO_CLIENT_ID}
REACT_APP_API_ENDPOINT=${API_ENDPOINT}/${ENVIRONMENT}
EOL

# Deploy frontend
echo "Deploying frontend..."
cd ../frontend
export AWS_REGION
export COGNITO_USER_POOL_ID
export COGNITO_CLIENT_ID
export API_ENDPOINT
export S3_BUCKET
export CLOUDFRONT_DISTRIBUTION_ID

npm install --legacy-peer-deps
npm run build

# fastapi-serverless-dev-frontend
aws s3 sync build/ s3://${S3_BUCKET} --delete

# EAYRCO3FU0TV3
aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_DISTRIBUTION_ID} --paths "/*"

echo "Deployment completed successfully!" 
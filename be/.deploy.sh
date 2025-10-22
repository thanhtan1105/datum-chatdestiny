#!/bin/bash

# Check if tag number is provided as argument
if [ -z "$1" ]; then
    echo "Usage: $0 <tag_number>"
    echo "Example: $0 v1.0.0"
    exit 1
fi

TAG_NUMBER=$1
IMAGE_NAME="chatdestiny/be"
ECR_REGISTRY="161409283793.dkr.ecr.us-east-1.amazonaws.com"
REGION="us-east-1"

echo "Starting deployment process for tag: $TAG_NUMBER"

# Step 1: Build Docker image locally
echo "Building Docker image..."
docker build -t $IMAGE_NAME .

# Step 2: Tag the image for ECR repository
echo "Tagging image for ECR..."
docker tag $IMAGE_NAME:latest $ECR_REGISTRY/$IMAGE_NAME:$TAG_NUMBER

# Step 3: Authenticate with AWS ECR
echo "Authenticating with ECR..."
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ECR_REGISTRY

# Step 4: Push the tagged image to ECR
echo "Pushing image to ECR..."
docker push $ECR_REGISTRY/$IMAGE_NAME:$TAG_NUMBER

echo "Deployment completed successfully!"
echo "Image pushed to: $ECR_REGISTRY/$IMAGE_NAME:$TAG_NUMBER"
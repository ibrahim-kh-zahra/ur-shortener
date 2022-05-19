#!/bin/bash

image_name=$1
: "${image_name:?Image name not specified}"
image_tag=$2
: "${image_tag:?Image tag not specified}"
# AWS ECR link
# in form of
# <account_id>.dkr.ecr.<region>.amazonaws.com
image_registry=$3
: "${image_registry:?Image registry not specified}"

git_branch=$4
: "${git_branch:?Git branch not specified}"

dryRun=$5
: "${dryRun:?dryRun parameter missing}"

if $dryRun
  then
    echo "Dry Run enabled, no artifact released"
fi

case $git_branch in

  master)
    environment="production"
    ;;

  *)
    echo "Couldn't match branch $git_branch with any environment"
    exit 1
    ;;
esac


image_basename="$image_registry/$image_name"

# Tagging image as latest and as specific commit version
echo "Building image: ${image_name} with tags [latest, ${image_tag}]"
docker build -t "$image_basename:latest" ./
docker tag "$image_basename:latest" "$image_basename:$image_tag"

echo "Logging into AWS"
aws ecr get-login-password | docker login --username AWS --password-stdin "$image_registry"

if $dryRun
  then
    echo "It's a dry run, omitting pushing images"
  else
    echo "Pushing images [ $image_basename:latest, $image_basename:$image_tag ] to AWS ECR: ${image_registry}"
    docker push "$image_basename:latest"
    docker push "$image_basename:$image_tag"
fi
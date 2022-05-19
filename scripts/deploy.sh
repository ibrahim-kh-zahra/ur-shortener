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

  develop)
    environment="staging"
    ;;

  master)
    environment="production"
    ;;

  *)
    echo "Couldn't match branch $git_branch with any environment"
    exit 1
    ;;
esac

image_basename="$image_registry/$image_name-$environment"

echo "Getting Task Definition for ${image_name}-$environment"
aws ecs describe-task-definition --task-definition "${image_name}-$environment-task" --query taskDefinition > task-definition.json

# echo "Installing JQ"
# apt update && apt-get install -y jq

echo "Creating new Task definitions for ${image_name}"
# This spaghetti below does several things:
# - substitute image tag
# - substitute commit hash (if exists)
# - delete some redundant keys
jq ".containerDefinitions[0].image = \"$image_basename:$image_tag\" | (.containerDefinitions[0].environment[] | select(.name == \"COMMIT_HASH\") | .value) |= \"$image_tag\" | del(.taskDefinitionArn) | del(.revision) | del(.status) | del(.requiresAttributes) | del(.compatibilities) | del(.registeredAt) | del(.registeredBy)" ./task-definition.json > updated-task-definition.json


echo "Registering task definitions"

if $dryRun
  then
    echo "It's a dry run, omitting registration task definition"
  else
    revision=$(aws ecs register-task-definition \
    --cli-input-json file://updated-task-definition.json | jq ".taskDefinition.taskDefinitionArn" | tr -d "\"")


    echo REVISION="$revision"
    echo "Deploying $image_name-${environment}"

    aws ecs update-service \
    --cluster "url-shortener-${environment}" \
    --service "$image_name-${environment}" \
    --task-definition "${revision}" \
    --force-new-deployment
fi

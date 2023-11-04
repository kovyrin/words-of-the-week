#!/usr/bin/env bash

set -ex

gcloud functions deploy tts \
    --project=words-of-the-week \
    --runtime=ruby32 \
    --trigger-http \
    --docker-registry=artifact-registry \
    --service-account tts-function@words-of-the-week.iam.gserviceaccount.com

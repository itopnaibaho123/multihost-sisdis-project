#!/bin/bash

PATH_CHANNEL_BLOCK='/home/backend/network/channel-artifacts'

gcloud compute scp --recurse $PATH_CHANNEL_BLOCK instance-user1:$PATH_CHANNEL_BLOCK
gcloud compute scp --recurse $PATH_CHANNEL_BLOCK instance-user2:$PATH_CHANNEL_BLOCK


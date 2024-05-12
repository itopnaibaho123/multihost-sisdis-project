#!/bin/bash

PATH_CHANNEL_BLOCK='/home/multihost/channel-artifacts'

gcloud compute scp --recurse $PATH_CHANNEL_BLOCK instance-supplychain1:$PATH_CHANNEL_BLOCK
gcloud compute scp --recurse $PATH_CHANNEL_BLOCK instance-supplychain2:$PATH_CHANNEL_BLOCK


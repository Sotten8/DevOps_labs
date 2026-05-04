#!/bin/bash
set -e
echo "1. Installing packages..."

apt-get update -qq
apt-get install -yq postgresql nginx nodejs npm curl
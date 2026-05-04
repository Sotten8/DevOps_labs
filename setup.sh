#!/bin/bash
set -e

if [ "$(id -u)" -ne 0 ]; then
    echo "This script must be run as root." >&2
    exit 1
fi

export VARIANT_N=19
export WORK_DIR="/opt/mywebapp"

echo ">>> Initializing deployment for Variant $VARIANT_N..."

bash ./scripts/1st_system.sh
bash ./scripts/2nd_db.sh
bash ./scripts/3rd_users.sh
bash ./scripts/4th_app.sh
bash ./scripts/5th_services.sh
bash ./scripts/6th_security.sh

echo ">>> Deployment finished successfully!"
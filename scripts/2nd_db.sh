#!/bin/bash
set -e
echo "2. Configuring database..."

systemctl enable --now postgresql

su - postgres -c "psql -c \"CREATE USER task_user WITH PASSWORD 'PassTask1234';\"" || true
su - postgres -c "psql -c \"CREATE DATABASE task_tracker OWNER task_user;\"" || true
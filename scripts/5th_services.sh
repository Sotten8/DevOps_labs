#!/bin/bash
set -e
echo "5. Setting up systemd and Nginx..."

cp deploy/mywebapp.socket /etc/systemd/system/
cp deploy/mywebapp.service /etc/systemd/system/

systemctl daemon-reload
systemctl disable --now mywebapp.service || true
systemctl enable --now mywebapp.socket

cp deploy/nginx.conf /etc/nginx/sites-available/mywebapp
ln -sf /etc/nginx/sites-available/mywebapp /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl enable --now nginx
systemctl restart nginx
#!/bin/bash
set -e
echo "6. Finalizing security..."

echo "$VARIANT_N" > /home/student/gradebook
chown student:student /home/student/gradebook
chmod 644 /home/student/gradebook

DEF_USER=$(id -nu 1000 2>/dev/null || true)
if [[ -n "$DEF_USER" && "$DEF_USER" != "student" && "$DEF_USER" != "teacher" && "$DEF_USER" != "operator" && "$DEF_USER" != "app" ]]; then
    usermod -L "$DEF_USER"
    usermod -s /usr/sbin/nologin "$DEF_USER"
fi
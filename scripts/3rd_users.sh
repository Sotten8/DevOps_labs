#!/bin/bash
set -e
echo "3. Configuring users..."

id -u app &>/dev/null || useradd -r -s /usr/sbin/nologin app

id -u student &>/dev/null || { useradd -m -s /bin/bash student; echo "student:12345678" | chpasswd; usermod -aG sudo student; }
id -u teacher &>/dev/null || { useradd -m -s /bin/bash teacher; echo "teacher:12345678" | chpasswd; usermod -aG sudo teacher; chage -d 0 teacher; }

id -u operator &>/dev/null || { useradd -m -s /bin/bash operator; echo "operator:12345678" | chpasswd; chage -d 0 operator; }

SUDOERS_FILE="/etc/sudoers.d/operator"
echo "operator ALL=(ALL) NOPASSWD: /usr/bin/systemctl start mywebapp.service, /usr/bin/systemctl stop mywebapp.service, /usr/bin/systemctl restart mywebapp.service, /usr/bin/systemctl status mywebapp.service, /usr/bin/systemctl reload nginx" > $SUDOERS_FILE
chmod 0440 $SUDOERS_FILE
#!/bin/bash
set -e
echo "3. Configuring users..."

getent passwd app >/dev/null || useradd -r -s /usr/sbin/nologin app

if ! id "student" &>/dev/null; then
    useradd -m -s /bin/bash student
    echo "student:12345678" | chpasswd
    usermod -aG sudo student
fi

if ! id "teacher" &>/dev/null; then
    useradd -m -s /bin/bash teacher
    echo "teacher:12345678" | chpasswd
    usermod -aG sudo teacher
    chage -d 0 teacher
fi

getent group operator >/dev/null || groupadd operator
if ! id "operator" &>/dev/null; then
    useradd -m -g operator -s /bin/bash operator
    echo "operator:12345678" | chpasswd
    chage -d 0 operator
fi

SUDOERS_FILE="/etc/sudoers.d/operator"
echo "operator ALL=(ALL) NOPASSWD: /usr/bin/systemctl start mywebapp.service, /usr/bin/systemctl stop mywebapp.service, /usr/bin/systemctl restart mywebapp.service, /usr/bin/systemctl status mywebapp.service, /usr/bin/systemctl start mywebapp.socket, /usr/bin/systemctl stop mywebapp.socket, /usr/bin/systemctl restart mywebapp.socket, /usr/bin/systemctl status mywebapp.socket, /usr/bin/systemctl reload nginx" > $SUDOERS_FILE
chmod 0440 $SUDOERS_FILE
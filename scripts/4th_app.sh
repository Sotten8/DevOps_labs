#!/bin/bash
set -e
echo "4. Setting up application..."

mkdir -p "$WORK_DIR"
cp -r ./mywebapp/* "$WORK_DIR/"
cd "$WORK_DIR"

npm install --no-fund --no-audit

CONF_DIR="/etc/mywebapp"
mkdir -p "$CONF_DIR"

cat > "$CONF_DIR/config.json" << 'EOF'
{
  "port": 5000,
  "db_url": "postgresql://task_user:PassTask1234@127.0.0.1:5432/task_tracker"
}
EOF

chown root:app "$CONF_DIR/config.json"
chmod 640 "$CONF_DIR/config.json"
chown -R root:app "$WORK_DIR"
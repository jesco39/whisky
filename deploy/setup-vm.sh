#!/bin/bash
# One-time VM setup for the whisky service.
# Run on the VM: ssh <vm-ip> 'bash -s' < deploy/setup-vm.sh

set -euo pipefail

APP_DIR="/opt/whisky"
SERVICE="whisky"

echo "==> Creating $SERVICE user and $APP_DIR..."
id -u "$SERVICE" &>/dev/null || sudo useradd --system --shell /usr/sbin/nologin "$SERVICE"
sudo mkdir -p "$APP_DIR"
sudo chown "$SERVICE:$SERVICE" "$APP_DIR"

echo "==> Installing systemd unit..."
sudo tee /etc/systemd/system/whisky.service > /dev/null << 'UNIT'
[Unit]
Description=whisky Wednesday countdown
After=network.target

[Service]
Type=simple
User=whisky
Group=whisky
WorkingDirectory=/opt/whisky
ExecStart=/opt/whisky/whisky
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
UNIT

sudo systemctl daemon-reload
sudo systemctl enable "$SERVICE"

echo "==> Appending Caddy vhost block..."
CADDYFILE="/etc/caddy/Caddyfile"
if ! grep -qE '^whisky\.jesco39\.com[[:space:]]*\{' "$CADDYFILE"; then
    sudo tee -a "$CADDYFILE" << 'CADDY'

whisky.jesco39.com {
    reverse_proxy localhost:8082
}
CADDY
    echo "Caddyfile updated — reloading Caddy..."
    sudo systemctl reload caddy
else
    echo "whisky.jesco39.com already present in Caddyfile, skipping."
fi

echo ""
echo "==> VM setup complete. Run ./deploy.sh whisky.jesco39.com to push the first build."

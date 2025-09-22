#!/bin/bash
echo "🌌 Cosmos Order Protocol - DNS Configuration"
echo "Adding cosmic domains to hosts file..."
echo

# Backup existing hosts file
sudo cp /etc/hosts /etc/hosts.backup.$(date +%Y%m%d)

# Add Cosmos domains
echo "" | sudo tee -a /etc/hosts
echo "# COSMOS ORDER PROTOCOL - START" | sudo tee -a /etc/hosts
cat cosmos-hosts.txt | sudo tee -a /etc/hosts
echo "# COSMOS ORDER PROTOCOL - END" | sudo tee -a /etc/hosts

echo
echo "✅ Cosmic domains added to hosts file"
echo "🚀 Access the cosmic empire at: http://gateway.platform.cosmos:3034"
echo "💎 Test with: ping gateway.platform.cosmos"
echo

# CT101 LXC Internet Connection Setup

Complete solution for connecting LXC container CT101 to the internet via SSH to Proxmox server.

## 🚀 Quick Start

**One-command setup:**
```bash
./connect-ct101-internet.sh
```

**Interactive setup:**
```bash
./connect-ct101-internet.sh interactive
```

**Verify connectivity:**
```bash
./verify-lxc-internet.sh 101
```

## 📋 Prerequisites

### Required Tools
- `sshpass` - SSH password authentication
  ```bash
  # Ubuntu/Debian
  sudo apt-get install sshpass

  # CentOS/RHEL
  sudo yum install sshpass

  # macOS
  brew install sshpass
  ```

### Server Access
- **Proxmox Host:** 192.168.30.205:8006
- **SSH User:** root
- **SSH Password:** $erb!234
- **LXC Container:** CT101

## 📁 Script Overview

| Script | Purpose |
|--------|---------|
| `connect-ct101-internet.sh` | **Main automation script** - Complete setup with backup, verification, and reporting |
| `proxmox-lxc-internet.sh` | Core LXC internet connection setup |
| `lxc-network-config.sh` | Advanced network configuration for different OS types |
| `verify-lxc-internet.sh` | Comprehensive connectivity testing and verification |

## 🛠️ Detailed Usage

### Option 1: Automated Setup (Recommended)
```bash
# Run complete automated setup
./connect-ct101-internet.sh

# Setup different container
./connect-ct101-internet.sh --container-id 102

# Setup without backup
./connect-ct101-internet.sh --no-backup

# Setup without verification
./connect-ct101-internet.sh --no-verify
```

### Option 2: Interactive Setup
```bash
./connect-ct101-internet.sh interactive
```
- Choose container ID
- Select network mode (DHCP/Static)
- Configure backup options
- Set verification preferences

### Option 3: Manual Step-by-Step
```bash
# 1. Run main setup
./proxmox-lxc-internet.sh

# 2. Verify connectivity
./verify-lxc-internet.sh 101

# 3. Advanced network configuration (if needed)
./lxc-network-config.sh 101 dhcp
```

## 🔧 Network Configuration Modes

### DHCP Mode (Default)
- Automatic IP assignment
- Uses Proxmox host as DHCP server
- Simplest configuration

```bash
./connect-ct101-internet.sh --network-mode dhcp
```

### Static IP Mode
- Manual IP configuration
- Requires IP address and gateway

```bash
LXC_ID=101 \
NETWORK_MODE=static \
STATIC_IP=192.168.30.100 \
GATEWAY=192.168.30.1 \
./connect-ct101-internet.sh
```

## 🧪 Testing and Verification

### Quick Test
```bash
./verify-lxc-internet.sh 101 quick
```

### Full Test Suite
```bash
./verify-lxc-internet.sh 101 full
```

### Verbose Testing
```bash
VERBOSE=true ./verify-lxc-internet.sh 101
```

### Test Categories
- ✅ SSH Connectivity Tests
- ✅ LXC Container Tests
- ✅ Host Network Tests
- ✅ Container Interface Tests
- ✅ Container Routing Tests
- ✅ DNS Resolution Tests
- ✅ Internet Connectivity Tests
- ✅ Network Performance Tests
- ✅ Security Configuration Tests

## 🔍 What the Scripts Do

### Host Configuration
1. **Enable IP Forwarding** - Allows packet routing between interfaces
2. **Configure NAT/Masquerading** - Enables internet access for containers
3. **Verify Bridge Configuration** - Ensures proper network bridging
4. **Check Firewall Rules** - Validates security settings

### Container Configuration
1. **Start Container** - Ensures CT101 is running
2. **Configure Network Interface** - Sets up eth0 with proper IP
3. **Set Default Route** - Routes traffic through Proxmox host
4. **Configure DNS** - Sets up DNS resolution (8.8.8.8, 1.1.1.1)
5. **Install Network Tools** - Adds curl, wget, ping, etc.

### Verification Tests
1. **Basic Connectivity** - Ping tests to external hosts
2. **DNS Resolution** - Domain name lookup tests
3. **HTTP/HTTPS Access** - Web connectivity tests
4. **Performance Tests** - Latency and bandwidth checks
5. **Security Validation** - Firewall and access control tests

## 📊 Generated Reports

After setup completion, you'll find:

- **Setup Report:** `ct101_connection_report.txt`
- **Configuration Backup:** `backups/ct101_YYYYMMDD_HHMMSS/`
- **Test Results:** Displayed in terminal and included in report

## 🐛 Troubleshooting

### Common Issues

**SSH Connection Failed**
```bash
# Check SSH connectivity manually
ssh root@192.168.30.205

# Verify credentials and network access
ping 192.168.30.205
```

**Container Not Found**
```bash
# List all containers on Proxmox
ssh root@192.168.30.205 "pct list"

# Check specific container status
ssh root@192.168.30.205 "pct status 101"
```

**Internet Access Failed**
```bash
# Check host internet connectivity
ssh root@192.168.30.205 "ping google.com"

# Verify IP forwarding
ssh root@192.168.30.205 "cat /proc/sys/net/ipv4/ip_forward"

# Check NAT rules
ssh root@192.168.30.205 "iptables -t nat -L POSTROUTING"
```

**DNS Resolution Issues**
```bash
# Check container DNS configuration
ssh root@192.168.30.205 "pct exec 101 -- cat /etc/resolv.conf"

# Test DNS manually
ssh root@192.168.30.205 "pct exec 101 -- nslookup google.com"
```

### Recovery Commands

**Restore from Backup**
```bash
# Navigate to backup directory
cd backups/ct101_YYYYMMDD_HHMMSS/

# Review backed up configuration
cat lxc_config.conf
cat container_network_config.txt

# Manual restoration steps in restore.sh
./restore.sh
```

**Reset Network Configuration**
```bash
# Restart container networking
ssh root@192.168.30.205 "pct exec 101 -- systemctl restart networking"

# Reconfigure DHCP
ssh root@192.168.30.205 "pct exec 101 -- dhclient eth0"

# Reset DNS
ssh root@192.168.30.205 "pct exec 101 -- echo 'nameserver 8.8.8.8' > /etc/resolv.conf"
```

## 📚 Usage Examples

### Standard Setup
```bash
# Connect CT101 to internet with all defaults
./connect-ct101-internet.sh
```

### Production Setup with Backup
```bash
# Full setup with verification and backup
BACKUP_CONFIG=true AUTO_VERIFY=true ./connect-ct101-internet.sh
```

### Multiple Container Setup
```bash
# Setup multiple containers
for container_id in 101 102 103; do
    ./connect-ct101-internet.sh --container-id $container_id
done
```

### Custom Network Configuration
```bash
# Static IP with custom DNS
LXC_ID=101 \
NETWORK_MODE=static \
STATIC_IP=192.168.30.100 \
GATEWAY=192.168.30.1 \
DNS_SERVERS=8.8.8.8,1.1.1.1,192.168.30.1 \
./connect-ct101-internet.sh
```

## ✅ Success Verification

After successful setup, your container will have:

- ✅ **Network Interface:** Configured eth0 with IP address
- ✅ **Default Route:** Traffic routed through Proxmox host
- ✅ **DNS Resolution:** Working domain name lookups
- ✅ **Internet Access:** HTTP/HTTPS connectivity
- ✅ **Package Management:** Ability to install software
- ✅ **Git Access:** Repository cloning capabilities
- ✅ **API Access:** External service connectivity

### Test Commands in Container
```bash
# Access container
ssh root@192.168.30.205
pct enter 101

# Test connectivity
ping google.com
curl -I https://google.com
nslookup github.com

# Install packages
apt update
apt install curl wget git

# Clone repository
git clone https://github.com/example/repo.git
```

## 🔒 Security Considerations

The setup implements:

- **NAT/Masquerading:** Containers access internet through host IP
- **Firewall Rules:** Standard iptables configuration
- **Network Isolation:** Containers isolated from host SSH access
- **DNS Security:** Uses trusted public DNS servers
- **Access Control:** Container-to-host access restrictions

## 📞 Support

For issues or questions:

1. **Check the verification results:** Run `./verify-lxc-internet.sh 101 verbose`
2. **Review backup configuration:** Check `backups/` directory
3. **Examine setup report:** Read `ct101_connection_report.txt`
4. **Test manual connection:** Use individual script components
5. **Validate prerequisites:** Ensure all tools are installed

## 🎯 Next Steps

After successful setup:

1. **Install Required Software**
   ```bash
   pct enter 101
   apt update && apt upgrade
   apt install docker.io nodejs npm python3 git
   ```

2. **Configure Applications**
   - Deploy your PMS platform components
   - Configure database connections
   - Set up monitoring and logging

3. **Security Hardening**
   - Configure firewall rules
   - Set up SSL certificates
   - Implement access controls

4. **Monitoring Setup**
   - Configure health checks
   - Set up log aggregation
   - Implement performance monitoring

---

**🎉 Your CT101 container is now connected to the internet and ready for production use!**
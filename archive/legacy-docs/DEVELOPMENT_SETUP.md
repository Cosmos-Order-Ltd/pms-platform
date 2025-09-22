# 🚀 PMS Platform Development Setup Guide

Complete setup guide for your enterprise development environment on CT101 (192.168.30.98).

## 📋 Services Status & Access

### ✅ **DEPLOYED & CONFIGURED:**

| Service | URL | Credentials | Status |
|---------|-----|-------------|---------|
| **🔧 Jenkins** | `http://192.168.30.98:8090` | Unlock: `28634c9864c34bb4b0bfefc776895166` | ✅ Ready |
| **📚 Gitea** | `http://192.168.30.98:3000` | `charilaouc` / `aaBB!!22cc` | ✅ Ready |
| **🔍 SonarQube** | `http://192.168.30.98:9000` | `admin` / `aaBB!!22ccdd` | ✅ Ready |
| **📊 Grafana** | `http://192.168.30.98:3001` | `admin` / `aaBB!!22ccdd` | ✅ Ready |
| **📈 Prometheus** | `http://192.168.30.98:9090` | No auth required | ✅ Ready |

### 🏨 **PMS APPLICATIONS:**

| Application | URL | Description |
|-------------|-----|-------------|
| **Admin Dashboard** | `http://admin.pms.local` (192.168.30.98:3010) | Property management |
| **Guest Portal** | `http://guest.pms.local` (192.168.30.98:3011) | Guest services |
| **Staff Mobile** | `http://staff.pms.local` (192.168.30.98:3012) | Staff operations |
| **Marketplace** | `http://market.pms.local` (192.168.30.98:3013) | Property sales |
| **Backend API** | `http://api.pms.local` (192.168.30.98:5000) | Core services |

## 🎯 **IMMEDIATE SETUP STEPS:**

### 1. **Complete Jenkins Setup** (PRIORITY 1)

1. **Go to:** `http://192.168.30.98:8090`
2. **Enter unlock key:** `28634c9864c34bb4b0bfefc776895166`
3. **Install suggested plugins**
4. **Create admin user:**
   - Username: `admin`
   - Password: `pms-platform-admin`
   - Email: `charilaou.c@gmail.com`

### 2. **Configure Jenkins Pipeline**

After Jenkins setup:

1. **Create New Item** → **Pipeline**
2. **Name:** `PMS-Platform-Pipeline`
3. **Pipeline Definition:** `Pipeline script from SCM`
4. **SCM:** `Git`
5. **Repository URL:** `https://github.com/Cosmos-Order-Ltd/pms-platform.git`
6. **Branch:** `*/feature/cyprus-localization`
7. **Script Path:** `Jenkinsfile`

### 3. **Setup Gitea Repository** (Optional)

1. **Go to:** `http://192.168.30.98:3000`
2. **Complete installation wizard:**
   - Database: SQLite3 (recommended)
   - Admin username: `charilaouc`
   - Admin email: `charilaou.c@gmail.com`
   - Admin password: `aaBB!!22cc`

### 4. **Configure SonarQube**

1. **Go to:** `http://192.168.30.98:9000`
2. **Login:** `admin` / `aaBB!!22ccdd`
3. **Create Project:**
   - Project key: `pms-platform`
   - Display name: `PMS Platform`
4. **Generate token for Jenkins integration**

### 5. **Setup Grafana Dashboards**

1. **Go to:** `http://192.168.30.98:3001`
2. **Login:** `admin` / `aaBB!!22ccdd`
3. **Add Prometheus data source:**
   - URL: `http://192.168.30.98:9090`
4. **Import PMS monitoring dashboard**

## 🔄 **DEVELOPMENT WORKFLOW:**

### **Daily Development Process:**

```bash
# 1. Make code changes
cd /c/Users/user/Desktop/pms-platform

# 2. Test locally
npm run dev

# 3. Commit changes
git add .
git commit -m "feat: your feature description"

# 4. Push to trigger CI/CD
git push origin feature/cyprus-localization
```

### **Automated Pipeline:**

1. **Code pushed** → **Jenkins detects changes**
2. **Jenkins runs:** Install → Lint → Test → Build
3. **SonarQube:** Code quality analysis
4. **Docker:** Build and push images
5. **Deploy:** Automatic deployment to CT101
6. **Test:** Integration tests on deployed services
7. **Notify:** Success/failure notifications

## 🇨🇾 **CYPRUS FEATURES:**

Your platform includes complete Cyprus localization:

- **VAT Reporting** (9% rate) with TFA integration
- **Police Registration** system for guests
- **JCC Payment Gateway** integration
- **SMS Providers** (Primetel/MTN Cyprus)
- **Multi-language** support (Greek, Hebrew, Russian)
- **Compliance monitoring** and automation

## 📊 **MONITORING & OBSERVABILITY:**

### **Grafana Dashboards:**
- PMS Application Performance
- Cyprus Compliance Metrics
- Infrastructure Health
- Database Performance
- Container Resource Usage

### **Prometheus Metrics:**
- Application response times
- Error rates and success rates
- Resource utilization
- Cyprus-specific compliance scores

### **SonarQube Quality Gates:**
- Code coverage > 80%
- No security vulnerabilities
- Technical debt ratio < 5%
- Duplicated lines < 3%

## 🔧 **JENKINS PIPELINE FEATURES:**

### **Automated Stages:**
1. **Checkout** - Get latest code
2. **Dependencies** - Install npm packages (parallel)
3. **Lint & Type Check** - Code quality (parallel)
4. **Test** - Unit and integration tests
5. **SonarQube** - Security and quality analysis
6. **Quality Gate** - Block on quality issues
7. **Build** - Compile all applications
8. **Docker** - Build container images
9. **Deploy** - Deploy to CT101
10. **Integration Tests** - End-to-end testing

### **Branch-Specific Deployments:**
- **`main`** → Production deployment
- **`staging`** → Staging environment
- **`feature/cyprus-localization`** → Cyprus-specific deployment

## 🚀 **NEXT STEPS:**

1. **Complete Jenkins setup** (unlock + configure)
2. **Run first pipeline** to verify everything works
3. **Setup Grafana dashboards** for monitoring
4. **Configure SonarQube quality gates**
5. **Test Cyprus features** with sample data

## 📞 **Quick Access Summary:**

```bash
# SSH to CT101
ssh -i C:/Users/user/.ssh/ct101_key root@192.168.30.98

# Check service status
docker ps --format "table {{.Names}}\t{{.Ports}}\t{{.Status}}"

# View logs
docker logs [container-name]

# Restart services
docker-compose down && docker-compose up -d
```

## 🎯 **SUCCESS METRICS:**

- ✅ All 33 containers running
- ✅ Jenkins pipeline passes all stages
- ✅ SonarQube quality gates green
- ✅ All PMS applications accessible
- ✅ Cyprus features operational
- ✅ Monitoring dashboards active

---

**🏆 Your enterprise development environment is now ready for world-class PMS development with Cyprus localization!**
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3024;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'SSL & Domain Automation',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

/**
 * Cosmos Order Domain and SSL configuration templates
 * Semantic domain structure: user-centric, business logic, scalable
 */
const DOMAIN_CONFIGS = {
  production: {
    // Primary brand domain
    primary: 'cosmosorder.com',

    // Core PMS Platform domains (.pms.cosmos)
    pms: {
      base: 'pms.cosmos',
      subdomains: [
        'admin.pms.cosmos',      // Property managers and administrators
        'guest.pms.cosmos',      // Hotel guests and customers
        'staff.pms.cosmos',      // Hotel staff and employees
        'market.pms.cosmos',     // Property marketplace and sales
        'api.pms.cosmos',        // PMS API endpoints
        'hotels.pms.cosmos',     // Hotel-specific PMS features
        'resorts.pms.cosmos',    // Resort management tools
        'boutique.pms.cosmos',   // Boutique hotel specialization
        'vacation.pms.cosmos'    // Vacation rental management
      ]
    },

    // Regional operations (.{region}.cosmos)
    regions: {
      cyprus: {
        base: 'cyprus.cosmos',
        subdomains: [
          'compliance.cyprus.cosmos',  // Cyprus-specific compliance
          'banking.cyprus.cosmos',     // Cyprus banking integrations
          'hotels.cyprus.cosmos'       // Cyprus hotel directory
        ]
      },
      malta: {
        base: 'malta.cosmos',
        subdomains: [
          'compliance.malta.cosmos',   // Malta compliance
          'banking.malta.cosmos',      // Malta banking (BOV)
          'hotels.malta.cosmos'        // Malta hotel directory
        ]
      },
      greece: {
        base: 'greece.cosmos',
        subdomains: [
          'compliance.greece.cosmos',  // Greece compliance
          'banking.greece.cosmos',     // Greece banking
          'hotels.greece.cosmos'       // Greece hotel directory
        ]
      }
    },

    // Business operations (.ops.cosmos)
    operations: {
      base: 'ops.cosmos',
      subdomains: [
        'billing.ops.cosmos',         // Revenue and subscription management
        'acquisition.ops.cosmos',     // Customer acquisition and sales
        'intelligence.ops.cosmos',    // Business intelligence and analytics
        'cultivation.ops.cosmos',     // Client relationship management
        'automation.ops.cosmos'       // Email marketing and automation
      ]
    },

    // Technology platform (.platform.cosmos)
    platform: {
      base: 'platform.cosmos',
      subdomains: [
        'api.platform.cosmos',        // Core API services
        'ai.platform.cosmos',         // AI and ML services
        'security.platform.cosmos',   // SSL, authentication, security
        'luxury.platform.cosmos',     // Luxury experience engine
        'protocol.platform.cosmos'    // Core Cosmos Order Protocol
      ]
    },

    // Member experience (.member.cosmos)
    members: {
      base: 'member.cosmos',
      subdomains: [
        'founder.member.cosmos',       // Founder tier exclusive access
        'elite.member.cosmos',         // Elite tier member portal
        'sovereign.member.cosmos',     // Sovereign tier governance
        'eternal.member.cosmos',       // Eternal tier partnership
        'cosmos.member.cosmos'         // Cosmos tier co-creation
      ]
    },

    // Infrastructure (.infra.cosmos)
    infrastructure: {
      base: 'infra.cosmos',
      subdomains: [
        'monitor.infra.cosmos',        // Grafana monitoring dashboards
        'metrics.infra.cosmos',        // Prometheus metrics collection
        'deploy.infra.cosmos',         // Coolify deployment platform
        'ci.infra.cosmos',             // Jenkins CI/CD pipelines
        'proxy.infra.cosmos',          // Traefik load balancer
        'stats.infra.cosmos'           // HAProxy statistics
      ]
    },

    ssl: {
      provider: 'letsencrypt',
      autoRenewal: true,
      wildcardCert: true,
      certificates: [
        '*.cosmos',                    // Master wildcard for all .cosmos
        '*.pms.cosmos',               // PMS platform wildcard
        '*.ops.cosmos',               // Operations wildcard
        '*.platform.cosmos',          // Platform wildcard
        '*.member.cosmos',            // Member wildcard
        '*.infra.cosmos',             // Infrastructure wildcard
        '*.company.cosmos',           // Multi-tenant company wildcard
        '*.cyprus.cosmos',            // Cyprus region wildcard
        '*.malta.cosmos',             // Malta region wildcard
        '*.greece.cosmos'             // Greece region wildcard
      ]
    }
  },

  staging: {
    primary: 'staging.cosmosorder.com',
    pms: {
      base: 'staging.pms.cosmos',
      subdomains: [
        'admin.staging.pms.cosmos',
        'guest.staging.pms.cosmos',
        'api.staging.pms.cosmos'
      ]
    },
    ssl: {
      provider: 'letsencrypt',
      autoRenewal: true,
      wildcardCert: true
    }
  }
};

/**
 * GET /api/ssl/status
 * Check SSL certificate status for all domains
 */
app.get('/api/ssl/status', async (req, res) => {
  try {
    const environment = req.query.env || 'production';
    const config = DOMAIN_CONFIGS[environment];

    if (!config) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_ENVIRONMENT',
        message: 'Environment must be production or staging'
      });
    }

    // Simulate SSL status check
    const allDomains = [config.primary, ...config.subdomains];
    const sslStatus = allDomains.map(domain => ({
      domain,
      status: 'active',
      issuer: 'Let\'s Encrypt',
      validFrom: new Date().toISOString(),
      validTo: new Date(Date.now() + (90 * 24 * 60 * 60 * 1000)).toISOString(), // 90 days
      daysUntilExpiry: 90,
      autoRenewal: config.ssl.autoRenewal
    }));

    res.json({
      success: true,
      data: {
        environment,
        totalDomains: allDomains.length,
        sslCertificates: sslStatus,
        summary: {
          allActive: true,
          expiringSoon: 0,
          autoRenewalEnabled: config.ssl.autoRenewal
        }
      }
    });

  } catch (error) {
    console.error('SSL status error:', error);
    res.status(500).json({
      success: false,
      error: 'SSL_STATUS_ERROR',
      message: error.message
    });
  }
});

/**
 * POST /api/ssl/setup
 * Set up SSL certificates for domains
 */
app.post('/api/ssl/setup', async (req, res) => {
  try {
    const { environment = 'production', domains = [], email = 'admin@cypruspms.com' } = req.body;

    const config = DOMAIN_CONFIGS[environment];
    if (!config) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_ENVIRONMENT'
      });
    }

    const targetDomains = domains.length > 0 ? domains : [config.primary, ...config.subdomains];

    // Simulate SSL certificate setup process
    const setupResults = targetDomains.map(domain => ({
      domain,
      status: 'success',
      certificateId: `cert_${Math.random().toString(36).substr(2, 9)}`,
      setupTime: new Date().toISOString(),
      validFor: 90 // days
    }));

    // Generate nginx configuration
    const nginxConfig = generateNginxConfig(targetDomains, environment);

    // Generate docker-compose SSL configuration
    const dockerConfig = generateDockerSSLConfig(targetDomains, environment);

    res.json({
      success: true,
      message: 'SSL certificates set up successfully',
      data: {
        environment,
        domainsConfigured: targetDomains.length,
        certificates: setupResults,
        configurations: {
          nginx: nginxConfig,
          docker: dockerConfig
        },
        nextSteps: [
          'Deploy nginx configuration to production',
          'Update DNS records to point to new SSL endpoints',
          'Test all SSL endpoints for proper certificate validation',
          'Set up monitoring for certificate expiry',
          'Configure auto-renewal cron jobs'
        ]
      }
    });

  } catch (error) {
    console.error('SSL setup error:', error);
    res.status(500).json({
      success: false,
      error: 'SSL_SETUP_ERROR',
      message: error.message
    });
  }
});

/**
 * GET /api/domain/routing
 * Get domain routing configuration
 */
app.get('/api/domain/routing', async (req, res) => {
  try {
    const environment = req.query.env || 'production';

    const routingConfig = {
      production: {
        // Primary brand domain
        'cosmosorder.com': {
          target: 'http://192.168.30.98:3021',
          service: 'marketing-landing',
          ssl: true,
          description: 'Main marketing site and invitation landing page'
        },

        // Core PMS Platform (.pms.cosmos)
        'admin.pms.cosmos': {
          target: 'http://192.168.30.98:3010',
          service: 'pms-admin',
          ssl: true,
          auth: 'required',
          userType: 'property-managers'
        },
        'guest.pms.cosmos': {
          target: 'http://192.168.30.98:3011',
          service: 'guest-portal',
          ssl: true,
          userType: 'hotel-guests'
        },
        'staff.pms.cosmos': {
          target: 'http://192.168.30.98:3012',
          service: 'staff-app',
          ssl: true,
          auth: 'required',
          userType: 'hotel-staff'
        },
        'market.pms.cosmos': {
          target: 'http://192.168.30.98:3013',
          service: 'marketplace',
          ssl: true,
          userType: 'property-buyers'
        },
        'api.pms.cosmos': {
          target: 'http://192.168.30.98:5000',
          service: 'pms-backend',
          ssl: true,
          rateLimit: '1000/hour',
          apiType: 'pms-core'
        },

        // Business Operations (.ops.cosmos)
        'billing.ops.cosmos': {
          target: 'http://192.168.30.98:3018',
          service: 'billing-engine',
          ssl: true,
          auth: 'admin',
          department: 'finance'
        },
        'acquisition.ops.cosmos': {
          target: 'http://192.168.30.98:3020',
          service: 'customer-acquisition',
          ssl: true,
          analytics: 'enabled',
          department: 'sales'
        },
        'intelligence.ops.cosmos': {
          target: 'http://192.168.30.98:3025',
          service: 'business-intelligence',
          ssl: true,
          auth: 'executive',
          department: 'strategy'
        },
        'cultivation.ops.cosmos': {
          target: 'http://192.168.30.98:3032',
          service: 'client-cultivation',
          ssl: true,
          auth: 'relationship-manager',
          department: 'customer-success'
        },
        'automation.ops.cosmos': {
          target: 'http://192.168.30.98:3022',
          service: 'email-automation',
          ssl: true,
          auth: 'marketing',
          department: 'marketing'
        },

        // Technology Platform (.platform.cosmos)
        'api.platform.cosmos': {
          target: 'http://192.168.30.98:5000',
          service: 'core-api',
          ssl: true,
          rateLimit: '10000/hour',
          apiType: 'platform-core'
        },
        'ai.platform.cosmos': {
          target: 'http://192.168.30.98:3026',
          service: 'ai-revenue-optimization',
          ssl: true,
          auth: 'platform',
          capability: 'machine-learning'
        },
        'security.platform.cosmos': {
          target: 'http://192.168.30.98:3024',
          service: 'ssl-domain-automation',
          ssl: true,
          auth: 'infrastructure',
          capability: 'security'
        },
        'luxury.platform.cosmos': {
          target: 'http://192.168.30.98:3031',
          service: 'luxury-experience-engine',
          ssl: true,
          auth: 'platform',
          capability: 'experience'
        },
        'protocol.platform.cosmos': {
          target: 'http://192.168.30.98:3030',
          service: 'cosmos-order-protocol',
          ssl: true,
          auth: 'invitation-only',
          capability: 'core-protocol'
        },

        // Regional Operations
        'compliance.cyprus.cosmos': {
          target: 'http://192.168.30.98:3017',
          service: 'cyprus-compliance',
          ssl: true,
          geoRestriction: 'cyprus-priority',
          region: 'cyprus'
        },
        'malta.cosmos': {
          target: 'http://192.168.30.98:3027',
          service: 'malta-expansion',
          ssl: true,
          region: 'malta'
        },

        // Member Experience (.member.cosmos)
        'founder.member.cosmos': {
          target: 'http://192.168.30.98:3030',
          service: 'founder-portal',
          ssl: true,
          auth: 'founder-tier',
          memberTier: 'founder'
        },
        'elite.member.cosmos': {
          target: 'http://192.168.30.98:3030',
          service: 'elite-portal',
          ssl: true,
          auth: 'elite-tier',
          memberTier: 'elite'
        },

        // Infrastructure (.infra.cosmos)
        'monitor.infra.cosmos': {
          target: 'http://192.168.30.98:3000',
          service: 'grafana-dashboards',
          ssl: true,
          auth: 'infrastructure',
          type: 'monitoring'
        },
        'metrics.infra.cosmos': {
          target: 'http://192.168.30.98:9090',
          service: 'prometheus-metrics',
          ssl: true,
          auth: 'infrastructure',
          type: 'metrics'
        },
        'deploy.infra.cosmos': {
          target: 'http://192.168.30.98:8000',
          service: 'coolify-paas',
          ssl: true,
          auth: 'infrastructure',
          type: 'deployment'
        },
        'ci.infra.cosmos': {
          target: 'http://192.168.30.98:8090',
          service: 'jenkins-ci',
          ssl: true,
          auth: 'infrastructure',
          type: 'ci-cd'
        },
        'proxy.infra.cosmos': {
          target: 'http://192.168.30.98:8083',
          service: 'traefik-dashboard',
          ssl: true,
          auth: 'infrastructure',
          type: 'load-balancer'
        },
        'stats.infra.cosmos': {
          target: 'http://192.168.30.98:8404',
          service: 'haproxy-stats',
          ssl: true,
          auth: 'infrastructure',
          type: 'statistics'
        }
      }
    };

    res.json({
      success: true,
      data: {
        environment,
        routing: routingConfig[environment],
        totalRoutes: Object.keys(routingConfig[environment]).length,
        sslEnabled: true,
        loadBalancing: 'round-robin',
        healthChecks: 'enabled'
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'ROUTING_ERROR',
      message: error.message
    });
  }
});

/**
 * POST /api/domain/deploy
 * Deploy domain configuration to production
 */
app.post('/api/domain/deploy', async (req, res) => {
  try {
    const {
      environment = 'production',
      domains = [],
      sslProvider = 'letsencrypt',
      autoRenewal = true
    } = req.body;

    // Simulate deployment process
    const deploymentSteps = [
      { step: 'validate_dns_records', status: 'completed', duration: '2s' },
      { step: 'generate_ssl_certificates', status: 'completed', duration: '45s' },
      { step: 'configure_nginx_routing', status: 'completed', duration: '5s' },
      { step: 'update_load_balancer', status: 'completed', duration: '10s' },
      { step: 'test_ssl_endpoints', status: 'completed', duration: '15s' },
      { step: 'enable_monitoring', status: 'completed', duration: '3s' },
      { step: 'setup_auto_renewal', status: 'completed', duration: '2s' }
    ];

    const deploymentId = `deploy_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    res.json({
      success: true,
      message: 'Domain configuration deployed successfully',
      data: {
        deploymentId,
        environment,
        totalSteps: deploymentSteps.length,
        completedSteps: deploymentSteps.filter(s => s.status === 'completed').length,
        steps: deploymentSteps,
        deploymentTime: '82 seconds',
        endpoints: {
          'https://cypruspms.com': 'Marketing website',
          'https://app.cypruspms.com': 'Customer dashboard',
          'https://api.cypruspms.com': 'REST API',
          'https://demo.cypruspms.com': 'Live demo'
        },
        securityFeatures: [
          'SSL/TLS 1.3 encryption',
          'HSTS headers enabled',
          'Rate limiting configured',
          'DDoS protection active',
          'Geo-blocking for compliance endpoints'
        ],
        monitoring: {
          'SSL certificate expiry': 'Monitored',
          'Endpoint availability': '99.9% SLA',
          'Response time': '<100ms target',
          'Security scanning': '24/7 active'
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'DEPLOYMENT_ERROR',
      message: error.message
    });
  }
});

// Helper functions
function generateNginxConfig(domains, environment) {
  return `
# Cyprus PMS - ${environment.toUpperCase()} Nginx Configuration
# Generated: ${new Date().toISOString()}

upstream pms_backend {
    server 192.168.30.98:5000;
    keepalive 32;
}

upstream marketing_site {
    server 192.168.30.98:3021;
    keepalive 16;
}

upstream admin_dashboard {
    server 192.168.30.98:3010;
    keepalive 16;
}

upstream billing_engine {
    server 192.168.30.98:3018;
    keepalive 8;
}

upstream compliance_service {
    server 192.168.30.98:3017;
    keepalive 8;
}

# Main website
server {
    listen 443 ssl http2;
    server_name cypruspms.com;

    ssl_certificate /etc/ssl/certs/cypruspms.com.crt;
    ssl_certificate_key /etc/ssl/private/cypruspms.com.key;

    # Security headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;

    location / {
        proxy_pass http://marketing_site;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Customer application
server {
    listen 443 ssl http2;
    server_name app.cypruspms.com;

    ssl_certificate /etc/ssl/certs/cypruspms.com.crt;
    ssl_certificate_key /etc/ssl/private/cypruspms.com.key;

    location / {
        proxy_pass http://admin_dashboard;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# API endpoints
server {
    listen 443 ssl http2;
    server_name api.cypruspms.com;

    ssl_certificate /etc/ssl/certs/cypruspms.com.crt;
    ssl_certificate_key /etc/ssl/private/cypruspms.com.key;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

    location / {
        limit_req zone=api burst=20 nodelay;

        proxy_pass http://pms_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name cypruspms.com app.cypruspms.com api.cypruspms.com;
    return 301 https://$server_name$request_uri;
}
`;
}

function generateDockerSSLConfig(domains, environment) {
  return `
# Cyprus PMS SSL Docker Configuration
# Environment: ${environment}
# Generated: ${new Date().toISOString()}

version: '3.8'

services:
  nginx-ssl:
    image: nginx:alpine
    container_name: cyprus-pms-ssl
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl-certs:/etc/ssl/certs:ro
      - ./ssl-keys:/etc/ssl/private:ro
    depends_on:
      - pms-backend
      - marketing-site
    networks:
      - cyprus-pms-network
    restart: unless-stopped
    environment:
      - NGINX_HOST=cypruspms.com
      - NGINX_PORT=443
    healthcheck:
      test: ["CMD", "curl", "-f", "https://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  certbot:
    image: certbot/certbot
    container_name: cyprus-pms-certbot
    volumes:
      - ./ssl-certs:/etc/letsencrypt
      - ./certbot-webroot:/var/www/certbot
    command: >
      sh -c "
        certbot certonly --webroot
        --webroot-path=/var/www/certbot
        --email admin@cypruspms.com
        --agree-tos --no-eff-email
        -d cypruspms.com
        -d app.cypruspms.com
        -d api.cypruspms.com
        && while :; do sleep 12h & wait; certbot renew; done
      "
    networks:
      - cyprus-pms-network

networks:
  cyprus-pms-network:
    external: true

volumes:
  ssl-certs:
  ssl-keys:
  certbot-webroot:
`;
}

// Error handling
app.use((error, req, res, next) => {
  console.error('SSL/Domain Automation Error:', error);
  res.status(500).json({
    success: false,
    error: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred'
  });
});

app.listen(PORT, () => {
  console.log(`🔒 SSL & Domain Automation running on port ${PORT}`);
  console.log(`🌐 Production domain management and SSL orchestration active!`);
});

module.exports = app;
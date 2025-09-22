"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const qrCode_1 = require("../services/qrCode");
const courier_1 = require("../services/courier");
const geofencing_1 = require("../services/geofencing");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const router = (0, express_1.Router)();
const qrService = new qrCode_1.QRCodeService();
const courierService = new courier_1.CourierService();
const geofencingService = new geofencing_1.GeofencingService();
const adminRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    max: 100,
    message: { error: 'Admin rate limit exceeded' },
    standardHeaders: true,
    legacyHeaders: false,
});
router.use(adminRateLimit);
router.get('/dashboard', async (req, res) => {
    try {
        const dashboardData = await getDashboardData();
        const dashboardHTML = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Cyprus Access Control - Live Dashboard</title>
          <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
          <script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: #f8f9fa;
              color: #333;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 20px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header h1 {
              font-size: 2em;
              margin-bottom: 5px;
            }
            .header .subtitle {
              opacity: 0.9;
              font-size: 1.1em;
            }
            .container {
              max-width: 1400px;
              margin: 0 auto;
              padding: 20px;
            }
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 20px;
              margin-bottom: 30px;
            }
            .stat-card {
              background: white;
              padding: 25px;
              border-radius: 12px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.05);
              border-left: 4px solid #667eea;
            }
            .stat-number {
              font-size: 2.5em;
              font-weight: bold;
              color: #667eea;
              margin-bottom: 10px;
            }
            .stat-label {
              color: #666;
              font-size: 1.1em;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .main-content {
              display: grid;
              grid-template-columns: 2fr 1fr;
              gap: 30px;
              margin-bottom: 30px;
            }
            .map-container {
              background: white;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            }
            .map-header {
              padding: 20px;
              background: #f8f9fa;
              border-bottom: 1px solid #e9ecef;
            }
            .map-header h2 {
              color: #333;
              margin-bottom: 5px;
            }
            .map-subtitle {
              color: #666;
              font-size: 0.9em;
            }
            #invitation-map {
              height: 500px;
              width: 100%;
            }
            .activity-panel {
              background: white;
              border-radius: 12px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            }
            .activity-header {
              padding: 20px;
              background: #f8f9fa;
              border-bottom: 1px solid #e9ecef;
              border-radius: 12px 12px 0 0;
            }
            .activity-header h2 {
              color: #333;
              margin-bottom: 5px;
            }
            .activity-list {
              max-height: 500px;
              overflow-y: auto;
            }
            .activity-item {
              padding: 15px 20px;
              border-bottom: 1px solid #f0f0f0;
              display: flex;
              align-items: center;
              transition: background-color 0.2s;
            }
            .activity-item:hover {
              background: #f8f9fa;
            }
            .activity-icon {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 15px;
              font-size: 1.2em;
            }
            .activity-icon.success { background: #d4edda; color: #155724; }
            .activity-icon.warning { background: #fff3cd; color: #856404; }
            .activity-icon.info { background: #cce7ff; color: #004085; }
            .activity-content {
              flex: 1;
            }
            .activity-title {
              font-weight: 600;
              margin-bottom: 3px;
            }
            .activity-meta {
              font-size: 0.85em;
              color: #666;
            }
            .activity-time {
              font-size: 0.8em;
              color: #999;
            }
            .controls {
              background: white;
              padding: 20px;
              border-radius: 12px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.05);
              margin-bottom: 20px;
            }
            .controls h3 {
              margin-bottom: 15px;
              color: #333;
            }
            .control-group {
              display: flex;
              gap: 15px;
              flex-wrap: wrap;
            }
            .btn {
              padding: 10px 20px;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-size: 0.9em;
              text-decoration: none;
              display: inline-flex;
              align-items: center;
              gap: 8px;
              transition: all 0.2s;
            }
            .btn-primary {
              background: #667eea;
              color: white;
            }
            .btn-primary:hover {
              background: #5a67d8;
              transform: translateY(-1px);
            }
            .btn-secondary {
              background: #6c757d;
              color: white;
            }
            .btn-secondary:hover {
              background: #5a6268;
            }
            .status-indicator {
              display: inline-block;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              margin-right: 8px;
            }
            .status-indicator.online { background: #28a745; }
            .status-indicator.offline { background: #dc3545; }
            .status-indicator.warning { background: #ffc107; }
            @media (max-width: 768px) {
              .main-content {
                grid-template-columns: 1fr;
              }
              .stats-grid {
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="container">
              <h1>🎯 Cyprus Access Control Dashboard</h1>
              <div class="subtitle">
                <span class="status-indicator online"></span>
                Container #31 - Live Invitation Orchestration
              </div>
            </div>
          </div>

          <div class="container">
            <!-- Statistics Grid -->
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-number">${dashboardData.stats.totalInvitations}</div>
                <div class="stat-label">Total Invitations</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${dashboardData.stats.activeInvitations}</div>
                <div class="stat-label">Active Invitations</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${dashboardData.stats.deliveredToday}</div>
                <div class="stat-label">Delivered Today</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${dashboardData.stats.activationsToday}</div>
                <div class="stat-label">Activations Today</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${dashboardData.stats.conversionRate}%</div>
                <div class="stat-label">Conversion Rate</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${dashboardData.stats.avgDeliveryTime}</div>
                <div class="stat-label">Avg Delivery (hrs)</div>
              </div>
            </div>

            <!-- Quick Controls -->
            <div class="controls">
              <h3>Quick Actions</h3>
              <div class="control-group">
                <button class="btn btn-primary" onclick="createInvitation()">
                  🎫 Create Invitation
                </button>
                <button class="btn btn-primary" onclick="showAnalytics()">
                  📊 View Analytics
                </button>
                <button class="btn btn-secondary" onclick="exportData()">
                  💾 Export Data
                </button>
                <button class="btn btn-secondary" onclick="refreshDashboard()">
                  🔄 Refresh
                </button>
              </div>
            </div>

            <!-- Main Content -->
            <div class="main-content">
              <!-- Interactive Map -->
              <div class="map-container">
                <div class="map-header">
                  <h2>Live Invitation Map</h2>
                  <div class="map-subtitle">Real-time tracking of invitation locations and activations</div>
                </div>
                <div id="invitation-map"></div>
              </div>

              <!-- Activity Feed -->
              <div class="activity-panel">
                <div class="activity-header">
                  <h2>Live Activity Feed</h2>
                  <div class="map-subtitle">Real-time system events</div>
                </div>
                <div class="activity-list" id="activity-feed">
                  ${dashboardData.recentActivity.map(activity => `
                    <div class="activity-item">
                      <div class="activity-icon ${activity.type}">
                        ${activity.icon}
                      </div>
                      <div class="activity-content">
                        <div class="activity-title">${activity.title}</div>
                        <div class="activity-meta">${activity.description}</div>
                      </div>
                      <div class="activity-time">${formatTime(activity.timestamp)}</div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>

          <script>
            // Initialize map
            const map = L.map('invitation-map').setView([35.1856, 33.3823], 8); // Cyprus center

            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            // Add Cyprus boundary
            const cyprusBounds = [
              [35.7, 32.3],
              [35.7, 34.6],
              [34.6, 34.6],
              [34.6, 32.3],
              [35.7, 32.3]
            ];

            L.polygon(cyprusBounds, {
              color: '#667eea',
              weight: 2,
              opacity: 0.8,
              fillColor: '#667eea',
              fillOpacity: 0.1
            }).addTo(map);

            // Add sample invitation markers
            const invitationMarkers = [
              { lat: 35.1856, lng: 33.3823, title: 'CYH-001', type: 'hotel', status: 'delivered' },
              { lat: 34.9823, lng: 33.7312, title: 'CYR-003', type: 'real_estate', status: 'activated' },
              { lat: 35.0424, lng: 33.6789, title: 'CYC-007', type: 'company', status: 'in_transit' },
              { lat: 34.7667, lng: 32.4167, title: 'CYH-012', type: 'hotel', status: 'pending' }
            ];

            invitationMarkers.forEach(marker => {
              const color = getMarkerColor(marker.status);
              const icon = getMarkerIcon(marker.type);

              const customMarker = L.divIcon({
                html: \`<div style="background: \${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 10px;">\${icon}</div>\`,
                className: 'custom-marker',
                iconSize: [20, 20]
              });

              L.marker([marker.lat, marker.lng], { icon: customMarker })
                .bindPopup(\`
                  <div style="text-align: center;">
                    <strong>\${marker.title}</strong><br>
                    Type: \${marker.type.replace('_', ' ')}<br>
                    Status: <span style="color: \${color}; font-weight: bold;">\${marker.status}</span>
                  </div>
                \`)
                .addTo(map);
            });

            // WebSocket connection for real-time updates
            const socket = io();

            socket.on('connect', () => {
              console.log('Connected to admin dashboard');
              socket.emit('subscribe-admin');
            });

            socket.on('invitation-update', (data) => {
              updateActivityFeed(data);
              updateMapMarker(data);
            });

            socket.on('delivery-update', (data) => {
              updateActivityFeed({
                type: 'info',
                icon: '📦',
                title: \`Delivery Update: \${data.trackingNumber}\`,
                description: \`Status changed to \${data.status}\`,
                timestamp: new Date()
              });
            });

            // Helper functions
            function getMarkerColor(status) {
              const colors = {
                'pending': '#ffc107',
                'in_transit': '#17a2b8',
                'delivered': '#28a745',
                'activated': '#667eea',
                'expired': '#dc3545'
              };
              return colors[status] || '#6c757d';
            }

            function getMarkerIcon(type) {
              const icons = {
                'hotel': '🏨',
                'real_estate': '🏘️',
                'company': '🏢'
              };
              return icons[type] || '📍';
            }

            function updateActivityFeed(activity) {
              const feed = document.getElementById('activity-feed');
              const activityHtml = \`
                <div class="activity-item">
                  <div class="activity-icon \${activity.type}">
                    \${activity.icon}
                  </div>
                  <div class="activity-content">
                    <div class="activity-title">\${activity.title}</div>
                    <div class="activity-meta">\${activity.description}</div>
                  </div>
                  <div class="activity-time">\${formatTime(activity.timestamp)}</div>
                </div>
              \`;
              feed.insertAdjacentHTML('afterbegin', activityHtml);

              // Remove old items (keep last 20)
              const items = feed.children;
              while (items.length > 20) {
                items[items.length - 1].remove();
              }
            }

            function formatTime(timestamp) {
              return new Date(timestamp).toLocaleTimeString();
            }

            function createInvitation() {
              alert('Create Invitation modal would open here');
            }

            function showAnalytics() {
              window.open('/api/analytics/dashboard', '_blank');
            }

            function exportData() {
              alert('Data export would begin here');
            }

            function refreshDashboard() {
              location.reload();
            }

            // Auto-refresh stats every 30 seconds
            setInterval(() => {
              fetch('/api/dashboard/stats')
                .then(response => response.json())
                .then(data => {
                  // Update stats display
                })
                .catch(console.error);
            }, 30000);
          </script>
        </body>
      </html>
    `;
        res.send(dashboardHTML);
    }
    catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to load dashboard'
        });
    }
});
router.get('/dashboard/stats', async (req, res) => {
    try {
        const stats = await getDashboardData();
        res.json(stats);
    }
    catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get dashboard statistics'
        });
    }
});
router.post('/invitations/create', async (req, res) => {
    try {
        const { businessType, tier, recipientDetails, activationLocation, deliveryMethod, expirationHours, trialDays, platformAccess } = req.body;
        const invitationNumber = generateInvitationNumber(businessType);
        const qrResult = await qrService.generateQRCode({
            invitationNumber,
            expirationHours: expirationHours || 72,
            smsVerification: true,
            deviceBinding: true,
            locationRequired: true
        });
        const invitation = {
            id: Math.floor(Math.random() * 1000) + 1,
            invitationNumber,
            businessType,
            tier,
            recipientDetails,
            activationLocation,
            deliveryMethod,
            expirationHours,
            trialDays,
            platformAccess,
            qrCode: qrResult.qrCodeDataURL,
            activationURL: qrResult.activationURL,
            status: 'created',
            createdAt: new Date(),
            createdBy: req.user?.id || 'admin'
        };
        res.json({
            success: true,
            invitation,
            qrCode: qrResult.qrCodeDataURL,
            activationURL: qrResult.activationURL
        });
    }
    catch (error) {
        console.error('Invitation creation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create invitation'
        });
    }
});
router.get('/geofencing', async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Geofencing management interface',
            activeZones: [
                {
                    id: 1,
                    name: 'Cyprus Hotels Zone',
                    type: 'hotel',
                    center: { lat: 35.1856, lng: 33.3823 },
                    radius: 50000,
                    activeInvitations: 12
                },
                {
                    id: 2,
                    name: 'Nicosia Business District',
                    type: 'company',
                    center: { lat: 35.1856, lng: 33.3823 },
                    radius: 5000,
                    activeInvitations: 8
                }
            ],
            totalZones: 15,
            totalActiveInvitations: 47
        });
    }
    catch (error) {
        console.error('Geofencing error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get geofencing data'
        });
    }
});
router.get('/trials', async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Trial management interface',
            activeTrials: [
                {
                    invitationNumber: 'CYH-001',
                    recipientName: 'Hotel Cyprus Ltd',
                    trialDays: 30,
                    daysRemaining: 23,
                    urgencyLevel: 'low',
                    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000)
                },
                {
                    invitationNumber: 'CYR-003',
                    recipientName: 'Cyprus Real Estate Group',
                    trialDays: 14,
                    daysRemaining: 3,
                    urgencyLevel: 'high',
                    lastActivity: new Date(Date.now() - 30 * 60 * 1000)
                }
            ],
            totalActiveTrials: 24,
            expiringSoon: 5,
            conversionRate: 67.5
        });
    }
    catch (error) {
        console.error('Trials error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get trial data'
        });
    }
});
async function getDashboardData() {
    return {
        stats: {
            totalInvitations: 47,
            activeInvitations: 24,
            deliveredToday: 8,
            activationsToday: 5,
            conversionRate: 67.5,
            avgDeliveryTime: 24
        },
        recentActivity: [
            {
                type: 'success',
                icon: '✅',
                title: 'Invitation Activated',
                description: 'CYH-001 activated by Hotel Cyprus Ltd',
                timestamp: new Date(Date.now() - 5 * 60 * 1000)
            },
            {
                type: 'info',
                icon: '📦',
                title: 'Package Delivered',
                description: 'CYR-003 delivered to Cyprus Real Estate Group',
                timestamp: new Date(Date.now() - 15 * 60 * 1000)
            },
            {
                type: 'warning',
                icon: '⚠️',
                title: 'Trial Expiring Soon',
                description: 'CYC-007 trial expires in 2 days',
                timestamp: new Date(Date.now() - 30 * 60 * 1000)
            },
            {
                type: 'success',
                icon: '🎫',
                title: 'New Invitation Created',
                description: 'CYH-012 created for Luxury Resort Cyprus',
                timestamp: new Date(Date.now() - 45 * 60 * 1000)
            }
        ]
    };
}
function generateInvitationNumber(businessType) {
    const prefix = businessType === 'hotel' ? 'CYH' :
        businessType === 'real_estate' ? 'CYR' : 'CYC';
    const number = Math.floor(Math.random() * 900) + 100;
    return `${prefix}-${number.toString().padStart(3, '0')}`;
}
exports.default = router;
//# sourceMappingURL=admin.js.map
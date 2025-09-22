const http = require('http');

/**
 * COSMOS ORDER PROTOCOL - FOUNDER COHORT GENERATOR
 * "Generating the first 50 founder invitations for the cosmic revolution"
 *
 * Systematically creates 49 additional founder invitations for premium
 * Mediterranean hospitality companies and entrepreneurs.
 */

// Premium founders for the first 50 cosmic invitations
const FOUNDER_COHORT = [
  // Cyprus Premium Hotels (5 founders)
  { name: "Amathus Beach Hotel", email: "gm@amathushotels.com", company: "Amathus Beach Hotel", country: "Cyprus" },
  { name: "Four Seasons Cyprus", email: "director@fourseasons.com.cy", company: "Four Seasons Cyprus", country: "Cyprus" },
  { name: "Anassa Hotel", email: "gm@anassa.com", company: "Anassa Hotel", country: "Cyprus" },
  { name: "Almyra Hotel", email: "gm@almyrahotel.com", company: "Almyra Hotel", country: "Cyprus" },
  { name: "The Library Hotel", email: "manager@libraryhotel.com.cy", company: "The Library Hotel", country: "Cyprus" },

  // Malta Luxury Properties (8 founders)
  { name: "The Phoenicia Malta", email: "gm@phoeniciamalta.com", company: "The Phoenicia Malta", country: "Malta" },
  { name: "Corinthia Palace Hotel", email: "director@corinthia.com", company: "Corinthia Palace Hotel", country: "Malta" },
  { name: "The Westin Dragonara", email: "gm@westin.com.mt", company: "The Westin Dragonara", country: "Malta" },
  { name: "InterContinental Malta", email: "gm@intercontinental.com.mt", company: "InterContinental Malta", country: "Malta" },
  { name: "Radisson Blu Resort Malta", email: "gm@radissonblu.com.mt", company: "Radisson Blu Resort Malta", country: "Malta" },
  { name: "Palazzo Consiglia", email: "owner@palazzoconsiglia.com", company: "Palazzo Consiglia", country: "Malta" },
  { name: "Casa Ellul", email: "director@casaellul.com", company: "Casa Ellul", country: "Malta" },
  { name: "Iniala Harbour House", email: "gm@iniala.com", company: "Iniala Harbour House", country: "Malta" },

  // Greece Premium Hotels (12 founders)
  { name: "Hotel Grande Bretagne", email: "gm@grandebretagne.gr", company: "Hotel Grande Bretagne", country: "Greece" },
  { name: "Costa Navarino", email: "gm@costanavarino.com", company: "Costa Navarino", country: "Greece" },
  { name: "Amanzoe", email: "gm@aman.com", company: "Amanzoe", country: "Greece" },
  { name: "Four Seasons Astir Palace", email: "gm@fourseasons.com", company: "Four Seasons Astir Palace", country: "Greece" },
  { name: "Mykonos Blu Grecotel", email: "gm@grecotel.com", company: "Mykonos Blu Grecotel", country: "Greece" },
  { name: "Cavo Tagoo Mykonos", email: "gm@cavotagoo.gr", company: "Cavo Tagoo Mykonos", country: "Greece" },
  { name: "Grace Hotel Santorini", email: "gm@gracehotels.com", company: "Grace Hotel Santorini", country: "Greece" },
  { name: "Katikies Santorini", email: "gm@katikies.com", company: "Katikies Santorini", country: "Greece" },
  { name: "Blue Palace Crete", email: "gm@bluepalace.gr", company: "Blue Palace Crete", country: "Greece" },
  { name: "Royal Villa Crete", email: "owner@royalvilla.gr", company: "Royal Villa Crete", country: "Greece" },
  { name: "Mandarin Oriental Athens", email: "gm@mandarinoriental.com", company: "Mandarin Oriental Athens", country: "Greece" },
  { name: "NJV Athens Plaza", email: "gm@njvathensplaza.gr", company: "NJV Athens Plaza", country: "Greece" },

  // Turkey Luxury Properties (10 founders)
  { name: "Four Seasons Bosphorus", email: "gm@fourseasons.com.tr", company: "Four Seasons Bosphorus", country: "Turkey" },
  { name: "Çırağan Palace Kempinski", email: "gm@kempinski.com", company: "Çırağan Palace Kempinski", country: "Turkey" },
  { name: "Raffles Istanbul", email: "gm@raffles.com", company: "Raffles Istanbul", country: "Turkey" },
  { name: "The Ritz-Carlton Istanbul", email: "gm@ritzcarlton.com", company: "The Ritz-Carlton Istanbul", country: "Turkey" },
  { name: "Mandarin Oriental Bodrum", email: "gm@mandarinoriental.com", company: "Mandarin Oriental Bodrum", country: "Turkey" },
  { name: "Six Senses Kaplankaya", email: "gm@sixsenses.com", company: "Six Senses Kaplankaya", country: "Turkey" },
  { name: "D Maris Bay", email: "gm@dmarisbay.com", company: "D Maris Bay", country: "Turkey" },
  { name: "Regnum Carya Golf", email: "gm@regnumhotels.com", company: "Regnum Carya Golf", country: "Turkey" },
  { name: "Hillside Beach Club", email: "owner@hillsidebeach.com", company: "Hillside Beach Club", country: "Turkey" },
  { name: "Maxx Royal Belek", email: "gm@maxxroyal.com", company: "Maxx Royal Belek", country: "Turkey" },

  // International Hospitality Groups (8 founders)
  { name: "Marriott International", email: "regional.director@marriott.com", company: "Marriott International", country: "Global" },
  { name: "Hyatt Hotels", email: "regional.gm@hyatt.com", company: "Hyatt Hotels", country: "Global" },
  { name: "AccorHotels", email: "regional.director@accor.com", company: "AccorHotels", country: "Global" },
  { name: "IHG Hotels", email: "regional.gm@ihg.com", company: "IHG Hotels", country: "Global" },
  { name: "Hilton Worldwide", email: "regional.director@hilton.com", company: "Hilton Worldwide", country: "Global" },
  { name: "Shangri-La Hotels", email: "regional.gm@shangri-la.com", company: "Shangri-La Hotels", country: "Global" },
  { name: "Rosewood Hotels", email: "regional.director@rosewoodhotels.com", company: "Rosewood Hotels", country: "Global" },
  { name: "Edition Hotels", email: "regional.gm@editionhotels.com", company: "Edition Hotels", country: "Global" },

  // Tech-Forward Hospitality Entrepreneurs (6 founders)
  { name: "PropTech Ventures", email: "founder@proptech.ventures", company: "PropTech Ventures", country: "Cyprus" },
  { name: "Mediterranean Digital Hotels", email: "ceo@meddigitalhotels.com", company: "Mediterranean Digital Hotels", country: "Malta" },
  { name: "Aegean Smart Properties", email: "founder@aegeansmart.gr", company: "Aegean Smart Properties", country: "Greece" },
  { name: "Anatolian Tech Hospitality", email: "ceo@anatoliantech.com", company: "Anatolian Tech Hospitality", country: "Turkey" },
  { name: "Luxury Automation Systems", email: "founder@luxuryautomation.com", company: "Luxury Automation Systems", country: "Global" },
  { name: "Cosmic Hospitality Partners", email: "partner@cosmichospitality.com", company: "Cosmic Hospitality Partners", country: "Global" }
];

async function generateInvitation(recipient) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      recipient,
      tier: 'founder'
    });

    const options = {
      hostname: 'localhost',
      port: 3034,
      path: '/api/cosmos/invitations/generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function generateFounderCohort() {
  console.log('🌌 COSMOS ORDER PROTOCOL - FOUNDER COHORT GENERATION');
  console.log('💎 Generating 49 premium founder invitations...\n');

  let successCount = 0;
  let errorCount = 0;
  const results = [];

  for (let i = 0; i < FOUNDER_COHORT.length; i++) {
    const founder = FOUNDER_COHORT[i];

    try {
      console.log(`🚀 Generating invitation ${i + 1}/49: ${founder.company} (${founder.country})`);

      const result = await generateInvitation(founder);

      if (result.success) {
        successCount++;
        console.log(`✅ Generated: ${result.data.number} - ${founder.name}`);
        results.push({
          number: result.data.number,
          company: founder.company,
          country: founder.country,
          status: 'generated'
        });
      } else {
        errorCount++;
        console.log(`❌ Failed: ${founder.company} - ${result.error}`);
        results.push({
          company: founder.company,
          country: founder.country,
          status: 'failed',
          error: result.error
        });
      }

      // Small delay to prevent overwhelming the service
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      errorCount++;
      console.log(`❌ Network error for ${founder.company}: ${error.message}`);
      results.push({
        company: founder.company,
        country: founder.country,
        status: 'network_error',
        error: error.message
      });
    }
  }

  console.log('\n🎊 FOUNDER COHORT GENERATION COMPLETE');
  console.log(`✅ Successful Invitations: ${successCount}`);
  console.log(`❌ Failed Invitations: ${errorCount}`);
  console.log(`📊 Total Processed: ${FOUNDER_COHORT.length}`);

  // Summary by country
  const countryStats = {};
  results.forEach(result => {
    if (!countryStats[result.country]) {
      countryStats[result.country] = { success: 0, failed: 0 };
    }
    if (result.status === 'generated') {
      countryStats[result.country].success++;
    } else {
      countryStats[result.country].failed++;
    }
  });

  console.log('\n🌍 INVITATIONS BY REGION:');
  Object.entries(countryStats).forEach(([country, stats]) => {
    console.log(`   ${country}: ${stats.success} successful, ${stats.failed} failed`);
  });

  console.log('\n🌌 First 50 Cosmos Order founders ready for recruitment');
  console.log('💎 Philosophy: You are not a user. You are a member of the revolution.');
  console.log('👑 Ready to activate the Mediterranean cosmic empire\n');

  return {
    totalProcessed: FOUNDER_COHORT.length,
    successful: successCount,
    failed: errorCount,
    results,
    countryStats
  };
}

// Main execution
if (require.main === module) {
  generateFounderCohort()
    .then(summary => {
      console.log('🚀 Founder cohort generation completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Fatal error in founder cohort generation:', error);
      process.exit(1);
    });
}

module.exports = {
  generateFounderCohort,
  generateInvitation,
  FOUNDER_COHORT
};
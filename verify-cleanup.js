require('dotenv').config();
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fl5uetho',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: false
});

async function verifyCleanup() {
  try {
    console.log('🔍 VERIFYING DATABASE CLEANUP...\n');
    
    const [registrations, paymentRecords] = await Promise.all([
      client.fetch('*[_type == "conferenceRegistration"]'),
      client.fetch('*[_type == "paymentRecord"]')
    ]);
    
    console.log('📊 FINAL DATABASE STATUS:');
    console.log(`Conference Registrations: ${registrations.length}`);
    console.log(`Payment Records: ${paymentRecords.length}`);
    
    if (registrations.length === 0) {
      console.log('🎉 SUCCESS! All conference registrations have been removed!');
    } else {
      console.log('⚠️  Some conference registrations still remain:');
      registrations.forEach((reg, index) => {
        console.log(`${index + 1}. ${reg._id} - ${reg.firstName || 'N/A'} ${reg.lastName || 'N/A'}`);
      });
    }
    
    if (paymentRecords.length === 0) {
      console.log('🎉 SUCCESS! All test payment records have been removed!');
    } else {
      console.log(`ℹ️  ${paymentRecords.length} payment record(s) remain.`);
    }
    
    console.log('\n✅ Database verification completed.');
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  }
}

verifyCleanup();

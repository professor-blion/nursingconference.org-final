require('dotenv').config();

/**
 * Coolify Environment Variables Verification Script
 * Verifies all required environment variables are properly set in production
 */

async function verifyCoolifyEnvironment() {
  console.log('🔍 VERIFYING COOLIFY ENVIRONMENT VARIABLES...');
  console.log('=' .repeat(60));
  console.log(`🕐 Timestamp: ${new Date().toISOString()}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'undefined'}`);
  console.log(`📍 Platform: ${process.platform}`);
  console.log(`🔧 Node Version: ${process.version}`);
  
  const results = {
    core: { passed: 0, total: 0, issues: [] },
    smtp: { passed: 0, total: 0, issues: [] },
    sanity: { passed: 0, total: 0, issues: [] },
    paypal: { passed: 0, total: 0, issues: [] },
    overall: false
  };

  try {
    // 1. Core Application Variables
    console.log('\n🔧 CORE APPLICATION VARIABLES');
    console.log('-'.repeat(50));
    
    const coreVars = [
      { name: 'NODE_ENV', required: true, expected: 'production' },
      { name: 'PORT', required: false, expected: '3000' },
      { name: 'HOSTNAME', required: false, expected: '0.0.0.0' }
    ];
    
    coreVars.forEach(varConfig => {
      const value = process.env[varConfig.name];
      const isSet = !!value;
      const isCorrect = !varConfig.expected || value === varConfig.expected;
      
      results.core.total++;
      
      if (varConfig.required && !isSet) {
        console.log(`❌ ${varConfig.name}: NOT SET (REQUIRED)`);
        results.core.issues.push(`${varConfig.name} is required but not set`);
      } else if (isSet && !isCorrect) {
        console.log(`⚠️  ${varConfig.name}: ${value} (Expected: ${varConfig.expected})`);
        results.core.issues.push(`${varConfig.name} should be ${varConfig.expected}`);
      } else if (isSet) {
        console.log(`✅ ${varConfig.name}: ${value}`);
        results.core.passed++;
      } else {
        console.log(`⚪ ${varConfig.name}: Not set (Optional)`);
        results.core.passed++;
      }
    });
    
    // 2. SMTP Email Variables
    console.log('\n📧 SMTP EMAIL VARIABLES');
    console.log('-'.repeat(50));
    
    const smtpVars = [
      { name: 'SMTP_HOST', required: true, expected: 'smtp.hostinger.com' },
      { name: 'SMTP_PORT', required: true, expected: ['465', '587'] },
      { name: 'SMTP_SECURE', required: false, expected: ['true', 'false'] },
      { name: 'SMTP_USER', required: true, expected: 'contactus@intelliglobalconferences.com' },
      { name: 'SMTP_PASS', required: true, sensitive: true },
      { name: 'FROM_EMAIL', required: true, expected: 'contactus@intelliglobalconferences.com' }
    ];
    
    smtpVars.forEach(varConfig => {
      const value = process.env[varConfig.name];
      const isSet = !!value;
      const isCorrect = !varConfig.expected || 
        (Array.isArray(varConfig.expected) ? varConfig.expected.includes(value) : value === varConfig.expected);
      
      results.smtp.total++;
      
      if (varConfig.required && !isSet) {
        console.log(`❌ ${varConfig.name}: NOT SET (REQUIRED)`);
        results.smtp.issues.push(`${varConfig.name} is required for email delivery`);
      } else if (isSet && !isCorrect && varConfig.expected) {
        const expectedStr = Array.isArray(varConfig.expected) ? varConfig.expected.join(' or ') : varConfig.expected;
        console.log(`⚠️  ${varConfig.name}: ${varConfig.sensitive ? '***SET***' : value} (Expected: ${expectedStr})`);
        results.smtp.issues.push(`${varConfig.name} should be ${expectedStr}`);
      } else if (isSet) {
        const displayValue = varConfig.sensitive ? '***SET***' : value;
        console.log(`✅ ${varConfig.name}: ${displayValue}`);
        results.smtp.passed++;
      } else {
        console.log(`⚪ ${varConfig.name}: Not set (Optional)`);
        results.smtp.passed++;
      }
    });
    
    // 3. Sanity CMS Variables
    console.log('\n🗄️ SANITY CMS VARIABLES');
    console.log('-'.repeat(50));
    
    const sanityVars = [
      { name: 'NEXT_PUBLIC_SANITY_PROJECT_ID', required: true, expected: 'fl5uetho' },
      { name: 'NEXT_PUBLIC_SANITY_DATASET', required: true, expected: 'production' },
      { name: 'NEXT_PUBLIC_SANITY_API_VERSION', required: false, expected: '2023-05-03' },
      { name: 'SANITY_API_TOKEN', required: true, sensitive: true }
    ];
    
    sanityVars.forEach(varConfig => {
      const value = process.env[varConfig.name];
      const isSet = !!value;
      const isCorrect = !varConfig.expected || value === varConfig.expected;
      
      results.sanity.total++;
      
      if (varConfig.required && !isSet) {
        console.log(`❌ ${varConfig.name}: NOT SET (REQUIRED)`);
        results.sanity.issues.push(`${varConfig.name} is required for Sanity CMS access`);
      } else if (isSet && !isCorrect && varConfig.expected) {
        console.log(`⚠️  ${varConfig.name}: ${varConfig.sensitive ? '***SET***' : value} (Expected: ${varConfig.expected})`);
        results.sanity.issues.push(`${varConfig.name} should be ${varConfig.expected}`);
      } else if (isSet) {
        const displayValue = varConfig.sensitive ? '***SET***' : value;
        console.log(`✅ ${varConfig.name}: ${displayValue}`);
        results.sanity.passed++;
      } else {
        console.log(`⚪ ${varConfig.name}: Not set (Optional)`);
        results.sanity.passed++;
      }
    });
    
    // 4. PayPal Variables
    console.log('\n💳 PAYPAL VARIABLES');
    console.log('-'.repeat(50));
    
    const paypalVars = [
      { name: 'NEXT_PUBLIC_PAYPAL_CLIENT_ID', required: true },
      { name: 'PAYPAL_CLIENT_SECRET', required: true, sensitive: true },
      { name: 'PAYPAL_BASE_URL', required: false, expected: 'https://api-m.paypal.com' }
    ];
    
    paypalVars.forEach(varConfig => {
      const value = process.env[varConfig.name];
      const isSet = !!value;
      const isCorrect = !varConfig.expected || value === varConfig.expected;
      
      results.paypal.total++;
      
      if (varConfig.required && !isSet) {
        console.log(`❌ ${varConfig.name}: NOT SET (REQUIRED)`);
        results.paypal.issues.push(`${varConfig.name} is required for PayPal payments`);
      } else if (isSet && !isCorrect && varConfig.expected) {
        console.log(`⚠️  ${varConfig.name}: ${varConfig.sensitive ? '***SET***' : value} (Expected: ${varConfig.expected})`);
        results.paypal.issues.push(`${varConfig.name} should be ${varConfig.expected}`);
      } else if (isSet) {
        const displayValue = varConfig.sensitive ? '***SET***' : value;
        console.log(`✅ ${varConfig.name}: ${displayValue}`);
        results.paypal.passed++;
      } else {
        console.log(`⚪ ${varConfig.name}: Not set (Optional)`);
        results.paypal.passed++;
      }
    });
    
    // 5. Summary and Recommendations
    console.log('\n📊 ENVIRONMENT VERIFICATION SUMMARY');
    console.log('=' .repeat(60));
    
    const categories = [
      { name: 'Core Application', data: results.core },
      { name: 'SMTP Email', data: results.smtp },
      { name: 'Sanity CMS', data: results.sanity },
      { name: 'PayPal', data: results.paypal }
    ];
    
    categories.forEach(category => {
      const percentage = category.data.total > 0 ? Math.round((category.data.passed / category.data.total) * 100) : 100;
      const status = percentage === 100 ? '✅' : percentage >= 80 ? '⚠️' : '❌';
      console.log(`   ${status} ${category.name}: ${category.data.passed}/${category.data.total} (${percentage}%)`);
    });
    
    const totalPassed = categories.reduce((sum, cat) => sum + cat.data.passed, 0);
    const totalRequired = categories.reduce((sum, cat) => sum + cat.data.total, 0);
    const overallPercentage = totalRequired > 0 ? Math.round((totalPassed / totalRequired) * 100) : 100;
    
    results.overall = overallPercentage >= 90;
    
    console.log(`\n🎯 OVERALL STATUS: ${totalPassed}/${totalRequired} (${overallPercentage}%)`);
    
    if (results.overall) {
      console.log('🎉 ENVIRONMENT READY FOR PRODUCTION!');
      console.log('✅ All critical environment variables are properly configured');
      console.log('✅ Payment receipt system should work correctly');
    } else {
      console.log('❌ ENVIRONMENT NEEDS ATTENTION!');
      console.log('🔧 Critical issues must be resolved before production use');
    }
    
    // 6. Issues and Recommendations
    const allIssues = [
      ...results.core.issues,
      ...results.smtp.issues,
      ...results.sanity.issues,
      ...results.paypal.issues
    ];
    
    if (allIssues.length > 0) {
      console.log('\n🚨 ISSUES TO RESOLVE:');
      allIssues.forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue}`);
      });
      
      console.log('\n🔧 RESOLUTION STEPS:');
      console.log('1. Go to Coolify application settings');
      console.log('2. Navigate to "Environment Variables" section');
      console.log('3. Add/update the missing or incorrect variables');
      console.log('4. Redeploy the application');
      console.log('5. Run this verification script again');
    }
    
    // 7. Next Steps
    console.log('\n📋 NEXT STEPS:');
    if (results.overall) {
      console.log('1. ✅ Environment is ready - proceed with testing');
      console.log('2. 🧪 Run: node debug-payment-workflow.js');
      console.log('3. 📧 Test email delivery with actual payment');
      console.log('4. 📊 Monitor application logs for any issues');
    } else {
      console.log('1. 🔧 Fix the environment variable issues listed above');
      console.log('2. 🔄 Redeploy application in Coolify');
      console.log('3. 🔍 Run this verification script again');
      console.log('4. 🧪 Proceed to workflow testing once all issues are resolved');
    }
    
    console.log('\n📞 SUPPORT RESOURCES:');
    console.log('   🐳 Coolify Documentation: https://coolify.io/docs');
    console.log('   🗄️ Sanity Dashboard: https://sanity.io/manage');
    console.log('   💳 PayPal Developer: https://developer.paypal.com');
    console.log('   📧 SMTP Provider: Contact Hostinger support');
    
  } catch (error) {
    console.error('\n💥 Environment verification failed:', error.message);
    console.error('Stack trace:', error.stack);
    results.overall = false;
  }
  
  return results;
}

// Run verification if called directly
if (require.main === module) {
  verifyCoolifyEnvironment()
    .then(results => {
      process.exit(results.overall ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Verification failed:', error);
      process.exit(1);
    });
}

module.exports = { verifyCoolifyEnvironment };

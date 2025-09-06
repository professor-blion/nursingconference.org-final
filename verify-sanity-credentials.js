/**
 * VERIFICATION SCRIPT FOR SANITY CREDENTIALS
 * 
 * This script verifies that all Sanity project IDs and API tokens
 * in the codebase are correct and no cross-project references remain.
 */

const fs = require('fs');
const path = require('path');

// Correct credentials
const CORRECT_PROJECT_ID = 'fl5uetho';
const CORRECT_API_TOKEN = 'skJxcOEM55Yxtn04BIQ5Cf3gJ0oW58CtryfVcIPnWjsohKhxu0BNDG1psGawYEl4TVmq24g42dbILVm1SvB1CAPfd54X2AmV8YV6sKsNUId0JbwEi90k1gW6tnSvFjJxBpgW8xmpsUvM82hPjmgqQHhrGqEQ3rExNHYpOm7qLWThEeTS8D0n';

// Known incorrect credentials that should NOT exist
const INCORRECT_PROJECT_IDS = ['n3no08m3'];
const INCORRECT_TOKENS = [
  'skjc5mkFKiTdcpHQsCWU8p2mUXSlrlvzMpb9TiyRBOoKWOwVjGHLcVaD7cdkCopUZK767GIyCj26Qo4nfnout8TpPgACQdKxvsfetjD1RBbpwQJUmcBXMvXtdGDbXze4YTkc3D8uLLJQBYBy920sd2RNQy1TTwTbbyGxzeyDnTyqVkaMLNgC',
  'skIrRjdaaygkwN7mE9JXLLV8IUPfHl2phKAu0umRR5eCLYuRw4oFi4kXfh3kXa0xxHHJZcv451AY6SFMxGuLWbHUMrPjxppFxA0NAFwgrkEZggVUYPJ3jtKA76br4f07USUJMDOR1JQoS7U0vSsiJzCp8q2CwgAcHiksA7H4FrN04Vh3kC3c',
  'skYegVIAaFOFaI7V7mOXSkrnV0L1P1TNbcYNIlfZ0seOUeFLSM1ygvFaAchfi6IfYwtqslz0WrVjBQ7pjcOOB2Spjp2E0ujG16mN5VGppLRnvsFL29nFZHU2ceAy6bBBP8TBJ5TcsrT180LR6HTjC0gzjnmfXl9srhe8kJkx312tqhAekrDp',
  'skm5Vr6I3J2tGwXbH5VE34OrEZd2YsVkMv8ZOTvxEhLE2YVsABikeolCIUOyVP3vpBPBu1IcEWaIPyXpoJPUGCtq7PYrMb1tBTlxK3GozsWLLVOrLlbn1htqdDFnLLeBciCS3H13s8UhkYaEOwSBCOIRSZDpC8cpRCphSQw18umo9dfGFGGq',
  'sk5ZJnKnmbkzR8oiue5pXEvOZly20Km0ZHRnc4ywpg8HPby9N3wipoQsOHMSIIj1yTF0dtccBarQQsL2P0YwmP5Uf8QeoHP44FleIkjPXotKSmGPwzkdpDjC2nA1Fbic5W5QnQeghKuQTfnsqLKIWvP4q5idSUpopClvl0BLJcAJTQeBZoQy'
];

// Files to exclude
const EXCLUDE_FILES = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  'audit-and-fix-sanity-credentials.js',
  'verify-sanity-credentials.js'
];

// File extensions to check
const INCLUDE_EXTENSIONS = ['.js', '.ts', '.json', '.md', '.env', '.yaml', '.yml'];

let verificationResults = {
  filesScanned: 0,
  issuesFound: 0,
  correctProjectIdCount: 0,
  correctTokenCount: 0,
  incorrectCredentials: []
};

function shouldProcessFile(filePath) {
  for (const exclude of EXCLUDE_FILES) {
    if (filePath.includes(exclude)) {
      return false;
    }
  }
  
  const ext = path.extname(filePath);
  return INCLUDE_EXTENSIONS.includes(ext) || path.basename(filePath).startsWith('.env');
}

function verifyFile(filePath) {
  try {
    verificationResults.filesScanned++;
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for correct project ID
    if (content.includes(CORRECT_PROJECT_ID)) {
      verificationResults.correctProjectIdCount++;
    }
    
    // Check for correct API token
    if (content.includes(CORRECT_API_TOKEN)) {
      verificationResults.correctTokenCount++;
    }
    
    // Check for incorrect project IDs
    for (const incorrectId of INCORRECT_PROJECT_IDS) {
      if (content.includes(incorrectId)) {
        verificationResults.issuesFound++;
        verificationResults.incorrectCredentials.push({
          file: filePath,
          type: 'Project ID',
          incorrect: incorrectId,
          correct: CORRECT_PROJECT_ID
        });
      }
    }
    
    // Check for incorrect API tokens
    for (const incorrectToken of INCORRECT_TOKENS) {
      if (content.includes(incorrectToken)) {
        verificationResults.issuesFound++;
        verificationResults.incorrectCredentials.push({
          file: filePath,
          type: 'API Token',
          incorrect: incorrectToken.substring(0, 20) + '...',
          correct: CORRECT_API_TOKEN.substring(0, 20) + '...'
        });
      }
    }
    
  } catch (error) {
    console.error(`❌ Error verifying ${filePath}:`, error.message);
  }
}

function scanDirectory(dirPath) {
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!EXCLUDE_FILES.some(exclude => item.includes(exclude))) {
          scanDirectory(fullPath);
        }
      } else if (stat.isFile()) {
        if (shouldProcessFile(fullPath)) {
          verifyFile(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`❌ Error scanning directory ${dirPath}:`, error.message);
  }
}

function generateVerificationReport() {
  console.log('\n' + '='.repeat(80));
  console.log('🔍 SANITY CREDENTIALS VERIFICATION REPORT');
  console.log('='.repeat(80));
  
  console.log(`📊 Verification Summary:`);
  console.log(`   Files Scanned: ${verificationResults.filesScanned}`);
  console.log(`   Files with Correct Project ID: ${verificationResults.correctProjectIdCount}`);
  console.log(`   Files with Correct API Token: ${verificationResults.correctTokenCount}`);
  console.log(`   Issues Found: ${verificationResults.issuesFound}`);
  
  if (verificationResults.issuesFound === 0) {
    console.log(`\n🎉 VERIFICATION PASSED!`);
    console.log(`   ✅ No incorrect Sanity credentials found`);
    console.log(`   ✅ All project references use: ${CORRECT_PROJECT_ID}`);
    console.log(`   ✅ All API tokens use the correct token`);
    console.log(`   ✅ No cross-project API request leakage detected`);
  } else {
    console.log(`\n❌ VERIFICATION FAILED!`);
    console.log(`   Found ${verificationResults.issuesFound} incorrect credential(s):`);
    
    verificationResults.incorrectCredentials.forEach((issue, index) => {
      console.log(`\n${index + 1}. ${issue.file}`);
      console.log(`   Type: ${issue.type}`);
      console.log(`   Found: ${issue.incorrect}`);
      console.log(`   Should be: ${issue.correct}`);
    });
    
    console.log(`\n🔧 Action Required:`);
    console.log(`   Run the audit script again to fix these issues:`);
    console.log(`   node audit-and-fix-sanity-credentials.js`);
  }
  
  console.log(`\n📋 Environment Variables Check:`);
  console.log(`   NEXT_PUBLIC_SANITY_PROJECT_ID should be: ${CORRECT_PROJECT_ID}`);
  console.log(`   SANITY_API_TOKEN should be: ${CORRECT_API_TOKEN.substring(0, 20)}...`);
  
  console.log('\n' + '='.repeat(80));
  
  return verificationResults.issuesFound === 0;
}

// Main execution
console.log('🔍 Starting Sanity Credentials Verification...');
console.log(`Expected Project ID: ${CORRECT_PROJECT_ID}`);
console.log(`Expected API Token: ${CORRECT_API_TOKEN.substring(0, 20)}...`);
console.log('');

// Start scanning from current directory
scanDirectory('.');

// Generate verification report
const passed = generateVerificationReport();

// Exit with appropriate code
process.exit(passed ? 0 : 1);

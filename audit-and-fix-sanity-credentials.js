/**
 * COMPREHENSIVE SANITY CREDENTIALS AUDIT AND FIX
 * 
 * This script identifies and fixes all hardcoded Sanity project IDs and API tokens
 * that may be referencing other projects, causing API request leakage.
 */

const fs = require('fs');
const path = require('path');

// Correct credentials for our project
const CORRECT_PROJECT_ID = 'fl5uetho';
const CORRECT_API_TOKEN = 'skJxcOEM55Yxtn04BIQ5Cf3gJ0oW58CtryfVcIPnWjsohKhxu0BNDG1psGawYEl4TVmq24g42dbILVm1SvB1CAPfd54X2AmV8YV6sKsNUId0JbwEi90k1gW6tnSvFjJxBpgW8xmpsUvM82hPjmgqQHhrGqEQ3rExNHYpOm7qLWThEeTS8D0n';

// Incorrect project IDs and tokens to replace
const INCORRECT_PROJECT_IDS = ['n3no08m3'];
const INCORRECT_TOKENS = [
  'skjc5mkFKiTdcpHQsCWU8p2mUXSlrlvzMpb9TiyRBOoKWOwVjGHLcVaD7cdkCopUZK767GIyCj26Qo4nfnout8TpPgACQdKxvsfetjD1RBbpwQJUmcBXMvXtdGDbXze4YTkc3D8uLLJQBYBy920sd2RNQy1TTwTbbyGxzeyDnTyqVkaMLNgC',
  'skIrRjdaaygkwN7mE9JXLLV8IUPfHl2phKAu0umRR5eCLYuRw4oFi4kXfh3kXa0xxHHJZcv451AY6SFMxGuLWbHUMrPjxppFxA0NAFwgrkEZggVUYPJ3jtKA76br4f07USUJMDOR1JQoS7U0vSsiJzCp8q2CwgAcHiksA7H4FrN04Vh3kC3c',
  'skYegVIAaFOFaI7V7mOXSkrnV0L1P1TNbcYNIlfZ0seOUeFLSM1ygvFaAchfi6IfYwtqslz0WrVjBQ7pjcOOB2Spjp2E0ujG16mN5VGppLRnvsFL29nFZHU2ceAy6bBBP8TBJ5TcsrT180LR6HTjC0gzjnmfXl9srhe8kJkx312tqhAekrDp',
  'skm5Vr6I3J2tGwXbH5VE34OrEZd2YsVkMv8ZOTvxEhLE2YVsABikeolCIUOyVP3vpBPBu1IcEWaIPyXpoJPUGCtq7PYrMb1tBTlxK3GozsWLLVOrLlbn1htqdDFnLLeBciCS3H13s8UhkYaEOwSBCOIRSZDpC8cpRCphSQw18umo9dfGFGGq',
  'sk5ZJnKnmbkzR8oiue5pXEvOZly20Km0ZHRnc4ywpg8HPby9N3wipoQsOHMSIIj1yTF0dtccBarQQsL2P0YwmP5Uf8QeoHP44FleIkjPXotKSmGPwzkdpDjC2nA1Fbic5W5QnQeghKuQTfnsqLKIWvP4q5idSUpopClvl0BLJcAJTQeBZoQy'
];

// Files to exclude from processing
const EXCLUDE_FILES = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  'audit-and-fix-sanity-credentials.js'
];

// File extensions to process
const INCLUDE_EXTENSIONS = ['.js', '.ts', '.json', '.md', '.env', '.yaml', '.yml'];

let auditResults = {
  filesScanned: 0,
  filesModified: 0,
  projectIdReplacements: 0,
  tokenReplacements: 0,
  modifiedFiles: []
};

function shouldProcessFile(filePath) {
  // Check if file should be excluded
  for (const exclude of EXCLUDE_FILES) {
    if (filePath.includes(exclude)) {
      return false;
    }
  }
  
  // Check if file extension should be included
  const ext = path.extname(filePath);
  return INCLUDE_EXTENSIONS.includes(ext) || path.basename(filePath).startsWith('.env');
}

function processFile(filePath) {
  try {
    auditResults.filesScanned++;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let fileModified = false;
    let replacements = [];
    
    // Replace incorrect project IDs
    for (const incorrectId of INCORRECT_PROJECT_IDS) {
      const regex = new RegExp(incorrectId, 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, CORRECT_PROJECT_ID);
        auditResults.projectIdReplacements += matches.length;
        replacements.push(`Project ID: ${incorrectId} → ${CORRECT_PROJECT_ID} (${matches.length} times)`);
        fileModified = true;
      }
    }
    
    // Replace incorrect API tokens
    for (const incorrectToken of INCORRECT_TOKENS) {
      if (content.includes(incorrectToken)) {
        content = content.replace(new RegExp(incorrectToken, 'g'), CORRECT_API_TOKEN);
        auditResults.tokenReplacements++;
        replacements.push(`API Token: ${incorrectToken.substring(0, 20)}... → ${CORRECT_API_TOKEN.substring(0, 20)}...`);
        fileModified = true;
      }
    }
    
    // Write back if modified
    if (fileModified) {
      fs.writeFileSync(filePath, content, 'utf8');
      auditResults.filesModified++;
      auditResults.modifiedFiles.push({
        file: filePath,
        replacements: replacements
      });
      
      console.log(`✅ Fixed: ${filePath}`);
      replacements.forEach(replacement => {
        console.log(`   ${replacement}`);
      });
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

function scanDirectory(dirPath) {
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip excluded directories
        if (!EXCLUDE_FILES.some(exclude => item.includes(exclude))) {
          scanDirectory(fullPath);
        }
      } else if (stat.isFile()) {
        if (shouldProcessFile(fullPath)) {
          processFile(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`❌ Error scanning directory ${dirPath}:`, error.message);
  }
}

function generateReport() {
  console.log('\n' + '='.repeat(80));
  console.log('🔍 SANITY CREDENTIALS AUDIT REPORT');
  console.log('='.repeat(80));
  
  console.log(`📊 Summary:`);
  console.log(`   Files Scanned: ${auditResults.filesScanned}`);
  console.log(`   Files Modified: ${auditResults.filesModified}`);
  console.log(`   Project ID Replacements: ${auditResults.projectIdReplacements}`);
  console.log(`   API Token Replacements: ${auditResults.tokenReplacements}`);
  
  if (auditResults.modifiedFiles.length > 0) {
    console.log(`\n📝 Modified Files:`);
    auditResults.modifiedFiles.forEach((file, index) => {
      console.log(`\n${index + 1}. ${file.file}`);
      file.replacements.forEach(replacement => {
        console.log(`   • ${replacement}`);
      });
    });
  }
  
  console.log(`\n✅ Audit Complete!`);
  console.log(`   Correct Project ID: ${CORRECT_PROJECT_ID}`);
  console.log(`   Correct API Token: ${CORRECT_API_TOKEN.substring(0, 20)}...`);
  
  if (auditResults.filesModified === 0) {
    console.log(`\n🎉 No issues found! All files already use correct credentials.`);
  } else {
    console.log(`\n🔧 Fixed ${auditResults.filesModified} files with incorrect credentials.`);
    console.log(`   This should prevent API request leakage to other Sanity projects.`);
  }
  
  console.log('\n' + '='.repeat(80));
}

// Main execution
console.log('🚀 Starting Sanity Credentials Audit...');
console.log(`Target Project ID: ${CORRECT_PROJECT_ID}`);
console.log(`Target API Token: ${CORRECT_API_TOKEN.substring(0, 20)}...`);
console.log('');

// Start scanning from current directory
scanDirectory('.');

// Generate final report
generateReport();

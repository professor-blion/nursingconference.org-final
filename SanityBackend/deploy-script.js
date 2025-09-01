const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

// Create Sanity client with editing token first to check project details
const editingClient = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  token: 'skIrRjdaaygkwN7mE9JXLLV8IUPfHl2phKAu0umRR5eCLYuRw4oFi4kXfh3kXa0xxHHJZcv451AY6SFMxGuLWbHUMrPjxppFxA0NAFwgrkEZggVUYPJ3jtKA76br4f07USUJMDOR1JQoS7U0vSsiJzCp8q2CwgAcHiksA7H4FrN04Vh3kC3c',
  useCdn: false,
  apiVersion: '2023-05-03'
});

// Create Sanity client with deployment token
const deployClient = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  token: 'skm5Vr6I3J2tGwXbH5VE34OrEZd2YsVkMv8ZOTvxEhLE2YVsABikeolCIUOyVP3vpBPBu1IcEWaIPyXpoJPUGCtq7PYrMb1tBTlxK3GozsWLLVOrLlbn1htqdDFnLLeBciCS3H13s8UhkYaEOwSBCOIRSZDpC8cpRCphSQw18umo9dfGFGGq',
  useCdn: false,
  apiVersion: '2023-05-03'
});

console.log('Testing Sanity connection with deployment token...');

async function testConnection() {
  console.log('Testing editing token...');
  try {
    // Test the editing connection first
    const editingProjects = await editingClient.projects.list();
    console.log('✅ Editing token works! Available projects:', editingProjects.map(p => `${p.displayName} (${p.id})`));

    const project = editingProjects.find(p => p.id === 'fl5uetho');
    if (project) {
      console.log('✅ Found target project:', project.displayName);
    }
  } catch (error) {
    console.error('❌ Editing token failed:', error.message);
  }

  console.log('\nTesting deployment token...');
  try {
    // Test the deployment connection
    const deployProjects = await deployClient.projects.list();
    console.log('✅ Deployment token works! Available projects:', deployProjects.map(p => `${p.displayName} (${p.id})`));

    const project = deployProjects.find(p => p.id === 'fl5uetho');
    if (project) {
      console.log('✅ Found target project with deployment token:', project.displayName);
      console.log('✅ Deployment token is working correctly!');
      console.log('');
      console.log('🚀 Your Sanity studio should be accessible at:');
      console.log('   https://intelliglobalconferences.sanity.studio/');
      console.log('');
      console.log('📝 Note: The studio deployment is managed by Sanity Cloud.');
      console.log('   Your schema changes and content are automatically synced.');
    } else {
      console.log('❌ Could not find project fl5uetho with deployment token');
    }

  } catch (error) {
    console.error('❌ Deployment token failed:', error.message);
    console.log('');
    console.log('This might be because:');
    console.log('1. The deployment token might be for a different project');
    console.log('2. The deployment token might not have the right permissions');
    console.log('3. The project ID might be incorrect');
    console.log('4. Network connectivity issues');
    console.log('');
    console.log('💡 Suggestion: The studio at https://intelliglobalconferences.sanity.studio/');
    console.log('   might already be deployed and working. Try accessing it directly.');
  }
}

testConnection();

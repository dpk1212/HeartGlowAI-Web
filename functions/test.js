const axios = require('axios');

const TEST_CASES = [
  {
    scenario: "I want to express gratitude to my friend for their support",
    relationshipType: "Friend",
    name: "Gratitude message"
  },
  {
    scenario: "I need to apologize for missing an important event",
    relationshipType: "Family Member",
    name: "Apology message"
  },
  {
    scenario: "I want to congratulate someone on their promotion",
    relationshipType: "Professional Contact",
    name: "Professional congratulations"
  }
];

async function testGenerateMessage(testCase) {
  try {
    console.log(`\nTesting: ${testCase.name}`);
    console.log('Input:', testCase);
    
    const response = await axios.post(
      'https://us-central1-heartglowai.cloudfunctions.net/generateMessage',
      {
        scenario: testCase.scenario,
        relationshipType: testCase.relationshipType
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Success! Generated message:', response.data.message);
    return true;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    return false;
  }
}

async function runTests() {
  console.log('Starting tests...\n');
  
  let successCount = 0;
  
  for (const testCase of TEST_CASES) {
    const success = await testGenerateMessage(testCase);
    if (success) successCount++;
  }
  
  console.log(`\nTest Summary: ${successCount}/${TEST_CASES.length} tests passed`);
}

runTests(); 
testGenerateMessage(); 
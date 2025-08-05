const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3001/api';

// Test data
const testData = {
  userId: 'test-user-123',
  childId: 'test-child-456',
  agentId: 'test-agent-789'
};

async function testProcessEndpoint() {
  console.log('🧪 Testing Main Processing Endpoint\n');

  const tests = [
    {
      name: 'Chat Request',
      payload: {
        type: 'chat',
        userId: testData.userId,
        childId: testData.childId,
        message: 'My 3-year-old is having trouble sleeping. What can I do?',
        options: {
          responseFormat: 'text'
        }
      }
    },
    {
      name: 'Analysis Request',
      payload: {
        type: 'analysis',
        userId: testData.userId,
        childId: testData.childId,
        data: {
          activities: ['reading', 'puzzles', 'outdoor play'],
          progress: {
            reading: 85,
            puzzles: 70,
            outdoor: 90
          },
          observations: 'Child shows strong interest in reading but struggles with complex puzzles'
        }
      }
    },
    {
      name: 'Recommendation Request',
      payload: {
        type: 'recommendation',
        userId: testData.userId,
        childId: testData.childId,
        data: {
          age: 4,
          interests: ['dinosaurs', 'space', 'art'],
          strengths: ['creativity', 'curiosity'],
          challenges: ['focus', 'patience']
        }
      }
    },
    {
      name: 'Auto-Route Request',
      payload: {
        type: 'auto-route',
        userId: testData.userId,
        childId: testData.childId,
        message: 'My child is struggling with math homework',
        options: {
          generateInsights: true,
          generateRecommendations: true
        }
      }
    }
  ];

  for (const test of tests) {
    console.log(`📝 Testing: ${test.name}`);
    console.log(`📤 Payload:`, JSON.stringify(test.payload, null, 2));
    
    try {
      const response = await fetch(`${BASE_URL}/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(test.payload)
      });

      const result = await response.json();
      
      console.log(`📊 Status: ${response.status}`);
      console.log(`📥 Response:`, JSON.stringify(result, null, 2));
      console.log('✅ Test completed\n');
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}\n`);
    }
  }

  console.log('🎉 All tests completed!');
}

// Test error handling
async function testErrorHandling() {
  console.log('🧪 Testing Error Handling\n');

  const errorTests = [
    {
      name: 'Missing Request Type',
      payload: {
        userId: testData.userId,
        message: 'This should fail'
      }
    },
    {
      name: 'Invalid Request Type',
      payload: {
        type: 'invalid-type',
        userId: testData.userId,
        message: 'This should fail'
      }
    },
    {
      name: 'Missing Required Fields for Agent',
      payload: {
        type: 'agent',
        userId: testData.userId,
        message: 'This should fail'
      }
    }
  ];

  for (const test of errorTests) {
    console.log(`📝 Testing: ${test.name}`);
    console.log(`📤 Payload:`, JSON.stringify(test.payload, null, 2));
    
    try {
      const response = await fetch(`${BASE_URL}/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(test.payload)
      });

      const result = await response.json();
      
      console.log(`📊 Status: ${response.status}`);
      console.log(`📥 Response:`, JSON.stringify(result, null, 2));
      console.log('✅ Error test completed\n');
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}\n`);
    }
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Main Processing Endpoint Tests\n');
  
  await testProcessEndpoint();
  console.log('\n' + '='.repeat(50) + '\n');
  await testErrorHandling();
  
  console.log('\n🎯 All tests finished!');
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(`${BASE_URL}/ping`);
    if (response.ok) {
      console.log('✅ Server is running');
      return true;
    }
  } catch (error) {
    console.log('❌ Server is not running. Please start the server first.');
    console.log('Run: npm run dev or npm start');
    return false;
  }
}

// Main execution
async function main() {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await runTests();
  }
}

main().catch(console.error); 
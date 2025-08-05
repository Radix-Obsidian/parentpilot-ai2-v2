// Simple test for the main processing endpoint
import { handleProcess } from './routes/process.js';

// Mock request and response objects
const mockReq = {
  body: {
    type: 'chat',
    userId: 'test-user-123',
    childId: 'test-child-456',
    message: 'My 3-year-old is having trouble sleeping. What can I do?',
    options: {
      responseFormat: 'text'
    }
  }
};

const mockRes = {
  status: (code) => ({
    json: (data) => {
      console.log(`Status: ${code}`);
      console.log('Response:', JSON.stringify(data, null, 2));
      return mockRes;
    }
  }),
  json: (data) => {
    console.log('Response:', JSON.stringify(data, null, 2));
    return mockRes;
  }
};

console.log('🧪 Testing Main Processing Endpoint\n');

// Test the handler directly
handleProcess(mockReq, mockRes)
  .then(() => {
    console.log('\n✅ Test completed successfully!');
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error);
  }); 
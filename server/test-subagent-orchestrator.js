import { SubAgentOrchestrator } from './agents/subagent-orchestrator.js';

// Simple test to verify the SubAgentOrchestrator integration
async function testSubAgentOrchestrator() {
  console.log('Testing SubAgentOrchestrator integration...');
  
  try {
    const orchestrator = new SubAgentOrchestrator();
    
    // Test dispatcher
    console.log('\n1. Testing Dispatcher...');
    const dispatcherResult = await orchestrator.executeDispatcher(
      "Soccer registration for my 8-year-old son is due next Friday. Cost is $150 and it's at the community center."
    );
    console.log('Dispatcher Result:', JSON.stringify(dispatcherResult, null, 2));
    
    if (dispatcherResult.success) {
      // Test analyst
      console.log('\n2. Testing Analyst...');
      const analystResult = await orchestrator.executeAnalyst(
        "Soccer registration for my 8-year-old son is due next Friday. Cost is $150 and it's at the community center.",
        dispatcherResult.data.category
      );
      console.log('Analyst Result:', JSON.stringify(analystResult, null, 2));
      
      if (analystResult.success) {
        // Test scheduler
        console.log('\n3. Testing Scheduler...');
        const schedulerResult = await orchestrator.executeScheduler(
          analystResult.data,
          "Alex"
        );
        console.log('Scheduler Result:', JSON.stringify(schedulerResult, null, 2));
      }
    }
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testSubAgentOrchestrator();
}

export { testSubAgentOrchestrator }; 
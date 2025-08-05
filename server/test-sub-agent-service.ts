import { subAgentService } from './agents/sub-agent-service';

// Example usage of the Sub-Agent Service Core
async function demonstrateSubAgentService() {
  console.log('=== Sub-Agent Service Core Demonstration ===\n');

  const userId = 'user-123';
  const childId = 'child-456';
  const agentTypeId = 'learning-coach';

  try {
    // 1. Create a new sub-agent
    console.log('1. Creating a new Learning Coach Agent...');
    const agent = await subAgentService.createSubAgent(
      userId,
      agentTypeId,
      'Learning Coach Agent',
      'Specialized in educational guidance and homework help',
      {
        learningStyle: 'visual',
        subjects: ['math', 'science', 'reading'],
        expertise: ['homework-help', 'study-strategies', 'motivation']
      }
    );

    if (!agent) {
      console.error('Failed to create agent');
      return;
    }

    console.log(`✅ Agent created: ${agent.name} (ID: ${agent.id})\n`);

    // 2. Process a message with the agent
    console.log('2. Processing a message with the agent...');
    const response = await subAgentService.processMessageWithAgent(
      agent.id,
      userId,
      childId,
      'My child is struggling with math homework, specifically with fractions. They get frustrated easily and give up quickly.',
      {
        childAge: 8,
        subject: 'math',
        topic: 'fractions'
      }
    );

    console.log(`✅ Response received: ${response.message}`);
    if (response.tasks && response.tasks.length > 0) {
      console.log(`📋 Tasks created: ${response.tasks.length}`);
    }
    if (response.insights && response.insights.length > 0) {
      console.log(`💡 Insights generated: ${response.insights.length}`);
    }
    if (response.recommendations && response.recommendations.length > 0) {
      console.log(`🎯 Recommendations: ${response.recommendations.length}`);
    }
    console.log('');

    // 3. Get agent capabilities
    console.log('3. Getting agent capabilities...');
    const capabilities = await subAgentService.getAgentCapabilities(agent.id, userId);
    console.log(`✅ Agent has ${capabilities.length} capabilities:`);
    capabilities.forEach(cap => {
      console.log(`   - ${cap.name}: ${cap.enabled ? '✅' : '❌'} (${cap.description})`);
    });
    console.log('');

    // 4. Create a task for the agent
    console.log('4. Creating a task for the agent...');
    const task = await subAgentService.createAgentTask(
      agent.id,
      childId,
      {
        task_type: 'homework_assistance',
        title: 'Create fraction practice exercises',
        description: 'Generate age-appropriate fraction exercises for an 8-year-old',
        priority: 'high',
        due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Tomorrow
      }
    );

    if (task) {
      console.log(`✅ Task created: ${task.title} (ID: ${task.id})`);
      console.log(`   Status: ${task.status}, Priority: ${task.priority}`);
    }
    console.log('');

    // 5. Get agent tasks
    console.log('5. Getting agent tasks...');
    const tasks = await subAgentService.getAgentTasks(agent.id);
    console.log(`✅ Found ${tasks.length} tasks for the agent:`);
    tasks.forEach(task => {
      console.log(`   - ${task.title} (${task.status})`);
    });
    console.log('');

    // 6. Generate insights
    console.log('6. Generating agent insights...');
    const insights = await subAgentService.generateAgentInsights(
      agent.id,
      userId,
      childId
    );

    console.log(`✅ Generated ${insights.length} insights:`);
    insights.forEach(insight => {
      console.log(`   - ${insight.title} (Confidence: ${insight.confidence_score || 'N/A'})`);
    });
    console.log('');

    // 7. Generate recommendations
    console.log('7. Generating agent recommendations...');
    const recommendations = await subAgentService.generateAgentRecommendations(
      agent.id,
      userId,
      childId
    );

    console.log(`✅ Generated ${recommendations.length} recommendations:`);
    recommendations.forEach(rec => {
      console.log(`   - ${rec.title} (Priority: ${rec.priority})`);
    });
    console.log('');

    // 8. Get performance metrics
    console.log('8. Getting agent performance metrics...');
    const metrics = await subAgentService.getAgentPerformanceMetrics(agent.id);
    console.log('✅ Performance metrics:');
    console.log(`   - Total tasks: ${metrics.totalTasks}`);
    console.log(`   - Completed tasks: ${metrics.completedTasks}`);
    console.log(`   - Completion rate: ${metrics.completionRate.toFixed(1)}%`);
    console.log(`   - Total insights: ${metrics.totalInsights}`);
    console.log(`   - Total recommendations: ${metrics.totalRecommendations}`);
    console.log('');

    // 9. Demonstrate multi-agent collaboration (if we had multiple agents)
    console.log('9. Demonstrating multi-agent collaboration...');
    const collaboration = await subAgentService.collaborateWithMultipleAgents(
      userId,
      childId,
      'Create a comprehensive learning plan for a child struggling with math',
      [agent.id] // In a real scenario, you'd have multiple agent IDs
    );

    console.log(`✅ Collaboration completed with ${collaboration.participatingAgents.length} agents`);
    console.log(`   Combined response: ${collaboration.combinedResponse.message}`);
    console.log('');

    // 10. Get service status
    console.log('10. Getting service status...');
    const config = subAgentService.getServiceConfig();
    const activeAgentsCount = subAgentService.getActiveAgentsCount();
    
    console.log('✅ Service status:');
    console.log(`   - Active agents: ${activeAgentsCount}`);
    console.log(`   - Max concurrent agents: ${config.maxConcurrentAgents}`);
    console.log(`   - Agent communication: ${config.enableAgentCommunication ? 'enabled' : 'disabled'}`);
    console.log(`   - Cross-agent learning: ${config.enableCrossAgentLearning ? 'enabled' : 'disabled'}`);
    console.log('');

    console.log('=== Demonstration completed successfully! ===');

  } catch (error) {
    console.error('❌ Error during demonstration:', error);
  }
}

// Example of inter-agent communication
async function demonstrateAgentCommunication() {
  console.log('\n=== Inter-Agent Communication Demonstration ===\n');

  const agent1Id = 'learning-coach-agent';
  const agent2Id = 'development-tracker-agent';

  try {
    // Send a message from one agent to another
    console.log('Sending message between agents...');
    await subAgentService.sendAgentMessage(
      agent1Id,
      agent2Id,
      'request',
      {
        requestType: 'get_development_data',
        childId: 'child-456',
        timeRange: 'last_30_days',
        focusAreas: ['math', 'cognitive_development']
      },
      'high'
    );

    console.log('✅ Message sent successfully');
    console.log('   From: Learning Coach Agent');
    console.log('   To: Development Tracker Agent');
    console.log('   Type: Request for development data');
    console.log('   Priority: High');

    // Get communications for the first agent
    const communications = await subAgentService.getAgentCommunications(agent1Id, 10);
    console.log(`\n📨 Recent communications for ${agent1Id}: ${communications.length} messages`);

  } catch (error) {
    console.error('❌ Error during communication demonstration:', error);
  }
}

// Example of agent capability management
async function demonstrateCapabilityManagement() {
  console.log('\n=== Agent Capability Management ===\n');

  const agentId = 'learning-coach-agent';
  const userId = 'user-123';

  try {
    // Get current capabilities
    console.log('Getting current agent capabilities...');
    const capabilities = await subAgentService.getAgentCapabilities(agentId, userId);
    
    console.log('✅ Current capabilities:');
    capabilities.forEach(cap => {
      console.log(`   - ${cap.name}: ${cap.enabled ? '✅' : '❌'}`);
    });

    // Update a capability
    if (capabilities.length > 0) {
      const capabilityToUpdate = capabilities[0].name;
      console.log(`\nUpdating capability: ${capabilityToUpdate}`);
      
      const success = await subAgentService.updateAgentCapability(
        agentId,
        capabilityToUpdate,
        false // Disable the capability
      );

      if (success) {
        console.log(`✅ Successfully disabled capability: ${capabilityToUpdate}`);
      } else {
        console.log(`❌ Failed to update capability: ${capabilityToUpdate}`);
      }
    }

  } catch (error) {
    console.error('❌ Error during capability management:', error);
  }
}

// Run the demonstrations
if (require.main === module) {
  demonstrateSubAgentService()
    .then(() => demonstrateAgentCommunication())
    .then(() => demonstrateCapabilityManagement())
    .then(() => {
      console.log('\n🎉 All demonstrations completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Error running demonstrations:', error);
      process.exit(1);
    });
}

export {
  demonstrateSubAgentService,
  demonstrateAgentCommunication,
  demonstrateCapabilityManagement
}; 
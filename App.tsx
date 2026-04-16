import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View, FlatList, Text } from 'react-native';
import { Message, Agent } from './src/types';
import { SwarmService } from './src/services/SwarmService';
import AgentList from './src/components/AgentList';
import ChatMessage from './src/components/ChatMessage';
import ChatInput from './src/components/ChatInput';

const App = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [agents] = useState<Agent[]>(SwarmService.getAgents());
  const flatListRef = useRef<FlatList>(null);

  const handleSend = (text: string) => {
    const userMsg = SwarmService.processMessage(text, 'user', false);
    setMessages(prev => [...prev, userMsg]);

    // Simulate agent response logic
    const mentions = SwarmService.parseMentions(text);
    if (mentions.length > 0 || text.toLowerCase().includes('swarm')) {
      setTimeout(() => {
        const respondingAgent = mentions.length > 0 
          ? agents.find(a => a.name.toLowerCase() === mentions[0].toLowerCase()) || agents[0]
          : agents[0];
        
        const responseText = `I'm on it! Processing your request for: "${text}"`;
        const agentMsg = SwarmService.processMessage(responseText, respondingAgent.id, true);
        setMessages(prev => [...prev, agentMsg]);
      }, 1000);
    }
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Synapse Swarm</Text>
      </View>
      <AgentList agents={agents} />
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ChatMessage 
            message={item} 
            agent={agents.find(a => a.id === item.senderId)} 
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>Start the swarm conversation...</Text>}
        contentContainerStyle={styles.chatFeed}
      />
      <ChatInput onSend={handleSend} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  header: { padding: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '800', color: '#000', letterSpacing: 0.5 },
  chatFeed: { padding: 16, paddingBottom: 32 },
  empty: { textAlign: 'center', marginTop: 100, color: '#BBB', fontSize: 14 },
});

export default App;
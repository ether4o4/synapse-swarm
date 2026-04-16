import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View, FlatList, Text, TouchableOpacity } from 'react-native';
import { Message, Agent } from './src/types';
import { SwarmService } from './src/services/SwarmService';
import AgentList from './src/components/AgentList';
import ChatMessage from './src/components/ChatMessage';
import ChatInput from './src/components/ChatInput';
import SwarmDashboard from './src/components/SwarmDashboard';
import AgentManager from './src/components/AgentManager';
import StorageExplorer from './src/components/StorageExplorer';

const App = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [agents] = useState<Agent[]>(SwarmService.getAgents());
  const [activeTab, setActiveTab] = useState<'chat' | 'dashboard' | 'agents' | 'storage'>('chat');
  const flatListRef = useRef<FlatList>(null);

  const handleSend = (text: string) => {
    const userMsg = SwarmService.processMessage(text, 'user', false);
    setMessages(prev => [...prev, userMsg]);

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
    if (messages.length > 0 && activeTab === 'chat') {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages, activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <SwarmDashboard agents={agents} messageCount={messages.length} />;
      case 'agents':
        return <AgentManager agents={agents} />;
      case 'storage':
        return <StorageExplorer />;
      default:
        return (
          <>
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
          </>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Synapse Swarm</Text>
      </View>
      
      <View style={{ flex: 1 }}>
        {renderContent()}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => setActiveTab('chat')} style={styles.tab}>
          <Text style={[styles.tabText, activeTab === 'chat' && styles.activeTabText]}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('dashboard')} style={styles.tab}>
          <Text style={[styles.tabText, activeTab === 'dashboard' && styles.activeTabText]}>Dash</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('agents')} style={styles.tab}>
          <Text style={[styles.tabText, activeTab === 'agents' && styles.activeTabText]}>Agents</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('storage')} style={styles.tab}>
          <Text style={[styles.tabText, activeTab === 'storage' && styles.activeTabText]}>Storage</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  header: { padding: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '800', color: '#000', letterSpacing: 0.5 },
  chatFeed: { padding: 16, paddingBottom: 32 },
  empty: { textAlign: 'center', marginTop: 100, color: '#BBB', fontSize: 14 },
  footer: { flexDirection: 'row', backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#EEE', paddingVertical: 8 },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabText: { fontSize: 12, color: '#999' },
  activeTabText: { color: '#007AFF', fontWeight: 'bold' },
});

export default App;
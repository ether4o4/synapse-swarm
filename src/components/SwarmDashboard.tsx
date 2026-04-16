import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Agent } from '../types';

interface Props {
  agents: Agent[];
  messageCount: number;
}

const SwarmDashboard: React.FC<Props> = ({ agents, messageCount }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Active Agents</Text>
        <Text style={styles.value}>{agents.length}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Total Messages</Text>
        <Text style={styles.value}>{messageCount}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>System Status</Text>
        <Text style={[styles.value, { color: '#4CAF50' }]}>Operational</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { backgroundColor: '#FFF', padding: 20, borderRadius: 12, marginBottom: 16, elevation: 2 },
  label: { fontSize: 14, color: '#666', marginBottom: 4 },
  value: { fontSize: 24, fontWeight: 'bold', color: '#000' },
});

export default SwarmDashboard;
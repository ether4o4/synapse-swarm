import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Agent } from '../types';

interface Props {
  agents: Agent[];
}

const AgentManager: React.FC<Props> = ({ agents }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={agents}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.agentRow}>
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.role}>{item.role}</Text>
            </View>
            <TouchableOpacity style={styles.configBtn}>
              <Text style={styles.btnText}>Config</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity style={styles.spawnBtn}>
        <Text style={styles.spawnText}>+ Spawn New Agent</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  agentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 8, marginBottom: 12 },
  name: { fontSize: 16, fontWeight: '600' },
  role: { fontSize: 12, color: '#666' },
  configBtn: { backgroundColor: '#EEE', padding: 8, borderRadius: 4 },
  btnText: { fontSize: 12 },
  spawnBtn: { backgroundColor: '#007AFF', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  spawnText: { color: '#FFF', fontWeight: 'bold' },
});

export default AgentManager;
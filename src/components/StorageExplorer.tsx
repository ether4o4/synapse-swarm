import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const StorageExplorer = () => {
  const mockFiles = [
    { id: '1', name: 'agent_alpha_logs.txt', size: '12KB' },
    { id: '2', name: 'swarm_config.json', size: '2KB' },
    { id: '3', name: 'memory_dump.bin', size: '1.2MB' },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={mockFiles}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.fileRow}>
            <Text style={styles.fileName}>{item.name}</Text>
            <Text style={styles.fileSize}>{item.size}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  fileRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  fileName: { fontSize: 14 },
  fileSize: { fontSize: 12, color: '#999' },
});

export default StorageExplorer;
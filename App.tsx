import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity } from 'react-native';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Synapse Swarm</Text>
      </View>
      <FlatList
        data={[]}
        renderItem={null}
        ListEmptyComponent={<Text style={styles.empty}>Start the swarm conversation...</Text>}
        style={styles.chatFeed}
      />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Message @swarm..."
          style={styles.input}
        />
        <TouchableOpacity style={styles.sendButton}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { padding: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#DDD', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  chatFeed: { flex: 1, padding: 16 },
  empty: { textAlign: 'center', marginTop: 50, color: '#999' },
  inputContainer: { flexDirection: 'row', padding: 16, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#DDD' },
  input: { flex: 1, height: 40, borderWidth: 1, borderColor: '#DDD', borderRadius: 20, paddingHorizontal: 16, backgroundColor: '#FAFAFA' },
  sendButton: { marginLeft: 12, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16, backgroundColor: '#007AFF', borderRadius: 20 },
  sendText: { color: '#FFF', fontWeight: 'bold' }
});

export default App;
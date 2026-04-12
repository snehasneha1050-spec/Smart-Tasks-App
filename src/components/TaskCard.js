import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const TaskCard = ({ task, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={[styles.priority, task.priority === 'High' ? styles.high : styles.medium]}>
          {task.priority}
        </Text>
      </View>
      <Text style={styles.description} numberOfLines={2}>{task.description}</Text>
      <Text style={styles.category}>{task.category}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFF', padding: 15, borderRadius: 10, marginVertical: 8, marginHorizontal: 15, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333', flex: 1 },
  priority: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5, fontSize: 12, fontWeight: 'bold', color: '#FFF', overflow: 'hidden' },
  high: { backgroundColor: '#FF5252' },
  medium: { backgroundColor: '#FFC107' },
  description: { fontSize: 14, color: '#666', marginBottom: 10 },
  category: { fontSize: 12, color: '#6200EA', fontWeight: 'bold' }
});

export default TaskCard;
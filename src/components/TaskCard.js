import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const TaskCard = ({ task, onPress, onEdit, onDelete }) => {
  
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return '#FF5252';
      case 'Medium': return '#FFC107';
      case 'Low': return '#4CAF50';
      default: return '#666';
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      
      {/* Task Details Section */}
      <View style={styles.taskInfo}>
        <Text style={[styles.title, task.completed && styles.completedTitle]}>
          {task.title}
        </Text>
        <Text style={styles.category} numberOfLines={1}>
        {task.category} • <Text style={{ color: getPriorityColor(task.priority), fontWeight: 'bold' }}>{task.priority}</Text> • <Text style={{ color: task.completed ? '#4CAF50' : '#FF9800', fontWeight: 'bold' }}>{task.completed ? 'Completed' : 'Pending'}</Text>
        {task.dueDate && ` • ⏰ ${new Date(task.dueDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
        </Text>
      </View>

      {/* Action Buttons Section (Edit & Delete) */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={onEdit}>
          <Text style={styles.iconText}>✏️</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.iconButton, styles.deleteButton]} onPress={onDelete}>
          <Text style={styles.iconText}>🗑️</Text>
        </TouchableOpacity>
      </View>

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  taskInfo: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  completedTitle: {
    color: '#999',
  },
  category: {
    fontSize: 12,
    color: '#666',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: '#FEE2E2', // Light red background for delete button
  },
  iconText: {
    fontSize: 16,
  },
});

export default TaskCard;
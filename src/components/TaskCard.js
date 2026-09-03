import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from '../hooks/useTranslation';

const TaskCard = ({ task, onPress, onEdit, onDelete }) => {
  const { t } = useTranslation();
  
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return '#FF5252';
      case 'Medium': return '#FFC107';
      case 'Low': return '#4CAF50';
      default: return '#666';
    }
  };

  const getCategoryTranslation = (cat) => {
    switch(cat) {
      case 'Work': return t.work || 'Work';
      case 'Personal': return t.personal || 'Personal';
      case 'Shopping': return t.shopping || 'Shopping';
      case 'Health': return t.health || 'Health';
      case 'Other': return t.other || 'Other';
      default: return cat;
    }
  };

  const getPriorityTranslation = (prio) => {
    switch(prio) {
      case 'High': return t.high || 'High';
      case 'Medium': return t.medium || 'Medium';
      case 'Low': return t.low || 'Low';
      default: return prio;
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
        {getCategoryTranslation(task.category)} • <Text style={{ color: getPriorityColor(task.priority), fontWeight: 'bold' }}>{getPriorityTranslation(task.priority)}</Text> • <Text style={{ color: task.completed ? '#4CAF50' : '#FF9800', fontWeight: 'bold' }}>{task.completed ? (t.completed || 'Completed') : (t.pending || 'Pending')}</Text>
        {task.dueDate && ` • ⏰ ${new Date(task.dueDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
        </Text>
      </View>

      {/* Action Buttons Section (Edit & Delete) */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={onEdit}>
          <Text style={styles.iconText}>✏️</Text>
        </TouchableOpacity>
        
        {onDelete && (
          <TouchableOpacity style={[styles.iconButton, styles.deleteButton]} onPress={onDelete}>
            <Text style={styles.iconText}>🗑️</Text>
          </TouchableOpacity>
        )}
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
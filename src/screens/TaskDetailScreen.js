import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleComplete, deleteTask } from '../store/taskSlice';
import { CustomAlert as Alert } from '../components/CustomAlert';
import { useTranslation } from '../hooks/useTranslation';

const TaskDetailScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const passedTask = route.params?.task;

  // Fetch the latest task details from Redux store so UI updates immediately
  const task = useSelector(state => state.tasks.tasks.find(t => t.id === passedTask?.id));

  if (!task) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{t.taskNotFound || 'Task not found'}</Text>
      </View>
    );
  }

  const handleToggleComplete = () => {
    dispatch(toggleComplete(task.id));
    Alert.alert(t.success || 'Success', task.completed ? (t.taskMarkedPending || 'Task marked as pending!') : (t.taskMarkedCompleted || 'Task marked as completed! 🎉'));
  };

  const handleDeleteTask = () => {
    Alert.alert(t.deleteTask, t.deleteConfirm, [
      { text: t.cancel, onPress: () => {} },
      {
        text: t.delete,
        onPress: () => {
          dispatch(deleteTask(task.id));
          navigation.goBack();
        },
        style: 'destructive'
      }
    ]);
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return '#E53935';
      case 'Medium': return '#FF9800';
      case 'Low': return '#4CAF50';
      default: return '#666';
    }
  };

  const getPriorityTranslation = (prio) => {
    switch(prio) {
      case 'High': return t.high;
      case 'Medium': return t.medium;
      case 'Low': return t.low;
      default: return prio;
    }
  };

  const getCategoryTranslation = (cat) => {
    switch(cat) {
      case 'Work': return t.work;
      case 'Personal': return t.personal;
      case 'Shopping': return t.shopping;
      case 'Health': return t.health;
      case 'Other': return t.other;
      default: return cat;
    }
  };

  const getStatusBadgeStyle = () => ({
    ...styles.statusBadge,
    backgroundColor: task.completed ? '#D4EDDA' : '#FFF4E5',
    color: task.completed ? '#155724' : '#FF9800'
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← {t.back}</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        {/* Status Badge */}
        <View style={styles.badgeContainer}>
          <Text style={getStatusBadgeStyle()}>
            {task.completed ? `✓ ${t.completed || 'Completed'}` : `⏳ ${t.pending || 'Pending'}`}
          </Text>
        </View>

        {/* Task Title */}
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.description}>{task.description}</Text>
        
        {/* Task Info */}
        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📌 {t.priority}:</Text>
            <Text style={[styles.infoValue, { color: getPriorityColor(task.priority) }]}>
              {getPriorityTranslation(task.priority)}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>🏷️ {t.category}:</Text>
            <Text style={styles.infoValue}>{getCategoryTranslation(task.category)}</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity 
          style={[styles.completeButton, task.completed && styles.completeButtonReverse]}
          onPress={handleToggleComplete}
        >
          <Text style={styles.completeButtonText}>
            {task.completed ? t.markIncomplete : `${t.markComplete} ✓`}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={handleDeleteTask}
        >
          <Text style={styles.deleteButtonText}>{t.deleteTask} 🗑️</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', padding: 16 },
  backButton: { paddingVertical: 12, marginBottom: 8 },
  backButtonText: { fontSize: 16, color: '#6200EA', fontWeight: '600' },
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 24, elevation: 3, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  badgeContainer: { alignItems: 'flex-start', marginBottom: 15 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, fontWeight: 'bold', fontSize: 12 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  description: { fontSize: 16, color: '#666', lineHeight: 24, marginBottom: 20 },
  infoBox: { backgroundColor: '#F9FAFB', padding: 16, borderRadius: 12, marginTop: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  infoLabel: { fontSize: 15, color: '#555', fontWeight: '500' },
  infoValue: { fontSize: 15, color: '#333', fontWeight: 'bold' },
  buttonGroup: { paddingHorizontal: 0, marginBottom: 30 },
  completeButton: { backgroundColor: '#4CAF50', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12, elevation: 2 },
  completeButtonReverse: { backgroundColor: '#FF9800' },
  completeButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  deleteButton: { backgroundColor: '#FF3B30', padding: 16, borderRadius: 12, alignItems: 'center', elevation: 2 },
  deleteButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  errorText: { fontSize: 18, color: '#E53935', textAlign: 'center', marginTop: 20 },
});

export default TaskDetailScreen;
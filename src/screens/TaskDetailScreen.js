import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleComplete, deleteTask, updateTask } from '../store/taskSlice';
import { CustomAlert as Alert } from '../components/CustomAlert';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../hooks/useTheme';
import { useAppStyles } from '../hooks/useAppStyles';
import { transliterateToHindi } from '../utils/transliterate';
import { getCategoryTranslation, getPriorityTranslation, getPriorityColor } from '../utils/helpers';

const TaskDetailScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useAppStyles();
  const passedTask = route.params?.task;

  const language = useSelector(state => state.theme?.language);

  const task = useSelector(state => state.tasks.tasks.find(taskItem => taskItem.id === passedTask?.id));

  if (!task) {
    return (
      <View style={styles.safeArea}>
        <Text style={styles.errorText}>{t.taskNotFound || 'Task not found'}</Text>
      </View>
    );
  }

  const handleToggleComplete = () => {
    dispatch(toggleComplete(task.id));
    const pointsMessage = !task.completed ? `\n\n🏆 ${t.youEarnedPoints || 'You earned 10 points!'}` : '';
    Alert.alert(
      t.success || 'Success', 
      task.completed 
        ? (t.taskMarkedPending || 'Task marked as pending!') 
        : ((t.taskMarkedCompleted || 'Task marked as completed! 🎉') + pointsMessage)
    );
  };

  const handleEditTask = () => {
    navigation.navigate('EditTask', { task });
  };

  const handleToggleSubtask = (subtaskId) => {
    if (!task.subtasks) return;
    const updatedSubtasks = task.subtasks.map(st =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    dispatch(updateTask({ ...task, subtasks: updatedSubtasks }));
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

  const getStatusBadgeStyle = () => ({
    ...styles.statusBadge,
    backgroundColor: task.completed ? colors.success + '20' : colors.error + '20',
    color: task.completed ? colors.success : colors.error
  });

  return (
    <ScrollView style={styles.safeArea} contentContainerStyle={styles.detailScrollContent} showsVerticalScrollIndicator={false}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← {t.back}</Text>
      </TouchableOpacity>

      <View style={styles.detailCard}>
        <View style={styles.badgeContainer}>
          <Text style={getStatusBadgeStyle()}>
            {task.completed ? `✓ ${t.completed || 'Completed'}` : `⏳ ${t.pending || 'Pending'}`}
          </Text>
        </View>

        <Text style={styles.detailTitle}>{language === 'Hindi' ? transliterateToHindi(task.title) : task.title}</Text>
        <Text style={styles.detailDesc}>{language === 'Hindi' ? transliterateToHindi(task.description) : task.description}</Text>
        
        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📌 {t.priority}:</Text>
            <Text style={[styles.infoValue, { color: getPriorityColor(task.priority) }]}>
              {getPriorityTranslation(task.priority, t)}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>🏷️ {t.category}:</Text>
            <Text style={styles.infoValue}>{getCategoryTranslation(task.category, t)}</Text>
          </View>
        </View>

        {task.subtasks && task.subtasks.length > 0 && (
          <View style={[styles.infoBox, styles.infoBoxExtra]}>
            <Text style={[styles.detailTitle, styles.detailTitleSmall]}>☑️ {t.subtasks || 'Checklist'}</Text>
            {task.subtasks.map(st => (
              <TouchableOpacity
                key={st.id}
                style={styles.subtaskRow}
                onPress={() => handleToggleSubtask(st.id)}
              >
                <Text style={[
                  styles.subtaskCheckbox,
                  st.completed && styles.subtaskCheckboxCompleted
                ]}>
                  {st.completed ? '☑' : '☐'}
                </Text>
                <Text style={[
                  styles.subtaskTitle,
                  st.completed && styles.subtaskTitleCompleted
                ]}>
                  {st.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.actionBtn, task.completed ? styles.actionBtnWarning : styles.actionBtnSuccess]}
          onPress={handleToggleComplete}
        >
          <Text style={styles.actionBtnText}>
            {task.completed ? t.markIncomplete : `${t.markComplete} ✓`}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionBtn, styles.actionBtnPrimary]}
          onPress={handleEditTask}
        >
          <Text style={styles.actionBtnText}>{t.edit || 'Edit Task'} ✏️</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionBtn, styles.actionBtnError]}
          onPress={handleDeleteTask}
        >
          <Text style={styles.actionBtnText}>{t.deleteTask} 🗑️</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default TaskDetailScreen;
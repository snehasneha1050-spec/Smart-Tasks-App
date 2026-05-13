import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useDispatch } from 'react-redux';
import { updateTask } from '../store/taskSlice';
import { CustomAlert as Alert } from '../components/CustomAlert';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../hooks/useTheme';

const CATEGORIES = ['Work', 'Personal', 'Shopping', 'Health', 'Other'];
const PRIORITIES = ['High', 'Medium', 'Low'];

const EditTaskScreen = ({ route, navigation }) => {
  const { task } = route.params;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { colors } = useTheme();

  // Initialize state with the existing task's data
  const [taskTitle, setTaskTitle] = useState(task.title);
  const [taskDescription, setTaskDescription] = useState(task.description);
  const [category, setCategory] = useState(task.category);
  const [priority, setPriority] = useState(task.priority);
  const [loading, setLoading] = useState(false);

  const getCategoryTranslation = useCallback((cat) => {
    switch(cat) {
      case 'Work': return t.work;
      case 'Personal': return t.personal;
      case 'Shopping': return t.shopping;
      case 'Health': return t.health;
      case 'Other': return t.other;
      default: return cat;
    }
  }, [t]);

  const getPriorityTranslation = useCallback((prio) => {
    switch(prio) {
      case 'High': return t.high;
      case 'Medium': return t.medium;
      case 'Low': return t.low;
      default: return prio;
    }
  }, [t]);

  const handleUpdateTask = useCallback(() => {
    if (!taskTitle.trim() || !taskDescription.trim()) {
      Alert.alert(t.error || 'Error', t.fillAllFields || 'Please fill in all fields.');
      return;
    }

    setLoading(true);

    const updatedTask = {
      id: task.id, // Keep the original ID
      title: taskTitle,
      description: taskDescription,
      category: category,
      priority: priority,
    };

    dispatch(updateTask(updatedTask));

    setTimeout(() => {
      setLoading(false);
      Alert.alert(t.success || 'Success', 'Task updated successfully! ✅', [
        {
          text: t.ok || 'OK',
          onPress: () => navigation.goBack()
        }
      ]);
    }, 500);
  }, [task.id, taskTitle, taskDescription, category, priority, t, dispatch, navigation]);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>✏️ {t.edit || 'Edit Task'}</Text>
        </View>

        {/* Task Title Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>{t.taskTitle}</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border }]}
            value={taskTitle}
            onChangeText={setTaskTitle}
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        {/* Task Description Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>{t.taskDescription}</Text>
          <TextInput
            style={[styles.input, styles.textArea, { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border }]}
            value={taskDescription}
            onChangeText={setTaskDescription}
            multiline={true}
            numberOfLines={4}
            placeholderTextColor={colors.textSecondary}
            textAlignVertical="top"
          />
        </View>

        {/* Category Selection */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>{t.category}</Text>
          <View style={styles.categoryContainer}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryButton, { backgroundColor: colors.cardBackground, borderColor: colors.primary }, category === cat && styles.selectedCategory]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[styles.categoryText, category === cat && styles.selectedCategoryText]}>
                  {getCategoryTranslation(cat)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Priority Selection */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>{t.taskPriority}</Text>
          <View style={styles.priorityContainer}>
            {PRIORITIES.map((level) => (
              <TouchableOpacity
                key={level}
                style={[styles.priorityButton, { backgroundColor: colors.cardBackground, borderColor: colors.primary }, priority === level && styles.selectedPriority]}
                onPress={() => setPriority(level)}
              >
                <Text style={[styles.priorityText, priority === level && styles.selectedPriorityText]}>
                  {getPriorityTranslation(level)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleUpdateTask}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>{loading ? (t.loading || 'Saving...') : (t.save || 'Save Changes')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>{t.cancel}</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Using the same styles as AddTaskScreen for consistency
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  scrollContent: { padding: 24, flexGrow: 1 },
  header: { marginBottom: 30 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  input: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 16, fontSize: 16, color: '#333' },
  textArea: { height: 120 },
  categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categoryButton: { paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: '#6200EA', borderRadius: 8, alignItems: 'center', backgroundColor: '#FFF' },
  selectedCategory: { backgroundColor: '#6200EA' },
  categoryText: { color: '#6200EA', fontWeight: '600', fontSize: 13 },
  selectedCategoryText: { color: '#FFF' },
  priorityContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  priorityButton: { flex: 1, paddingVertical: 12, borderWidth: 1, borderColor: '#6200EA', borderRadius: 8, alignItems: 'center', marginHorizontal: 4, backgroundColor: '#FFF' },
  selectedPriority: { backgroundColor: '#6200EA' },
  priorityText: { color: '#6200EA', fontWeight: 'bold' },
  selectedPriorityText: { color: '#FFF' },
  saveButton: { backgroundColor: '#6200EA', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 20, elevation: 3 },
  saveButtonDisabled: { backgroundColor: '#999' },
  saveButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  cancelButton: { backgroundColor: '#E0E0E0', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 12 },
  cancelButtonText: { color: '#333', fontSize: 18, fontWeight: 'bold' },
});

export default EditTaskScreen;
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
import { addTask } from '../store/taskSlice';
import { CustomAlert as Alert } from '../components/CustomAlert';
import { useTranslation } from '../hooks/useTranslation';

const CATEGORIES = ['Work', 'Personal', 'Shopping', 'Health', 'Other'];
const PRIORITIES = ['High', 'Medium', 'Low'];

const AddTaskScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [category, setCategory] = useState('Work');
  const [priority, setPriority] = useState('Medium');
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

  const handleSaveTask = useCallback(() => {
    if (!taskTitle.trim()) {
      Alert.alert(t.error || 'Error', t.enterTaskTitle || 'Please enter a task title');
      return;
    }
    if (!taskDescription.trim()) {
      Alert.alert(t.error || 'Error', t.enterTaskDesc || 'Please enter a task description');
      return;
    }
    
    setLoading(true);
    
    const newTask = {
      id: Date.now().toString(),
      title: taskTitle,
      description: taskDescription,
      category: category,
      priority: priority,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    
    dispatch(addTask(newTask));
    
    setTimeout(() => {
      setLoading(false);
      Alert.alert(t.success || 'Success', t.taskAddedSuccess || 'Task added successfully! 🎉', [
        {
          text: t.ok || 'OK',
          onPress: () => navigation.goBack()
        }
      ]);
    }, 500);
  }, [taskTitle, taskDescription, category, priority, t, dispatch, navigation]);

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📝 {t.addNewTask}</Text>
          <Text style={styles.subText}>{t.taskDetails || 'Create a new assignment or task'}</Text>
        </View>

        {/* Task Title Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t.taskTitle}</Text>
          <TextInput
            style={styles.input}
            placeholder={t.taskTitlePlaceholder || "e.g., Complete UI Design"}
            value={taskTitle}
            onChangeText={setTaskTitle}
            placeholderTextColor="#A0A0A0"
          />
        </View>

        {/* Task Description Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t.taskDescription}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={t.taskDescPlaceholder || "Enter task details..."}
            value={taskDescription}
            onChangeText={setTaskDescription}
            multiline={true}
            numberOfLines={4}
            placeholderTextColor="#A0A0A0"
            textAlignVertical="top"
          />
        </View>

        {/* Category Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t.category}</Text>
          <View style={styles.categoryContainer}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  category === cat && styles.selectedCategory
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[
                  styles.categoryText,
                  category === cat && styles.selectedCategoryText
                ]}>
                  {getCategoryTranslation(cat)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Priority Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t.taskPriority}</Text>
          <View style={styles.priorityContainer}>
            {PRIORITIES.map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.priorityButton,
                  priority === level && styles.selectedPriority
                ]}
                onPress={() => setPriority(level)}
              >
                <Text style={[
                  styles.priorityText,
                  priority === level && styles.selectedPriorityText
                ]}>
                  {getPriorityTranslation(level)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
          onPress={handleSaveTask}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>{loading ? t.loading || 'Saving...' : t.save}</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  scrollContent: { padding: 24, flexGrow: 1 },
  header: { marginBottom: 30 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  subText: { fontSize: 16, color: '#666', marginTop: 5 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
  },
  textArea: { height: 120 },
  categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#6200EA',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  selectedCategory: { backgroundColor: '#6200EA' },
  categoryText: { color: '#6200EA', fontWeight: '600', fontSize: 13 },
  selectedCategoryText: { color: '#FFF' },
  priorityContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#6200EA',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: '#FFF',
  },
  selectedPriority: { backgroundColor: '#6200EA' },
  priorityText: { color: '#6200EA', fontWeight: 'bold' },
  selectedPriorityText: { color: '#FFF' },
  saveButton: {
    backgroundColor: '#6200EA',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
  },
  saveButtonDisabled: { backgroundColor: '#999' },
  saveButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  cancelButton: {
    backgroundColor: '#E0E0E0',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  cancelButtonText: { color: '#333', fontSize: 18, fontWeight: 'bold' },
});

export default AddTaskScreen;
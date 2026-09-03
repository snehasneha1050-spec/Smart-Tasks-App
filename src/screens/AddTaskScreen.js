import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView
} from 'react-native';
import { useDispatch } from 'react-redux';
import { addTask, fetchTasks } from '../store/taskSlice';
import { CustomAlert as Alert } from '../components/CustomAlert';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../hooks/useTheme';
import { useAppStyles } from '../hooks/useAppStyles';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import notifee, { TriggerType, RepeatFrequency } from '@notifee/react-native';
import { getCategoryTranslation, getPriorityTranslation } from '../utils/helpers';

const CATEGORIES = ['Work', 'Personal', 'Shopping', 'Health', 'Other'];
const PRIORITIES = ['High', 'Medium', 'Low'];

const AddTaskScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useAppStyles(); // 👈 Get all layout and colors automatically!
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [category, setCategory] = useState('Work');
  const [priority, setPriority] = useState('Medium');
  const [loading, setLoading] = useState(false);

  const [dueDate, setDueDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [isReminderSet, setIsReminderSet] = useState(false);
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtask, setNewSubtask] = useState('');

  const handleSaveTask = useCallback(async () => {
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
      dueDate: isReminderSet ? dueDate.toISOString() : null,
      isDaily: isReminderSet, // Automatically daily if reminder is set
      subtasks: subtasks,
    };
    
    if (isReminderSet && dueDate > new Date()) {
      try {
        await notifee.requestPermission();
        const channelId = await notifee.createChannel({ 
          id: 'task-reminders-alarm', 
          name: 'Task Reminders Alarm',
          sound: 'alarm', // Extensions like .mp3 are not needed for Android
        });
        
        const trigger = {
          type: TriggerType.TIMESTAMP,
          timestamp: dueDate.getTime(),
          repeatFrequency: RepeatFrequency.DAILY
        };

        await notifee.createTriggerNotification(
          {
            title: '⏰ Task Reminder',
            body: `It's time to complete: ${taskTitle}`,
            android: { channelId },
            ios: { sound: 'alarm.mp3' },
            data: { task: newTask },
          },
          trigger
        );
      } catch (error) {
        console.log('Notification error:', error);
      }
    }

    try {
      const resultAction = await dispatch(addTask(newTask));

      if (addTask.rejected.match(resultAction)) {
        throw new Error(resultAction.payload || 'Failed to add task.');
      }

      await dispatch(fetchTasks());

      setLoading(false);
      Alert.alert(t.success || 'Success', t.taskAddedSuccess || 'Task added successfully! 🎉', [
        {
          text: t.ok || 'OK',
          onPress: () => navigation.goBack()
        }
      ]);
    } catch (error) {
      setLoading(false);
      Alert.alert(t.error || 'Error', error.message || 'Unable to add task.');
    }
  }, [taskTitle, taskDescription, category, priority, isReminderSet, dueDate, subtasks, t, dispatch, navigation]);

  const onDateChange = useCallback((_, selectedDate) => {
    // For iOS, we need to hide the picker after a selection.
    // For Android, the modal picker closes itself.
    if (Platform.OS === 'ios') {
      setShowPicker(false);
    }

    if (selectedDate) {
      setDueDate(selectedDate);
      setIsReminderSet(true);
    }
  }, []);

  const handleOpenTimePicker = useCallback(() => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: dueDate,
        mode: 'time',
        is24Hour: false,
        onChange: onDateChange,
      });
    } else {
      setShowPicker(true);
    }
  }, [dueDate, onDateChange]);

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, { id: Date.now().toString(), title: newSubtask.trim(), completed: false }]);
      setNewSubtask('');
    }
  };

  const handleRemoveSubtask = (id) => {
    setSubtasks(subtasks.filter(st => st.id !== id));
  };

  return (
    <KeyboardAvoidingView 
      style={styles.safeArea}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.formHeader}>
          <Text style={styles.formHeaderTitle}>📝 {t.addNewTask}</Text>
          <Text style={styles.formSubText}>{t.taskDetails || 'Create a new assignment or task'}</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>{t.taskTitle}</Text>
          <TextInput
            style={styles.formInput}
            placeholder={t.taskTitlePlaceholder || "e.g., Complete UI Design"}
            value={taskTitle}
            onChangeText={setTaskTitle}
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>{t.taskDescription}</Text>
          <TextInput
            style={[styles.formInput, styles.formTextArea]}
            placeholder={t.taskDescPlaceholder || "Enter task details..."}
            value={taskDescription}
            onChangeText={setTaskDescription}
            multiline={true}
            numberOfLines={4}
            placeholderTextColor={colors.textSecondary}
            textAlignVertical="top"
          />
        </View>

      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>⏰ {t.dueDate || 'Reminder Time'}</Text>
        
        <View style={[styles.formInput, styles.formInputRow]}>
          <TouchableOpacity onPress={handleOpenTimePicker} style={styles.formInputRowAction}>
            <Text style={isReminderSet ? styles.reminderText : styles.reminderTextMuted}>
              {isReminderSet ? dueDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : (t.selectDate || 'Select Time')}
            </Text>
          </TouchableOpacity>
          
          {/* Clear Reminder Option */}
          {isReminderSet && (
            <TouchableOpacity onPress={() => setIsReminderSet(false)} style={styles.reminderClearButton}>
              <Text style={styles.reminderClearText}>✖</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {showPicker && Platform.OS === 'ios' && (
          <DateTimePicker
            value={dueDate}
            mode="time"
            display="default"
            onChange={onDateChange}
          />
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>☑️ {t.subtasks || 'Sub-tasks'}</Text>
        <View style={styles.subtaskInputRow}>
          <TextInput
            style={[styles.formInput, styles.subtaskInput]}
            placeholder={t.addSubtask || "Add a sub-task..."}
            value={newSubtask}
            onChangeText={setNewSubtask}
            placeholderTextColor={colors.textSecondary}
          />
          <TouchableOpacity style={styles.subtaskAddButton} onPress={handleAddSubtask}>
            <Text style={styles.subtaskAddButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        {subtasks.map((st) => (
          <View key={st.id} style={styles.subtaskItem}>
            <Text style={styles.subtaskItemText}>• {st.title}</Text>
            <TouchableOpacity onPress={() => handleRemoveSubtask(st.id)}>
              <Text style={styles.subtaskRemoveButtonText}>✖</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>{t.category}</Text>
          <View style={styles.rowWrap}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.chipBtn,
                  category === cat && styles.chipBtnActive
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[
                  styles.chipText,
                  category === cat && styles.chipTextActive
                ]}>
              {getCategoryTranslation(cat, t)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>{t.taskPriority}</Text>
          <View style={styles.rowBetween}>
            {PRIORITIES.map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.chipBtnFlex,
                  priority === level && styles.chipBtnActive
                ]}
                onPress={() => setPriority(level)}
              >
                <Text style={[
                  styles.chipText,
                  priority === level && styles.chipTextActive
                ]}>
                  {getPriorityTranslation(level, t)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
          onPress={handleSaveTask}
          disabled={loading}
        >
          <Text style={styles.saveBtnText}>{loading ? t.loading || 'Saving...' : t.save}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelBtnText}>{t.cancel}</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddTaskScreen;
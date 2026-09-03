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
import { updateTask } from '../store/taskSlice';
import { CustomAlert as Alert } from '../components/CustomAlert';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../hooks/useTheme';
import { useAppStyles } from '../hooks/useAppStyles';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import notifee, { TriggerType, RepeatFrequency } from '@notifee/react-native';
import { getCategoryTranslation, getPriorityTranslation } from '../utils/helpers';

const CATEGORIES = ['Work', 'Personal', 'Shopping', 'Health', 'Other'];
const PRIORITIES = ['High', 'Medium', 'Low'];

const EditTaskScreen = ({ route, navigation }) => {
  const { task } = route.params;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useAppStyles();

  const [taskTitle, setTaskTitle] = useState(task.title);
  const [taskDescription, setTaskDescription] = useState(task.description);
  const [category, setCategory] = useState(task.category);
  const [priority, setPriority] = useState(task.priority);
  const [loading, setLoading] = useState(false);

  const initialDueDate = task.dueDate ? new Date(task.dueDate) : new Date();
  const [dueDate, setDueDate] = useState(initialDueDate);
  const [showPicker, setShowPicker] = useState(false);
  const [isReminderSet, setIsReminderSet] = useState(!!task.dueDate);
  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  const [newSubtask, setNewSubtask] = useState('');

  const handleUpdateTask = useCallback(async () => {
    if (!taskTitle.trim() || !taskDescription.trim()) {
      Alert.alert(t.error || 'Error', t.fillAllFields || 'Please fill in all fields.');
      return;
    }

    setLoading(true);

    const updatedTask = {
      ...task, // Keep original properties like 'completed' and 'createdAt'
      id: task.id, // Keep the original ID
      title: taskTitle,
      description: taskDescription,
      category: category,
      priority: priority,
      dueDate: isReminderSet ? dueDate.toISOString() : null,
      isDaily: isReminderSet,
      subtasks: subtasks,
    };

    if (isReminderSet && dueDate > new Date()) {
      try {
        await notifee.requestPermission();
        const channelId = await notifee.createChannel({
          id: 'task-reminders-alarm',
          name: 'Task Reminders Alarm',
          sound: 'alarm',
        });

        const trigger = {
          type: TriggerType.TIMESTAMP,
          timestamp: dueDate.getTime(),
          repeatFrequency: RepeatFrequency.DAILY
        };

        await notifee.createTriggerNotification(
          {
            id: task.id, // Using task.id ensures old notifications are overwritten
            title: '⏰ Task Reminder',
            body: `It's time to complete: ${taskTitle}`,
            android: { channelId },
            ios: { sound: 'alarm.mp3' },
            data: { task: updatedTask },
          },
          trigger
        );
      } catch (error) {
        console.log('Notification error:', error);
      }
    }

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
  }, [task, taskTitle, taskDescription, category, priority, isReminderSet, dueDate, subtasks, t, dispatch, navigation]);

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
          <Text style={styles.formHeaderTitle}>✏️ {t.edit || 'Edit Task'}</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>{t.taskTitle}</Text>
          <TextInput
            style={styles.formInput}
            value={taskTitle}
            onChangeText={setTaskTitle}
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>{t.taskDescription}</Text>
          <TextInput
            style={[styles.formInput, styles.formTextArea]}
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
                style={[styles.chipBtn, category === cat && styles.chipBtnActive]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>
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
                style={[styles.chipBtnFlex, priority === level && styles.chipBtnActive]}
                onPress={() => setPriority(level)}
              >
                <Text style={[styles.chipText, priority === level && styles.chipTextActive]}>
                  {getPriorityTranslation(level, t)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
          onPress={handleUpdateTask}
          disabled={loading}
        >
          <Text style={styles.saveBtnText}>{loading ? (t.loading || 'Saving...') : (t.save || 'Save Changes')}</Text>
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

export default EditTaskScreen;
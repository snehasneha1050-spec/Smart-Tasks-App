import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import TaskCard from '../components/TaskCard';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../hooks/useTheme';
import { useAppStyles } from '../hooks/useAppStyles';
import { deleteTask } from '../store/taskSlice';
import { CustomAlert as Alert } from '../components/CustomAlert';
import { transliterateToHindi } from '../utils/transliterate';

const HomeScreen = ({ navigation }) => {
  const tasks = useSelector(state => (Array.isArray(state.tasks.tasks) ? state.tasks.tasks : []));
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useAppStyles();
  const dispatch = useDispatch();
  
  const language = useSelector(state => state.theme?.language);
  const rawUsername = useSelector(state => state.user?.username);

  let username = t.user || 'User';
  if (rawUsername) {
    if (t.names && t.names[rawUsername.toLowerCase()]) username = t.names[rawUsername.toLowerCase()];
    else if (language === 'Hindi') username = transliterateToHindi(rawUsername);
    else username = rawUsername;
  }

  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('priority');
  const [searchQuery, setSearchQuery] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const completedCount = useMemo(() => tasks.filter(task => task.completed).length, [tasks]);
  const pendingCount = useMemo(() => tasks.filter(task => !task.completed).length, [tasks]);
  const completionPercentage = useMemo(() => tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0, [tasks.length, completedCount]);

  const filteredTasks = useMemo(() => tasks.filter(task => {
    const matchesFilter = filter === 'all' || (filter === 'completed' && task.completed) || (filter === 'pending' && !task.completed);
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = task.title.toLowerCase().includes(searchLower) || task.description.toLowerCase().includes(searchLower);
    return matchesFilter && matchesSearch;
  }), [tasks, filter, searchQuery]);

  const sortedTasks = useMemo(() => [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      const aPriority = a.priority?.toLowerCase() || 'low';
      const bPriority = b.priority?.toLowerCase() || 'low';
      return priorityOrder[aPriority] - priorityOrder[bPriority];
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'date') {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    }
    return 0;
  }), [filteredTasks, sortBy]);

  const displayTasks = useMemo(() => {
    if (language !== 'Hindi') return sortedTasks;
    return sortedTasks.map(task => ({
      ...task,
      title: transliterateToHindi(task.title),
      description: transliterateToHindi(task.description)
    }));
  }, [sortedTasks, language]);

  const handleTaskPress = useCallback((task) => {
    navigation.navigate('TaskDetail', { task });
  }, [navigation]);

  const handleEditTask = useCallback((task) => {
    navigation.navigate('EditTask', { task });
  }, [navigation]);

  const handleDeleteTask = useCallback((taskId) => {
    Alert.alert(t.deleteTask || 'Delete Task', t.deleteConfirm || 'Are you sure you want to delete this task?', [
      { text: t.cancel || 'Cancel', style: 'cancel' },
      {
        text: t.delete || 'Delete',
        onPress: () => dispatch(deleteTask(taskId)),
        style: 'destructive'
      }
    ]);
  }, [t, dispatch]);

  const renderFilterButton = (filterType, label) => (
    <TouchableOpacity
      style={[styles.filterButton, filter === filterType && styles.filterButtonActive]}
      onPress={() => setFilter(filterType)}
    >
      <Text style={[styles.filterButtonText, filter === filterType && styles.filterButtonTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
  const renderSortButton = (sortType, label) => (
    <TouchableOpacity
      style={[styles.sortButton, sortBy === sortType && styles.sortButtonActive]}
      onPress={() => setSortBy(sortType)}
    >
      <Text style={[styles.sortButtonText, sortBy === sortType && styles.sortButtonTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>{t.hello}, {username}! 👋</Text>
            <Text style={styles.subText}>
              {t.tasks} • 🏆 {completedCount * 10} {t.points || 'Points'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t.totalTasks}</Text>
          <Text style={[styles.statValue, { color: colors.primary }]}>{tasks.length}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t.completedTasks}</Text>
          <Text style={[styles.statValueCompleted, { color: colors.success }]}>{completedCount}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t.pendingTasks}</Text>
          <Text style={[styles.statValuePending, { color: colors.error }]}>{pendingCount}</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <Text style={[styles.progressLabel, { color: colors.text }]}>{t.completionRate}: {completionPercentage}%</Text>
        <View style={[styles.progressBar, { backgroundColor: colors.inputBackground }]}>
          <View
            style={[
              styles.progressFill,
              { width: `${completionPercentage}%`, backgroundColor: colors.primary }
            ]}
          />
        </View>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder={t.search || "Search tasks..."}
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchBtn}>
            <Text style={styles.clearSearchText}>✖</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterContainer}>
        {renderFilterButton('all', t.allTasks)}
        {renderFilterButton('pending', `${t.pending} (${pendingCount})`)}
        {renderFilterButton('completed', `${t.completed} (${completedCount})`)}
      </View>

      <View style={styles.sortContainer}>
        <Text style={[styles.sortLabel, { color: colors.text }]}>{t.sortBy}:</Text>
        <View style={styles.sortButtons}>
          {renderSortButton('priority', t.priority)}
          {renderSortButton('title', t.title)}
          {renderSortButton('date', t.date)}
        </View>
      </View>

      <ScrollView 
        style={styles.taskList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.homeScrollContent}
      >
        {displayTasks.length > 0 ? (
          displayTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onPress={() => handleTaskPress(task)}
              onEdit={() => handleEditTask(task)}
              onDelete={() => handleDeleteTask(task.id)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📭</Text>
            <Text style={[styles.emptyStateTitle, { color: colors.text }]}>{t.noTasks}</Text>
            <Text style={[styles.emptyStateDescription, { color: colors.textSecondary }]}>
              {searchQuery.length > 0 && `No tasks match "${searchQuery}"`}
              {searchQuery.length === 0 && filter === 'completed' && 'Complete some tasks to see them here!'}
              {searchQuery.length === 0 && filter === 'pending' && 'All tasks are completed! 🎉'}
              {searchQuery.length === 0 && filter === 'all' && t.createFirstTask}
            </Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddTask')}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default HomeScreen;
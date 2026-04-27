import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useSelector } from 'react-redux';
import TaskCard from '../components/TaskCard';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../hooks/useTheme';

const HomeScreen = ({ navigation }) => {
  const tasks = useSelector(state => state.tasks.tasks);
  const username = useSelector(state => state.user?.username) || 'User';
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [filter, setFilter] = useState('all'); // all, completed, pending
  const [sortBy, setSortBy] = useState('priority'); // priority, date, title
  const [fadeAnim] = useState(new Animated.Value(0));

  // Animation effect
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // Calculate task statistics
  const completedCount = tasks.filter(task => task.completed).length;
  const pendingCount = tasks.filter(task => !task.completed).length;
  const completionPercentage = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  // Filter tasks based on selected filter
  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
  if (sortBy === 'priority') {
    const priorityOrder = { high: 1, medium: 2, low: 3 };

    const aPriority = a.priority?.toLowerCase() || 'low';
    const bPriority = b.priority?.toLowerCase() || 'low';

    return priorityOrder[aPriority] - priorityOrder[bPriority];
  }
//Title sorting 
  if (sortBy === 'title') {
    return a.title.localeCompare(b.title);
  }
   // ✅ Date sorting (latest first)
  if (sortBy === 'date') {
    return new Date(b.createdAt) - new Date(a.createdAt);
  }

  return 0;
});

  const handleTaskPress = (task) => {
    navigation.navigate('TaskDetail', { task });
  };

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
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>{t.hello}, {username}! 👋</Text>
            <Text style={styles.subText}>{t.tasks}</Text>
          </View>
        </View>
      </View>

      {/* Task Statistics */}
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

      {/* Progress Bar */}
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

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {renderFilterButton('all', t.allTasks)}
        {renderFilterButton('pending', `${t.pending} (${pendingCount})`)}
        {renderFilterButton('completed', `${t.completed} (${completedCount})`)}
      </View>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={[styles.sortLabel, { color: colors.text }]}>{t.sortBy}:</Text>
        <View style={styles.sortButtons}>
          {renderSortButton('priority', t.priority)}
          {renderSortButton('title', t.title)}
          {renderSortButton('date', t.date)}
        </View>
      </View>

      {/* Tasks List */}
      <ScrollView 
        style={styles.taskList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {sortedTasks.length > 0 ? (
          sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onPress={() => handleTaskPress(task)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📭</Text>
            <Text style={[styles.emptyStateTitle, { color: colors.text }]}>{t.noTasks}</Text>
            <Text style={[styles.emptyStateDescription, { color: colors.textSecondary }]}>
              {filter === 'completed' && 'Complete some tasks to see them here!'}
              {filter === 'pending' && 'All tasks are completed! 🎉'}
              {filter === 'all' && t.createFirstTask}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 30,
    backgroundColor: '#6200EA',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: '#6200EA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  subText: {
    fontSize: 15,
    color: '#E0E0E0',
    marginTop: 6,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6200EA',
  },
  statValueCompleted: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4CAF50',
  },
  statValuePending: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF9800',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6200EA',
    borderRadius: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#E8EAEF',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterButtonActive: {
    backgroundColor: '#6200EA',
    borderColor: '#6200EA',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  filterButtonTextActive: {
    color: '#FFF',
  },
  sortContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  sortLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  sortButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#E8EAEF',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  sortButtonActive: {
    backgroundColor: '#6200EA',
    borderColor: '#6200EA',
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  sortButtonTextActive: {
    color: '#FFF',
  },
  taskList: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 80,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#6200EA',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
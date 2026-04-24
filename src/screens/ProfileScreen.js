import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../hooks/useTheme';

const ProfileScreen = ({ navigation }) => {
  const tasks = useSelector(state => state.tasks.tasks);
  const { t } = useTranslation();
  const { colors } = useTheme();

  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.filter(t => !t.completed).length;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>📌</Text>
        </View>
        <Text style={styles.name}>{t.appName}</Text>
        <Text style={styles.role}>{t.taskManagement}</Text>
      </View>

      {/* Stats Section */}
      <View style={[styles.statsContainer, { backgroundColor: colors.cardBackground }]}>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>{completedCount}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t.completed}</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>{pendingCount}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t.pending}</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>{tasks.length}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t.total}</Text>
        </View>
      </View>

      {/* Menu Options */}
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: colors.cardBackground }]}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.menuIcon}>⚙️</Text>
          <View style={styles.menuContent}>
            <Text style={[styles.menuText, { color: colors.text }]}>{t.settings}</Text>
            <Text style={[styles.menuSubtext, { color: colors.textSecondary }]}>{t.managePreferences}</Text>
          </View>
          <Text style={[styles.menuArrow, { color: colors.textSecondary }]}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.cardBackground }]}>
          <Text style={styles.menuIcon}>📊</Text>
          <View style={styles.menuContent}>
            <Text style={[styles.menuText, { color: colors.text }]}>{t.taskStatistics}</Text>
            <Text style={[styles.menuSubtext, { color: colors.textSecondary }]}>{t.viewProgress}</Text>
          </View>
          <Text style={[styles.menuArrow, { color: colors.textSecondary }]}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.cardBackground }]}>
          <Text style={styles.menuIcon}>ℹ️</Text>
          <View style={styles.menuContent}>
            <Text style={[styles.menuText, { color: colors.text }]}>{t.about}</Text>
            <Text style={[styles.menuSubtext, { color: colors.textSecondary }]}>{t.version} 1.0</Text>
          </View>
          <Text style={[styles.menuArrow, { color: colors.textSecondary }]}>›</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { backgroundColor: '#6200EA', alignItems: 'center', paddingVertical: 40, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginBottom: 15, elevation: 5, fontSize: 50 },
  avatarText: { fontSize: 50 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#FFF', letterSpacing: 1 },
  role: { fontSize: 16, color: '#E0E0E0', marginTop: 5 },
  statsContainer: { flexDirection: 'row', backgroundColor: '#FFF', marginHorizontal: 20, marginTop: -30, borderRadius: 15, paddingVertical: 16, elevation: 4 },
  statBox: { flex: 1, alignItems: 'center', paddingHorizontal: 8 },
  statNumber: { fontSize: 22, fontWeight: '700', color: '#6200EA' },
  statLabel: { fontSize: 12, color: '#888', marginTop: 6, fontWeight: '500' },
  divider: { width: 1, backgroundColor: '#EEE' },
  menuContainer: { padding: 20, marginTop: 20, marginBottom: 20 },
  menuItem: { flexDirection: 'row', backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 12, alignItems: 'center', elevation: 2 },
  menuIcon: { fontSize: 24, marginRight: 12 },
  menuContent: { flex: 1 },
  menuText: { fontSize: 16, color: '#333', fontWeight: '600' },
  menuSubtext: { fontSize: 13, color: '#999', marginTop: 2 },
  menuArrow: { fontSize: 20, color: '#ccc', fontWeight: 'bold' },
});

export default ProfileScreen
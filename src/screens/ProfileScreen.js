import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';

const ProfileScreen = ({ navigation }) => {
  const tasks = useSelector(state => state.tasks.tasks);
  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.filter(t => !t.completed).length;
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>📌</Text>
        </View>
        <Text style={styles.name}>Smart Tasks Manager</Text>
        <Text style={styles.role}>Task Management</Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{completedCount}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{pendingCount}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{tasks.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      {/* Menu Options */}
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.menuIcon}>⚙️</Text>
          <View style={styles.menuContent}>
            <Text style={styles.menuText}>Settings</Text>
            <Text style={styles.menuSubtext}>Manage preferences</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>📊</Text>
          <View style={styles.menuContent}>
            <Text style={styles.menuText}>Statistics</Text>
            <Text style={styles.menuSubtext}>View your progress</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>ℹ️</Text>
          <View style={styles.menuContent}>
            <Text style={styles.menuText}>About App</Text>
            <Text style={styles.menuSubtext}>Version 1.0</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
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

export default ProfileScreen;
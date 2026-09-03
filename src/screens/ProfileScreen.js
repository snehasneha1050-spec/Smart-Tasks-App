import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStyles } from '../hooks/useAppStyles';

const ProfileScreen = ({ navigation }) => {
  const tasks = useSelector(state => state.tasks.tasks);
  const { t } = useTranslation();
  const styles = useAppStyles();

  const completedCount = useMemo(() => tasks.filter(task => task.completed).length, [tasks]);
  const pendingCount = useMemo(() => tasks.filter(task => !task.completed).length, [tasks]);

  return (
    <ScrollView style={styles.safeArea} showsVerticalScrollIndicator={false}>
      <View style={styles.mainHeader}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>🏆</Text>
        </View>
        <Text style={styles.headerTitleMain}>{t.appName}</Text>
        <Text style={styles.headerSubMain}>
          {completedCount * 10} {t.pointsEarned || 'Points Earned'}
        </Text>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statVal}>{completedCount}</Text>
          <Text style={styles.statLab}>{t.completed}</Text>
        </View>
        <View style={styles.verticalDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statVal}>{pendingCount}</Text>
          <Text style={styles.statLab}>{t.pending}</Text>
        </View>
        <View style={styles.verticalDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statVal}>{tasks.length}</Text>
          <Text style={styles.statLab}>{t.total}</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.menuIcon}>⚙️</Text>
          <View style={styles.menuContent}>
            <Text style={styles.menuText}>{t.settings}</Text>
            <Text style={styles.menuSubtext}>{t.managePreferences}</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
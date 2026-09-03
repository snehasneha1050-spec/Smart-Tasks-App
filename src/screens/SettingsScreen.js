import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme, setLanguage, setNotificationsEnabled, setPreferences } from '../store/themeSlice';
import { useTranslation } from '../hooks/useTranslation';
import { logoutUser } from '../store/userSlice';
import { useTheme } from '../hooks/useTheme';
import { useAppStyles } from '../hooks/useAppStyles';
import { CustomAlert as Alert } from '../components/CustomAlert';
import { loadUserPreferences, saveUserPreferences, logoutUserSession, clearSavedSession } from '../utils/storage';

const SettingsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { darkMode, language, notificationsEnabled } = useSelector(state => state.theme);
  const username = useSelector(state => state.user.username);
  const sessionToken = useSelector(state => state.user.sessionToken);
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useAppStyles();

  useEffect(() => {
    const syncPreferences = async () => {
      if (!username) return;
      const preferences = await loadUserPreferences(username);
      dispatch(setPreferences(preferences));
    };

    syncPreferences();
  }, [dispatch, username]);

  const persistPreferences = async (nextPreferences) => {
    if (!username) return;
    const mergedPreferences = {
      darkMode: typeof nextPreferences.darkMode === 'boolean' ? nextPreferences.darkMode : darkMode,
      language: nextPreferences.language || language,
      notificationsEnabled: typeof nextPreferences.notificationsEnabled === 'boolean'
        ? nextPreferences.notificationsEnabled
        : notificationsEnabled,
    };

    await saveUserPreferences(username, mergedPreferences);
    dispatch(setPreferences(mergedPreferences));
  };

  const handleNotificationToggle = async (newValue) => {
    dispatch(setNotificationsEnabled(newValue));
    await persistPreferences({ notificationsEnabled: newValue });

    if (newValue) {
      try {
        Alert.alert(t.success || 'Success', 'Notifications enabled for this account!');
      } catch (error) {
        console.log('Notification error:', error);
      }
    } else {
      Alert.alert(t.success || 'Success', 'Notifications disabled.');
    }
  };

  const handleLogout = () => {
    Alert.alert(t.logout, t.logoutConfirm, [
      { text: t.cancel, onPress: () => {} },
      {
        text: t.logout,
        onPress: async () => {
          if (username && sessionToken) {
            try {
              await logoutUserSession({ username, sessionToken });
            } catch (error) {
              console.error('Session logout failed:', error);
            }
          }

          await clearSavedSession();
          dispatch(logoutUser());
          navigation.replace('Login');
        },
        style: 'destructive'
      }
    ]);
  };

  return (
    <ScrollView 
      style={styles.safeArea}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.pageTitle}>{t.settingsTitle}</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌐 {t.language}</Text>
        
        <TouchableOpacity 
          style={[styles.rowMenu, language === 'English' && styles.rowMenuSelected]}
          onPress={async () => {
            dispatch(setLanguage('English'));
            await persistPreferences({ language: 'English' });
          }}
        >
          <Text style={styles.rowMenuText}>English</Text>
          {language === 'English' && <Text>✅</Text>}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.rowMenu, styles.rowMenuNoBorder, language === 'Hindi' && styles.rowMenuSelected]}
          onPress={async () => {
            dispatch(setLanguage('Hindi'));
            await persistPreferences({ language: 'Hindi' });
          }}
        >
          <Text style={styles.rowMenuText}>हिंदी (Hindi)</Text>
          {language === 'Hindi' && <Text>✅</Text>}
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ {t.preferences}</Text>
        <View style={styles.rowMenu}>
          <Text style={styles.rowMenuText}>{t.darkMode}</Text>
          <Switch 
            value={darkMode}
            onValueChange={async () => {
              const nextDarkMode = !darkMode;
              dispatch(toggleTheme());
              await persistPreferences({ darkMode: nextDarkMode });
            }}
            trackColor={{ false: colors.border, true: colors.primary }}
          />
        </View>
        <View style={[styles.rowMenu, styles.rowMenuNoBorder]}>
          <Text style={styles.rowMenuText}>{t.notifications}</Text>
          <Switch 
            value={notificationsEnabled}
            onValueChange={handleNotificationToggle}
            trackColor={{ false: colors.border, true: colors.primary }}
          />
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ℹ️ {t.about}</Text>
        <View style={[styles.rowMenu, styles.rowMenuNoBorder]}>
          <Text style={styles.rowMenuText}>{t.version}</Text>
          <Text style={styles.settingValueText}>1.0.0</Text>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.actionBtnText}>{t.logout}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
export default SettingsScreen;
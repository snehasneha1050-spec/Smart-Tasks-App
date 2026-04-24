import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme, setLanguage } from '../store/themeSlice';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../hooks/useTheme';
import { CustomAlert as Alert } from '../components/CustomAlert';

const SettingsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { darkMode, language } = useSelector(state => state.theme);
  const { t } = useTranslation();
  const { colors } = useTheme();

  const handleLogout = () => {
    Alert.alert(t.logout, t.logoutConfirm, [
      { text: t.cancel, onPress: () => {} },
      {
        text: t.logout,
        onPress: () => navigation.replace('Login'),
        style: 'destructive'
      }
    ]);
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.headerTitle, { color: colors.text }]}>{t.settingsTitle}</Text>

      {/* Language Options */}
      <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>🌐 {t.language}</Text>
        
        <TouchableOpacity 
          style={[
            styles.optionRow, 
            { borderBottomColor: colors.border },
            language === 'English' && { backgroundColor: colors.primary + '1A' }
          ]}
          onPress={() => dispatch(setLanguage('English'))}
        >
          <Text style={[styles.optionText, { color: colors.text }]}>English</Text>
          {language === 'English' && <Text>✅</Text>}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.optionRow, 
            { borderBottomColor: 'transparent' },
            language === 'Hindi' && { backgroundColor: colors.primary + '1A' }
          ]}
          onPress={() => dispatch(setLanguage('Hindi'))}
        >
          <Text style={[styles.optionText, { color: colors.text }]}>हिंदी (Hindi)</Text>
          {language === 'Hindi' && <Text>✅</Text>}
        </TouchableOpacity>
      </View>

      {/* Preferences Settings */}
      <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>⚙️ {t.preferences}</Text>
        <View style={[styles.switchRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.optionText, { color: colors.text }]}>{t.darkMode}</Text>
          <Switch 
            value={darkMode}
            onValueChange={() => dispatch(toggleTheme())}
            trackColor={{ false: colors.border, true: colors.primary }}
          />
        </View>
        <View style={[styles.switchRow, { borderBottomColor: 'transparent' }]}>
          <Text style={[styles.optionText, { color: colors.text }]}>{t.notifications}</Text>
          <Switch 
            value={true}
            onValueChange={() => {}}
            trackColor={{ false: colors.border, true: colors.primary }}
          />
        </View>
      </View>

      {/* About App */}
      <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>ℹ️ {t.about}</Text>
        <View style={[styles.infoRow, { borderBottomColor: 'transparent' }]}>
          <Text style={[styles.optionText, { color: colors.text }]}>{t.version}</Text>
          <Text style={{ color: colors.textSecondary }}>1.0.0</Text>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.error }]} onPress={handleLogout}>
        <Text style={styles.logoutText}>{t.logout}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  section: { borderRadius: 12, padding: 16, marginBottom: 20, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  optionRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, paddingHorizontal: 10, borderRadius: 8 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  optionText: { fontSize: 16 },
  logoutButton: { padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  logoutText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});

export default SettingsScreen;
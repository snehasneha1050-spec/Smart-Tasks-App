import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme, setLanguage } from '../store/themeSlice';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../hooks/useTheme';

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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.headerTitle, { color: colors.text }]}>{t.settingsTitle}</Text>

      {/* Language Options */}
      <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>🌐 {t.language} / भाषा</Text>
        
        <TouchableOpacity 
          style={[styles.optionRow, language === 'English' && styles.selectedRow]}
          onPress={() => dispatch(setLanguage('English'))}
        >
          <Text style={[styles.optionText, { color: colors.text }]}>English</Text>
          {language === 'English' && <Text>✅</Text>}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.optionRow, language === 'Hindi' && styles.selectedRow]}
          onPress={() => dispatch(setLanguage('Hindi'))}
        >
          <Text style={[styles.optionText, { color: colors.text }]}>हिंदी (Hindi)</Text>
          {language === 'Hindi' && <Text>✅</Text>}
        </TouchableOpacity>
      </View>

      {/* Other Settings */}
      <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>⚙️ {t.preferences}</Text>
        <View style={styles.switchRow}>
          <Text style={[styles.optionText, { color: colors.text }]}>{t.darkMode}</Text>
          <Switch 
            value={darkMode}
            onValueChange={() => dispatch(toggleTheme())}
            trackColor={{ false: colors.border, true: colors.primary }}
          />
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.error }]} onPress={handleLogout}>
        <Text style={styles.logoutText}>{t.logout}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', padding: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  section: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 20, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#6200EA', marginBottom: 15 },
  optionRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  selectedRow: { backgroundColor: '#F9F5FF' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  optionText: { fontSize: 16, color: '#333' },
  logoutButton: { backgroundColor: '#FF3B30', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  logoutText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});

export default SettingsScreen;
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Animated
} from 'react-native';
import { useDispatch } from 'react-redux';
import { CustomAlert as Alert } from '../components/CustomAlert';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStyles } from '../hooks/useAppStyles';
import { useTheme } from '../hooks/useTheme';
import { loginUser } from '../store/userSlice';
import { setPreferences } from '../store/themeSlice';
import { fetchTasks } from '../store/taskSlice';
import { signup, login } from '../services/authService';import { setAuthToken } from '../services/api';import { saveSession } from '../utils/storage';

const SignUpScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPasswordState] = useState('');
  const { t } = useTranslation();
  const styles = useAppStyles();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(30)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(30)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonTranslateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.stagger(150, [
      Animated.parallel([
        Animated.timing(headerOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(headerTranslateY, { toValue: 0, tension: 50, friction: 7, useNativeDriver: true })
      ]),
      Animated.parallel([
        Animated.timing(formOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(formTranslateY, { toValue: 0, tension: 50, friction: 7, useNativeDriver: true })
      ]),
      Animated.parallel([
        Animated.timing(buttonOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(buttonTranslateY, { toValue: 0, tension: 50, friction: 7, useNativeDriver: true })
      ])
    ]).start();
  }, [headerOpacity, headerTranslateY, formOpacity, formTranslateY, buttonOpacity, buttonTranslateY]);

  const handleSignUp = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert(t.error || 'Error', t.fillAllFields || 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert(t.error || 'Error', t.passwordsNotMatch || 'Passwords do not match!');
      return;
    }
    const trimmedFullName = fullName.trim();

    try {
      const result = await signup({
        name: trimmedFullName,
        email: email.trim(),
        password,
      });

      if (!result.success) {
        Alert.alert(t.error || 'Error', result.message || 'Account could not be created.');
        return;
      }

      const loginResult = await login({
        email: email.trim(),
        username: trimmedFullName,
        password,
      });
      if (!loginResult.success) {
        Alert.alert(t.error || 'Error', loginResult.message || 'Login after registration failed.');
        return;
      }

      const sessionToken = loginResult.token || null;
      setAuthToken(sessionToken);
      dispatch(fetchTasks());
      dispatch(setPreferences({
        darkMode: false,
        language: 'English',
        notificationsEnabled: true,
      }));
      dispatch(loginUser({ username: trimmedFullName, sessionToken }));
      await saveSession({ username: trimmedFullName, sessionToken });
      Alert.alert(t.success || 'Success', t.accountCreated || 'Account Created Successfully! 🎉', [
        { text: t.ok || 'OK', onPress: () => navigation.replace('MainTabs') }
      ]);
    } catch (e) {
      console.error('Signup error:', e);
      Alert.alert(t.error || 'Error', 'Unable to create account in the MySQL backend.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.safeArea}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle={colors.isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.authMain}>
          <Animated.View style={[styles.authHeader, { opacity: headerOpacity, transform: [{ translateY: headerTranslateY }] }]}>
            <Text style={styles.authLogo}>✨</Text>
            <Text style={styles.authTitle}>{t.createAccount}</Text>
            <Text style={styles.authSubtitle}>{t.signUpSubtitle}</Text>
          </Animated.View>

          <Animated.View style={[styles.authInputSection, { opacity: formOpacity, transform: [{ translateY: formTranslateY }] }]}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput
                style={styles.input}
                placeholder={t.fullNamePlaceholder || "Full Name"}
                value={fullName}
                onChangeText={setFullName}
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>✉️</Text>
              <TextInput
                style={styles.input}
                placeholder={t.emailPlaceholder || "Email Address"}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder={t.password}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>🔑</Text>
              <TextInput
                style={styles.input}
                placeholder={t.confirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPasswordState}
                secureTextEntry
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </Animated.View>

          <Animated.View style={{ opacity: buttonOpacity, transform: [{ translateY: buttonTranslateY }] }}>
            <TouchableOpacity style={styles.primaryBtn} onPress={handleSignUp}>
              <Text style={styles.primaryBtnText}>{t.signUp}</Text>
            </TouchableOpacity>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>{t.alreadyHaveAccount} </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>{t.login}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default SignUpScreen;
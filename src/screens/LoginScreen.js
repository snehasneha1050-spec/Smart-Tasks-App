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
import { useTheme } from '../hooks/useTheme';
import { useAppStyles } from '../hooks/useAppStyles';
import { loginUser } from '../store/userSlice';
import { setPreferences } from '../store/themeSlice';
import { fetchTasks } from '../store/taskSlice';
import { login as loginUserRequest } from '../services/authService';
import { setAuthToken } from '../services/api';
import { saveSession } from '../utils/storage';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useAppStyles();
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

  const handleLogin = async () => {
    const trimmedUsername = username.trim();
    if (trimmedUsername !== '' && password.trim() !== '') {
      try {
        const result = await loginUserRequest({
          email: trimmedUsername,
          username: trimmedUsername,
          password,
        });

        if (result.success) {
          const sessionToken = result.token || null;
          const loggedUsername = result.user?.name || trimmedUsername;

          setAuthToken(sessionToken);
          dispatch(fetchTasks());
          dispatch(setPreferences({
            darkMode: false,
            language: 'English',
            notificationsEnabled: true,
          }));
          dispatch(loginUser({ username: loggedUsername, sessionToken }));
          await saveSession({ username: loggedUsername, sessionToken });
          Alert.alert(t.success || 'Success', `${t.welcome || 'Welcome'}, ${loggedUsername}! 🎉`, [
            {
              text: t.ok || 'OK',
              onPress: () => navigation.replace('MainTabs')
            }
          ]);
        } else {
          Alert.alert(t.loginFailed || 'Login Failed', result.message || 'Invalid username or password. Please Sign Up first.');
        }
      } catch (e) {
        console.error('Login error:', e);
        Alert.alert(t.loginFailed || 'Login Failed', 'Unable to connect to the MySQL backend. Please start the API server first.');
      }
    } else {
      Alert.alert(t.loginFailed || 'Login Failed', t.enterCredentials || 'Please enter a valid username and password.');
    }
  };

  const handleResetPassword = async () => {
    const trimmedUsername = username.trim();
    if (!trimmedUsername || !newPassword || !confirmNewPassword) {
      Alert.alert(t.error || 'Error', 'Please fill in all fields to reset password.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      Alert.alert(t.error || 'Error', 'Passwords do not match!');
      return;
    }

    try {
      const result = await resetUserPassword({ username: trimmedUsername, newPassword });
      if (result.success) {
        Alert.alert(t.success || 'Success', 'Password reset successfully! You can now login.', [
          { text: t.ok || 'OK', onPress: () => {
              setIsResetMode(false);
              setPassword('');
              setNewPassword('');
              setConfirmNewPassword('');
          }}
        ]);
      } else {
        Alert.alert(t.error || 'Error', 'Username not found. Please Sign Up first.');
      }
    } catch (e) {
      console.error('Reset password error:', e);
      Alert.alert(t.error || 'Error', 'Unable to reset password through the MySQL backend.');
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
            <Text style={styles.authLogo}>🗓️</Text>
            <Text style={styles.authTitle}>{isResetMode ? 'Reset Password' : t.welcomeBack}</Text>
            <Text style={styles.authSubtitle}>{isResetMode ? 'Enter a new password for your account' : t.signInSubtitle}</Text>
          </Animated.View>

          <Animated.View style={[styles.authInputSection, { opacity: formOpacity, transform: [{ translateY: formTranslateY }] }]}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput
                style={styles.input}
                placeholder={t.username}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            {!isResetMode ? (
              <>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>🔒</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={t.password}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    placeholderTextColor={colors.textSecondary}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.forgotPassword} onPress={() => setIsResetMode(true)}>
                  <Text style={styles.forgotPasswordText}>{t.forgotPassword}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>🔑</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="New Password"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showNewPassword}
                    placeholderTextColor={colors.textSecondary}
                  />
                  <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                    <Text style={styles.eyeIcon}>{showNewPassword ? '🙈' : '👁️'}</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>🔑</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm New Password"
                    value={confirmNewPassword}
                    onChangeText={setConfirmNewPassword}
                    secureTextEntry={!showConfirmPassword}
                    placeholderTextColor={colors.textSecondary}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Text style={styles.eyeIcon}>{showConfirmPassword ? '🙈' : '👁️'}</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Animated.View>

          <Animated.View style={{ opacity: buttonOpacity, transform: [{ translateY: buttonTranslateY }] }}>
            {!isResetMode ? (
              <>
                <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin}>
                  <Text style={styles.primaryBtnText}>{t.login}</Text>
                </TouchableOpacity>

                <View style={styles.footerRow}>
                  <Text style={styles.footerText}>{t.noAccount} </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.linkText}>{t.signUp}</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <TouchableOpacity style={styles.primaryBtn} onPress={handleResetPassword}>
                  <Text style={styles.primaryBtnText}>Reset Password</Text>
                </TouchableOpacity>

                <View style={styles.footerRow}>
                  <TouchableOpacity onPress={() => setIsResetMode(false)}>
                    <Text style={styles.linkText}>Back to Login</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Animated
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { CustomAlert as Alert } from '../components/CustomAlert';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../hooks/useTheme';
import { loginUser } from '../store/userSlice';
import { loadTasks } from '../store/taskSlice';
import { loadUserTasks } from '../utils/storage';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useDispatch();

  // Animation Values
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
        const usersStr = await AsyncStorage.getItem('registeredUsers');
        const users = usersStr ? JSON.parse(usersStr) : [];
        
        // Validate User
        const validUser = users.find(
          u => u.username.toLowerCase() === trimmedUsername.toLowerCase() && u.password === password
        );

        if (validUser) {
          // Save logged-in session
          await AsyncStorage.setItem('loggedInUser', trimmedUsername);
          
          const userTasks = await loadUserTasks(trimmedUsername);
          dispatch(loadTasks(userTasks));
          dispatch(loginUser(trimmedUsername));
          Alert.alert(t.success || 'Success', `${t.welcome || 'Welcome'}, ${trimmedUsername}! 🎉`, [
            {
              text: t.ok || 'OK',
              onPress: () => navigation.replace('MainTabs')
            }
          ]);
        } else {
          Alert.alert(t.loginFailed || 'Login Failed', 'Invalid username or password. Please Sign Up first.');
        }
      } catch (e) {
        console.error('Login error:', e);
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
      const usersStr = await AsyncStorage.getItem('registeredUsers');
      const users = usersStr ? JSON.parse(usersStr) : [];
      
      const userIndex = users.findIndex(
        u => u.username.toLowerCase() === trimmedUsername.toLowerCase()
      );

      if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        await AsyncStorage.setItem('registeredUsers', JSON.stringify(users));
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
    }
  };

  const styles = StyleSheet.create({
    keyboardAvoidingView: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollViewContent: {
      flexGrow: 1,
    },
    mainContainer: {
      flex: 1,
      backgroundColor: 'transparent',
      padding: 24,
      justifyContent: 'center',
    },
    header: {
      alignItems: 'center',
      marginBottom: 48,
    },
    logoEmoji: {
      fontSize: 64,
      marginBottom: 16,
      color: colors.primary,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
      letterSpacing: 0.5,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      paddingHorizontal: 16,
      lineHeight: 24,
    },
    inputSection: {
      marginBottom: 24,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.inputBackground,
      borderRadius: 12,
      marginBottom: 16,
      paddingHorizontal: 16,
      height: 56,
      borderWidth: 1,
      borderColor: colors.border,
    },
    inputIcon: {
      fontSize: 20,
      marginRight: 12,
      color: colors.textSecondary,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
    },
    forgotPassword: {
      alignSelf: 'flex-end',
      marginBottom: 16,
    },
    forgotPasswordText: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '600',
    },
    loginButton: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: 24,
    },
    loginButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    footerText: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    signUpText: {
      fontSize: 16,
      color: colors.primary,
      fontWeight: 'bold',
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle={colors.isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />

      <ScrollView contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled">
        <View style={styles.mainContainer}>
          {/* Header Section */}
          <Animated.View style={[styles.header, { opacity: headerOpacity, transform: [{ translateY: headerTranslateY }] }]}>
            <Text style={styles.logoEmoji}>🗓️</Text>
            <Text style={styles.title}>{isResetMode ? 'Reset Password' : t.welcomeBack}</Text>
            <Text style={styles.subtitle}>{isResetMode ? 'Enter a new password for your account' : t.signInSubtitle}</Text>
          </Animated.View>

          {/* Input Fields Section */}
          <Animated.View style={[styles.inputSection, { opacity: formOpacity, transform: [{ translateY: formTranslateY }] }]}>
            
            {/* Username Input Box */}
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
                {/* Password Input Box */}
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

                {/* Forgot Password Link */}
                <TouchableOpacity style={styles.forgotPassword} onPress={() => setIsResetMode(true)}>
                  <Text style={styles.forgotPasswordText}>{t.forgotPassword}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* New Password Input Box */}
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>🔑</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="New Password"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>
                
                {/* Confirm New Password Input Box */}
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>🔑</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm New Password"
                    value={confirmNewPassword}
                    onChangeText={setConfirmNewPassword}
                    secureTextEntry
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>
              </>
            )}
          </Animated.View>

          {/* Login Button & Footer Section */}
          <Animated.View style={{ opacity: buttonOpacity, transform: [{ translateY: buttonTranslateY }] }}>
            {!isResetMode ? (
              <>
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                  <Text style={styles.loginButtonText}>{t.login}</Text>
                </TouchableOpacity>

                {/* Footer Section */}
                <View style={styles.footer}>
                  <Text style={[styles.footerText, { color: colors.textSecondary }]}>{t.noAccount} </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.signUpText}>{t.signUp}</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <TouchableOpacity style={styles.loginButton} onPress={handleResetPassword}>
                  <Text style={styles.loginButtonText}>Reset Password</Text>
                </TouchableOpacity>

                {/* Footer Section */}
                <View style={styles.footer}>
                  <TouchableOpacity onPress={() => setIsResetMode(false)}>
                    <Text style={styles.signUpText}>Back to Login</Text>
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
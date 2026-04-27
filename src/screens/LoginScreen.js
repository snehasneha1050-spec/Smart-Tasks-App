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
import { useDispatch } from 'react-redux';
import { CustomAlert as Alert } from '../components/CustomAlert';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../hooks/useTheme';
import { loginUser } from '../store/userSlice';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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

  const handleLogin = () => {
    if (username.trim() !== '' && password.trim() !== '') {
      dispatch(loginUser(username.trim()));
      Alert.alert('Success', `Welcome, ${username}! 🎉`, [
        {
          text: 'OK',
          onPress: () => navigation.replace('MainTabs')
        }
      ]);
    } else {
      Alert.alert('Login Failed', 'Please enter a valid username and password.');
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
    demoContainer: {
      alignItems: 'center',
      marginBottom: 8,
    },
    demoText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontStyle: 'italic',
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
            <Text style={styles.title}>{t.welcomeBack}</Text>
            <Text style={styles.subtitle}>{t.signInSubtitle}</Text>
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
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>{t.forgotPassword}</Text>
            </TouchableOpacity>

            {/* Demo Login Hint */}
            <View style={styles.demoContainer}>
              <Text style={styles.demoText}>{t.demoHint}</Text>
            </View>
          </Animated.View>

          {/* Login Button & Footer Section */}
          <Animated.View style={{ opacity: buttonOpacity, transform: [{ translateY: buttonTranslateY }] }}>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>{t.login}</Text>
            </TouchableOpacity>

            {/* Footer Section - Added a link here to navigate to the SignUp page */}
            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: colors.textSecondary }]}>{t.noAccount}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.signUpText}>{t.signUp}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
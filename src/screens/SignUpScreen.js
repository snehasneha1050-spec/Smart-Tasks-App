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
import { loginUser } from '../store/userSlice';

const SignUpScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPasswordState] = useState('');
  const { t } = useTranslation();
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

  const handleSignUp = () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert(t.error || 'Error', t.fillAllFields || 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert(t.error || 'Error', t.passwordsNotMatch || 'Passwords do not match!');
      return;
    }
    
    dispatch(loginUser(fullName.trim()));
    // Navigate to the MainTabs screen upon successful signup
    Alert.alert(t.success || 'Success', t.accountCreated || 'Account Created Successfully! 🎉', [
      { text: t.ok || 'OK', onPress: () => navigation.replace('MainTabs') }
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />
      <ScrollView contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled">
        <View style={styles.mainContainer}>
          
          {/* Header Section */}
          <Animated.View style={[styles.header, { opacity: headerOpacity, transform: [{ translateY: headerTranslateY }] }]}>
            <Text style={styles.logoEmoji}>✨</Text>
            <Text style={styles.title}>{t.createAccount}</Text>
            <Text style={styles.subtitle}>{t.signUpSubtitle}</Text>
          </Animated.View>

          {/* Input Fields Section */}
          <Animated.View style={[styles.inputSection, { opacity: formOpacity, transform: [{ translateY: formTranslateY }] }]}>
            
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput
                style={styles.input}
                placeholder={t.fullNamePlaceholder || "Full Name"}
                value={fullName}
                onChangeText={setFullName}
                placeholderTextColor="#A0A0A0"
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
                placeholderTextColor="#A0A0A0"
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
                placeholderTextColor="#A0A0A0"
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
                placeholderTextColor="#A0A0A0"
              />
            </View>
          </Animated.View>

          {/* Sign Up Button & Footer Section */}
          <Animated.View style={{ opacity: buttonOpacity, transform: [{ translateY: buttonTranslateY }] }}>
            <TouchableOpacity style={styles.signUpBtn} onPress={handleSignUp}>
              <Text style={styles.signUpBtnText}>{t.signUp}</Text>
            </TouchableOpacity>

            {/* Footer Section */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>{t.alreadyHaveAccount} </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginText}>{t.login}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  mainContainer: { flex: 1, backgroundColor: '#F3F4F6', padding: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  logoEmoji: { fontSize: 50, marginBottom: 10, color: '#6200EA' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#333333', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666666', textAlign: 'center' },
  inputSection: { marginBottom: 24 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputIcon: { fontSize: 18, marginRight: 12, color: '#A0A0A0' },
  input: { flex: 1, fontSize: 16, color: '#333333', height: '100%' },
  signUpBtn: {
    backgroundColor: '#6200EA',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    marginBottom: 24,
  },
  signUpBtnText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', letterSpacing: 0.5 },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { color: '#666666', fontSize: 14 },
  loginText: { color: '#6200EA', fontSize: 14, fontWeight: 'bold' },
});

export default SignUpScreen;
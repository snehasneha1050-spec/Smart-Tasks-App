import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Global ref to hold the alert function
let globalAlertRef = null;

// Custom Alert Object that mimics React Native's Alert.alert
export const CustomAlert = {
  alert: (title, message, buttons) => {
    if (globalAlertRef) {
      globalAlertRef.alert(title, message, buttons);
    } else {
      console.warn('CustomAlertProvider not mounted!');
    }
  }
};

export const CustomAlertProvider = () => {
  const [config, setConfig] = useState({ visible: false, title: '', message: '', buttons: [] });

  useEffect(() => {
    globalAlertRef = {
      alert: (title, message, buttons) => {
        setConfig({ visible: true, title, message, buttons: buttons || [] });
      },
      close: () => {
        setConfig(prev => ({ ...prev, visible: false }));
      }
    };
  }, []);

  if (!config.visible) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={config.visible}
      onRequestClose={() => globalAlertRef.close()}
    >
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          {config.title ? <Text style={styles.title}>{config.title}</Text> : null}
          {config.message ? <Text style={styles.message}>{config.message}</Text> : null}
          
          <View style={styles.buttonContainer}>
            {config.buttons && config.buttons.length > 0 ? (
              config.buttons.map((btn, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.button,
                    btn.style === 'cancel' || (config.buttons.length === 2 && index === 0) ? styles.cancelButton : null,
                    btn.style === 'destructive' ? styles.destructiveButton : null,
                  ]}
                  onPress={() => {
                    if (btn.onPress) btn.onPress();
                    globalAlertRef.close();
                  }}
                >
                  <Text style={[
                    styles.buttonText,
                    btn.style === 'cancel' || (config.buttons.length === 2 && index === 0) ? styles.cancelText : null,
                    btn.style === 'destructive' ? styles.destructiveText : null,
                  ]}>
                    {btn.text}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <TouchableOpacity style={styles.button} onPress={() => globalAlertRef.close()}>
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    width: width * 0.8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gap: 12,
  },
  button: {
    flex: 1,
    backgroundColor: '#6200EA',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  destructiveButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelText: {
    color: '#666666',
  },
  destructiveText: {
    color: '#FFFFFF',
  },
});
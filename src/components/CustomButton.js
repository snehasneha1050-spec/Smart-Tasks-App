import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomButton = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: { backgroundColor: '#6200EA', padding: 15, borderRadius: 8, alignItems: 'center', marginVertical: 10 },
  text: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});

export default CustomButton;
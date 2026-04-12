import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Header = ({ title }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { paddingVertical: 20, paddingHorizontal: 15, backgroundColor: '#6200EA', paddingTop: 40 },
  headerTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold' }
});

export default Header;
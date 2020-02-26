import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';

const RecordButton = props => {
  return (
    <TouchableOpacity {...props} style={styles.fab}>
      <Text style={styles.fabIcon}>+</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    backgroundColor: '#03A9F4',
  },
  fabIcon: {
    fontSize: 20,
    color: 'white',
  },
});

export default RecordButton;

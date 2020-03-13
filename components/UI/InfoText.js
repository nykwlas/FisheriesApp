import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Colors from '../../constants/Colors';

const InfoText = ({text}) => (
  <View style={styles.container}>
    <Text style={styles.infoText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: Colors.background,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 20,
    color: 'gray',
    fontWeight: '500',
  },
});

export default InfoText;

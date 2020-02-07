import React from 'react';
import {ScrollView, Text, Image, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';

const RecordDetail = props => {
  const recordId = props.navigation.getParam('recordId');
  const selectedRecord = useSelector(state =>
    state.records.availableRecords.find(prod => prod.id === recordId),
  );

  return (
    <ScrollView>
      <Image style={styles.image} source={{uri: selectedRecord.imageUrl}} />
      <Text style={styles.price}>selectedRecord.date</Text>
      <Text style={styles.description}>{selectedRecord.description}</Text>
    </ScrollView>
  );
};

RecordDetail.navigationOptions = navData => {
  return {
    headerTitle: navData.navigation.getParam('recordTitle'),
  };
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 300,
  },
  actions: {
    marginVertical: 10,
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: 'open-sans-bold',
  },
  description: {
    fontFamily: 'open-sans',
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 20,
  },
});

export default RecordDetail;

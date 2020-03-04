import React from 'react';
import {
  View,
  SafeAreaView,
  FlatList,
  ScrollView,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import {useSelector} from 'react-redux';

const RecordDetail = props => {
  const recordId = props.navigation.getParam('recordId');
  const selectedRecord = useSelector(state =>
    state.records.availableRecords.find(prod => prod.id === recordId),
  );
  const catches = selectedRecord.catches;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image style={styles.image} source={{uri: selectedRecord.imageUrl}} />
        <Text style={styles.price}>{selectedRecord.date}</Text>
        <Text style={styles.description}>{selectedRecord.description}</Text>
        <FlatList
          data={catches}
          keyExtractor={item => item.id}
          renderItem={itemData => (
            <View style={styles.catchItems}>
              <Text>{itemData.item.kind}</Text>
              <Text>{itemData.item.time}</Text>
              <Text>{itemData.item.length} cm</Text>
              <Text>{itemData.item.weight} kg</Text>
            </View>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

RecordDetail.navigationOptions = navData => {
  return {
    headerTitle: navData.navigation.getParam('recordTitle'),
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
  catchItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 15,
  },
});

export default RecordDetail;

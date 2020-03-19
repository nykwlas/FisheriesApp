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

import Colors from '../../../constants/Colors';

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
        <Text style={styles.title}>Description</Text>
        <Text style={styles.description}>{selectedRecord.description}</Text>
        <Text style={styles.title}>Today's Catches</Text>
        <FlatList
          data={catches}
          keyExtractor={item => item.id}
          renderItem={itemData => (
            <View style={styles.locationContainer}>
              <Text style={styles.addressTitle}>{itemData.item.kind}</Text>
              <Text style={styles.address}>
                Time of catch: {itemData.item.time}
              </Text>
              <Text style={styles.address}>
                Length: {itemData.item.length} cm
              </Text>
              <Text style={styles.address}>
                Weight: {itemData.item.weight} kg
              </Text>
              <Text style={styles.address}>Depth: {itemData.item.depth} m</Text>
              <Text style={styles.address}>Method: {itemData.item.method}</Text>
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
    backgroundColor: Colors.background,
  },
  locationContainer: {
    marginVertical: 20,
    marginHorizontal: '5%',
    width: '90%',
    // maxWidth: 350,
    justifyContent: 'center',
    alignItems: 'flex-start',
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    paddingLeft: 30,
  },
  address: {
    color: Colors.primary,
    textAlign: 'center',
    fontSize: 16,
  },
  addressTitle: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
    paddingBottom: 10,
  },
  title: {
    paddingTop: 30,
    paddingLeft: 20,
    fontSize: 20,
    fontWeight: 'bold',
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
    fontSize: 16,
    paddingTop: 20,
    marginHorizontal: 20,
  },
  catchItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 15,
  },
});

export default RecordDetail;

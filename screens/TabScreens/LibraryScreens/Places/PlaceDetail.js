import React from 'react';
import {
  ScrollView,
  Image,
  View,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import {useSelector} from 'react-redux';

// import MapPreview from '../../../../components/Maps/MapPreview';
import Colors from '../../../../constants/Colors';

const PlaceDetailScreen = props => {
  const placeId = props.navigation.getParam('placeId');
  const image = props.navigation.getParam('image');
  const selectedPlace = useSelector(state =>
    state.places.places.find(place => place.id === placeId),
  );
  const selectedLocation = {lat: selectedPlace.lat, lng: selectedPlace.lng};

  // const showMapHandler = () => {
  //   props.navigation.navigate('Map', {
  //     readonly: true,
  //     initialLocation: selectedLocation,
  //   });
  // };

  return (
    <ScrollView contentContainerStyle={{alignItems: 'center'}}>
      <Image
        source={{
          uri: Platform.OS === 'ios' ? image : `file://${image}`,
        }}
        style={styles.image}
      />
      <View style={styles.locationContainer}>
        <View style={styles.addressContainer}>
          <Text style={styles.addressTitle}>Place Data</Text>
          <Text style={styles.address}>Latitude: {selectedLocation.lat}</Text>
          <Text style={styles.address}>Longitude: {selectedLocation.lng}</Text>
          <Text style={styles.address}>selectedPlace.address</Text>
        </View>
        {/* <MapPreview
          style={styles.mapPreview}
          location={selectedLocation}
          onPress={showMapHandler}
        /> */}
      </View>
    </ScrollView>
  );
};

PlaceDetailScreen.navigationOptions = navData => {
  return {
    headerTitle: navData.navigation.getParam('placeTitle'),
  };
};

const styles = StyleSheet.create({
  image: {
    height: '35%',
    minHeight: 300,
    width: '100%',
    backgroundColor: '#ccc',
  },
  locationContainer: {
    marginVertical: 20,
    width: '90%',
    maxWidth: 350,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 5,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  addressContainer: {
    padding: 20,
  },
  address: {
    color: Colors.primary,
    textAlign: 'center',
  },
  addressTitle: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
    paddingBottom: 10,
  },
  mapPreview: {
    width: '100%',
    maxWidth: 350,
    height: 300,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});

export default PlaceDetailScreen;

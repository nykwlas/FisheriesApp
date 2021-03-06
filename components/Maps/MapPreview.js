import React from 'react';
import {TouchableOpacity, Image, StyleSheet} from 'react-native';

import Styles from '../../constants/Styles';
import googleApiKey from '../../config/GoogleMaps/googleMapsAPI';

const MapPreview = props => {
  let imagePreviewUrl;

  if (props.location) {
    imagePreviewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${
      props.location.lat
    },${
      props.location.lng
    }&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:A%7C${
      props.location.lat
    },${props.location.lng}&key=${googleApiKey}`;
  }

  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{...styles.mapPreview, ...props.style}}>
      {props.location ? (
        <Image style={Styles.image} source={{uri: imagePreviewUrl}} />
      ) : (
        props.children
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mapPreview: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapPreview;

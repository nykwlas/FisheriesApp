import React, {useState} from 'react';
import {View, Button, Image, Text, StyleSheet} from 'react-native';
import ImagePicker from 'react-native-image-picker';

import Colors from '../../constants/Colors';

const ImgPicker = props => {
  const [pickedImage, setPickedImage] = useState();

  const imageOptions = {
    title: 'Select Profile picture',
    storageOptions: {
      skipBackup: true,
      // path: 'images',
    },
  };

  const takeImageHandler = async () => {
    let source;
    ImagePicker.showImagePicker(imageOptions, response => {
      // console.log('Response = ', response);
      if (response.didCancel) {
        // console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        source = response.uri;
      }
      setPickedImage(source);
      props.onImageTaken(source);
    });
  };

  return (
    <View style={styles.imagePicker}>
      <View style={styles.imagePreview}>
        {!pickedImage ? (
          <Text>No image picked yet.</Text>
        ) : (
          <Image style={styles.image} source={{uri: pickedImage}} />
        )}
      </View>
      <Button
        title="Take Image"
        color={Colors.primary}
        onPress={takeImageHandler}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imagePicker: {
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ImgPicker;

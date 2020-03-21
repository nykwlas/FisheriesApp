import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {Avatar} from 'react-native-elements';

const MyAvatar = props => {
  const photoUrl = useSelector(state => state.auth.photoUrl);
  return (
    <View style={styles.userImage}>
      <Avatar
        rounded
        size="small"
        source={{uri: photoUrl + '&' + new Date()}}
      />
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  userImage: {
    flex: 1,
    flexDirection: 'row',
    // marginRight: 12,
  },
});

export default MyAvatar;

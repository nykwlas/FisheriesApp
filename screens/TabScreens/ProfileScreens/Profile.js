import React, {useState} from 'react';
import {
  ScrollView,
  Switch,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {Avatar, ListItem} from 'react-native-elements';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import AsyncStorage from '@react-native-community/async-storage';

import HeaderButton from '../../../components/Buttons/HeaderButton';
import BaseIcon from '../../../components/UI/Icon';
import Chevron from '../../../components/UI/Chevron';
import InfoText from '../../../components/UI/InfoText';
import Colors from '../../../constants/Colors';
import * as authActions from '../../../store/actions/auth';

import ImagePicker from 'react-native-image-picker';
import Dialog from 'react-native-dialog';

const Profile = props => {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [
    isResetPasswordDialogVisible,
    setIsResetPasswordDialogVisible,
  ] = useState(false);
  const [
    isDeleteAccoubtDialogVisible,
    setIsDeleteAccoubtDialogVisible,
  ] = useState(false);

  const [newDate, setNewDate] = useState(new Date());
  const [displayName, setDisplayName] = useState(
    useSelector(state => state.auth.displayName),
  );
  const [sumbitNameButton, setSumbitNameButton] = useState(true);
  const [changedName, setChangedName] = useState();
  const photoUrl = useSelector(state => state.auth.photoUrl);
  const email = useSelector(state => state.auth.email);
  const dispatch = useDispatch();

  const onPressOptions = () => {
    // props.navigation.navigate('options');
  };

  const options = {
    title: 'Select Profile picture',
    storageOptions: {
      skipBackup: true,
      // path: 'images',
    },
  };

  const onPressChangePicture = async () => {
    const userData = await AsyncStorage.getItem('userData');
    const transformedData = JSON.parse(userData);
    const {userId} = transformedData;
    const url =
      'https://firebasestorage.googleapis.com/v0/b/shopapp-d5c17.appspot.com/o/ProfileImages%2F' +
      userId +
      '.jpg?alt=media';
    ImagePicker.showImagePicker(options, response => {
      // console.log('Response = ', response);
      if (response.didCancel) {
        // console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = response.uri;
        dispatch(authActions.handleUpload(source)).then(() => {
          setNewDate(new Date());
        });
      }
    });
    if (photoUrl === undefined) {
      await dispatch(authActions.updatePhotoUrl(url));
      await dispatch(authActions.getProfile());
    }
  };

  const changeName = async () => {
    setDisplayName(changedName);
    await dispatch(authActions.updateProfileName(changedName));
    await dispatch(authActions.getProfile());
  };

  const onPressChangeName = () => {
    setIsDialogVisible(true);
  };

  const passwordReset = async () => {
    await dispatch(authActions.resetPassword(email));
    props.navigation.navigate('Auth');
  };

  const onPressPasswordReset = () => {
    setIsResetPasswordDialogVisible(true);
  };

  const deleteAccount = async () => {
    await dispatch(authActions.deleteAccount(email));
    props.navigation.navigate('Auth');
  };

  const onPressDeleteAccount = () => {
    setIsDeleteAccoubtDialogVisible(true);
  };

  const onChangePushNotifications = () => {
    setPushNotifications(!pushNotifications);
  };

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.userRow}>
        <View style={styles.userImage}>
          <Avatar
            rounded
            size="large"
            source={{uri: photoUrl + '&' + newDate}}
          />
        </View>
        <View>
          <Text style={{fontSize: 16}}>{displayName}</Text>
          <Text
            style={{
              color: 'gray',
              fontSize: 16,
            }}>
            {email}
          </Text>
        </View>
      </View>
      <InfoText text="Account" />
      <View>
        <ListItem
          hideChevron
          title="Push Notifications"
          containerStyle={styles.listItemContainer}
          rightElement={
            <Switch
              onValueChange={onChangePushNotifications}
              value={pushNotifications}
            />
          }
          leftIcon={
            <BaseIcon
              containerStyle={{
                backgroundColor: '#FFADF2',
              }}
              icon={{
                type: 'material',
                name: 'notifications',
              }}
            />
          }
        />
        <ListItem
          title="Statistics"
          rightTitle="Charts"
          rightTitleStyle={{fontSize: 15}}
          onPress={() => onPressOptions()}
          containerStyle={styles.listItemContainer}
          leftIcon={
            <BaseIcon
              containerStyle={{backgroundColor: '#57DCE7'}}
              icon={{
                type: 'material-community',
                name: 'chart-bar',
              }}
            />
          }
          rightIcon={<Chevron />}
        />
        <ListItem
          title="Licences"
          rightTitle="DFMR"
          rightTitleStyle={{fontSize: 15}}
          onPress={() => onPressOptions()}
          containerStyle={styles.listItemContainer}
          leftIcon={
            <BaseIcon
              containerStyle={{backgroundColor: '#FAD291'}}
              icon={{
                type: 'font-awesome',
                name: 'money',
              }}
            />
          }
          rightIcon={<Chevron />}
        />
      </View>
      <InfoText text="Account Settings" />
      <View>
        <ListItem
          hideChevron
          title="Change Profile Picture"
          onPress={() => onPressChangePicture()}
          containerStyle={styles.listItemContainer}
          leftIcon={
            <BaseIcon
              containerStyle={{
                backgroundColor: '#f5aa42',
              }}
              icon={{
                type: 'font-awesome',
                name: 'user-circle',
              }}
            />
          }
          rightIcon={<Chevron />}
        />
        <ListItem
          title="Change Display Name"
          rightTitle=""
          rightTitleStyle={{fontSize: 15}}
          onPress={onPressChangeName}
          containerStyle={styles.listItemContainer}
          leftIcon={
            <BaseIcon
              containerStyle={{backgroundColor: '#4278f5'}}
              icon={{
                type: 'material-community',
                name: 'text-short',
              }}
            />
          }
          rightIcon={<Chevron />}
        />
        <ListItem
          title="Password Reset"
          rightTitle=""
          rightTitleStyle={{fontSize: 15}}
          onPress={() => onPressPasswordReset()}
          containerStyle={styles.listItemContainer}
          leftIcon={
            <BaseIcon
              containerStyle={{backgroundColor: '#f56342'}}
              icon={{
                type: 'font-awesome',
                name: 'lock',
              }}
            />
          }
          rightIcon={<Chevron />}
        />
        <ListItem
          title="Delete Account"
          rightTitle=""
          rightTitleStyle={{fontSize: 15}}
          onPress={() => onPressDeleteAccount()}
          containerStyle={styles.listItemContainer}
          leftIcon={
            <BaseIcon
              containerStyle={{backgroundColor: '#2e362e'}}
              icon={{
                type: 'MaterialCommunityIcons',
                name: 'delete-forever',
              }}
            />
          }
          rightIcon={<Chevron />}
        />
      </View>
      <InfoText text="More" />
      <View>
        <ListItem
          title="About US"
          onPress={() => onPressOptions()}
          containerStyle={styles.listItemContainer}
          leftIcon={
            <BaseIcon
              containerStyle={{backgroundColor: '#A4C8F0'}}
              icon={{
                type: 'ionicon',
                name: 'md-information-circle',
              }}
            />
          }
          rightIcon={<Chevron />}
        />
        <ListItem
          title="Terms and Policies"
          onPress={() => onPressOptions()}
          containerStyle={styles.listItemContainer}
          leftIcon={
            <BaseIcon
              containerStyle={{backgroundColor: '#C6C7C6'}}
              icon={{
                type: 'entypo',
                name: 'light-bulb',
              }}
            />
          }
          rightIcon={<Chevron />}
        />
        <ListItem
          title="Share our App"
          onPress={() => onPressOptions()}
          containerStyle={styles.listItemContainer}
          leftIcon={
            <BaseIcon
              containerStyle={{
                backgroundColor: '#C47EFF',
              }}
              icon={{
                type: 'entypo',
                name: 'share',
              }}
            />
          }
          rightIcon={<Chevron />}
        />
        <ListItem
          title="Rate Us"
          onPress={() => onPressOptions()}
          containerStyle={styles.listItemContainer}
          badge={{
            value: 5,
            textStyle: {color: 'white'},
            containerStyle: {backgroundColor: 'gray', marginTop: 0},
          }}
          leftIcon={
            <BaseIcon
              containerStyle={{
                backgroundColor: '#FECE44',
              }}
              icon={{
                type: 'entypo',
                name: 'star',
              }}
            />
          }
          rightIcon={<Chevron />}
        />
        <ListItem
          title="Send FeedBack"
          onPress={() => onPressOptions()}
          containerStyle={styles.listItemContainer}
          leftIcon={
            <BaseIcon
              containerStyle={{
                backgroundColor: '#00C001',
              }}
              icon={{
                type: 'materialicon',
                name: 'feedback',
              }}
            />
          }
          rightIcon={<Chevron />}
        />
      </View>
      <Dialog.Container
        visible={isDialogVisible}
        onBackdropPress={() => {
          setIsDialogVisible(false);
        }}>
        <Dialog.Title style={styles.title}>
          Change your Display Name
        </Dialog.Title>
        <Dialog.Description>Enter your full name.</Dialog.Description>
        <Dialog.Input
          wrapperStyle={styles.modalInput}
          onChangeText={text => {
            setChangedName(text);
            if (text.length > 3) {
              setSumbitNameButton(false);
            } else {
              setSumbitNameButton(true);
            }
          }}
        />
        {sumbitNameButton && (
          <Dialog.Input style={styles.error}>
            Your name must be more than 3 characters.
          </Dialog.Input>
        )}
        <Dialog.Button
          label="Cancel"
          onPress={() => {
            setIsDialogVisible(false);
          }}
        />
        <Dialog.Button
          label="Submit"
          disabled={sumbitNameButton}
          onPress={() => {
            setIsDialogVisible(false);
            changeName();
          }}
        />
      </Dialog.Container>
      <Dialog.Container
        visible={isResetPasswordDialogVisible}
        onBackdropPress={() => {
          setIsResetPasswordDialogVisible(false);
        }}>
        <Dialog.Title style={styles.title}>
          Send password reset email
        </Dialog.Title>
        <Dialog.Description>Accept to send you email.</Dialog.Description>
        <Dialog.Button
          label="Cancel"
          onPress={() => {
            setIsResetPasswordDialogVisible(false);
          }}
        />
        <Dialog.Button
          label="Send"
          onPress={() => {
            setIsResetPasswordDialogVisible(false);
            passwordReset();
          }}
        />
      </Dialog.Container>
      <Dialog.Container
        visible={isDeleteAccoubtDialogVisible}
        onBackdropPress={() => {
          setIsDeleteAccoubtDialogVisible(false);
        }}>
        <Dialog.Title style={styles.title}>
          Are you sure you want to delete your account?
        </Dialog.Title>
        <Dialog.Description>Accept to delete your account.</Dialog.Description>
        <Dialog.Button
          label="Cancel"
          onPress={() => {
            setIsDeleteAccoubtDialogVisible(false);
          }}
        />
        <Dialog.Button
          label="Send"
          onPress={() => {
            setIsDeleteAccoubtDialogVisible(false);
            deleteAccount();
          }}
        />
      </Dialog.Container>
    </ScrollView>
  );
};

Profile.navigationOptions = navData => {
  return {
    headerTitle: 'Profile',
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOut: {
    color: '#F57C00',
  },
  scroll: {
    backgroundColor: Colors.background,
  },
  userRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 8,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 6,
  },
  userImage: {
    marginRight: 12,
  },
  listItemContainer: {
    height: 55,
    borderWidth: 0.5,
    borderColor: '#ECECEC',
  },
  modalInput: {
    borderBottomWidth: 0.5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    fontSize: 16,
    color: 'red',
  },
});

export default Profile;

import React, {useState} from 'react';
import {
  ScrollView,
  Switch,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {Avatar, ListItem} from 'react-native-elements';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';

import HeaderButton from '../../../components/Buttons/HeaderButton';
import BaseIcon from '../../../components/UI/Icon';
import Chevron from '../../../components/UI/Chevron';
import InfoText from '../../../components/UI/InfoText';
import Colors from '../../../constants/Colors';

const Profile = props => {
  const [pushNotifications, setPushNotifications] = useState(true);
  const displayName = useSelector(state => state.auth.displayName);

  const onPressOptions = () => {
    // props.navigation.navigate('options');
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
            source={require('../../../assets/owm_icon.png')}
          />
        </View>
        <View>
          <Text style={{fontSize: 16}}>{displayName}</Text>
          <Text
            style={{
              color: 'gray',
              fontSize: 16,
            }}>
            EMAIL
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
        <ListItem
          title="Location"
          rightTitle="New York"
          rightTitleStyle={{fontSize: 15}}
          onPress={() => onPressOptions()}
          containerStyle={styles.listItemContainer}
          leftIcon={
            <BaseIcon
              containerStyle={{backgroundColor: '#57DCE7'}}
              icon={{
                type: 'material',
                name: 'place',
              }}
            />
          }
          rightIcon={<Chevron />}
        />
        <ListItem
          title="Language"
          rightTitle="English"
          rightTitleStyle={{fontSize: 15}}
          onPress={() => onPressOptions()}
          containerStyle={styles.listItemContainer}
          leftIcon={
            <BaseIcon
              containerStyle={{backgroundColor: '#FEA8A1'}}
              icon={{
                type: 'material',
                name: 'language',
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
});

export default Profile;

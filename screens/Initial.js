import React, {useEffect, useCallback} from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import Colors from '../constants/Colors';
// import {AppLoading} from 'expo';
// import {Asset} from 'expo-asset';
// import * as Font from 'expo-font';
// import * as Icon from '@expo/vector-icons'
// import Icon from 'react-native-vector-icons/Ionicons';
import {withFirebaseHOC} from '../config/Firebase';

const Initial = props => {
  // state = {
  //   isAssetsLoadingComplete: false,
  // };

  const componentDidMount = useCallback(async () => {
    try {
      // previously
      // this.loadLocalAsync();

      await props.firebase.checkUserAuth(user => {
        if (user) {
          // if the user has previously logged in
          props.navigation.navigate('App');
        } else {
          // if the user has previously signed out from the app
          props.navigation.navigate('Auth');
        }
      });
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.firebase]);

  useEffect(() => {
    componentDidMount();
  }, [componentDidMount]);

  // loadLocalAsync = async () => {
  //   return await Promise.all([
  //     Asset.loadAsync([
  //       require('../assets/flame.png'),
  //       require('../assets/icon.png'),
  //     ]),
  //     Font.loadAsync({
  //       ...Icon.Ionicons.font,
  //     }),
  //   ]);
  // };

  // handleLoadingError = error => {
  //   // In this case, you might want to report the error to your error
  //   // reporting service, for example Sentry
  //   console.warn(error);
  // };

  // handleFinishLoading = () => {
  //   this.setState({isAssetsLoadingComplete: true});
  // };

  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
    // <AppLoading
    //   startAsync={this.loadLocalAsync}
    //   onFinish={this.handleFinishLoading}
    //   onError={this.handleLoadingError}
    // />
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default withFirebaseHOC(Initial);

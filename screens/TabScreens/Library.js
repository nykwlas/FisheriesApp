import React /*, {useState, useEffect, useCallback}*/ from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
// import {SearchBar} from 'react-native-elements';
// import {useDispatch} from 'react-redux';
import HeaderButton from '../../components/UI/HeaderButton';

const Library = props => {
  // const [search, setSearch] = useState('');

  // const dispatch = useDispatch();

  // const searchItem = useCallback(searchData => {
  //   setSearch(searchData);
  //   // dispatch();
  // }, []);

  // useEffect(() => {
  //   props.navigation.setParams({search: search, onChange: searchItem});
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [search, searchItem]);

  return (
    <View style={styles.container}>
      <Text>Library</Text>
    </View>
  );
};

Library.navigationOptions = navData => {
  // const change = navData.navigation.getParam('onChange');
  return {
    headerTitle: 'Library',
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
    // headerRight: () => (
    //   <SearchBar
    //     placeholder="Type Here..."
    //     onChangeText={value => {
    //       console.log('changed');
    //       change(value);
    //     }}
    //     value={navData.navigation.getParam('search')}
    //   />
    // ),
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
});

export default Library;

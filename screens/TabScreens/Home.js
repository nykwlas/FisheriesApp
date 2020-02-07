import React, {useState, useEffect, useCallback} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {Button} from 'react-native-elements';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import {useSelector, useDispatch} from 'react-redux';

import HeaderButton from '../../components/UI/HeaderButton';
import RecordItem from '../../components/Records/RecordItem';
import * as recordActions from '../../store/actions/records';
import Colors from '../../constants/Colors';

const Home = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const records = useSelector(state => state.records.availableRecords);
  const dispatch = useDispatch();

  const loadRecords = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(recordActions.fetchRecords());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener('willFocus', loadRecords);

    return () => {
      willFocusSub.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadRecords]);

  useEffect(() => {
    setIsLoading(true);
    loadRecords().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadRecords]);

  const selectItemHandler = (id, title) => {
    props.navigation.navigate('RecordDetail', {
      recordId: id,
      recordTitle: title,
    });
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred!</Text>
        <Button
          title="Try again"
          onPress={loadRecords}
          color={Colors.primary}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isLoading && records.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No records found. Maybe start adding some!</Text>
      </View>
    );
  }

  return (
    <FlatList
      onRefresh={loadRecords}
      refreshing={isRefreshing}
      data={records}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <RecordItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.date}
          onSelect={() => {
            selectItemHandler(itemData.item.id, itemData.item.title);
          }}>
          <Button
            color={Colors.primary}
            title="View Details"
            onPress={() => {
              selectItemHandler(itemData.item.id, itemData.item.title);
            }}
          />
        </RecordItem>
      )}
    />
  );
};

Home.navigationOptions = navData => {
  return {
    headerTitle: 'Home',
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Home;

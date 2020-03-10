import React, {useState, useEffect, useCallback} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  Alert,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import {Button} from 'react-native-elements';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';

import HeaderButton from '../../../components/UI/HeaderButton';
import RecordButton from '../../../components/UI/RecordButton';
import RecordItem from '../../../components/Records/RecordItem';
import * as recordActions from '../../../store/actions/records';
import Colors from '../../../constants/Colors';

const Home = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const records = useSelector(state => state.records.userRecords);
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

  const loadData = () => {
    setIsLoading(true);
    loadRecords().then(() => {
      setIsLoading(false);
    });
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, loadRecords]);

  const selectItemHandler = (id, title) => {
    props.navigation.navigate('RecordDetail', {
      recordId: id,
      recordTitle: title,
    });
  };

  const deleteHandler = id => {
    Alert.alert('Are you sure?', 'Do you really want to delete this record?', [
      {text: 'No', style: 'default'},
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => {
          dispatch(recordActions.deleteRecord(id));
        },
      },
    ]);
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred!</Text>
        <Button
          title="Try again"
          onPress={() => {
            loadData();
          }}
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
        <RecordButton
          onPress={() => {
            props.navigation.navigate('RecordForm');
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        onRefresh={loadRecords}
        refreshing={isRefreshing}
        data={records}
        keyExtractor={item => item.id}
        renderItem={itemData => (
          <RecordItem
            image={itemData.item.imageUrl}
            title={itemData.item.title}
            date={itemData.item.date}
            onSelect={() => {
              selectItemHandler(itemData.item.id, itemData.item.title);
            }}>
            <View style={styles.buttonContainer}>
              <View style={styles.button}>
                <Button
                  color={Colors.primary}
                  title="View Details"
                  onPress={() => {
                    selectItemHandler(itemData.item.id, itemData.item.title);
                  }}
                />
              </View>
              <View style={styles.button}>
                <Button
                  style={styles.button}
                  color={Colors.primary}
                  title="Delete"
                  onPress={deleteHandler.bind(this, itemData.item.id)}
                />
              </View>
            </View>
          </RecordItem>
        )}
      />
      <RecordButton
        onPress={() => {
          props.navigation.navigate('RecordForm');
        }}
      />
    </View>
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
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flex: 1,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    width: '35%',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;

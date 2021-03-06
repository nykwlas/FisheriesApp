import React, {useState, useEffect, useCallback} from 'react';
import {Platform, StyleSheet, Text, Alert, View, FlatList} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import {Button} from 'react-native-elements';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';

import HeaderButton from '../../../components/Buttons/HeaderButton';
import RecordButton from '../../../components/Buttons/RecordButton';
import RecordItem from '../../../components/Records/RecordItem';
import Loading from '../../../components/Loading';
import Error from '../../../components/Error';
import * as recordActions from '../../../store/actions/records';

import Colors from '../../../constants/Colors';
import Styles from '../../../constants/Styles';

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
    Alert.alert(
      'Are you sure?',
      'Do you really want to delete this record?',
      [
        {text: 'No', style: 'default'},
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            dispatch(recordActions.deleteRecord(id));
          },
        },
      ],
      {cancelable: true},
    );
  };

  if (error) {
    return (
      <Error
        onRetry={() => {
          loadData();
        }}
      />
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  if (!isLoading && records.length === 0) {
    return (
      <View style={Styles.centered}>
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
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Rooms"
          iconName={Platform.OS === 'android' ? 'md-mail' : 'ios-mail'}
          onPress={() => {
            navData.navigation.navigate('Rooms');
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
});

export default Home;

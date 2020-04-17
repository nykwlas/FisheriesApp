import React, {useState, useEffect, useCallback} from 'react';
import {
  Text,
  TextInput,
  TouchableHighlight,
  StatusBar,
  FlatList,
  View,
  StyleSheet,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import Loading from '../../../../components/Loading';
import Error from '../../../../components/Error';
import * as messagingActions from '../../../../store/actions/messaging';

import Styles from '../../../../constants/Styles';

const Rooms = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const [newRoom, setNewRoom] = useState('');

  const rooms = useSelector(state => state.messaging.availableRooms);
  const dispatch = useDispatch();

  const loadRooms = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(messagingActions.fetchRooms());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener('willFocus', loadRooms);

    return () => {
      willFocusSub.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadRooms]);

  const loadData = () => {
    setIsLoading(true);
    loadRooms().then(() => {
      setIsLoading(false);
    });
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, loadRooms]);

  const addRoom = async () => {
    if (newRoom === '') {
      return;
    }
    await dispatch(messagingActions.createRoom(newRoom));
    setNewRoom('');
  };

  const openMessages = room => {
    props.navigation.navigate('Messages', {
      roomKey: room.id,
      roomName: room.name,
    });
  };

  const renderRow = item => {
    return (
      <TouchableHighlight
        style={styles.roomLi}
        underlayColor="#fff"
        onPress={() => openMessages(item)}>
        <Text style={styles.roomLiText}>{item.name}</Text>
      </TouchableHighlight>
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

  if (!isLoading && rooms.length === 0) {
    return (
      <View style={styles.roomsContainer}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.roomsHeader}>Chat Rooms</Text>
        <View style={styles.roomsInputContainer}>
          <TextInput
            style={styles.roomsInput}
            placeholder={'New Room Name'}
            onChangeText={text => setNewRoom(text)}
            value={newRoom}
          />
          <TouchableHighlight
            style={styles.roomsNewButton}
            underlayColor="#fff"
            onPress={() => addRoom()}>
            <Text style={styles.roomsNewButtonText}>Create</Text>
          </TouchableHighlight>
        </View>
        <View style={Styles.centered}>
          <Text style={styles.textColor}>
            No rooms found. Maybe start creating some!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.roomsContainer}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.roomsHeader}>Chat Rooms</Text>
      <View style={styles.roomsInputContainer}>
        <TextInput
          style={styles.roomsInput}
          placeholder={'New Room Name'}
          onChangeText={text => setNewRoom(text)}
          value={newRoom}
        />
        <TouchableHighlight
          style={styles.roomsNewButton}
          underlayColor="#fff"
          onPress={() => addRoom()}>
          <Text style={styles.roomsNewButtonText}>Create</Text>
        </TouchableHighlight>
      </View>
      <View style={styles.roomsListContainer}>
        <FlatList
          onRefresh={loadRooms}
          refreshing={isRefreshing}
          data={rooms}
          keyExtractor={item => item.id}
          renderItem={({item}) => renderRow(item)}
        />
      </View>
    </View>
  );
};

Rooms.navigationOptions = navData => {
  return {
    headerTitle: 'Rooms',
  };
};

const styles = StyleSheet.create({
  textColor: {
    color: 'white',
    fontSize: 16,
  },
  roomLi: {
    flex: 1,
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderColor: 'transparent',
    borderWidth: 1,
    paddingLeft: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
  roomLiText: {
    color: '#1E90FF',
    fontSize: 22,
  },
  roomsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#1E90FF',
  },
  roomsHeader: {
    color: '#fff',
    fontSize: 28,
    top: 20,
  },
  roomsInputContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomColor: '#f9f9f9',
    borderBottomWidth: 2,
    top: 30,
  },
  roomsInput: {
    flex: 1,
    height: 50,
    textAlign: 'center',
    fontSize: 18,
    color: '#1E90FF',
    borderColor: '#f9f9f9',
    borderWidth: 2,
    borderRadius: 4,
    margin: 10,
  },
  roomsNewButton: {
    alignItems: 'center',
    marginRight: 20,
  },
  roomsNewButtonText: {
    color: '#1E90FF',
    fontSize: 18,
  },
  roomsListContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 30,
    backgroundColor: '#fff',
  },
});

export default Rooms;

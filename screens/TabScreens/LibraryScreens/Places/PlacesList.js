import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, Platform, FlatList, Alert} from 'react-native';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import {useSelector, useDispatch} from 'react-redux';

import HeaderButton from '../../../../components/Buttons/HeaderButton';
import PlaceItem from '../../../../components/Maps/PlaceItem';
import Loading from '../../../../components/Loading';
import Error from '../../../../components/Error';
import * as placesActions from '../../../../store/actions/places';

import Styles from '../../../../constants/Styles';

const PlacesListScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const places = useSelector(state => state.places.userPlaces);
  const dispatch = useDispatch();

  const loadPlaces = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(placesActions.loadPlaces());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener('willFocus', loadPlaces);

    return () => {
      willFocusSub.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadPlaces]);

  const loadData = () => {
    setIsLoading(true);
    loadPlaces().then(() => {
      setIsLoading(false);
    });
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, loadPlaces]);

  const selectItemHandler = (id, title, image) => {
    props.navigation.navigate('PlaceDetail', {
      placeTitle: title,
      placeId: id,
      image: image,
    });
  };

  const deleteHandler = id => {
    Alert.alert(
      'Are you sure?',
      'Do you really want to delete this place?',
      [
        {text: 'No', style: 'default'},
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            dispatch(placesActions.deletePlace(id));
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

  if (!isLoading && places.length === 0) {
    return (
      <View style={Styles.centered}>
        <Text>No places found. Maybe start adding some!</Text>
      </View>
    );
  }

  return (
    <FlatList
      onRefresh={loadPlaces}
      refreshing={isRefreshing}
      data={places}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <PlaceItem
          image={itemData.item.imageUri}
          title={itemData.item.title}
          // address={itemData.item.address}
          onSelect={() => {
            selectItemHandler(
              itemData.item.id,
              itemData.item.title,
              itemData.item.imageUri,
            );
          }}
          onDelete={() => {
            deleteHandler(itemData.item.id);
          }}
        />
      )}
    />
  );
};

PlacesListScreen.navigationOptions = navData => {
  return {
    headerTitle: 'All Places',
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Add Place"
          iconName={Platform.OS === 'android' ? 'md-add' : 'ios-add'}
          onPress={() => {
            navData.navigation.navigate('NewPlace');
          }}
        />
      </HeaderButtons>
    ),
  };
};

export default PlacesListScreen;

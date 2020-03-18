import React, {useState, useEffect, useCallback, useReducer} from 'react';
import {
  ScrollView,
  View,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useDispatch} from 'react-redux';
import Input from '../../../../components/Input/Input';

import Colors from '../../../../constants/Colors';
import * as placesActions from '../../../../store/actions/places';
import ImagePicker from '../../../../components/Maps/ImagePicker';
import LocationPicker from '../../../../components/Maps/LocationPicker';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    // eslint-disable-next-line no-unused-vars
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues,
    };
  }
  return state;
};

const NewPlaceScreen = props => {
  const [titleValue, setTitleValue] = useState('');
  const [selectedImage, setSelectedImage] = useState();
  const [selectedLocation, setSelectedLocation] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: '',
      image: '',
      location: {},
    },
    inputValidities: {
      title: false,
      image: false,
      location: false,
    },
    formIsValid: false,
  });

  // const titleChangeHandler = text => {
  //   // you could add validation
  //   setTitleValue(text);
  // };

  const titleChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
      setTitleValue(inputValue);
    },
    [dispatchFormState],
  );

  const imageTakenHandler = imagePath => {
    dispatchFormState({
      type: FORM_INPUT_UPDATE,
      value: imagePath,
      isValid: true,
      input: 'image',
    });
    setSelectedImage(imagePath);
  };

  const locationPickedHandler = useCallback(location => {
    dispatchFormState({
      type: FORM_INPUT_UPDATE,
      value: location,
      isValid: true,
      input: 'location',
    });
    setSelectedLocation(location);
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred!', error, [{text: 'Okay'}], {
        cancelable: true,
      });
    }
  }, [error]);

  const savePlaceHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert(
        'Something is Wrong!',
        'Please fill all inputs  in the form.',
        [{text: 'Okay'}],
        {cancelable: true},
      );
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(
        placesActions.addPlace(titleValue, selectedImage, selectedLocation),
      );
      props.navigation.goBack();
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, selectedImage, selectedLocation, titleValue]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.form}>
        <Input
          styleTextInput={styles.textInput}
          styleLabel={styles.title}
          label="Title"
          id="title"
          errorText="Please enter at least 5 characters!"
          keyboardType="default"
          returnKeyType="done"
          autoCapitalize="sentences"
          onInputChange={titleChangeHandler}
          initialValue={''}
          initiallyValid={false}
          required
          minLength={5}
        />
        <ImagePicker onImageTaken={imageTakenHandler} />
        <LocationPicker
          navigation={props.navigation}
          onLocationPicked={locationPickedHandler}
        />
        <Button
          title="Save Place"
          color={Colors.primary}
          onPress={savePlaceHandler}
        />
      </View>
    </ScrollView>
  );
};

NewPlaceScreen.navigationOptions = {
  headerTitle: 'Add Place',
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
  },
  form: {
    margin: 30,
  },
  label: {
    fontSize: 18,
    // marginBottom: 15,
  },
  textInput: {
    marginBottom: 15,
  },
});

export default NewPlaceScreen;

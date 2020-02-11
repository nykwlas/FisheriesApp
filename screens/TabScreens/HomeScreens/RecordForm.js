import React, {useState, useReducer, useEffect, useCallback} from 'react';
import {
  ActivityIndicator,
  Platform,
  TextInput,
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  Alert,
} from 'react-native';
import {Button} from 'react-native-elements';
// import { Ionicons } from '@expo/vector-icons'
// import Icon from 'react-native-vector-icons/Ionicons';
// import {Formik} from 'formik';
// import * as Yup from 'yup';
import {useDispatch} from 'react-redux';
import {ProgressSteps, ProgressStep} from 'react-native-progress-steps';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import RNPickerSelect from 'react-native-picker-select';
import Input from '../../../components/UI/Input';
import * as recordActions from '../../../store/actions/records';
import Colors from '../../../constants/Colors';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../../../components/UI/HeaderButton';

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

const RecordForm = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const placeholder = {
    label: 'Select a type...',
    value: null,
  };
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: '',
      imageUrl:
        'https://cdn.pixabay.com/photo/2016/10/02/22/17/red-t-shirt-1710578_1280.jpg',
      description: '',
      date: '',
    },
    inputValidities: {
      title: false,
      imageUrl: true,
      description: false,
      date: false,
    },
    formIsValid: false,
  });

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred!', error, [{text: 'Okay'}]);
    }
  }, [error]);

  const submitHandler = useCallback(async () => {
    console.log(
      formState.inputValues.title,
      formState.inputValues.description,
      formState.inputValues.date,
      formState.inputValues.imageUrl,
    );
    if (!formState.formIsValid) {
      Alert.alert('Wrong input!', 'Please check the errors in the form.', [
        {text: 'Okay'},
      ]);
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(
        recordActions.createRecord(
          formState.inputValues.title,
          formState.inputValues.description,
          formState.inputValues.imageUrl,
          formState.inputValues.date,
        ),
      );
      props.navigation.goBack();
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, formState]);

  useEffect(() => {
    props.navigation.setParams({submit: submitHandler});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitHandler]);

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState],
  );

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(Platform.OS === 'ios' ? true : false);
  };
  const handleConfirm = inputDate => {
    const dat = inputDate.getUTCDate();
    const month = inputDate.getUTCMonth() + 1;
    const year = inputDate.getUTCFullYear();
    const dateStr = dat + '/' + month + '/' + year;
    inputChangeHandler('date', dateStr, true);
    hideDatePicker();
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ProgressSteps>
        <ProgressStep label="Date">
          <View style={styles.inputDate}>
            <Button title="Select Date" onPress={showDatePicker} />
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
            <TextInput style={styles.text} value={formState.inputValues.date} />
          </View>
          <View style={styles.inputType}>
            <Text style={styles.text}>Select type of Fishing</Text>
          </View>
          <View style={styles.input}>
            <RNPickerSelect
              placeholder={placeholder}
              onValueChange={value => {
                inputChangeHandler('title', value, true);
              }}
              items={[
                {label: 'Spearfishing', value: 'Spearfishing'},
                {label: 'Freshwater/Cane', value: 'Freshwater'},
                {label: 'Saltwater/Cane', value: 'Saltwater'},
              ]}
            />
          </View>
        </ProgressStep>
        <ProgressStep>
          <View>
            <Text>Second Step</Text>
          </View>
        </ProgressStep>
        <ProgressStep onSubmit={submitHandler}>
          <Input
            id="description"
            label="Description"
            errorText="Please enter a valid description!"
            keyboardType="default"
            returnKeyType="done"
            autoCapitalize="sentences"
            autoCorrect
            // multiline
            // numberOfLines={3}
            onInputChange={inputChangeHandler}
            initialValue={''}
            initiallyValid={false}
            required
            minLength={5}
          />
        </ProgressStep>
      </ProgressSteps>
    </SafeAreaView>
  );
};

RecordForm.navigationOptions = navData => {
  const submitFn = navData.navigation.getParam('submit');
  return {
    headerTitle: navData.navigation.getParam('Add New Record'),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Save"
          iconName={
            Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'
          }
          onPress={submitFn}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inputDate: {
    margin: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  text: {
    fontSize: 18,
    fontFamily: 'open-sans-bold',
  },
  input: {
    marginLeft: 65,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputType: {
    marginTop: 15,
    marginLeft: 60,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RecordForm;

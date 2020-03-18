import React, {
  useState,
  useReducer,
  useEffect,
  useCallback,
  Fragment,
} from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View,
  Text,
  Alert,
  FlatList,
} from 'react-native';
import {useDispatch} from 'react-redux';

import {Button} from 'react-native-elements';
import Modal from 'react-native-modal';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import {ProgressSteps, ProgressStep} from 'react-native-progress-steps';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';

import Input from '../../../components/Input/Input';
import HeaderButton from '../../../components/Buttons/HeaderButton';
import FormRecordButton from '../../../components/Buttons/FormRecordButton';
import FormInput from '../../../components/Input/FormInput';
import FormButton from '../../../components/Buttons/FormButton';
import ErrorMessage from '../../../components/Input/ErrorMessage';
import Catch from '../../../models/catch';

import * as recordActions from '../../../store/actions/records';
import Colors from '../../../constants/Colors';

import {Formik} from 'formik';
import * as Yup from 'yup';

let catches = [];
const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const validationSchema = Yup.object().shape({
  kind: Yup.string()
    .label('Kind')
    .required('Kind of fish is required')
    .min(3, 'Must have at least 3 characters'),
  weight: Yup.number()
    .label('Weight')
    .positive('Enter a positive number')
    .truncate()
    .required('Weight of fish is required'),
  length: Yup.number()
    .label('Length')
    .positive('Enter a positive number')
    .truncate()
    .required('Length of fish is required'),
  time: Yup.string()
    .label('Time')
    .required('Time of catch is required')
    .min(5, 'Time must be in format HH:MM'),
  depth: Yup.number()
    .label('Depth')
    .required('Depth of catch is required')
    .positive('Enter a positive number')
    .truncate()
    .max(1000, 'Depth must be less than 1000 meters'),
  method: Yup.string()
    .label('Method')
    .required('Method of catch is required')
    .min(3, 'Must have at least 3 characters'),
});

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

const RecordForm = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const [kindField, setKindField] = useState('');
  const [weightField, setWeightField] = useState('');
  const [lengthField, setLengthField] = useState('');
  const [timeField, setTimeField] = useState('');
  const [depthField, setDepthField] = useState('');
  const [methodField, setMethodField] = useState('');
  const [description, setDescription] = useState('');

  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [stepOneError, setStepOneError] = useState(false);
  const [stepTwoError, setStepTwoError] = useState(false);

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
      catches: [],
    },
    inputValidities: {
      title: false,
      imageUrl: true,
      description: false,
      date: false,
      catches: false,
    },
    formIsValid: false,
  });

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred!', error, [{text: 'Okay'}], {
        cancelable: true,
      });
    }
  }, [error]);

  const submitHandler = useCallback(async () => {
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
        recordActions.createRecord(
          formState.inputValues.title,
          formState.inputValues.description,
          formState.inputValues.imageUrl,
          formState.inputValues.date,
          catches,
        ),
      );
      props.navigation.goBack();
    } catch (err) {
      setError(err.message);
    }
    catches = [];
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

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatePicker = () => {
    showMode('date');
  };

  // const showTimepicker = () => {
  //   showMode('time');
  // };

  const handleConfirmDate = inputDate => {
    const dat = inputDate.getUTCDate();
    const month = inputDate.getUTCMonth() + 1;
    const year = inputDate.getUTCFullYear();
    const dateStr = dat + '/' + month + '/' + year;
    inputChangeHandler('date', dateStr, true);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setShow(Platform.OS === 'ios' ? true : false);
    handleConfirmDate(currentDate);
  };

  const pickerStyle = {
    inputIOS: {
      color: 'black',
    },
    inputAndroid: {
      color: 'black',
    },
  };

  const handleOnSubmitCatch = (values, actions) => {
    const {kind, weight, length, time, depth, method} = values;
    const newCatch = new Catch(time, kind, weight, length, time, depth, method);
    catches.push(newCatch);
    inputChangeHandler('catches', catches, true);
    toggleModal();
  };

  const onNextStepOne = () => {
    if (!formState.inputValues.title || !formState.inputValues.date) {
      setStepOneError(true);
    } else {
      setStepOneError(false);
    }
  };

  const onNextStepTwo = () => {
    if (formState.inputValues.catches.length === 0) {
      setStepTwoError(true);
    } else {
      setStepTwoError(false);
    }
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
      <ProgressSteps
        activeStepIconBorderColor="#03A9F4"
        completedStepIconColor="#03A9F4"
        completedProgressBarColor="#03A9F4"
        activeLabelColor="#03A9F4">
        <ProgressStep label="Date" onNext={onNextStepOne} errors={stepOneError}>
          <View style={styles.inputDate}>
            <Button title="Select Date" onPress={showDatePicker} />
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                timeZoneOffsetInMinutes={0}
                value={date}
                mode={mode}
                is24Hour={true}
                display="default"
                onChange={onChange}
                maximumDate={new Date()}
              />
            )}
            <Text style={styles.text}>{formState.inputValues.date}</Text>
          </View>
          <View style={styles.inputType}>
            <Text style={styles.text}>Select type of Fishing</Text>
          </View>
          <View style={styles.input}>
            <RNPickerSelect
              value={formState.inputValues.title}
              style={pickerStyle}
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
        <ProgressStep
          label="Catches"
          onNext={onNextStepTwo}
          errors={stepTwoError}>
          <View style={styles.container}>
            <View style={styles.inputDate}>
              <Text>Add new catches:</Text>
              <FormRecordButton
                onPress={() => {
                  toggleModal();
                }}
              />
            </View>
            <SafeAreaView style={styles.container}>
              <FlatList
                data={catches}
                keyExtractor={item => item.id}
                renderItem={itemData => (
                  <View style={styles.catchItems}>
                    <Text>{itemData.item.kind}</Text>
                    <Text>{itemData.item.time}</Text>
                    <Text>{itemData.item.length} cm</Text>
                    <Text>{itemData.item.weight} kg</Text>
                  </View>
                )}
              />
            </SafeAreaView>
            <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
              <ScrollView style={styles.modal}>
                <SafeAreaView style={styles.container}>
                  <Formik
                    validateOnMount
                    initialValues={{
                      kind: kindField,
                      weight: weightField,
                      length: lengthField,
                      time: timeField,
                      depth: depthField,
                      method: methodField,
                    }}
                    onSubmit={(values, actions) => {
                      handleOnSubmitCatch(values, actions);
                    }}
                    validationSchema={validationSchema}>
                    {({
                      handleChange,
                      values,
                      handleSubmit,
                      errors,
                      isValid,
                      touched,
                      handleBlur,
                    }) => (
                      <Fragment>
                        <View style={styles.textContainer}>
                          <Text style={styles.text}>Kind of Fish</Text>
                        </View>
                        <View style={styles.inputModal}>
                          <FormInput
                            name="kind"
                            value={values.kind}
                            onChangeText={
                              (setKindField(values.kind), handleChange('kind'))
                            }
                            placeholder="Kind..."
                            onBlur={handleBlur('kind')}
                          />
                        </View>
                        <ErrorMessage
                          errorValue={touched.kind && errors.kind}
                        />
                        <View style={styles.textContainer}>
                          <Text style={styles.text}>Weight of Fish (Kg)</Text>
                        </View>
                        <View style={styles.inputModal}>
                          <FormInput
                            name="weight"
                            value={values.weight}
                            onChangeText={
                              (setWeightField(values.weight),
                              handleChange('weight'))
                            }
                            placeholder="Weight..."
                            onBlur={handleBlur('weight')}
                          />
                        </View>
                        <ErrorMessage
                          errorValue={touched.weight && errors.weight}
                        />
                        <View style={styles.textContainer}>
                          <Text style={styles.text}>Length of Fish (cm)</Text>
                        </View>
                        <View style={styles.inputModal}>
                          <FormInput
                            name="length"
                            value={values.length}
                            onChangeText={
                              (setLengthField(values.length),
                              handleChange('length'))
                            }
                            placeholder="Lenght..."
                            onBlur={handleBlur('length')}
                          />
                        </View>
                        <ErrorMessage
                          errorValue={touched.length && errors.length}
                        />
                        <View style={styles.textContainer}>
                          <Text style={styles.text}>Time of Catch</Text>
                        </View>
                        <View style={styles.inputModal}>
                          <FormInput
                            name="time"
                            value={values.time}
                            onChangeText={
                              (setTimeField(values.time), handleChange('time'))
                            }
                            placeholder="Time..."
                            onBlur={handleBlur('time')}
                          />
                        </View>
                        <ErrorMessage
                          errorValue={touched.time && errors.time}
                        />
                        <View style={styles.textContainer}>
                          <Text style={styles.text}>Depth of Catch (m)</Text>
                        </View>
                        <View style={styles.inputModal}>
                          <FormInput
                            name="depth"
                            value={values.depth}
                            onChangeText={
                              (setDepthField(values.depth),
                              handleChange('depth'))
                            }
                            placeholder="Depth..."
                            onBlur={handleBlur('depth')}
                          />
                        </View>
                        <ErrorMessage
                          errorValue={touched.depth && errors.depth}
                        />
                        <View style={styles.textContainer}>
                          <Text style={styles.text}>Method of Catch</Text>
                        </View>
                        <View style={styles.inputModal}>
                          <FormInput
                            name="method"
                            value={values.method}
                            onChangeText={
                              (setMethodField(values.method),
                              handleChange('method'))
                            }
                            placeholder="Your Method..."
                            onBlur={handleBlur('method')}
                          />
                        </View>
                        <ErrorMessage
                          errorValue={touched.method && errors.method}
                        />
                        <View style={styles.buttonContainer}>
                          <FormButton
                            buttonType="outline"
                            onPress={handleSubmit}
                            title="Add Catch"
                            buttonColor="#F57C00"
                            disabled={!isValid}
                          />
                          <FormButton
                            buttonType="outline"
                            onPress={toggleModal}
                            title="Cancel"
                            buttonColor="#F57C00"
                          />
                        </View>
                        <ErrorMessage errorValue={errors.general} />
                      </Fragment>
                    )}
                  </Formik>
                </SafeAreaView>
              </ScrollView>
            </Modal>
          </View>
        </ProgressStep>
        <ProgressStep label="Submit" onSubmit={submitHandler}>
          <Input
            style={styles.description}
            id="description"
            label="Description"
            errorText="Please enter at least 5 characters!"
            keyboardType="default"
            returnKeyType="done"
            autoCapitalize="sentences"
            autoCorrect
            onInputChangeSet={setDescription}
            onInputChange={inputChangeHandler}
            initialValue={description}
            initiallyValid={description === '' ? false : true}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 10,
    marginHorizontal: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  description: {
    marginLeft: '20%',
    width: 250,
    maxWidth: 250,
  },
  inputDate: {
    margin: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  text: {
    fontSize: 16,
    fontFamily: 'open-sans-bold',
  },
  textContainer: {
    marginLeft: 30,
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
  modal: {
    flex: 1,
    marginHorizontal: '10%',
    backgroundColor: '#fff',
  },
  inputModal: {
    // marginBottom: 5,
  },
  catchItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 15,
  },
});

export default RecordForm;

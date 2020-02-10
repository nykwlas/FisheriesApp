import React, {useState} from 'react';
import {
  Platform,
  TextInput,
  StyleSheet,
  SafeAreaView,
  View,
  Text,
} from 'react-native';
import {Button} from 'react-native-elements';
// import { Ionicons } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/Ionicons';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useDispatch} from 'react-redux';
import {ProgressSteps, ProgressStep} from 'react-native-progress-steps';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import RNPickerSelect from 'react-native-picker-select';

// import FormInput from '../../components/FormInput';
// import FormButton from '../../components/FormButton';
// import ErrorMessage from '../../components/ErrorMessage';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .label('Name')
    .required()
    .min(2, 'Must have at least 2 characters'),
  email: Yup.string()
    .label('Email')
    .email('Enter a valid email')
    .required('Please enter a registered email'),
  password: Yup.string()
    .label('Password')
    .required()
    .min(6, 'Password should be at least 6 characters '),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Confirm Password must matched Password')
    .required('Confirm Password is required'),
  check: Yup.boolean().oneOf([true], 'Please check the agreement'),
});

const RecordForm = props => {
  const dispatch = useDispatch();

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState('');
  const [type, setType] = useState('');

  const placeholder = {
    label: 'Select a type...',
    value: null,
  };

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
    setDate(dateStr);
    hideDatePicker();
  };

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
            <TextInput style={styles.text} value={date} />
          </View>
          <View style={styles.inputType}>
            <Text style={styles.text}>Select type of Fishing</Text>
          </View>
          <View style={styles.input}>
            <RNPickerSelect
              placeholder={placeholder}
              onValueChange={value => setType(value)}
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
        <ProgressStep>
          <View>
            <Text>Third Step</Text>
          </View>
        </ProgressStep>
      </ProgressSteps>
    </SafeAreaView>
  );
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

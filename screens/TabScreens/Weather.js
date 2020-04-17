import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Dimensions,
  StyleSheet,
  Platform,
  Image,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import Geolocation from '@react-native-community/geolocation';
import ModalFilterPicker from 'react-native-modal-filter-picker';

import * as weatherActions from '../../store/actions/weather';
import HeaderButton from '../../components/Buttons/HeaderButton';
import Loading from '../../components/Loading';
import Error from '../../components/Error';

const weatherIcons = {
  '01d': require('../../assets/weather/01d.png'),
  '01n': require('../../assets/weather/01n.png'),
  '02d': require('../../assets/weather/02d.png'),
  '02n': require('../../assets/weather/02n.png'),
  '04d': require('../../assets/weather/04d.png'),
  '04n': require('../../assets/weather/04n.png'),
  '09d': require('../../assets/weather/09d.png'),
  '09n': require('../../assets/weather/09n.png'),
  '10d': require('../../assets/weather/10d.png'),
  '10n': require('../../assets/weather/10n.png'),
  '11d': require('../../assets/weather/11d.png'),
  '11n': require('../../assets/weather/11n.png'),
  '13d': require('../../assets/weather/13d.png'),
  '13n': require('../../assets/weather/13n.png'),
  '50d': require('../../assets/weather/50d.png'),
  '50n': require('../../assets/weather/50n.png'),
};

const screenWidth = Dimensions.get('window').width;

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

function capitalizeFirstLetter(string) {
  if (!string) {
    return;
  }
  let words = [];
  string.split(' ').forEach(word => {
    words.push(word[0].toUpperCase() + word.slice(1));
  });
  return words.join(' ');
}

const Weather = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cityPicked, setCityPicked] = useState();

  const [position, setPosition] = useState({
    latitude: 35.1264,
    longitude: 33.4299,
  });

  const weatherData = useSelector(state => state.weather.weatherData);
  const forecastData = useSelector(state => state.weather.forecastData);
  const dispatch = useDispatch();

  const isEmpty = obj => {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  };

  const loadWeather = useCallback(async () => {
    setError(null);
    try {
      if (!isEmpty(cityPicked) && !(cityPicked === 'My Location')) {
        await dispatch(weatherActions.fetchWeatherData(cityPicked, null));
      } else {
        // console.log(position.longitude, position.latitude);
        await dispatch(
          weatherActions.fetchWeatherData(
            position.latitude,
            position.longitude,
          ),
        );
      }
    } catch (err) {
      console.log(err.message);
      setError(err.message);
    }
  }, [dispatch, setError, position.latitude, position.longitude, cityPicked]);

  const loadForecast = useCallback(async () => {
    setError(null);
    try {
      if (!isEmpty(cityPicked) && !(cityPicked === 'My Location')) {
        await dispatch(weatherActions.fetchForecastData(cityPicked, null));
      } else {
        await dispatch(
          weatherActions.fetchForecastData(
            position.latitude,
            position.longitude,
          ),
        );
      }
    } catch (err) {
      console.log(err.message);
      setError(err.message);
    }
  }, [dispatch, setError, position.latitude, position.longitude, cityPicked]);

  const loadData = useCallback(() => {
    setIsLoading(true);
    loadForecast().then(() => {
      loadWeather().then(() => {
        setIsLoading(false);
      });
    });
  }, [loadForecast, loadWeather]);

  const onSelectModalPicker = picked => {
    setCityPicked(picked.key);
    // loadData();
    setIsModalVisible(false);
  };

  const options = [
    {
      key: 'My Location',
      label: 'My Location',
      searchKey: 'Location',
    },
    {
      key: 'Paphos',
      label: 'Paphos',
      searchKey: 'Cyprus',
    },
    {
      key: 'Limassol',
      label: 'Limassol',
      searchKey: 'Cyprus',
    },
    {
      key: 'Nicosia',
      label: 'Nicosia',
      searchKey: 'Cyprus',
    },
    {
      key: 'Famagusta',
      label: 'Famagusta',
      searchKey: 'Cyprus',
    },
    {
      key: 'Larnaca',
      label: 'Larnaca',
      searchKey: 'Cyprus',
    },
  ];

  const toggleModal = useCallback(() => {
    setIsModalVisible(!isModalVisible);
  }, [isModalVisible]);

  useEffect(() => {
    props.navigation.setParams({searchModal: toggleModal});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggleModal]);

  const getPosition = useCallback(async () => {
    await Geolocation.getCurrentPosition(pos => {
      setPosition({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
    });
  }, []);

  useEffect(() => {
    getPosition();
    const willFocusSub = props.navigation.addListener(
      'willFocus',
      (loadWeather, loadForecast),
    );

    return () => {
      willFocusSub.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadWeather, loadForecast, setCityPicked, getPosition]);

  useEffect(() => {
    getPosition().then(() => {
      loadData();
    });
  }, [
    dispatch,
    getPosition,
    loadData,
    loadForecast,
    loadWeather,
    setCityPicked,
  ]);

  if (error) {
    return (
      <Error
        onRetry={() => {
          getPosition().then(() => {
            loadData();
          });
        }}
      />
    );
  }

  if (isLoading || isEmpty(weatherData) || isEmpty(forecastData)) {
    return <Loading />;
  }

  const transformDate = date => {
    var aestTime = new Date(date * 1000).toLocaleString('en-US', {
      timeZone: 'Cyprus',
    });
    aestTime = new Date(aestTime);
    return aestTime;
  };

  const roundNumber = num => {
    if (num) {
      return Math.round(num);
    } else {
      return '0';
    }
  };

  let forecastDetails = [];
  if (!isEmpty(weatherData)) {
    if (weatherData.dt) {
      let sR = transformDate(weatherData.sys.sunrise);
      let sS = transformDate(weatherData.sys.sunset);

      function lessThanTen(num) {
        if (num < 10) {
          return '0' + num.toString();
        }
        return num;
      }

      forecastDetails = [
        [
          {
            title: 'SUN STARTS',
            text: `${lessThanTen(sR.getHours())}:${lessThanTen(
              sR.getMinutes(),
            )}`,
          },
          {
            title: 'SUN ENDS',
            text: `${lessThanTen(sS.getHours())}:${lessThanTen(
              sS.getMinutes(),
            )}`,
          },
        ],
        [
          {
            title: 'HUMIDITY',
            text: `${weatherData.main.humidity}%`,
          },
          {
            title: 'RAIN CHANCE',
            text: `${weatherData.clouds.all}%`,
          },
        ],
        [
          {
            title: 'VISIBILITY',
            text: `${weatherData.visibility / 1000} km`,
          },
          {title: 'PRECIPITATION', text: `${0} mm`},
        ],
        [
          {
            title: 'PRESSURE',
            text: `${weatherData.main.pressure}`,
          },
        ],
      ];
    }
  }

  return (
    <ScrollView style={styles.backColor}>
      <View style={styles.flex}>
        <View style={styles.center}>
          <Text style={[styles.text, styles.fontLarge]}>
            {forecastData.city.name}
          </Text>
          <Text style={[styles.text, styles.fontSmall]}>
            {capitalizeFirstLetter(weatherData.weather[0].description)}
          </Text>
          <Text style={styles.textBigTemp}>
            {roundNumber(weatherData.main.temp)}
          </Text>
        </View>
        <View style={[styles.lineSpaced]}>
          <View style={styles.rowEnd}>
            <Text style={[styles.textDay, styles.weightBig]}>
              {weatherData.dt && days[transformDate(weatherData.dt).getDay()]}
            </Text>
            <Text style={[styles.textBoldWhite, styles.padLeft]}>
              {'TODAY'}
            </Text>
          </View>
          <View style={styles.flexDirRow}>
            <Text style={styles.textTempWhite}>
              {roundNumber(weatherData.main.temp_min)}
            </Text>
            <Text style={styles.textTempGray}>
              {roundNumber(weatherData.main.temp_max)}
            </Text>
          </View>
        </View>
        <View style={[styles.flatlist, styles.topBottomWhiteBorder]}>
          <FlatList
            horizontal
            data={forecastData.list}
            keyExtractor={item => item.dt + item.dt.toLocaleString}
            renderItem={({item, index, separators}) => (
              <View style={[styles.lineSpaced, styles.flexDirCol]}>
                <Text style={styles.text}>
                  {index === 0 ? 'Now' : transformDate(item.dt).getHours()}
                </Text>
                <Image
                  style={[styles.image, styles.margVertical]}
                  source={weatherIcons[item.weather[0].icon]}
                />
                <Text style={styles.textBoldWhite}>
                  {roundNumber(item.main.temp) + 'º'}
                </Text>
              </View>
            )}
          />
        </View>
        <View style={[styles.container, styles.bottomWhiteBorder]}>
          <FlatList
            data={forecastData.list}
            keyExtractor={item => item.dt_txt + item.dt_txt.toLocaleString} //style={[styles.lineSpaced, {paddingVertical: 5}]}
            renderItem={({item, index, separators}) => {
              if (transformDate(item.dt).getHours() === 12) {
                return (
                  <View style={[styles.lineSpaced, styles.padVertical]}>
                    <View style={styles.rowBetween}>
                      <Text style={styles.textDay}>
                        {days[transformDate(item.dt).getDay()]}
                      </Text>
                      <Image
                        style={styles.image}
                        source={weatherIcons[item.weather[0].icon]}
                      />
                    </View>
                    <View style={styles.rowEndJustify}>
                      <Text style={styles.textTempWhite}>
                        {roundNumber(item.main.temp_min)}
                      </Text>
                      <Text style={styles.textTempGray}>
                        {roundNumber(item.main.temp_max)}
                      </Text>
                    </View>
                  </View>
                );
              }
            }}
          />
        </View>
        <View
          style={[styles.container, styles.bottomWhiteBorder, styles.report]}>
          <Text style={styles.textReport}>
            {
              'In the early morning and late afternoon is the best time to fish, cooler temperatures and lower light levels allow fish to swim in shallow water for meals.'
            }
          </Text>
        </View>
        <View style={styles.container}>
          {forecastDetails.map((item4, index4) => (
            <View
              style={[styles.details, index4 === 3 ? styles.zeroBot : null]}
              key={'subarray' + index4.toString()}>
              {item4.map(i => (
                <View style={styles.detailTitle} key={i.title}>
                  <Text style={[styles.textTempGray, styles.font2Small]}>
                    {' '}
                    {i.title}{' '}
                  </Text>
                  <Text style={[styles.text, styles.fontMed]}> {i.text} </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
      <View style={styles.flex}>
        <ModalFilterPicker
          title={'Select City'}
          titleTextStyle={styles.modalTitle}
          visible={isModalVisible}
          onSelect={onSelectModalPicker}
          onCancel={toggleModal}
          options={options}
        />
      </View>
    </ScrollView>
  );
};

Weather.navigationOptions = navData => {
  const searchModal = navData.navigation.getParam('searchModal');
  return {
    headerTitle: 'Weather',
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
          title="Search"
          iconName={Platform.OS === 'android' ? 'md-search' : 'ios-search'}
          onPress={searchModal}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth,
  },
  flex: {flex: 1},
  flexDirRow: {flexDirection: 'row'},
  flexDirCol: {flexDirection: 'column'},
  rowEnd: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  rowEndJustify: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 1,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1.4,
  },
  backColor: {backgroundColor: '#00028a'},
  font2Small: {fontSize: 12},
  fontSmall: {fontSize: 18},
  fontMed: {fontSize: 28},
  fontLarge: {fontSize: 36},
  weightBig: {fontWeight: '300'},
  margVertical: {marginVertical: 20},
  padVertical: {paddingVertical: 5},
  padLeft: {paddingLeft: 10},
  image: {height: 24, width: 24},
  flatlist: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginVertical: 10,
    paddingVertical: 5,
    height: 120,
  },
  modal: {
    flex: 1,
    marginHorizontal: '10%',
    backgroundColor: '#fff',
  },
  modalTitle: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 28,
    color: 'white',
  },
  center: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  topBottomWhiteBorder: {
    borderBottomColor: '#fff',
    borderTopColor: '#fff',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
  },
  bottomWhiteBorder: {
    borderBottomColor: '#fff',
    borderBottomWidth: 0.5,
    paddingBottom: 10,
  },
  zeroBot: {borderBottomWidth: 0},
  lineSpaced: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  textReport: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '200',
    lineHeight: 20,
  },
  textBoldWhite: {
    color: '#fff',
    fontWeight: '600',
  },
  textDay: {
    fontSize: 20,
    fontWeight: '200',
    color: '#fff',
  },
  textBigTemp: {
    color: '#fff',
    fontSize: 72,
    fontWeight: '200',
  },
  textTempGray: {fontSize: 20, fontWeight: '200', color: '#aaa'},
  textTempWhite: {
    paddingHorizontal: 15,
    fontSize: 20,
    fontWeight: '300',
    color: '#fff',
  },
  text: {
    color: '#fff',
  },
  report: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  detailTitle: {flex: 1, padding: 10},
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
    borderBottomColor: '#fff',
    borderBottomWidth: 0.5,
  },
});

export default Weather;

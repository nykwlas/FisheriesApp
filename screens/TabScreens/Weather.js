import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Image,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import Icon from 'react-native-vector-icons/Ionicons';
import {Button} from 'react-native-elements';
import Colors from '../../constants/Colors';
import * as weatherActions from '../../store/actions/weather';

const OWMIcon = require('../../assets/owm_icon.png');
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const weatherData = useSelector(state => state.weather.weatherData);
  const forecastData = useSelector(state => state.weather.forecastData);
  const dispatch = useDispatch();

  const loadWeather = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(weatherActions.fetchWeatherData(146669));
    } catch (err) {
      console.log(err.message);
      setError(err.message);
    }
    setIsRefreshing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, setIsLoading, setError]);

  const loadForecast = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(weatherActions.fetchForecastData(146669));
    } catch (err) {
      console.log(err.message);
      setError(err.message);
    }
    setIsRefreshing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, setIsLoading, setError]);

  const isEmpty = obj => {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      'willFocus',
      (loadWeather, loadForecast),
    );

    return () => {
      willFocusSub.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadWeather, loadForecast]);

  const loadData = () => {
    setIsLoading(true);
    loadForecast().then(() => {
      loadWeather().then(() => {
        setIsLoading(false);
      });
    });
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, loadForecast, loadWeather]);

  if (error) {
    return (
      <View style={styles.center}>
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

  if (isLoading || isEmpty(weatherData) || isEmpty(forecastData)) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const transformDate = date => {
    var aestTime = new Date(date * 1000).toLocaleString('en-US', {
      timeZone: 'Cyprus',
    });
    aestTime = new Date(aestTime);
    return aestTime;
  };

  const generateBackgroundColor = () => {
    function s(s) {
      return Math.floor(Math.random() * s).toString();
    }

    return {
      backgroundColor: 'hsl(' + s(240) + ', ' + s(100) + '%, ' + s(30) + '%)',
    };
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
    // console.log('for' + isEmpty(forecastData));
    // console.log('we' + isEmpty(weatherData));
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
            text: `${100 - weatherData.clouds.all}%`,
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
    <ScrollView style={{backgroundColor: '#00028a'}}>
      <View style={{flex: 1}}>
        <View style={styles.centered}>
          <Text style={[styles.text, {fontSize: 36}]}>
            {forecastData.city.name}
          </Text>
          <Text style={[styles.text, {fontSize: 18}]}>
            {capitalizeFirstLetter(weatherData.weather[0].description)}
          </Text>
          <Text style={styles.textBigTemp}>
            {roundNumber(weatherData.main.temp)}
          </Text>
        </View>
        <View style={[styles.lineSpaced]}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
            }}>
            <Text style={[styles.textDay, {fontWeight: '300'}]}>
              {weatherData.dt && days[transformDate(weatherData.dt).getDay()]}
            </Text>
            <Text style={[styles.textBoldWhite, {paddingLeft: 10}]}>
              {'TODAY'}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
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
            // onRefresh={loadForecast}
            // refreshing={isRefreshing}
            horizontal
            data={forecastData.list}
            keyExtractor={item => item.dt + item.dt.toLocaleString}
            renderItem={({item, index, separators}) => (
              <View style={[styles.lineSpaced, {flexDirection: 'column'}]}>
                <Text style={styles.text}>
                  {index === 0 ? 'Now' : transformDate(item.dt).getHours()}
                </Text>
                <Image
                  style={{height: 24, width: 24, marginVertical: 20}}
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
            // onRefresh={loadForecast}
            // refreshing={isRefreshing}
            data={forecastData.list}
            keyExtractor={item => item.dt_txt + item.dt_txt.toLocaleString} //style={[styles.lineSpaced, {paddingVertical: 5}]}
            renderItem={({item, index, separators}) => {
              if (transformDate(item.dt).getHours() === 14) {
                return (
                  <View style={[styles.lineSpaced, {paddingVertical: 5}]}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        flex: 1.4,
                      }}>
                      <Text style={styles.textDay}>
                        {days[transformDate(item.dt).getDay()]}
                      </Text>
                      <Image
                        style={{height: 24, width: 24}}
                        source={weatherIcons[item.weather[0].icon]}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        flex: 1,
                      }}>
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
              style={[
                styles.details,
                index4 === 3 ? {borderBottomWidth: 0} : null,
              ]}
              key={'subarray' + index4.toString()}>
              {item4.map(i => (
                <View style={{flex: 1, padding: 10}} key={i.title}>
                  <Text style={[styles.textTempGray, {fontSize: 12}]}>
                    {' '}
                    {i.title}{' '}
                  </Text>
                  <Text style={[styles.text, {fontSize: 28}]}> {i.text} </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>

    // <View>
    //   <Text>AEL</Text>
    // </View>
  );
};

Weather.navigationOptions = navData => {
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
    width: screenWidth,
  },
  flatlist: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginVertical: 10,
    paddingVertical: 5,
    height: 120,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {
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
  lineSpaced: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  //
  //
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
  //
  //
  report: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  //
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
    borderBottomColor: '#fff',
    borderBottomWidth: 0.5,
  },
  //
  footer: {
    width: screenWidth,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderTopColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  ballWraper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ball: {
    width: 6,
    height: 6,
    borderRadius: 3,
    margin: 3,
  },
});

export default Weather;

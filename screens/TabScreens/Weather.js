import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Image,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import {Button} from 'react-native-elements';
import Colors from '../../constants/Colors';
// import {connect} from 'react-redux';
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

const WeatherForecast = props => {
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

  useEffect(() => {
    setIsLoading(true);
    loadForecast().then(() => {
      loadWeather().then(() => {
        setIsLoading(false);
      });
    });
  }, [dispatch, loadForecast, loadWeather]);

  if (error) {
    return (
      <View style={styles.center}>
        <Text>An error occurred!</Text>
        <Button
          title="Try again"
          onPress={(loadWeather, loadForecast)}
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
    <ScrollView>
      <View style={{flex: 1, backgroundColor: '#00028a'}}>
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
              'Today: Heavy rain and storm. Enjoy your time and visit my github. Temperature now is 21ºC; maximum today was 28ºC.'
            }
          </Text>
        </View>
      </View>
    </ScrollView>

    // <View>
    //   <Text>AEL</Text>
    // </View>
  );
};

export default WeatherForecast;

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
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  bottomWhiteBorder: {
    borderBottomColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
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
    borderBottomWidth: StyleSheet.hairlineWidth,
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

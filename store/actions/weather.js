import secret_token from '../../config/OpenWeatherMap/openWeatherMapConfig';
export const WEATHER_FETCH = 'WEATHER_FETCH';
export const FORECAST_FETCH = 'FORECAST_FETCH';

const transformDate = date => {
  if (!date) {
    return null;
  }
  var aestTime = new Date(date * 1000).toLocaleString('en-US', {
    timeZone: 'America/Cuiaba',
  });
  aestTime = new Date(aestTime);
  return aestTime;
};

export const fetchWeatherData = id => {
  return async (dispatch, getState) => {
    // const currentWeather = getState().weather.currentWeather;
    try {
      const url = `http://api.openweathermap.org/data/2.5/weather?id=${id}&lang=en&units=metric&APPID=${secret_token}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      const resData = await response.json();
      dispatch({
        type: WEATHER_FETCH,
        weatherData: resData,
      });
    } catch (err) {
      // send to custom analytics server
      console.log(err);
      throw err;
    }
  };
};

export const fetchForecastData = id => {
  return async (dispatch, getState) => {
    // const currentWeather = getState().weather.currentWeather;
    try {
      const url = `http://api.openweathermap.org/data/2.5/forecast?id=${id}&lang=en&units=metric&APPID=${secret_token}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      const resData = await response.json();
      // console.log(resData.cod);
      // console.log(resData.list[0].clouds.all);

      dispatch({
        type: FORECAST_FETCH,
        forecastData: resData,
      });
    } catch (err) {
      // send to custom analytics server
      console.log(err);
      throw err;
    }
  };
};

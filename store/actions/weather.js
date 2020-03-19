import secret_token from '../../config/OpenWeatherMap/openWeatherMapConfig';
export const WEATHER_FETCH = 'WEATHER_FETCH';
export const FORECAST_FETCH = 'FORECAST_FETCH';

export const fetchWeatherData = (lat, lon) => {
  return async (dispatch, getState) => {
    try {
      let url;
      if (lon === null) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${lat}&lang=en&units=metric&APPID=${secret_token}`;
      } else {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=en&units=metric&APPID=${secret_token}`;
      }
      // console.log(url);
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

export const fetchForecastData = (lat, lon) => {
  return async (dispatch, getState) => {
    try {
      let url;
      if (lon === null) {
        url = `https://api.openweathermap.org/data/2.5/forecast?q=${lat}&lang=en&units=metric&APPID=${secret_token}`;
      } else {
        url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&lang=en&units=metric&APPID=${secret_token}`;
      }
      // console.log(url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      const resData = await response.json();
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

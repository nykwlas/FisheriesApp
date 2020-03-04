import {WEATHER_FETCH, FORECAST_FETCH} from '../actions/weather';

const initialState = {
  weatherData: {},
  forecastData: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case WEATHER_FETCH:
      return {
        weatherData: action.weatherData,
        forecastData: state.forecastData,
      };
    case FORECAST_FETCH:
      return {
        weatherData: state.weatherData,
        forecastData: action.forecastData,
      };
  }
  return state;
};

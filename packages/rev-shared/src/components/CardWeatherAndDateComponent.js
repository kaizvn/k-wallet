import React from 'react';

import WeatherIconComponent from './WeatherIconComponent';

const CardWeatherAndDateComponent = ({
  weather,
  temperature,
  time,
  weatherType,
  location,
  skyType
}) => (
  <div className={`card ks-widget-weather-and-datetime ks-${weather}`}>
    <div className="ks-widget-weather-and-datetime-weather-block">
      <div className="ks-widget-weather-and-datetime-weather-block-amount">
        {temperature}
      </div>
      <div className="ks-widget-weather-and-datetime-weather-block-type">
        {weatherType}
      </div>
    </div>
    <div className="ks-widget-weather-and-datetime-datetime-block">
      <div className="ks-widget-weather-and-datetime-datetime-block-datetime">
        {time}
      </div>
      <div className="ks-widget-weather-and-datetime-datetime-block-location">
        {location}
      </div>
      <WeatherIconComponent skyType={skyType} />
    </div>
  </div>
);
export default CardWeatherAndDateComponent;

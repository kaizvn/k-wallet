import React from 'react';

const CardWeatherComponent = ({ weather, icon, temperature, location }) => (
  <div className={`card ks-widget-simple-weather-only ks-${weather}`}>
    <span className={`ks-icon wi ${icon}`} />
    <div className="ks-widget-simple-weather-only-body">
      <div className="ks-widget-simple-weather-only-block-amount">
        {temperature}
      </div>
      <div className="ks-widget-simple-weather-only-location">{location}</div>
    </div>
  </div>
);
export default CardWeatherComponent;

import React from 'react';
import Typography from '@material-ui/core/Typography';
import LocationIcon from '@material-ui/icons/LocationOn';
import GOOGLE_MAP_SKIN from '../../lib/constants/GOOGLE_MAP_SKIN';
import markerLocation from '../../public/marker.png';
import './StaticMap.scss';

const StaticMap = props => {
  const { gig = {}, size = [300, 300], zoom = 13 } = props;
  if (!gig.location) {
    return <div></div>;
  }
  const location = gig.location.coordinates.join(',');

  const styling = GOOGLE_MAP_SKIN.map(style => {
    let convertedStyle = 'style=';
    if (style.featureType) {
      convertedStyle += `feature:${style.featureType}|`;
    }
    if (style.elementType) {
      convertedStyle += `element:${style.elementType}|`;
    }
    if (style.stylers.length) {
      convertedStyle += style.stylers
        .map(s =>
          JSON.stringify(s)
            .replace(/[{}"]/g, '')
            .replace('#', '0x')
        )
        .join('&');
    }
    return convertedStyle;
  }).join('&');
  return (
    <div className="map-static__container">
      <img
        width={size[0]}
        height={size[1]}
        src={`https://maps.googleapis.com/maps/api/staticmap?center=${location}&zoom=${zoom}&scale=2&size=${size.join(
          'x'
        )}&maptype=roadmap&key=${process.env.GOOGLE_MAPS_API}&format=png&visual_refresh=true&${styling}`}
        alt={gig.location.address}
      />
      <img src={markerLocation} alt={gig.location.address} className="map-static__marker" />

      <Typography className="map-static__address">
        <LocationIcon /> {gig.location.address}
      </Typography>
    </div>
  );
};

export default StaticMap;
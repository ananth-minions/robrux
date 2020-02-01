import React, { Fragment } from 'react';
import Typography from '@material-ui/core/Typography';
import LocationIcon from '@material-ui/icons/LocationOn';
import GOOGLE_MAP_SKIN from '~/lib/constants/GOOGLE_MAP_SKIN';
import ConditionalWrap from '~/lib/hocs/withConditionalWrap';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    flexDirection: 'column',
    display: 'inline-flex',
    alignItems: 'flex-start',
    maxWidth: '100%',
  },
  mapStatic: {
    position: 'relative',
    '&:hover img[data-value="marker"]': {
      transform: 'translateX(-50%) translateY(-50%) scale(0.66)',
    },
  },
  mapStaticGoogle: {
    objectFit: 'cover',
  },
  mapStaticMarker: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transformOrigin: 'center',
    transform: 'translateX(-50%) translateY(-50%) scale(0.4)',
    transition: theme.transitions.create('transform'),
    cursor: 'pointer',
  },
  mapStaticAddress: {
    margin: theme.spacing(1, 0),
    verticalAlign: 'middle',
    display: 'flex',
  },
}));
const StaticMap = ({ gig = {}, size = [300, 300], zoom = 13, withLink, withAddress }) => {
  const classes = useStyles();
  if (!gig.location) {
    return <Fragment></Fragment>;
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
    <div className={classes.root} data-value="root">
      <ConditionalWrap
        condition={withLink}
        wrap={children => (
          <a target="_blank" href={`https://maps.google.com/?q=${location}`}>
            {children}
          </a>
        )}
      >
        <div className={classes.mapStatic}>
          <img
            data-value="map"
            className={classes.mapStaticGoogle}
            width={size[0]}
            height={size[1]}
            src={`https://maps.googleapis.com/maps/api/staticmap?center=${location}&zoom=${zoom}&scale=2&size=${size.join(
              'x'
            )}&maptype=roadmap&key=${process.env.GOOGLE_MAPS_API}&format=png&visual_refresh=true&${styling}`}
            alt={gig.location.address}
          />
          <img data-value="marker" src="/marker.png" alt={gig.location.address} className={classes.mapStaticMarker} />
        </div>
      </ConditionalWrap>
      {withAddress && (
        <Typography className={classes.mapStaticAddress} data-value="address">
          <LocationIcon /> {gig.location.address}
        </Typography>
      )}
    </div>
  );
};

export default StaticMap;

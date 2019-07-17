import React, { Component, Fragment } from 'react';

// components:
import Marker from './Marker';

// examples:
import GoogleMap from './GoogleMap';

// consts
import BRUX_CENTER from '../../__TEMP/_constants/brux_center';
import STYLES from '../../__TEMP/_constants/styles';
import config from 'config';
import ApolloClient, { gql } from 'apollo-boost';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  mapContainer: {
    borderRadius: `${theme.shape.borderRadius * 3}px`,
    height: '300px',
    margin: theme.spacing(1),
    boxShadow: theme.shadows[2],
    overflow: 'hidden',
  },
  gigslist: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
  pro: {
    padding: theme.spacing(2),
    color: theme.palette.alternateColor,
    backgroundColor: '#EEE',
    position: 'relative',
    display: 'flex',
  },
  title: { fontWeight: 'bold' },
  name: {
    color: 'gray',
  },
  rating: {
    color: 'darkorange',
    marginBottom: theme.spacing(2),
  },
  price: {
    position: 'absolute',
    background: theme.palette.alternateColor,
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    bottom: 0,
    right: 0,
    color: 'white',
    borderRadius: `0 0 ${theme.shape.borderRadius}px 0`,
  },
  details: {
    flexGrow: 1,
  },
  avatar: {
    width: '64px',
    height: '64px',
    marginRight: theme.spacing(1),
  },
  avatarImg: {
    borderRadius: '50%',
  },
});

// Return map bounds based on list of gigs
const getMapBounds = (map, maps, gigs) => {
  const bounds = new maps.LatLngBounds();

  gigs.forEach(place => {
    bounds.extend(new maps.LatLng(place.location.coordinates[0], place.location.coordinates[1]));
  });
  return bounds;
};

// Re-center map when resizing the window
const bindResizeListener = (map, maps, bounds) => {
  maps.event.addDomListenerOnce(map, 'idle', () => {
    maps.event.addDomListener(window, 'resize', () => {
      map.fitBounds(bounds);
    });
  });
};

// Fit map to its bounds after the api is loaded
const apiIsLoaded = (map, maps, gigs) => {
  // Get bounds by our gigs
  const bounds = getMapBounds(map, maps, gigs);
  // Fit map to bounds
  map.fitBounds(bounds);
  // Bind the resize listener
  bindResizeListener(map, maps, bounds);
};

const createMapOptions = maps => {
  return {
    maxZoom: 15,
    // minZoom: 9,
    // minZoomOverride: true,
    panControl: false,
    fullscreenControl: false,
    mapTypeControl: false,
    scrollwheel: false,
    styles: STYLES,
    clickableIcons: false,
  };
};

class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      limit: 20,
      gigs: [],
      bbox: [],
    };
    this._fetchGigs = this._fetchGigs.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onMarkerClick = this._onMarkerClick.bind(this);
    this._onChildMouseEnter = this._onChildMouseEnter.bind(this);
    this._onChildMouseLeave = this._onChildMouseLeave.bind(this);
  }

  _fetchGigs() {
    const client = new ApolloClient({
      uri: `${config.WEBPACK_SERVER_URL}/graphql`,
    });

    client
      .query({
        query: gql`
          {
            gigs(limit: ${this.state.limit}, sort: "-_rating", bbox: ${JSON.stringify(this.state.bbox)}) {
              _id
              _providerName
              _rating
              title
              price
              images
              location {
                coordinates
              }
            }
          }
        `,
      })
      .then(result => this.setState({ gigs: result.data.gigs }));
  }

  _onChange(center, zoom, bounds, marginBounds) {
    // NW [lat, long] + NE + SE + SW + NW (again)
    const bbox = [
      [marginBounds.nw.lat, marginBounds.nw.lng],
      [marginBounds.ne.lat, marginBounds.ne.lng],
      [marginBounds.se.lat, marginBounds.se.lng],
      [marginBounds.sw.lat, marginBounds.sw.lng],
      [marginBounds.nw.lat, marginBounds.nw.lng],
    ];
    // console.log(zoom);

    this.setState({ bbox }, () => {
      this._fetchGigs();
    });
  }

  _onMarkerClick(gig) {
    // console.log(gig);
  }

  _onChildMouseEnter(key, childProps) {
    // console.log(key, childProps);
    // const index = this.props.markers.findIndex(m => m.get('_id') === markerId);
    // if (this.props.onMarkerHover) {
    //   this.props.onMarkerHover(index);
    // }
  }

  _onChildMouseLeave() {
    if (this.props.onMarkerHover) {
      // this.props.onMarkerHover(-1);
    }
  }

  render() {
    const { gigs } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.mapContainer}>
          <GoogleMap
            defaultZoom={13}
            defaultCenter={BRUX_CENTER}
            resetBoundsOnResize={true}
            onChildMouseEnter={this._onChildMouseEnter}
            onChildMouseLeave={this._onChildMouseLeave}
            onChange={({ center, zoom, bounds, marginBounds }) => this._onChange(center, zoom, bounds, marginBounds)}
            yesIWantToUseGoogleMapApiInternals
            options={createMapOptions}
            // onGoogleApiLoaded={({ map, maps }) => apiIsLoaded(map, maps, gigs)}
          >
            {gigs.map(gig => {
              return (
                <Marker
                  key={gig._id}
                  text={gig.title}
                  onClick={() => this._onMarkerClick(gig)}
                  lat={gig.location.coordinates[0]}
                  lng={gig.location.coordinates[1]}
                />
              );
            })}
          </GoogleMap>
        </div>
        {gigs.length && (
          <Grid container spacing={2} className={classes.gigslist}>
            {gigs.map(gig => {
              return (
                <Grid item xs={6} sm={4} md={3} key={gig._id}>
                  <Paper className={classes.pro}>
                    <div className={classes.avatar}>
                      <img className={classes.avatarImg} src={gig.images[0]} alt={gig._providerName} />
                    </div>
                    <div className={classes.details}>
                      <p className={classes.title}>{gig.title}</p>
                      <p className={classes.name}>{gig._providerName}</p>
                      <p className={classes.rating}>
                        <label>★ {Math.round(gig._rating * 100) / 100}</label>
                      </p>
                      <div className={classes.price}>{gig.price}€/h</div>
                    </div>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        )}
      </div>
    );
  }
}

// Map.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

export default withStyles(styles)(Map);
// export default Map;

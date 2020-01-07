import React, { useState, useEffect, useContext } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import Router from 'next/router';
import Grid from '@material-ui/core/Grid';
import { WebsiteHeaderLayout } from '~/lib/layouts/WebsiteHeaderLayout';
import withApollo from '~/lib/hocs/withApollo';
import { GlobalContext } from '~/lib/contexts/GlobalContext';
import { TranslationsContext } from '~/lib/contexts/TranslationsContext';
import { SEARCH_BBOX_GIG } from '~/lib/graphql/gigs.strings';
import CITIES from '~/lib/constants/CITIES';
import Map from '~/components/Map/Map';
import Breadcrumb from '~/components/Breadcrumb/Breadcrumb';
import SmallGigsList from '~/components/Gig/SmallGigsList';

const Browse = props => {
  const [bbox, setBbox] = useState([]);
  const [searchingFor, setSearchingFor] = useState(props.searchingFor || '');
  const [searchingInLocation, setSearchingInLocation] = useState(props.inLocation || '');
  const [hovered, setHovered] = useState(null);
  const [searchBboxGigs, { data, error, loading }] = useLazyQuery(SEARCH_BBOX_GIG, {
    variables: { limit: 20, sort: '-_rating', bbox, searchingFor },
  });

  const { showMap } = useContext(GlobalContext).state;
  const { STRINGS } = useContext(TranslationsContext).state;

  useEffect(() => {
    if (bbox.length) {
      searchBboxGigs();
    }
  }, [bbox, searchingFor, searchBboxGigs]);

  // Update state when the props change
  useEffect(() => {
    setSearchingFor(props.searchingFor);
  }, [props.searchingFor]);
  useEffect(() => {
    setSearchingInLocation(props.inLocation);
  }, [props.inLocation]);

  let gigs = { data: (data && data.gigs) || undefined, loading };

  const onMapBoundsChange = (center, zoom, bounds, marginBounds) => {
    let bbox = [];
    if (typeof marginBounds == 'boolean') {
      bbox = [
        [bounds.sw[0], bounds.ne[1]],
        bounds.ne,
        [bounds.ne[0], bounds.sw[1]],
        bounds.sw,
        [bounds.sw[0], bounds.ne[1]],
      ];
    } else {
      // INFO: This is how coordinates are stored NW [lat, long] + NE + SE + SW + NW (again)
      bbox = [
        [marginBounds.nw.lat, marginBounds.nw.lng],
        [marginBounds.ne.lat, marginBounds.ne.lng],
        [marginBounds.se.lat, marginBounds.se.lng],
        [marginBounds.sw.lat, marginBounds.sw.lng],
        [marginBounds.nw.lat, marginBounds.nw.lng],
      ];
    }
    setBbox(bbox, searchingFor);
  };

  const onGigClick = gig => {
    Router.push({
      pathname: `/service/view/${gig.slug || gig._id}`,
    });
  };

  const onHoverEnters = (key, childProps) => {
    setHovered(key);
  };

  const onHoverLeaves = () => {
    setHovered(null);
  };

  return (
    <Grid container className="home-page__container" spacing={1}>
      {!!searchingFor && (
        <Grid container>
          <Breadcrumb
            links={[
              { href: '/', text: STRINGS.SITE_NAME },
              searchingInLocation &&
                CITIES[searchingInLocation] && {
                  href: `/browse?location=${searchingInLocation}`,
                  text: CITIES[searchingInLocation].name,
                },
              { href: '', text: searchingFor },
            ].filter(Boolean)}
          />
        </Grid>
      )}
      <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
        {showMap && (
          <Map
            gigs={gigs}
            city={searchingInLocation}
            hovered={hovered}
            mapServiceProvider="osm"
            maxZoom={16}
            _onMapBoundsChange={onMapBoundsChange}
            _onMarkerClick={onGigClick}
            _onMapChildMouseEnter={onHoverEnters}
            _onMapChildMouseLeave={onHoverLeaves}
          />
        )}
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6} xl={8}>
        <SmallGigsList
          gigs={gigs}
          hovered={hovered}
          _onMouseEnter={onHoverEnters}
          _onMouseLeave={onHoverLeaves}
          _onClick={onGigClick}
        />
      </Grid>
    </Grid>
  );
};

Browse.getInitialProps = async ctx => {
  const { query } = ctx;

  return { searchingFor: query.search, inLocation: query.location };
};

Browse.Layout = WebsiteHeaderLayout;

export default withApollo(Browse);

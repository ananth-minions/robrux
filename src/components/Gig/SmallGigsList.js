import React, { useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { trackWindowScroll } from 'react-lazy-load-image-component';
import SmallGig from './SmallGig';
import Typography from '@material-ui/core/Typography';
import { GlobalContext } from '~/lib/contexts/GlobalContext';

const styles = theme => ({
  'small-gigs-list__container': {
    flex: 1,
    padding: theme.spacing(0, 1),
  },
});

const SmallGigsList = (props, { scrollPosition }) => {
  const { classes, gigs, hovered, _onMouseEnter, _onMouseLeave, _onClick } = props;
  const { STRINGS } = useContext(GlobalContext).state;

  if (gigs.data !== undefined && gigs.data.length === 0 && gigs.loading === false) {
    return (
      <Typography variant="subtitle1" component="h4" align="left">
        {STRINGS.BROWSE_NO_RESULTS}
      </Typography>
    );
  }
  const data = gigs.loading ? [false, false] : gigs.data || [];

  return (
    <Grid container spacing={2} className={classes['small-gigs-list__container']}>
      {data.map((gig, index) => (
        <Grid item xs={12} sm={4} md={6} lg={6} xl={6} key={index}>
          <SmallGig
            scrollPosition={scrollPosition}
            hovered={hovered === gig._id}
            gig={gig}
            loading={gigs.loading}
            _onMouseEnter={_onMouseEnter}
            _onMouseLeave={_onMouseLeave}
            _onClick={_onClick}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default withStyles(styles)(trackWindowScroll(SmallGigsList));

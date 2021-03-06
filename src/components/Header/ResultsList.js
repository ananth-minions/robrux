import React from 'react';
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';

import Result from './Result';

const useStyles = makeStyles(theme => ({
  'result-list__container': {
    backgroundColor: theme.palette.background.default,
    position: 'absolute',
    padding: 0,
    width: '100%',
    maxHeight: 'calc(100vh - 160px)',
    overflow: 'scroll',
    boxShadow: theme.shadows[2],
    borderRadius: `0 0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px`,
  },
}));

export default function ResultsList({ results, searching }) {
  const classes = useStyles();
  return (
    <Grid item>
      <List dense className={classes['result-list__container']}>
        {results.map((result, idx) => (
          <Result
            key={idx}
            searching={(!!result._id && searching) || ''}
            result={result}
            isLast={results.length === idx + 1}
            isClickable={!!result._id}
          />
        ))}
      </List>
    </Grid>
  );
}

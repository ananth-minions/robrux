import React, { Fragment } from 'react';
import { useTheme, withStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Highlighter from 'react-highlight-words';
import Link from '~/lib/hocs/withLink';
import ConditionalWrap from '~/lib/hocs/withConditionalWrap';

const classes = theme => ({
  divider: {
    height: 32,
    alignSelf: 'center',
    margin: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  title: {
    color: theme.palette.primary.main,
  },
  'result-list__result-highlighted': {
    backgroundColor: theme.palette.grey[300],
    padding: theme.spacing(0.25, 0.5),
    margin: theme.spacing(0, -0.25),
  },
  rating: {
    color: theme.custom_palette.warning,
    fontWeight: 'bold',
    flexShrink: 0,
    alignSelf: 'center',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
});

const Result = ({ searching, result, isLast, isClickable, classes }) => {
  const handleResultClick = () => {};
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  const trimWords = (str, search, wordsCount = matches ? 13 : 5) => {
    const words = str.split(' ');
    const regex = new RegExp(`${search}`, 'ig');
    const index = words.findIndex(word => word.match(regex));
    const start = index - wordsCount < 0 ? 0 : index - wordsCount;
    return (
      (start === 0 ? '' : '… ') +
      words
        .slice(start < 0 ? 0 : start, index + wordsCount + (wordsCount - index > 0 ? wordsCount - index : 0))
        .join(' ')
        .trim() +
      (index + wordsCount > words.length ? '' : '…')
    );
  };

  const strippedString = str => str.replace(/(<([^>]+)>)/gi, '');

  return (
    <Fragment>
      <ConditionalWrap
        condition={isClickable}
        wrap={children => (
          <Link href={`/service/view/${result.slug || result._id}`} underline="none">
            {children}
          </Link>
        )}
      >
        <ListItem alignItems="flex-start" button={isClickable} onClick={handleResultClick}>
          {result?._userId?.avatar && (
            <ListItemAvatar>
              <Avatar src={result._userId.avatar} alt={`${result._userId.firstName} ${result._userId.lastName}`} />
            </ListItemAvatar>
          )}
          <ListItemText
            className={classes.title}
            primary={
              <Highlighter
                highlightClassName={classes['result-list__result-highlighted']}
                highlightTag="strong"
                searchWords={[searching]}
                textToHighlight={result.title}
              />
            }
            secondary={
              <Highlighter
                highlightClassName={classes['result-list__result-highlighted']}
                highlightTag="strong"
                searchWords={[searching]}
                textToHighlight={
                  result._id ? trimWords(strippedString(result.richDescription), searching) : result.richDescription
                }
              />
            }
          />
          {!!isClickable && <Divider className={classes.divider} orientation="vertical" />}
          {!!isClickable && (
            <Typography className={classes.rating} variant="subtitle2">
              ★ {result._rating.toFixed(2)}
            </Typography>
          )}
        </ListItem>
      </ConditionalWrap>
      {!isLast && <Divider variant="inset" component="li" />}
    </Fragment>
  );
};

export default withStyles(classes)(Result);

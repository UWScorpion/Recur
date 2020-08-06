import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import 'src/assets/images/recur_main_logo.svg'

const useStyles = makeStyles((theme) => ({
  logoMain: {
    fontWeight: 800,
  },
  logoSecond: {
    fontWeight: 100,
  },
  logoThird: {
    fontSize: '1.125rem',
    fontWeight: 400,
    lineHeight: 1.5,
    color: '#202020',
  },
}));

export default (function Logo(props) {
  const classes = useStyles();

  return (
    <Box textAlign="center" >
      <svg style={{ width: 307, height: 361 }}>
        <use xlinkHref={ `#recur_main_logo` }></use>
      </svg>
      <Box display="flex" justifyContent="center" mt={4} mb={1}>
        <Typography className={classes.logoMain} variant="h4" color="textPrimary">Recur</Typography>
        <Box ml={1}>
          <Typography className={classes.logoSecond} variant="h4" color="primary">by Buildschool</Typography>
        </Box>
      </Box>
      <Typography className={classes.logoThird}>Learn to code. For Free.</Typography>
    </Box>
  );
});

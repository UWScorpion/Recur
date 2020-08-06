import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

const Loading = () => (
  <Grid container justify="center">
    <Box p={10}>
      <CircularProgress disableShrink />
    </Box>
  </Grid>
);

export default Loading;

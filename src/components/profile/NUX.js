import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dateformat from 'dateformat'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import 'src/assets/images/logo.svg'
import 'src/assets/images/student-placeholder.svg'

const STAGE = {
}

const useStyles = makeStyles(theme => ({
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default (function NUX(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const [stage, setStage] = useState(STAGE.INTRO);

  useEffect(() => {
    // fetch relevant data
    switch (stage) {
      default:
        break;
    }
  }, [stage]);

  const getSubtitle = (stage) => {
    switch (stage) {
      default:
        return '';
    }
  };

  const getNav = (stage) => {
    var stages = Object.values(STAGE);
    switch (stage) {
      default:
        return null;
    }
  };

  const getContent = (stage) => {
    switch (stage) {
      default:
        return null;
    }
  };

  if (!user || !user.data || user.data.web_nux_state === 1000) {
    return null;
  }
  return (
    <Dialog fullScreen={true} open={true} TransitionComponent={Transition}>
      <DialogContent>
        <Container maxWidth="md">
          <Box textAlign="center" py={3}>
            <svg style={{ height: 100 }}>
              <use xlinkHref={ `#logo` }></use>
            </svg>
          </Box>
          <Box bgcolor="#373D4E" borderRadius={10} py={7} px={8}>
            <Grid container direction="row" justify="space-between" alignItems="center">
              <Grid item xs={10}>
                <Typography className={classes.white} variant="h2">Welcome to Buildschool!</Typography>
              </Grid>
              <Grid item>
                {getNav(stage)}
              </Grid>
            </Grid>
            <Box mb={3} mt={1}>
              <Typography className={classes.white} variant="subtitle1">{getSubtitle(stage)}</Typography>
            </Box>
            {getContent(stage)}
          </Box>
        </Container>
      </DialogContent>
    </Dialog>
  );
});

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CheckpointSymbol from 'src/components/page/checkpoints/CheckpointSymbol';
import { actionGetSelectedPage } from 'src/actions/actions';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import _Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { withStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  grid: {
    '&:hover $hoverGrid': {
      display: 'block',
    }
  },
  item: {
    cursor: 'pointer',
    '&:hover $hoverItem': {
      display: 'block',
    }
  },
  hoverGrid: {
    display: 'none',
  },
  hoverItem: {
    cursor: 'pointer',
    display: 'none',
  },
}));

const Stepper = withStyles(theme => ({
  root: {
    padding: theme.spacing(3, 3, 0, 3),
  },
  alternativeLabel: {
    alignItems: 'stretch',
  },
}))(_Stepper);

export default (function Checkpoints(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const checkpoints = useSelector(state => state.checkpoints);
  const session = useSelector(state => state.session);
  const pages = useSelector(state => state.pages);
  const selectedPage = useSelector(state => state.selectedPage);

  const selectPage = (item) => {
    for (var ii = 0; ii < pages.length; ii++) {
      if (pages[ii].id === item.data.start_page_id) {
        dispatch(actionGetSelectedPage(pages[ii]));
      }
    }
  };

  const isInCurrentCheckpoint = (item) => {
    if (!pages || pages.length === 0) {
      return false;
    }
    var in_range = false;
    for (var ii = 0; ii < pages.length; ii++) {
			if (pages[ii].id === item.data.start_page_id) {
				in_range = true;
			}
      if (in_range && pages[ii].id === selectedPage.id) {
        return true;
      }
			if (pages[ii].id === item.data.page_id) {
				in_range = false;
			}
    }
    return false;
  };

  // to avoid extra computation, we're computing state client side for real time updates
  // to pages. other locations using checkpoints will need a hard refresh to update.
  const getCompleteState = (item) => {
    if (!pages || pages.length === 0) {
      return 0;
    }
    var states = [];
    var in_range = false;
    for (var ii = 0; ii < pages.length; ii++) {
			if (pages[ii].id === item.data.start_page_id) {
				in_range = true;
			}
      if (in_range) {
        states.push(pages[ii].viewer_data.complete);
      }
			if (pages[ii].id === item.data.page_id) {
				in_range = false;
			}
    }
    if (states.filter(e => e === 2).length === states.length) {
      return 2;
    } else if (states.filter(e => e === 3).length > 0) {
      return 3;
    } else if (states.filter(e => e === 0).length !== states.length) {
      return 1;
    } else {
      return 0;
    }
  };

  if (checkpoints.length === 0) {
    return null;
  }
  var step = 0;
  checkpoints.forEach((item, i) => {
    if (isInCurrentCheckpoint(item)) {
      step = i;
    }
  });
  return (
    <Box borderBottom="1px solid #f0f0f0" mb={1}>
      <Grid className={classes.grid} container direction="row" justify="center" alignItems="center">
        <Stepper alternativeLabel nonLinear activeStep={step} connector={<div />}>
          {checkpoints.map((item, i) => {
            return (
              <Step key={item.id} className={[classes.item, step === i ? classes.active : ''].join(' ')} completed={getCompleteState(item) === 2}>
                <StepLabel
                  onClick={() => selectPage(item)}
                  StepIconComponent={CheckpointSymbol}
                  StepIconProps={{ item: item, stepidx: i, complete: getCompleteState(item) }}>
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Grid>
    </Box>
  );
});

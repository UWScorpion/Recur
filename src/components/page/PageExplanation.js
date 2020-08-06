import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actionUnsetFormData } from 'src/actions/actions';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import HOCPage from 'src/components/page/HOCPage';
import { parsePage } from 'src/requests/courseRequests';
import { readQuery, mutateQuery, customQuery, escapeData } from 'src/utils/API/queryAPI';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  paper: {
    width: 500,
    padding: theme.spacing(2),
    paddingRight: theme.spacing(3),
  },
  fail: {
    backgroundColor: '#FF7B7B',
  },
  success: {
    backgroundColor: '#B8E986',
  },
}));

export default (function PageExplanation(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const selectedFormData = useSelector(state => state.selectedFormData);
  const ref = useRef(null);
  const page = props.page;

  useEffect(() => {
    if (selectedFormData._is_submitted) {
      if (selectedFormData._header) {
        ref.current && ref.current.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    }
  }, [selectedFormData._is_submitted]);

  if (!selectedFormData._header || !selectedFormData._is_submitted) {
    return <div />;
  } else {
    return (
      <Paper ref={ref} className={[classes[selectedFormData._class], classes.paper].join(' ')}>
        <Grid container justify="space-between" alignItems="center">
          <Grid item xs={11}>
            <Grid item container direction="column" spacing={1}>
              <Grid item>
                <Typography color="textSecondary" variant="h6">{selectedFormData._header}</Typography>
              </Grid>
              <Grid item>
                <Typography color="textSecondary" variant="body1">{selectedFormData._message}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={1}>
            <Button size="small" onClick={() => dispatch(actionUnsetFormData({ key: '_is_submitted' }))}>
              OK
            </Button>
          </Grid>
        </Grid>
      </Paper>
    );
  }
});

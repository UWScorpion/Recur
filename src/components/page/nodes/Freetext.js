import React from 'react';
import { useDispatch } from 'react-redux';
import { actionSetFormData } from 'src/actions/actions';
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  outlined: {
		border: '1px solid #4A4A4A',
		borderRadius: 3,
  },
}));

export default (function Freetext(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { node } = props;

  const change = (event) => {
    dispatch(actionSetFormData({ key: node.id, value: event.target.value }));
  };

  return (node.data.multiline
    ? <TextField data-key={node.id} className={classes.outlined} onChange={(e) => change(e)} fullWidth variant="outlined" multiline />
    : <TextField data-key={node.id} className={classes.outlined} onChange={(e) => change(e)} fullWidth variant="outlined" />);
});

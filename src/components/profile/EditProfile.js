import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import ChangePassword from 'src/components/profile/ChangePassword';
import ChangeName from 'src/components/profile/ChangeName';

const useStyles = makeStyles(theme => ({
  cursor: {
    cursor: 'pointer',
  },
  title: {
    backgroundColor: '#FBFDFF',
    borderBottom: '2px solid #E6EBF5',
  },
  label: {
    textTransform: 'capitalize',
  },
}));

const Dialog = withStyles(theme => ({
  paper: {
    borderRadius: 8,
  },
}))(_Dialog);


export default (function EditProfile(props) {
  const classes = useStyles();
  const [selectedView, setSelectedViewer] = useState('name');

  const toggleView = (view) => {
    setSelectedViewer(view);
  };

  const onClose = () => {
    props.onClose && props.onClose();
  };

  return (
    <Dialog open={true} onClose={() => onClose()} maxWidth="xs" fullWidth={true}>
      <DialogTitle className={classes.title} disableTypography={true}>
        <Box display="flex" alignItems="center">
          <Box flexGrow={1}>
            <Typography className={classes.header} color="textPrimary" variant="h3">Edit Profile</Typography>
          </Box>
          <Button className={classes.label} onClick={props.onClose} color="primary">cancel</Button>
        </Box>
      </DialogTitle>
      {selectedView === 'name'
        ? <ChangeName onClose={() => onClose()} handleToggleView={(view) => toggleView(view)}/>
        : <ChangePassword onClose={() => onClose()}  handleToggleView={(view) => toggleView(view)}/>}
    </Dialog>
  );
});

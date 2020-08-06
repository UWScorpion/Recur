import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import _Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import ColorButton from 'src/components/button/ColorButton';
import { actionSigninUser } from 'src/actions/actions';
import { requestViewer } from 'src/requests/authRequests';
import { customQuery, uploadPhotoQuery, mutateQuery, escapeData } from 'src/utils/API/queryAPI';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import ErrorIcon from '@material-ui/icons/Error';
import Dialog from '@material-ui/core/Dialog';
import EditProfile from 'src/components/profile/EditProfile';

const REGEX_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])\S{8,99}$/;




const useStyles = makeStyles(theme => ({
  cursor: {
    cursor: 'pointer',
  },
  header: {
    fontFamily: [ 'Avenir', 'sans-serif' ],
    color: '#202020',
  },
  inputLabel: {
    marginTop: theme.spacing(3),
    display: 'inline',
    fontSize: '1rem',
  },
  inputBoxOld: {
    marginLeft: '10%',
    marginTop: theme.spacing(4),
  },
  inputBoxNew: {
    marginLeft: '10%',
    marginTop: theme.spacing(2),
  },
  errorBox: {
    marginTop: theme.spacing(1),
  },
  inputField: {
    marginTop: '3%',
    marginLeft: '10%',
    marginRight: '10%',
    width: '80%',
  },
  errorMessage: {
    display: 'inline',
    marginLeft: theme.spacing(5),
    marginRight: theme.spacing(0),
    fontSize: '0.9rem',
    color: 'red',
  },
  errorIcon: {
    color: 'red',
    fontSize: '1.2rem',
  },
  changePassword: {
    margin: '10%',
    marginTop: theme.spacing(20),
    fontSize: '1.1rem',
    width: '80%',
  },
}));


export default (function ChangePassword(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const [displayOldPassErr, setDisplayOldPassErr] = useState("");
  const [displayNewPassErr, setDisplayNewPassErr] = useState("");
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');



  const handleClose = () => {
    props.onClose();
  };

  const onSubmitChanges = () => {
    setDisplayOldPassErr(``);
    setDisplayNewPassErr(``);
    if (!oldPassword) {
      setDisplayOldPassErr(`Can't be blank`);
    } else if (newPassword.length < 8) {
      setDisplayNewPassErr('Minimum length of 8 chars');
    } else if (!newPassword.match(REGEX_PASSWORD)) {
      setDisplayNewPassErr('Must contain lowercase, uppercase, and numbers');
    } else {
      customQuery('/custom/changepassword', {
        old_pass: oldPassword,
        new_pass: newPassword,
      })
      .then(res => {
        console.log("here is the res", res);
        if (res.data.error) {
          setDisplayOldPassErr(res.data.error.message);
        } else {
          props.onClose();
        }
      })
      .catch( err => {
        console.log(err);
      })
     }};

  return (
    <Box>
      <Box px={1} className={classes.inputBoxOld}>
        <Typography className={classes.inputLabel}>Old Password</Typography>
      </Box>
      <TextField
        type="password"
        autoComplete="current-password"
        variant="outlined"
        className={classes.inputField}
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />
      <Box px={1} className={classes.errorBox}>
        <Typography className={classes.errorMessage}>{ displayOldPassErr }</Typography>
      </Box>
      <Box px={1} className={classes.inputBoxNew}>
        <Typography className={classes.inputLabel}>New Password</Typography>
      </Box>
      <TextField
        type="password"
        autoComplete="current-password"
        variant="outlined"
        className={classes.inputField}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <Box px={1} className={classes.errorBox}>
        <Typography className={classes.errorMessage}>{ displayNewPassErr }</Typography>
      </Box>
      <ColorButton className={classes.changePassword} onClick={() => onSubmitChanges()}>Change Password</ColorButton>
    </Box>
    );
});

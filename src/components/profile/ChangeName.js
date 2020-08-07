import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import _Dialog from '@material-ui/core/Dialog';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import ColorButton from 'src/components/button/ColorButton';
import CameraIcon from 'src/assets/images/icon_camera.png';
import IconButton from '@material-ui/core/IconButton';
import { actionSigninUser } from 'src/actions/actions';
import { requestViewer } from 'src/requests/authRequests';
import { uploadPhotoQuery, mutateQuery, escapeData } from 'src/utils/API/queryAPI';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import 'src/assets/images/placeholder_photo.svg';
import ErrorIcon from '@material-ui/icons/Error';

const PHOTO_SIZE = 100;

const useStyles = makeStyles(theme => ({
  cursor: {
    cursor: 'pointer',
  },
  header: {
    fontFamily: [ 'Avenir', 'sans-serif' ],
    color: '#202020',
  },
  subheader: {
    fontSize: '1.25rem',
    fontFamily: [ 'Avenir', 'sans-serif' ],
    fontWeight: 600,
    lineHeight: 1.5,
    color: '#202020',
    marginBottom: theme.spacing(1.5),
  },
  text: {
    fontSize: '1.25rem',
    width: '100%',
  },
  insidetext: {
    borderRadius: 10,
  },
  CameraIconSize: {
    width:'30%',
    height:'30%',
  },
  error: {
    fontSize: '1.125rem',
    fontFamily: [ 'Avenir', 'sans-serif' ],
    fontWeight: 500,
    color: '#D0021B',
    marginBottom: theme.spacing(1),
  },
  changePassword: {
    cursor: 'pointer',
    paddingTop: '10%',
    marginLeft: '30%',
    fontSize: '1.1rem',
  },
}));

const Dialog = withStyles(theme => ({
  paper: {
    borderRadius: 8,
  },
}))(_Dialog);

export default (function ChangeName(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [firstName, setFirstName] = useState(user.data.first_name || '');
  const [lastName, setLastName] = useState(user.data.last_name || '');

  const onFileUpload = (event) => {
    setLoading(true);
    setError(null);
    alert('Uploading functionality has not been implemented');
  };

  const onSave = (photo_id) => {
    if (!firstName || !lastName){
      setError('Please enter a valid name');
      return;
    } else {
      setLoading(true);
      setError(null);
      var data = {
        first_name: firstName,
        last_name: lastName,
      };
    }
    if (photo_id) {
      data.photo_ids = [photo_id];
    }
    mutateQuery(`profile(id:"${user.id}" data:"${escapeData(data)}")`).then(res => {
      setLoading(false);
      return requestViewer();
    }).then(profile => {
      dispatch(actionSigninUser(profile))
      props.onClose();
    }).catch(err => setError(err.message || err.log || err));
  };

  return (
    <Box p={4}>
      <Box position="relative" margin="0 auto" width={PHOTO_SIZE} mb={6}>
        <Avatar style={{ width: PHOTO_SIZE, height: PHOTO_SIZE, marginRight: PHOTO_SIZE / 4 }}>
          {user.photo
            ? <img src={user.photo.data.files[1].path} height={PHOTO_SIZE} />
            : <svg style={{ height: PHOTO_SIZE, width: '100%' }}><use xlinkHref={`#placeholder_photo`}></use></svg>}
        </Avatar>
        <Box position="absolute" bottom={-14} right={-30}>
          <IconButton disabled={loading} variant="outlined" component="label">
            <img className = {classes.CameraIconSize} src = {CameraIcon} alt = 'AddPhoto'/>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              type="file"
              onChange={(e) => onFileUpload(e)}
            />
          </IconButton>
        </Box>
      </Box>
      <Box mb={2}>
        <Typography className={classes.subheader} color="textPrimary" variant="subtitle1">First Name</Typography>
        <TextField
          className={classes.text}
          variant="outlined"
          InputProps={{ className: classes.insidetext }}
          onChange={(e) => setFirstName(e.target.value)}
          value={firstName}
        />
      </Box>
      <Box mb={2}>
        <Typography className={classes.subheader} color="textPrimary" variant="subtitle1">Last Name</Typography>
        <TextField
          className={classes.text}
          variant="outlined"
          InputProps={{ className: classes.insidetext }}
          onChange={(e) => setLastName(e.target.value)}
          value={lastName}
        />
      </Box>
      {error
        ? <Typography className={classes.error} color="textPrimary" variant="body1">{error}</Typography>
        : null}
      <ColorButton disabled={loading} onClick={() => onSave()} style={{ marginBottom: '5%'}}>Save</ColorButton>
      <Link className={classes.changePassword} onClick={() => props.handleToggleView('password') }>Change Password</Link>
    </Box>
  );
});

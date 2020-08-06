import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import PersonIcon from '@material-ui/icons/Person';
import { mutateQuery } from 'src/utils/API/queryAPI';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { queryGuard } from 'src/utils/queryGuard';
import { requestFriends, requestFriendRequests, requestFriendRequestsReceived } from 'src/requests/studentRequests';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0.25, 0.5),
    display: 'flex',
    alignItems: 'center',
    width: '40vw',
    borderRadius: 50,
  },
  container: {
    backgroundColor: '#f7f8f9',
    height: '100vh',
  },
  listItem: {
    padding: theme.spacing(1),
    marginTop: '0.75rem',
    marginBottom: '0.5rem',
    marginLeft: '0.5rem',
  },
  friendTypography: {
    padding: theme.spacing(0, 3),
    color: '#9e9e9e',
  },
  requestTypography: {
    padding: theme.spacing(0, 3),
  },
  profilePhoto: {
    marginTop: theme.spacing(1),
  },
  submit: {
    padding: theme.spacing(1),
  },
}));

const AddButton = withStyles(theme => ({
  root: {
    fontSize: '1rem',
    padding: theme.spacing(1, 3),
    border: '1px solid #4A4A4A',
    width: theme.spacing(10),
    justify: 'right',
    margin: '0 auto',
    marginRight: '0.5rem',
    borderRadius: 50,
    textTransform: 'none',
    lineHeight: 1,
    color: '#4A4A4A',
    backgroundColor: '#FFC15B',
    '&:hover': {
      backgroundColor: '#FFC15B',
    },
    '&:disabled': {
      backgroundColor: '#FFC15B',
    },
  }
}))(Button);

const AcceptButton = withStyles(theme => ({
  root: {
    fontSize: '1rem',
    padding: theme.spacing(1, 3),
    border: '1px solid #4A4A4A',
    width: theme.spacing(10),
    justify: 'right',
    margin: '0 auto',
    marginRight: '0.5rem',
    borderRadius: 50,
    textTransform: 'none',
    lineHeight: 1,
    color: '#4A4A4A',
    backgroundColor: '#FFC15B',
    '&:hover': {
      backgroundColor: '#FFC15B',
    },
    '&:disabled': {
      backgroundColor: '#FFC15B',
    },
  }
}))(Button);

export default function Friend(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = useSelector(state => state.session.user);
  const friends = useSelector(state => state.friends);
  const friendRequests = useSelector(state => state.friendRequests);
  const friendRequestsReceived = useSelector(state => state.friendRequestsReceived);
  const { profile } = props;
  const [loading, setLoading] = useState(false);
  const isFriend = friends?.map(friend => friend.id)?.includes(profile.id);
  const isSendFriendRequest = friendRequests?.map(friendRequest => friendRequest.id)?.includes(profile.id);
  const isReceivedFriendRequest = friendRequestsReceived?.map(friendRequest => friendRequest.id)?.includes(profile.id);

  useEffect(() => {
    queryGuard(dispatch, requestFriends)(user.id);
    queryGuard(dispatch, requestFriendRequests)(user.id);
    queryGuard(dispatch, requestFriendRequestsReceived)(user.id);
  }, []);

  const sendRequest = () => {
    setLoading(true);
    mutateQuery(`profile(id:"${user.id}") {friend_sent(to_id:"${profile.id}")}`).then(res => {
      setLoading(false);
      dispatch(requestFriendRequests(user.id));
    })
  };

  const receiveRequest = () => {
    setLoading(true);
    mutateQuery(`profile(id:"${user.id}") {friend (to_id:"${profile.id}")}`).then(res => {
      setLoading(false);
      dispatch(requestFriendRequestsReceived(user.id));
      dispatch(requestFriends(user.id));
    })
  };

  const updateFriendStatus = () => {
    if (isFriend) {
      return (
        <Typography className={classes.friendTypography} variant="h5">Friends</Typography>
      );
    } else if (isSendFriendRequest) {
      return (
        <Box fontWeight="fontWeightBold">
          <Typography className={classes.requestTypography} variant="h5">Requested</Typography>
          {friendRequests.map(friendRequest => (profile => { friendRequest } ))}
        </Box>
      );
    } else if (isReceivedFriendRequest) {
      return (
        <AcceptButton className={classes.submit} disabled={loading} onClick={receiveRequest}>Accept</AcceptButton>
      );
    } else {
      return (
        <AddButton className={classes.submit} disabled={loading} onClick={sendRequest}>Add</AddButton>
      );
    }
  };

  return (
    <Grid container direction="column" justify="flex-start" alignItems="stretch">
      <Grid item>
        <Box mt={1} mb={1} display="flex">
          <Box flexGrow={0.5} pr={2}>
            <Paper className={classes.root} variant="outlined">
              <ListItemAvatar className={classes.listItem}>
                {profile.photo
                  ? <Avatar src={profile?.photo?.data?.files[1].path} />
                  : <PersonIcon fontSize="large" />}
              </ListItemAvatar>
              <ListItemText
                primaryTypographyProps={{ variant: "h4", color: "textSecondary" }}
                primary={(profile?.data?.name || "User")}
              />
              {updateFriendStatus()} 
            </Paper>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};


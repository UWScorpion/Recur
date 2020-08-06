import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { grey } from '@material-ui/core/colors';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { requestFriends, requestFriendRequestsReceived } from 'src/requests/studentRequests';
import { readQuery } from 'src/utils/API/queryAPI';
import Friend from 'src/components/profile/Friend';

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: '#f7f8f9',
    height: '100vh',
  },
  search: {
    marginTop: theme.spacing(1),
  },
  textField: {
    [`& fieldset`]: {
      borderRadius: 100,
    },
  },
  buttonProgress: {
    color: grey[100],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const SearchButton = withStyles(theme => ({
  root: {
    fontSize: '1rem',
    fontFamily: ['Avenir', 'sans-serif'],
    padding: theme.spacing(1, 3),
    border: '1px solid #4A4A4A',
    width: theme.spacing(10),
    justify: 'right',
    margin: '0 auto',
    marginLeft: '1rem',
    borderRadius: 50,
    textTransform: 'none',
    lineHeight: 1,
    color: '#4A4A4A',
    backgroundColor: '#fff',
    '&:hover': {
      backgroundColor: '#fff',
    },
    '&:disabled': {
      backgroundColor: '#fff',
    },
  },
}))(Button);

export default withRouter(function Friends(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = useSelector(state => state.session.user);
  const friends = useSelector(state => state.friends);
  const friendRequestsReceived = useSelector(state => state.friendRequestsReceived);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  useEffect(() => {
    dispatch(requestFriends(user.id));
    dispatch(requestFriendRequestsReceived(user.id));
  }, []);

  const onSubmit = () => {
    setLoading(true);
    readQuery(`profile(text_index:"${searchValue}") { photo_ids }`).then(res => {
      setLoading(false);
      var profiles = [];

      Object.values(res.data.objects).forEach(object => {
        if (object.type === "profile" && object.id !== user.id) {
          object.photo = (object.data.photo_ids || []).length > 0 ?
            (res.data.objects[object.data.photo_ids[0]] || null) : null;
          profiles.push(object);
        }
      });
      setSearchResults(profiles);
    })
  };

  const renderFriendsList = () => {
    if (loading) {
      return (
        <CircularProgress size={24} className={classes.buttonProgress} />
      );
    } else if (searchResults && searchResults.length > 0) {
      return (
        <Grid container direction="column" justify="flex-start" alignItems="stretch">
          <Typography color="textPrimary" variant="h4" paragraph={true}>Search Results</Typography>
          <Grid item xs={6}>
            <Box mt={1} mb={4} minWidth={500} height="100%">
              {searchResults.map(profile => (
                <Friend key={profile.id} profile={profile} />
              ))}
            </Box>
          </Grid>
        </Grid>
      );
    } else if ((friends && friends.length > 0) || (friendRequestsReceived && friendRequestsReceived.length > 0)) {
      return (
        <>
          <Grid container direction="column" justify="flex-start" alignItems="stretch">
            <Typography color="textPrimary" variant="h4" paragraph={true}>Requests</Typography>
            <Grid item xs={6}>
              <Box mt={1} mb={4} minWidth={500} height="100%">
                {friendRequestsReceived.map(profile => (
                  <Friend key={profile.id} profile={profile} />
                ))}
              </Box>
            </Grid>
          </Grid> 
          <Grid container direction="column" justify="flex-start" alignItems="stretch">
            <Typography color="textPrimary" variant="h4" paragraph={true}>Friends</Typography>
            <Grid item xs={6}>
              <Box mt={1} mb={4} minWidth={500} height="100%">
                {friends.map(profile => (
                  <Friend key={profile.id} profile={profile} />
                ))}
              </Box>
            </Grid>
          </Grid>
        </>
      );
    } else {
      return (
        <Grid container direction="column" justify="flex-start" alignItems="stretch">
          <Typography color="textPrimary" variant="h4" paragraph={true}>Friends</Typography>
          <Box mt={1} mb={1} display="flex">
            <Box flexGrow={0.5} pr={2}>
              <Typography color="textSecondary" variant="subtitle1">
                You aren't connected with anyone on Recur yet.
              </Typography>
            </Box>
          </Box>
          <Box>
            <Box display="flex" alignItems="center">
              <Typography color="textSecondary" variant="subtitle1">
                <Box fontWeight="fontWeightBold">Start typing to search for friends to study with!</Box>
              </Typography>
            </Box>
          </Box>
        </Grid>
      );
    }
  };
  return (
    <>
      <Grid container direction="row" justify="center">
        <Grid item xs={7}>
          <Box mb={1}>
            <Box px={5} py={5}> 
              <Grid item xs={7}>
                <Box mt={1} mb={4} minWidth={700} display="flex" alignItems="center">
                  <TextField
                    className={classes.textField}
                    fullWidth
                    variant="outlined"
                    placeholder="Search for Friends to study with"
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                  <SearchButton disabled={searchValue.length < 3 || loading} onClick={(e) => onSubmit(e)}>Search</SearchButton>
                </Box>
              </Grid>
            </Box> 
          </Box>
        </Grid>
      </Grid>
      <Grid container direction="row">
        <Grid item xs={7} xl={7}>
          <Box width="100vw" borderBottom="4px solid #DCE5E7"></Box>
        </Grid>
      </Grid>
      <Grid container direction="row" justify="center">
        <Grid item xs={7} xl={7}>
          <Box mb={12}>
            <Box px={5} py={5}>
              <Grid item xs={6}>
                <Box mt={1} mb={4} minWidth={500} height="100%">
                  {renderFriendsList()}
                </Box>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
});

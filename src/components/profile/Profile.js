import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from "react-router";
import { readQuery } from 'src/utils/API/queryAPI';
import dateformat from 'dateformat';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import CircularProgress from '@material-ui/core/CircularProgress';
import { actionSetMenuItem, actionSetTopMenuItem } from 'src/actions/actions';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  profileBox: {
    padding: theme.spacing(4, 3),
    borderRadius: 7,
  },
  container: {
    backgroundColor: '#f7f8f9',
  },
  vertical: {
    top: '50%',
    transform: 'translateY(-50%)',
  },
  circular: {
    '& circle': {
      strokeLinecap: 'round',
    },
  },
}));

const PHOTO_SIZE = 60;

export default withRouter(function Profile(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = useSelector(state => state.session.user);
  const [profile, setProfile] = useState({});
  const [photo, setPhoto] = useState(null);
  const [pointLog, setPointLog] = useState(null);

  useEffect(() => {
   var profile_id = props.match?.params?.profileID;
    if (profile_id && (profile_id !== profile.id)) {
     dispatch(actionSetTopMenuItem('people'));
     dispatch(actionSetMenuItem(profile_id));
     readQuery(`profile(id:"${profile_id}") { photo_ids point_log }`).then(res => {
       var logs = [];
       res.data.edges.forEach(e => {
          if (e.type === 'profile/point_log') {
           logs.push(res.data.objects[e.to_id]);
          }
       });
       logs.sort((a, b) => new Date(b.time_created || null).getTime() - new Date(a.time_created || null).getTime());
       var profile = res.data.objects[profile_id];
       setPointLog(logs);
       setProfile(profile);
       setPhoto((profile.data.photo_ids || []).length > 0 ? res.data.objects[profile.data.photo_ids[0]] : null);
     });
    }
  });

  if (!profile || !profile.data || pointLog === null) {
    return <></>;
  }

  var by_date = {};
  pointLog.forEach(log => {
  var day = dateformat(new Date(log.time_created), 'mmmm dS, yyyy');
    by_date[day] = by_date[day] || [];
    by_date[day].push(log);
  });
  return (
    <Box p={8} className={classes.container}>
      <Grid container direction="column" spacing={4}>
        <Grid item container direction="row" spacing={4}>
          <Grid item xs={6}>
            <Paper className={classes.profileBox}>
              <Grid container>
                <Grid item xs={2}>
                  <Avatar style={{ width: PHOTO_SIZE, height: PHOTO_SIZE, marginRight: PHOTO_SIZE / 4 }}>
                    {photo
                      ? <img src={photo.data.files[1].path} height={PHOTO_SIZE} />
                      : <svg style={{ height: PHOTO_SIZE, width: '100%' }}><use xlinkHref={`#student-placeholder`}></use></svg>}
                  </Avatar>
                </Grid>
                <Grid item xs={10}>
                  <Typography variant="h3" color="textPrimary">{profile.data.name}</Typography>
                </Grid>
              </Grid>
              <Box display="flex" flexDirection="column" mt={3}>
                <Typography variant="body1">Email: <Link target="_blank" href={'mailto:'+profile.data.email}>{profile.data.email}</Link></Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        <Grid item>
          <Paper className={classes.profileBox}>
            <Grid item xs={12}><Typography color="textPrimary" variant="h4">Activity Log</Typography></Grid>
            {Object.keys(by_date).map(day => {
              return (
                <Grid key={'points_'+day} container item direction="column" spacing={2}>
                  <Grid item>
                    <Typography color="textPrimary" variant="h5"><b>{day}</b></Typography>
                  </Grid>
                  <Grid container item direction="column">
                    {by_date[day].map(log => {
                      return <Grid key={'log_'+log.id} item xs={12}><Typography color="textPrimary" variant="h5">{log.data.reason}</Typography></Grid>;
                    })}
                  </Grid>
                </Grid>
              );
            })}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
});

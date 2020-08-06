import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import { signinRequest } from 'src/requests/authRequests';
import { loggedoutQuery } from 'src/utils/API/queryAPI';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Logo from 'src/components/signin/Logo.js';
import ColorButton from 'src/components/button/ColorButton';

const useStyles = makeStyles((theme) => ({
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
  error: {
    fontSize: '1.125rem',
    fontFamily: [ 'Avenir', 'sans-serif' ],
    fontWeight: 500,
    color: '#D0021B',
    marginBottom: theme.spacing(1),
  },
  member: {
    marginTop: theme.spacing(2),
    fontSize: '0.75rem',
    fontFamily: [ 'Avenir', 'sans-serif' ],
  },
  link: {
    color: '#202020',
    fontWeight: 700,
  },
}));

export default withRouter(function Signin(props) {
  const { history, location } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const sessionError = useSelector(state => state.session.error);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e) => {
    setLoading(true);
    dispatch(signinRequest(username.toLowerCase(), password)).then(() => {
      history.push('/platform/');
      setLoading(false);
    });
  }

  return (
    <Grid container direction="row" justify="center" alignItems="center" style={{ height: '100vh' }}>
      <Grid item xs={6} style={{ minWidth: 500 }}>
        <Logo />
      </Grid>
      <Grid item xs={6} style={{ minWidth: 500, height: '100%' }}>
        <Box borderLeft="4px solid #DCE5E7" height="100%" px={9} display="flex" alignItems="center" bgcolor="#fbfbfb" justifyContent="center">
          <Box borderRadius={10} py={4} px={6} border="2px solid #e6ebf5" bgcolor="#ffffff" width={400}>
            <Grid container direction="column" justify="flex-start" alignItems="stretch">
              <Typography className={classes.header} color="textPrimary" variant="h2" paragraph={true}>Login</Typography>
              <Box mt={1} mb={4}>
                <Typography className={classes.subheader} color="textPrimary" variant="subtitle1">Email</Typography>
                <TextField
                  className={classes.text}
                  type="email"
                  autoComplete="on"
                  variant="outlined"
                  InputProps={{ className: classes.insidetext }}
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                />
              </Box>
              <Box mb={3}>
                <Typography className={classes.subheader} color="textPrimary" variant="subtitle1">Password</Typography>
                <TextField
                  className={classes.text}
                  type="password"
                  variant="outlined"
                  InputProps={{ className: classes.insidetext }}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </Box>
              {sessionError
                ? <Typography className={classes.error} color="textPrimary" variant="body1">{sessionError}</Typography>
                : null}
              <ColorButton disabled={loading} onClick={(e) => onSubmit(e)}>Login</ColorButton>
              <Typography className={classes.member} color="textPrimary" variant="body1">
                Not a member yet? <Link className={classes.link} href="/signup/">Sign up for free</Link>
              </Typography>
             </Grid>
           </Box>
         </Box>
       </Grid>
     </Grid>
   );
});

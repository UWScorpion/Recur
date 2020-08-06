import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import { signinRequest } from 'src/requests/authRequests';
import { loggedoutQuery } from 'src/utils/API/queryAPI';
import { actionAuthError } from 'src/actions/actions';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Logo from 'src/components/signin/Logo.js';
import ColorButton from 'src/components/button/ColorButton';

const useStyles = makeStyles((theme) => ({
  fieldHeaderError: {
    color: '#D0021B',
    fontSize: '1rem',
    fontWeight: 400,
    marginLeft: theme.spacing(3),
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

const REGEX_EMAIL = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const REGEX_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])\S{8,99}$/;

export default withRouter(function Signin(props) {
  const { history, location } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const sessionError = useSelector(state => state.session.error);
  const [localErrors, setLocalErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [terms, setTerms] = useState(false);

  const onSubmit = (e) => {
    var errors = {};
    if (!firstName) {
      errors.firstName = `Can't be blank`;
    }
    if (!lastName) {
      errors.lastName = `Can't be blank`;
    }
    if (!email) {
      errors.email = `Can't be blank`;
    } else if (!email.match(REGEX_EMAIL)) {
      errors.email = `Invalid email address format`;
    }
    if (!password) {
      errors.password = `Can't be blank`;
    } else if (password.length < 8) {
      errors.password = 'Minimum length of 8 chars';
    } else if (!password.match(REGEX_PASSWORD)) {
      errors.password = 'Must contain lowercase, uppercase, and numbers';
    }
    if (!terms) {
      errors.terms = 'You must accept the terms and conditions to use this service';
    }
    setLocalErrors(errors);
    dispatch(actionAuthError(null));
    if (Object.keys(errors).length > 0) {
      return;
    }
    setLoading(true);
    loggedoutQuery('/custom/recur_signup', {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
    }).then(res => {
      setLoading(false);
      if (res.data.error) {
        var err = res.data.error;
        throw new Error(err.message || err.log || err);
      }
      return dispatch(signinRequest(email.toLowerCase(), password));
    }).then(
    ).catch(err => dispatch(actionAuthError(err.message || err.log || err)));
  }

  const renderError = (text) => {
    return text
      ? <Box className={classes.fieldHeaderError} mb={1.75}>
          {text}
        </Box>
      : null;
  };

  return (
    <Grid container direction="row" justify="center" alignItems="center" style={{ height: '100vh' }}>
      <Grid item xs={6} style={{ minWidth: 500 }}>
        <Logo />
      </Grid>
      <Grid item xs={6} style={{ minWidth: 500, height: '100%' }}>
        <Box borderLeft="4px solid #DCE5E7" height="100%" px={9} display="flex" alignItems="center" bgcolor="#fbfbfb" justifyContent="center">
          <Box borderRadius={10} py={4} px={6} border="2px solid #e6ebf5" bgcolor="#ffffff" width={400}>
            <Grid container direction="column" justify="flex-start" alignItems="stretch">
              <Typography className={classes.header} color="textPrimary" variant="h2" paragraph={true}>Sign Up</Typography>
              <Box mt={1} mb={4} display="flex">
                <Box flexGrow={0.5} pr={2}>
                  <Typography className={classes.subheader} color="textPrimary" variant="subtitle1">First Name</Typography>
                  <TextField
                    className={classes.text}
                    variant="outlined"
                    InputProps={{ className: classes.insidetext }}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder={localErrors.firstName || null}
                    value={firstName}
                  />
                </Box>
                <Box flexGrow={0.5} pl={2}>
                  <Typography className={classes.subheader} color="textPrimary" variant="subtitle1">Last Name</Typography>
                  <TextField
                    className={classes.text}
                    variant="outlined"
                    InputProps={{ className: classes.insidetext }}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder={localErrors.lastName || null}
                    value={lastName}
                  />
                </Box>
              </Box>
              <Box mb={2}>
                <Box display="flex" alignItems="center">
                  <Typography className={classes.subheader} color="textPrimary" variant="subtitle1">Email</Typography>
                  {renderError(localErrors.email)}
                </Box>
                <TextField
                  type="email"
                  autoComplete="on"
                  className={classes.text}
                  variant="outlined"
                  InputProps={{ className: classes.insidetext }}
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </Box>
              <Box mb={2}>
                <Box display="flex" alignItems="center">
                  <Typography className={classes.subheader} color="textPrimary" variant="subtitle1">Password</Typography>
                  {renderError(localErrors.password)}
                </Box>
                <TextField
                  type="password"
                  className={classes.text}
                  variant="outlined"
                  InputProps={{ className: classes.insidetext }}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </Box>
              <Box mb={2}>
                <FormControlLabel
                   control={<Checkbox
                      onChange={(e) => setTerms(!terms)}
                      checked={terms}
                    />}
                   label={
                     <Box display="inline-block">
                       I agree to the <Link target="_blank" href="https://buildschool.io/terms">terms and conditions</Link>
                     </Box>
                   }
                 />
                {renderError(localErrors.terms)}
              </Box>
              {sessionError
                ? <Typography className={classes.error} color="textPrimary" variant="body1">{sessionError}</Typography>
                : null}
              <ColorButton disabled={loading} onClick={(e) => onSubmit(e)}>Sign Up</ColorButton>
             </Grid>
           </Box>
         </Box>
       </Grid>
     </Grid>
   );
});

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { ProtectedRoute, AuthRoute, AdminRoute } from 'src/utils/routeUtil';
import configureStore from 'src/store/store';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';

import Exam from 'src/components/exam/Exam';
import Signin from 'src/components/signin/Signin';
import Signup from 'src/components/signin/Signup';
import Page from 'src/components/page/Page';
import Template from 'src/components/template/Template';
import Menu from 'src/components/menu/Menu';
import Profile from 'src/components/profile/Profile';
import Friends from 'src/components/profile/Friends';

import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import "@babel/polyfill"
import 'src/core.sass';
import 'src/assets/images/favicon.png';

const theme = responsiveFontSizes(createMuiTheme({
  palette: {
    primary: {
      main: '#3DB5E1',
    },
    secondary: {
      main: '#FFC15B',
    },
    text: {
      primary: '#4A4A4A',
      secondary: '#000000',
    },
  },
  typography: {
    h2: {
      fontWeight: 700,
      fontSize: '2.2rem',
      lineHeight: 1.5,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.5,
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.25rem',
      lineHeight: 1.5,
    },
    h5: {
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 700,
      fontSize: '0.625rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '0.92rem',
      lineHeight: 1.54,
    },
    fontFamily: [ 'Open Sans', 'sans-serif' ],
  },
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
  },
}));

const App = ({ store }) => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <Router>
        <Route exact path="/" component={() => <Redirect to="/platform/" />} />
        <AuthRoute exact path="/signin/:code" component={Signin} />
        <AuthRoute exact path="/signin" component={Signin} />
        <AuthRoute exact path="/signup" component={Signup} />
        <ProtectedRoute path="/platform" component={() =>
          <Box minHeight="100vh" minWidth={1200} display="flex">
            <Drawer style={{ width: 300, borderRight: '1px solid #ECECEC', backgroundColor: '#ffffff', overflow: 'hidden' }} variant="permanent" open>
              <Menu />
            </Drawer>
            <Box flexGrow={1}>
              <Grid container style={{ position: 'relative', overflow: 'hidden' }}>
                <Grid item xs={12}>
                  <Switch>
                    <Route exact path="/platform/content/:templateName" component={Template} />
                    <Route exact path="/platform/page/:pageID" component={Page} />
                    <Route exact path="/platform/exam/page/:pageID" component={Exam} />
                    <Route exact path="/platform/exam" component={Exam} />
                    <Route exact path="/platform/profile/:profileID" component={Profile} />
                    <Route exact path="/platform/friends" component={Friends} />
                  </Switch>
                </Grid>
              </Grid>
            </Box>
          </Box>
        } />
      </Router>
    </ThemeProvider>
  </Provider>
)

configureStore().then(store => {
  const root = document.getElementById('root');
  ReactDOM.render(<App store={store} />, root);
});

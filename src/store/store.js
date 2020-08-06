import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import rootReducer from 'src/reducers/rootReducer'
import { requestViewer } from 'src/requests/authRequests'
import Auth from 'src/utils/API/authAPI'
import { readQuery } from 'src/utils/API/queryAPI';

function configureStore() {
  return Auth.currentAuthenticatedUser()
    .then(user => requestViewer())
    .then(profile => configure(profile))
    .catch(err => configure(null));
}

function configure(user) {
  let preLoadStore = {
    session: {
      user: user,
    },
    menu: {
      width: 300,
    },
  };
  if (process.env.NODE_ENV === 'production') {
    return createStore(
      rootReducer,
      preLoadStore,
      applyMiddleware(thunk),
    );
  } else {
    return createStore(
      rootReducer,
      preLoadStore,
      applyMiddleware(thunk, logger),
    );
  }
}

export default configureStore;

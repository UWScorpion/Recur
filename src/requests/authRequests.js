import Auth from 'src/utils/API/authAPI'
import { readQuery } from 'src/utils/API/queryAPI';
import { actionSigninUser, actionAuthError } from 'src/actions/actions';

export const signinRequest = (username, password) => dispatch => {
	return Auth.signIn(username, password)
    .then(user => requestViewer())
    .then(profile => dispatch(actionSigninUser(profile)))
    .catch(err => dispatch(actionAuthError(err.message || err)));
}

export const requestViewer = () => {
  return readQuery(`viewer { photo_ids }`).then(data => {
    if (Object.values(data.data.objects).length === 0) {
      return null;
    }
    var profile = Object.values(data.data.objects).filter(o => o.type === 'profile').pop();
    profile.photo = Object.values(data.data.objects).filter(o => o.type === 'photo').pop();
    return profile;
  });
}

export const signoutRequest = () => dispatch => {
	return Auth.signOut()
    .then(() => window.location.reload(true))
    .catch(err => console.log("sign out error ", err))
}

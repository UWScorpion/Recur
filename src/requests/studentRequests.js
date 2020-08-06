import { readQuery } from 'src/utils/API/queryAPI';
import { actionGetStudents, actionGetFriends, actionGetFriendRequests, actionGetFriendRequestsReceived } from 'src/actions/actions';

export const requestStudents = () => dispatch => {
	return readQuery(`profile { photo_ids }`)
    .then(students => {
      var profiles = {};
      Object.values(students.data.objects).forEach(profile => {
        if (profile.type === 'profile') {
          if (!profile?.data?.name) {
            return;
          }
          if ((profile.data.photo_ids || []).length > 0) {
            profile.photo = students.data.objects[profile.data.photo_ids[0]];
          }
          profiles[profile.id] = profile;
        }
      });
      profiles = Object.values(profiles);
      profiles.sort((a, b) => (a.data.name).localeCompare(b.data.name));
      dispatch(actionGetStudents(profiles));
    });
}

export const requestFriendRequestsReceived = (user_id) => dispatch => {
  readQuery(`profile(id:"${user_id}") { friend_received {photo_ids} }`).then(res => {
    let friends = [];
    res.data.edges.forEach(edge => {
      let friend = res.data.objects[edge.to_id];
      friend.photo = (friend.data.photo_ids || []).length > 0 ? res.data.objects[friend.data.photo_ids[0]] || null : null;
      friends.push(friend);
    });
    dispatch(actionGetFriendRequestsReceived(friends));
  });
}

export const requestFriendRequests = (user_id) => dispatch => {
  readQuery(`profile(id:"${user_id}") { friend_sent {photo_ids} }`).then(res => {
    let friends = [];
    res.data.edges.forEach(edge => {
      let friend = res.data.objects[edge.to_id];
      friend.photo = (friend.data.photo_ids || []).length > 0 ? res.data.objects[friend.data.photo_ids[0]] || null : null;
      friends.push(friend);
    });
    dispatch(actionGetFriendRequests(friends));
  });
}

export const requestFriends = (user_id) => dispatch => {
  readQuery(`profile(id:"${user_id}") { friend {photo_ids} }`).then(res => {
    let friends = [];
    res.data.edges.forEach(edge => {
      let friend = res.data.objects[edge.to_id];
      friend.photo = (friend.data.photo_ids || []).length > 0 ? res.data.objects[friend.data.photo_ids[0]] || null : null;
      friends.push(friend);
    });
    dispatch(actionGetFriends(friends))
  });
}

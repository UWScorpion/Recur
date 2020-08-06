import { mutateQuery } from 'src/utils/API/queryAPI';

export const sendFriendRequest = (user_id, profile_id) => dispatch => {
  return mutateQuery(`profile(id:"${user_id}") {friend_sent(to_id:"${profile_id}")}`).then();
};

export const acceptFriendRequest = (id, user_id) => dispatch => {
  return mutateQuery(`profile(id:"${id}") {friend(to_id:"${user_id}")}`).then();
};
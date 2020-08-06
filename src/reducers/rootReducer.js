import { combineReducers } from 'redux';
import {
  authReducer,
  pageReducer,
  studentReducer,
  menuSelectedReducer,
  menuTopSelectedReducer,
  checkpointReducer,
  selectedFormDataReducer,
  submissionReducer,
  selectedPageReducer,
  unitReducer,
  completedLessonsReducer,
  skillScoreReducer,
  skillPageScoreReducer,
  skillsReducer,
  fileReducer,
  menuReducer,
  friendReducer,
  friendRequestReducer,
  friendRequestReceivedReducer
} from 'src/reducers/reducers';

const reducers = combineReducers({
  session: authReducer,
  units: unitReducer,
  students: studentReducer,
  pages: pageReducer,
  checkpoints: checkpointReducer,
  submissions: submissionReducer,
  completedLessons: completedLessonsReducer,
  selectedFormData: selectedFormDataReducer,
  selectedPage: selectedPageReducer,
  selectedMenuItem: menuSelectedReducer,
  selectedTopMenuItem: menuTopSelectedReducer,
  skillScores: skillScoreReducer,
  skillPageScores: skillPageScoreReducer,
  skills: skillsReducer,
  fileCache: fileReducer,
  menu: menuReducer,
  friends: friendReducer,
  friendRequests: friendRequestReducer,
  friendRequestsReceived: friendRequestReceivedReducer
});

const rootReducer = (state, action) => {
  if (action.type === 'SIGNIN_USER' && action.user === null) {
    state = {};
  }
  return reducers(state, action);
}

export default rootReducer;

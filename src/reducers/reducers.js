import { parsePage } from 'src/requests/courseRequests';
import {
  SIGNIN_USER,
  AUTH_ERROR,
  REQUEST_CHECKPOINTS,
  SELECT_MENU_ITEM,
  SELECT_TOP_MENU_ITEM,
  REQUEST_PAGES,
  COMPLETE_PAGE,
  REQUEST_SUBMISSIONS,
  REQUEST_STUDENTS,
  SET_FORM_DATA,
  UNSET_FORM_DATA,
  SELECTED_PAGE,
  COMPLETE_SELECTED_PAGE,
  REQUEST_UNITS_LESSONS,
  REQUEST_COMPLETED_LESSONS,
  UPDATE_COMPLETED_LESSON,
  REQUEST_USER_SCORES,
  UPDATE_USER_SCORE,
  REQUEST_SKILL_PAGE_SCORES,
  REQUEST_ALL_SKILLS,
  REQUEST_FILE,
  SET_MENU_WIDTH,
  FRIENDS,
  FRIEND_REQUESTS,
  FRIEND_REQUESTS_RECEIVED
} from 'src/actions/actions';
import { orderSort } from 'src/utils/utils';

export const authReducer = (state = {}, action) => {
  switch (action.type) {
    case SIGNIN_USER:
      return { user: action.user, error: null };
    case AUTH_ERROR:
      return { user: null, error: action.message };
    default:
      return state;
  }
}

export const checkpointReducer = (state = [], action) => {
  switch (action.type) {
    case REQUEST_CHECKPOINTS:
      return action.checkpoints;
    default:
      return state;
  }
}

export const menuSelectedReducer = (state = '', action) => {
  switch (action.type) {
    case SELECT_MENU_ITEM:
      return action.item
    default:
      return state;
  }
}

export const menuTopSelectedReducer = (state = '', action) => {
  switch (action.type) {
    case SELECT_TOP_MENU_ITEM:
      return action.item
    default:
      return state;
  }
}

export const pageReducer = (state = [], action) => {
  switch (action.type) {
    case REQUEST_PAGES:
      return action.pages;
    case COMPLETE_PAGE:
      var copy = state.slice();
      for (var ii = 0; ii < copy.length; ii++) {
        if (action.page_id === copy[ii].id) {
          copy[ii].viewer_data.complete = action.state;
          copy[ii].viewer_data.time_complete = Date.now();
        }
      }
      return copy;
    default:
      return state;
  }
}

export const submissionReducer = (state = [], action) => {
  switch (action.type) {
    case REQUEST_SUBMISSIONS:
      return action.submissions;
    default:
      return state;
  }
}

export const studentReducer = (state = [], action) => {
  switch (action.type) {
    case REQUEST_STUDENTS:
      return action.students;
    default:
      return state;
  }
}

export const selectedFormDataReducer = (state = [], action) => {
  switch (action.type) {
    case SELECTED_PAGE:
      return {};
    case SET_FORM_DATA:
      var copy = Object.assign({}, state);
      delete copy[action.field.key];
      copy[action.field.key] = action.field.value;
      return copy;
    case UNSET_FORM_DATA:
      var copy = Object.assign({}, state);
      delete copy[action.field.key];
      return copy;
    default:
      return state;
  }
}

export const selectedPageReducer = (state = null, action) => {
  switch (action.type) {
    case SELECTED_PAGE:
      return parsePage(Object.assign({}, action.page || {}));
    case COMPLETE_SELECTED_PAGE:
      if (state !== null) {
        var page = Object.assign({}, state);
        page.viewer_data = page.data || {};
        page.viewer_data.complete = action.state;
        page.viewer_data.time_complete = Date.now();
        return page;
      }
      return state;
    default:
      return state;
  }
}

export const unitReducer = (state = [], action) => {
  switch (action.type) {
    case REQUEST_UNITS_LESSONS:
      return action.units;
    default:
      return state;
  }
}

export const completedLessonsReducer = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_COMPLETED_LESSONS:
      return action.completed;
    case UPDATE_COMPLETED_LESSON:
      var copy = {};
      Object.keys(state).map(id => {
        copy[id] = id === action.lesson_id ? action.percentage: state[id];
      });
      copy[action.lesson_id] = action.percentage;
      return copy;
    default:
      return state;
  }
}

export const skillScoreReducer = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_USER_SCORES:
      return action.scores;
    case UPDATE_USER_SCORE:
      var copy = {};
      Object.keys(state).map(id => {
        copy[id] = id === action.skill_id ? action.score : state[id];
      });
      copy[action.skill_id] = action.score;
      return copy;
    default:
      return state;
  }
}

export const skillPageScoreReducer = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_SKILL_PAGE_SCORES:
      return action.scores;
    default:
      return state;
  }
}

export const fileReducer = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_FILE:
      var copy = Object.assign({}, state);
      copy[action.file.id] = action.file;
      return copy;
    default:
      return state;
  }
}

export const skillsReducer = (state = [], action) => {
  switch (action.type) {
    case REQUEST_ALL_SKILLS:
      return action.skills;
    default:
      return state;
  }
}

export const menuReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_MENU_WIDTH:
      var copy = Object.assign({}, state);
      copy.width = action.width;
      return copy;
    default:
      return state;
  }
}

export const friendRequestReceivedReducer = (state = [], action) => {
  switch(action.type) {
    case FRIEND_REQUESTS_RECEIVED:
      return action.friends;
    default:
      return state;
  }
}

export const friendRequestReducer = (state = [], action) => {
  switch (action.type) {
    case FRIEND_REQUESTS:
      return action.friends;
    default:
      return state;
  }
}

export const friendReducer = (state = [], action) => {
  switch (action.type) {
    case FRIENDS:
      return action.friends;
    default:
      return state;
  }
}

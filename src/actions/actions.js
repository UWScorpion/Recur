export const AUTH_ERROR = 'AUTH_ERROR';
export const COMPLETE_PAGE = 'COMPLETE_PAGE';
export const COMPLETE_SELECTED_PAGE = 'COMPLETE_SELECTED_PAGE';
export const REQUEST_CHECKPOINTS = 'REQUEST_CHECKPOINTS';
export const REQUEST_PAGES = 'REQUEST_PAGES';
export const REQUEST_STUDENTS = 'REQUEST_STUDENTS';
export const REQUEST_SUBMISSIONS = 'REQUEST_SUBMISSIONS';
export const REQUEST_UNITS_LESSONS = 'REQUEST_UNITS_LESSONS';
export const SELECT_MENU_ITEM = 'SELECT_MENU_ITEM';
export const SELECT_TOP_MENU_ITEM = 'SELECT_TOP_MENU_ITEM';
export const SELECTED_PAGE = 'SELECTED_PAGE';
export const SET_FORM_DATA = 'SET_FORM_DATA';
export const SIGNIN_USER = 'SIGNIN_USER';
export const UNSET_FORM_DATA = 'UNSET_FORM_DATA';
export const REQUEST_COMPLETED_LESSONS = 'REQUEST_COMPLETED_LESSONS';
export const UPDATE_COMPLETED_LESSON = 'UPDATE_COMPLETED_LESSON';
export const REQUEST_USER_SCORES = 'REQUEST_USER_SCORES';
export const UPDATE_USER_SCORE = 'UPDATE_USER_SCORE';
export const REQUEST_SKILL_PAGE_SCORES = 'REQUEST_SKILL_PAGE_SCORES';
export const REQUEST_ALL_SKILLS = 'REQUEST_ALL_SKILLS';
export const REQUEST_FILE = 'REQUEST_FILE';
export const SET_MENU_WIDTH = 'SET_MENU_WIDTH';
export const FRIENDS = 'FRIENDS';
export const FRIEND_REQUESTS = 'FRIEND_REQUESTS';
export const FRIEND_REQUESTS_RECEIVED = 'FRIEND_REQUESTS_RECEIVED';

export const actionAuthError = message => ({ type: AUTH_ERROR, message })
export const actionSigninUser = user => ({ type: SIGNIN_USER, user })
export const actionGetUnitsLessons = units => ({ type: REQUEST_UNITS_LESSONS, units })
export const actionGetPages = pages => ({ type: REQUEST_PAGES, pages })
export const actionGetSelectedPage = page => ({ type: SELECTED_PAGE, page })
export const actionGetCompleteSelectedPage = state => ({ type: COMPLETE_SELECTED_PAGE, state })
export const actionGetCompletePage = (page_id, state) => ({ type: COMPLETE_PAGE, update: { page_id: page_id, state: state } })
export const actionGetCheckpoints = checkpoints => ({ type: REQUEST_CHECKPOINTS, checkpoints })
export const actionSetMenuItem = (item) => ({ type: SELECT_MENU_ITEM, item })
export const actionSetTopMenuItem = (item) => ({ type: SELECT_TOP_MENU_ITEM, item })
export const actionSetFormData = field => ({ type: SET_FORM_DATA, field })
export const actionUnsetFormData = field => ({ type: UNSET_FORM_DATA,	field })
export const actionGetStudents = students => ({ type: REQUEST_STUDENTS, students })
export const actionGetSubmissions = (submissions) => ({ type: REQUEST_SUBMISSIONS, submissions })
export const actionGetCompletedLessons = completed => ({ type: REQUEST_COMPLETED_LESSONS, completed })
export const actionUpdateCompletedLesson = (lesson_id, percentage) => ({ type: UPDATE_COMPLETED_LESSON, lesson_id: lesson_id, percentage: percentage })
export const actionGetUserScores = scores => ({ type: REQUEST_USER_SCORES, scores })
export const actionUpdateUserScore = (skill_id, score) => ({ type: UPDATE_USER_SCORE, skill_id: skill_id, score: score })
export const actionGetPageSkillScores = scores => ({ type: REQUEST_SKILL_PAGE_SCORES, scores })
export const actionGetAllSkills = skills => ({ type: REQUEST_ALL_SKILLS, skills })
export const actionGetFile = file => ({ type: REQUEST_FILE, file })
export const actionSetMenuWidth = width => ({ type: SET_MENU_WIDTH, width })
export const actionGetFriendRequests = friends => ({ type: FRIEND_REQUESTS, friends })
export const actionGetFriends = friends => ({ type: FRIENDS, friends })
export const actionGetFriendRequestsReceived = friends => ({ type: FRIEND_REQUESTS_RECEIVED, friends })

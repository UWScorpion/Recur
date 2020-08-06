import { readQuery, customQuery } from 'src/utils/API/queryAPI';
import { requestLessonAndPagesFromPageID } from 'src/requests/courseRequests';
import { actionGetSubmissions } from 'src/actions/actions';

export const createSubmission = (page_id, url) => dispatch => {
  return customQuery('/custom/new_submission', {
    page_id: page_id,
    url: url,
  }).then(data => {
    dispatch(requestSubmissions());
    dispatch(requestLessonAndPagesFromPageID(page_id));
  });
}

export const requestSubmissions = () => dispatch => {
	return readQuery(`viewer { submission { page } }`)
    .then(data => {
      var edges = Object.values(data.data.edges).filter(e => e.type === 'submission/page');
      edges.forEach(e => data.data.objects[e.from_id].page_id = e.to_id);
      var items = Object.values(data.data.objects).filter(e => e.type === 'submission');
      dispatch(actionGetSubmissions(items));
    });
}

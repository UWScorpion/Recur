import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actionSetMenuItem, actionSetTopMenuItem, actionGetPages } from 'src/actions/actions';
import { requestUserScores, requestPageSkillScores, requestAllSkills } from 'src/requests/examRequests';
import { requestSelectedPage } from 'src/requests/courseRequests';
import HOCPage from 'src/components/page/HOCPage';
import Loading from 'src/components/page/Loading';
import PageNav from 'src/components/page/PageNav';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { withRouter } from "react-router";
import { queryGuard } from 'src/utils/queryGuard';

export default withRouter(function Exam(props) {
  const dispatch = useDispatch();
  const selectedPage = useSelector(state => state.selectedPage);
  const user = useSelector(state => state.session.user);
  const skillScores = useSelector(state => state.skillScores);
  const skillPageScores = useSelector(state => state.skillPageScores);
  const skills = useSelector(state => state.skills);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [noCandidates, setNoCandidates] = useState(false);
  const [completedPageIDs, setCompletedPageIDs] = useState({});
  const page_url_id = props.match?.params?.pageID;

  const loadScores = () => {
    if (loaded || loading || !user) {
      return false;
    }
    setLoading(true);
    queryGuard(dispatch, requestAllSkills)();
    dispatch(requestUserScores(user.id));
    dispatch(requestPageSkillScores());
    dispatch(actionGetPages([]));
    dispatch(requestUserScores(user.id));
  };

  useEffect(() => {
    dispatch(actionSetTopMenuItem('library'));
    dispatch(actionSetMenuItem('exam'));
    loadScores();
  }, []);

  useEffect(() => {
    selectNextPage([], [], null);
  }, [skillPageScores]);

  useEffect(() => {
    if (selectedPage && selectedPage.id !== page_url_id && selectedPage.data.is_exam) {
      props.history.push('/platform/exam/page/' + selectedPage.id);
    }
  }, [selectedPage]);

  const selectNextPage = (page_ids, pages, current_id) => {
    var found = false;
    var candidates = [];
    for (var page_id in skillPageScores) {
      if (page_id in completedPageIDs) {
        continue;
      }
      var one_at_current = false;
      var is_candidate = false;
      for (var skill_id in skillPageScores[page_id]) {
        var score = skillPageScores[page_id][skill_id];
        var user_score = skillScores[skill_id] || 1;
        if (Math.abs(user_score - score) <= 2) {
          is_candidate = true;
        }
        if (user_score - score <= 0) {
          one_at_current = true;
        }
      }
      if (is_candidate && one_at_current) {
        candidates.push(page_id);
      }
    }
    if (candidates.length > 0) {
      found = true;
      dispatch(requestSelectedPage(candidates[Math.floor(Math.random() * candidates.length)])).then(page => {
        var completed = Object.assign({}, completedPageIDs);
        completed[page.id] = 1;
        setLoaded(true);
        setLoading(false);
        setNoCandidates(false);
        setCompletedPageIDs(completed);
        if (!page.data.is_exam || (page.viewer_data.time_complete && page.viewer_data.time_complete >= (Date.now() - 604800000))) {
          selectNextPage(page_ids, pages, current_id);
        }
      });
    }
    if (!found) {
      setLoaded(true);
      setLoading(false);
      setNoCandidates(true);
    }
  };

  return (
    noCandidates
      ? <Box p={4}>
          <Typography variant="h5">{'You have completed all available questions. Try reloading the page to repeat the exam.'}</Typography>
        </Box>
      : (selectedPage
        ? <Box maxWidth={800} margin="auto">
            <Box pt={4} pb={2}>
              <Typography color="textPrimary" variant="h4">{selectedPage.data.title}</Typography>
            </Box>
            <HOCPage page={selectedPage} />
            <PageNav pageIDs={[]} pages={[]} forceNext={true} handlePrevPage={(...p) => null} handleNextPage={(...p) => selectNextPage(...p)} />
          </Box>
        : <Loading />)
  );
});

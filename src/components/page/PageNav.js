import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from "react-router";
import validate from 'uuid-validate';
import { actionSetFormData } from 'src/actions/actions';
import { completeCurrentPage } from 'src/requests/courseRequests';
import { updateUserScore } from 'src/requests/examRequests';
import { customQuery, mutateQuery, escapeData } from 'src/utils/API/queryAPI';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles, withStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  spacing: {
    marginRight: theme.spacing(2),
  },
}));

const ColorFab = withStyles(theme => ({
  root: {
    fontWeight: 600,
    textTransform: 'none',
    boxShadow: 'none',
    borderRadius: theme.spacing(4),
  },
}))(Button);

export default withRouter(function PageNav(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = useSelector(state => state.session.user);
  const pages = useSelector(state => state.pages);
  const selectedPage = useSelector(state => state.selectedPage);
  const selectedFormData = useSelector(state => state.selectedFormData);
  const selectedMenuItem = useSelector(state => state.selectedMenuItem);
  const skillScores = useSelector(state => state.skillScores);
  const skillPageScores = useSelector(state => state.skillPageScores);
  const menu = useSelector(state => state.menu);
  const [attempted, setAttempted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [feedbackText, setFeedbackText] = useState(null);
  const [showDifficulty, setShowDifficulty] = useState(false);

  useEffect(() => {
    if (selectedPage) {
      setStartTime(Date.now());
      setShowDifficulty(false);
    }
  }, [selectedPage]);

  const submitForm = () => {
    if (selectedFormData._is_submitted) {
      return;
    }
    var data = {};
    data.page_id = selectedPage ? selectedPage.id : null;
    data.form_name = selectedFormData.form_name;
    var fields = {};
    for (var key in selectedFormData) {
      if (!(key in selectedPage.data.blocks)) {
        continue;
      }
      var block = selectedPage.data.blocks[key];
      if (key.startsWith('multiple')) {
        var local_data = [];
        selectedFormData[key].forEach(ii => {
          if (validate(ii)) {
            local_data.push(ii);
          } else {
            local_data.push(block.choices[ii].text);
          }
        });
        fields[block.name || key] = local_data;
      } else {
        fields[block.name || key] = selectedFormData[key];
      }
    }
    if (Object.keys(fields).length === 0) {
      dispatch(actionSetFormData({ key: '_class', value: 'fail' }));
      dispatch(actionSetFormData({ key: '_message', value: 'Form is empty' }));
      dispatch(actionSetFormData({ key: '_header', value: 'Error' }));
      dispatch(actionSetFormData({ key: '_is_submitted', value: true }));
    } else {
      data.answers = fields;
      mutateQuery(`response(data:"${escapeData(data)}")`).then(res => {
        dispatch(actionSetFormData({ key: '_class', value: 'success' }));
        dispatch(actionSetFormData({ key: '_message', value: 'Form was submitted successfully' }));
        dispatch(actionSetFormData({ key: '_header', value: 'Thanks!' }));
        dispatch(actionSetFormData({ key: '_is_submitted', value: true }));
      });
    }
  }

  const submitPracticePage = () => {
    var message = null;
    var correct = null;
    for (var key in selectedPage.data.blocks) {
      if (key.startsWith('fitb')) {
        if (selectedFormData[key] != selectedPage.data.blocks[key].answer) {
          message = selectedPage.data.blocks[key].explanation;
          correct = false;
          break;
        } else {
          correct = (correct === null) ? true : correct;
        }
      } else if (key.startsWith('multiple')) {
        var values = selectedFormData[key] || [];
        var choices = selectedPage.data.blocks[key].choices;
        var local_correct = null;
        var missing = false;
        for (var ii = 0; ii < choices.length; ii++) {
          var choice = choices[ii];
          if (values.includes(ii)) {
            if (choice.correct === 'true' || choice.correct === true) {
              local_correct = (local_correct === null) ? true : local_correct;
            } else {
              message = choice.incorrect_feedback || 'Try again!';
              local_correct = false;
            }
          } else if (choice.correct === 'true' || choice.correct === true) {
            missing = true;
            local_correct = false;
          }
        }
        if (values.length === 0 && choices.length > 0) {
          message = 'Please complete the multiple choice question';
          local_correct = false;
        }
        correct = (correct === null) ? local_correct : correct;
        if (message === null && missing) {
          message = 'You are missing a correct answer';
        }
        if (message !== null) {
          break;
        }
      }
    }
    var header = null;
    var className = null;
    var page_id = selectedPage.id;
    if (message || !correct) {
      className = 'fail';
      header = 'Incorrect';
      message = message || 'One or more answers is incorrect';
    } else if (correct) {
      className = 'success';
      header = 'Correct';
      message = 'Great job!';
      if (!(page_id in skillPageScores) && selectedPage.viewer_data.complete !== 2) {
        dispatch(completeCurrentPage(page_id, 2, selectedMenuItem, pages));
      }
    }
    if (!attempted && selectedPage.data.is_exam) {
      setAttempted(true);
      for (var skill_id in skillPageScores[page_id]) {
        var score = skillPageScores[page_id][skill_id];
        var viewer_score = skillScores[skill_id] || 1;
        if (score !== viewer_score) {
          var new_score = correct ? viewer_score + 1 : viewer_score - 1;
          new_score = Math.max(Math.min(new_score, 10), 1);
          dispatch(updateUserScore(skill_id, new_score));
        }
      }
      dispatch(completeCurrentPage(page_id, 2, null, []));
    }

    dispatch(actionSetFormData({ key: '_class', value: className }));
    dispatch(actionSetFormData({ key: '_message', value: message }));
    dispatch(actionSetFormData({ key: '_header', value: header }));
    dispatch(actionSetFormData({ key: '_is_submitted', value: true }));
    return correct;
  }

  if (!selectedPage) {
    return <div />
  }
  var page_num = 1;
  for (var ii = 0; ii < props.pageIDs.length; ii++) {
    if (props.pageIDs[ii] === selectedPage.id) {
      page_num = ii + 1;
      break;
    }
  }

  var submit = null;
  var extra_buttons = null;
  if (selectedPage.data.is_form) {
    submit =
      <ColorFab className={classes.spacing} color="textPrimary" disabled={selectedFormData._is_submitted} variant="outlined" size="large" onClick={() => submitForm()}>
        Submit
      </ColorFab>;
  } else {
    for (var key in (selectedPage.data.blocks || {})) {
      if (key.startsWith('fitb') || key.startsWith('multiple')) {
        submit =
          <ColorFab className={classes.spacing} color="textPrimary" variant="outlined" size="large" onClick={() => submitPracticePage()}>
            Submit
          </ColorFab>;
        break;
      }
    }
  }

  return (
    <>
      <Box py={2} position="fixed" bottom={0} bgcolor="#ffffff" zIndex={1} maxWidth={800} width="100%">
        <Grid container direction="row" justify="space-between" alignItems="center">
          <Grid item xs={4} style={{ textAlign: 'left' }}>
            {extra_buttons}
            <ColorFab color="textPrimary" variant="outlined" size="large" onClick={() => props.handlePrevPage && props.handlePrevPage(props.pageIDs, pages, selectedPage.id)}>
              Back
            </ColorFab>
          </Grid>
          <Grid item xs={4} style={{ textAlign: 'center' }}>
            {!props.pageIDs.length
              ? null
              : <Typography variant="body2">
                  Page {page_num}/{props.pageIDs.length}
                </Typography>}
          </Grid>
          <Grid item xs={4} style={{ textAlign: 'right' }}>
            {submit}
            {page_num < props.pageIDs.length || props.forceNext
              ? <ColorFab color="textPrimary" variant="outlined" size="large" onClick={() => props.handleNextPage && props.handleNextPage(props.pageIDs, pages, selectedPage.id)}>
                  Next
                </ColorFab>
              : null}
          </Grid>
        </Grid>
      </Box>
    </>
  );
});

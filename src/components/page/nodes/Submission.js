import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSubmission } from 'src/requests/submissionRequests';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

export default (function Submission(props) {
  const { node } = props;
  const selectedPage = useSelector(state => state.selectedPage);
  const dispatch = useDispatch();

  const submit = (is_update) => {
    var url = window.prompt(is_update
      ? 'Update your Git Pull request, and paste the Pull Request URL here again'
      : 'Submit a Git Pull Request, and paste the Pull Request URL here'
    );
    if (is_update || url.length > 0) {
      dispatch(createSubmission(selectedPage.id, url));
    }
  };

  var state = null;
  switch (selectedPage.viewer_data.complete) {
    case 1:
      state = <Box p={1}>Pending grading...</Box>;
      break;
    case 2:
      state = <Box p={1}>Complete</Box>;
      break;
    case 3:
      state =
        <div>
          <div>Changes required</div>
          <Button onClick={() => submit(true)}>Submit Updates</Button>
        </div>;
      break;
    default:
      state = <Button onClick={() => submit(false)}>Submit</Button>;
      break;
  }
  return (
    <div data-key={node.id} style={{ maxWidth: 400 }}>
      <Card style={{ display: 'inline-block' }}>
        <CardContent>
          <Typography variant="h4">Assignment</Typography>
          <Box pt={1}>
            <Link href={node.data.source_url} target="_blank">{node.data.source_url}</Link>
          </Box>
        </CardContent>
        <CardActions>
          {state}
        </CardActions>
      </Card>
    </div>
  );
});

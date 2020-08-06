import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleIcon from '@material-ui/icons/CheckCircleOutline';
import CheckCircleComplete from '@material-ui/icons/CheckCircle';
import { readQuery, mutateQuery, escapeData } from 'src/utils/API/queryAPI';
import { updateUserPoints } from 'src/requests/examRequests';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText'
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  fill: {
    fill: '#26e600 !important',
  },
  empty: {
    fill: '#d8d8d8 !important',
  },
}));

export default (function Project(props) {
  const { node } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const selectedPage = useSelector(state => state.selectedPage);
  const user = useSelector(state => state.session.user);
  const [completed, setCompleted] = useState(null);

  useEffect(() => {
    var page_id = selectedPage && selectedPage.id;
    if (page_id) {
      readQuery(`viewer { complete(to_id:"${page_id}") }`).then(res => {
        res.data.edges.forEach(e => {
          if (e.type === 'profile/complete') {
            setCompleted(JSON.parse(e.data || '{}').completed || []);
          }
        });
      });
    }
  }, [selectedPage]);

  const handleComplete = (page_id, index, checkpoint) => {
    var local = (completed || []).slice();
    if (!local.includes(index)) {
      local.push(index);
    }
    mutateQuery(`viewer { complete(to_id:"${page_id}" data:"${escapeData(d)}") }`).then(res => {
      dispatch(updateUserPoints(user, checkpoint.points, 'Completed project checkpoint ' + selectedPage.data.title + ': ' + checkpoint.name));
      setCompleted(local);
    });
  };

  return (
    <div data-key={node.id} style={{ maxWidth: 400 }}>
      <Card style={{ display: 'inline-block' }}>
        <CardContent>
          <Typography variant="h4">Project</Typography>
          <Box pt={1}>
            <Link href={node.data.source_url} target="_blank">{node.data.source_url}</Link>
          </Box>
          <List>
            {(node.data.checkpoints || []).map((checkpoint, index) => {
              return (
                <>
                  <Divider component="li" />
                  <ListItem key={'project_' + selectedPage.id + '_' + index}>
                    <ListItemText primary={checkpoint.name} secondary={checkpoint.points+' XP'} />
                    <ListItemSecondaryAction>
                      {(completed || []).includes(index)
                        ? <IconButton edge="end">
                            <CheckCircleComplete className={classes.fill} />
                          </IconButton>
                        : <IconButton edge="end" title="Mark Completed" onClick={() => handleComplete(selectedPage.id, index, checkpoint)}>
                            <CheckCircleComplete className={classes.empty} />
                          </IconButton>}
                    </ListItemSecondaryAction>
                  </ListItem>
                </>
              );
            })}
          </List>
        </CardContent>
      </Card>
    </div>
  );
});

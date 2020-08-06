import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestFile } from 'src/requests/courseRequests';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  icon: {
    marginLeft: theme.spacing(1),
  },
}));

export default (function File(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const fileCache = useSelector(state => state.fileCache);
  const { node } = props;

  useEffect(() => {
    var file_id = node.data.file_id;
    if (file_id && !(file_id in fileCache)) {
      dispatch(requestFile(file_id));
    }
  }, [node]);

  var file_name = null;
  var file_path = null;
  if (node.data.file) {
    file_path = node.data.file;
    if (file_path.startsWith('[')) {
      var middle = file_path.slice(1, -1);
      var parts = middle.split(' ');
      file_path = parts[0];
      if (parts.length > 1) {
        parts.shift();
        file_name = parts.join(' ');
      }
    }
    if (!file_name) {
      var shorter = file_path || '/';
      if (shorter.endsWith('/')) {
        shorter = shorter.slice(0, -1);
      }
      file_name = shorter.split('/').pop();
    }
  } else if (node.data.file_id && (node.data.file_id in fileCache)) {
    file_name = fileCache[node.data.file_id].data.files[0].name;
    file_path = fileCache[node.data.file_id].data.files[0].path;
  }
  return (
    <Box data-key={node.id} my={1}>
      <Button variant="contained" size="small" color="default" href={file_path} target="_blank">
        {file_name}
        <CloudDownloadIcon className={classes.icon} />
      </Button>
    </Box>
  );
});

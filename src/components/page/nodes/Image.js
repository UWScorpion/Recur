import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import validate from 'uuid-validate';
import { requestFile } from 'src/requests/courseRequests';
import Box from '@material-ui/core/Box';

export default (function Image(props) {
  const dispatch = useDispatch();
  const fileCache = useSelector(state => state.fileCache);
  const { node } = props;

  useEffect(() => {
    var url = node.data.url;
    if (url && validate(url) && !(url in fileCache)) {
      dispatch(requestFile(url));
    }
  }, [node]);

  var url = node.data.url;
  if (validate(url)) {
    url = url in fileCache ? fileCache[url].data.files[0].path : null;
  }
  if (!url) {
    return <div data-key={node.id}>MISSING URL</div>;
  }
  return (
    <Box data-key={node.id} my={1}>
      <img
        src={url}
        width={node.data.width || null}
        height={node.data.height || null}
      />
    </Box>
  );
});

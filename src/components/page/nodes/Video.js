import React from 'react';
import Box from '@material-ui/core/Box';

export default (function Video(props) {
  const { node } = props;
  var src = '';
  var url = null;
  switch (node.data.video_type) {
    case 'youtube':
      src = 'https://www.youtube.com/embed/'+node.data.video_id;
      break;
    case 'archive':
      src = 'https://archive.org/embed/'+node.data.video_id;
      break;
    case 'other':
      url = node.data.video_id;
      break;
    default:
      src = 'https://player.vimeo.com/video/'+node.data.video_id;
      break;
  }
  return (url
    ? <Box data-key={node.id} my={2}>
        External Video: <a href={url} target="_blank">{url}</a>
      </Box>
    : <Box data-key={node.id} my={2}>
        <iframe
          src={src}
          width={node.data.width | 640}
          height={node.data.height | 360}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          webkitallowfullscreen="true"
          mozallowfullscreen="true"
          allowFullScreen={true}>
        </iframe>
      </Box>
  );
});

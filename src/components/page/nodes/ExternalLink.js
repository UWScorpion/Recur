import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles(theme => ({
  text: {
    fontSize: '0.8125rem',
    lineHeight: 1.54,
  },
}));

export default (function ExternalLink(props) {
  const classes = useStyles();
  const { node } = props;
  var text = node.data.text || null;
  var link = node.data.url;
  var is_inline = node.data.is_inline;
  if (is_inline) {
    return (
      <Link data-key={node.id} className={classes.text} underline="always" color="primary" target="_blank" href={link}>
        {text || link}
      </Link>
    );
  } else {
    return (
      <Box data-key={node.id} px={2} py={1} my={1} borderRadius={6} boxShadow={1} display="inline-flex">
        <Link className={classes.text} underline="always" color="primary" target="_blank" href={link}>
          {text || link}
        </Link>
      </Box>
    );
  }
});

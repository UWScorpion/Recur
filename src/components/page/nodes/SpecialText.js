import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  pre: {
    whiteSpace: 'pre-wrap',
  },
}));

const map = {
  main_header: 'h3',
  section_header: 'h4',
  paragraph_header: 'h5',
  box_header: 'h6',
  paragraph: 'body1',
};

export default (function SpecialText(props) {
  const { node } = props;
  const classes = useStyles();
  var clx = [node.data.size === 'paragraph' ? classes.pre : null];
  return (
    <Typography
      data-key={node.id}
      display="block"
      variant={map[node.data.size]}
      color="textPrimary"
      paragraph={!!node.data.is_paragraph}
      className={clx.join(' ')}>
      {node.data.text}
    </Typography>
  );
});

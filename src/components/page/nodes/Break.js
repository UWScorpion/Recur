import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  line: {
    margin: 0,
    opacity: 0.5,
  },
  wide: {
    left: '-100%',
    width: '300%',
    transform: 'translateX(-50%)',
  },
}));

export default(function Break(props) {
  const classes = useStyles();
  const { node } = props;
  return (
    <hr data-key={node.id} className={[classes.line, node.data.is_wide ? classes.wide : null].join(' ')} />
  );
});

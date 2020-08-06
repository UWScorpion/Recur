import React, { useContext } from 'react';
import PageNodes from 'src/components/page/nodes/PageNodes';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { ColorContext } from 'src/utils/Context'

const useStyles = makeStyles(theme => ({
  text: {
    whiteSpace: 'pre-wrap',
  },
  bold: {
    fontWeight: 600,
  },
  italic: {
    fontStyle: 'italic',
  },
  code: {
    fontFamily: 'Courier',
    fontSize: '0.8125rem',
    fontWeight: 400,
    color: '#2b2b2b',
    padding: '0 4px',
  },
  contrast: {
    fontWeight: 700,
  },
}));

export default (function PageText(props) {
  const { node } = props;
  const context = useContext(ColorContext);

  var content = node.data.text || '';
  if (node.children.length > 0) {
    content = <PageNodes nodes={node.children} />;
  }
  var out = null;
  var classes = useStyles();
  switch (node.data.style) {
    case 'bold':
      out = <Typography color="textPrimary" variant="body1" component="span" className={[classes.text, classes.bold, 'pageText'].join(' ')}>{content}</Typography>;
      break;
    case 'italic':
      out = <Typography color="textPrimary" variant="body1" component="span" className={[classes.text, classes.italic, 'pageText'].join(' ')}>{content}</Typography>;
      break;
    case 'code':
      out = <Typography component="span" variant="body1" className={[classes.text, classes.code, 'pageText'].join(' ')}>{content}</Typography>;
      break;
    case 'link':
      var parts = node.data.text.split(' ');
      var link = parts.shift();
      out = <Link color="primary" href={link} target="_blank">{parts.length > 0 ? parts.join(' ') : link}</Link>;
      break;
    default:
      out = <Typography color="textPrimary" variant="body1" component="span" className={[classes.text, 'pageText', context === 'bold' ? classes.contrast : ''].join(' ')}>{content}</Typography>;
      break;
  }
  return out;
})

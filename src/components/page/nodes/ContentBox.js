import React from 'react';
import PageNodes from 'src/components/page/nodes/PageNodes';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Typography from '@material-ui/core/Typography';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  dark: {
    '& .pageText': {
      fontFamily: 'Courier',
      color: '#ffffff',
    },
  },
}));

export default (function ContentBox(props) {
  const classes = useStyles();
  const { node } = props;
  const is_dark = !!node.data.is_dark;
  const is_copy = !!node.data.is_allow_copy;
  var text_depth = '';
  if (is_copy) {
    var s = node.children.slice().reverse();
    while (s.length > 0) {
      var curr = s.pop();
      if (curr.data.text) {
        text_depth += curr.data.text;
      }
      for (var ii = curr.children.length - 1; ii >= 0; ii--) {
        s.push(curr.children[ii]);
      }
    }
  }
  return (
    <Box data-key={node.id} m={1} borderRadius={6} border={1} borderColor="#D9D9D9" bgcolor={is_dark ? '#4F566B' : '#F1F3F8'}>
      <Box color={is_dark ? '#C2C1C1' : '#4F566B'} pt={2} pb={1} px={2} borderBottom={1} borderColor="#979797" position="relative">
        <Typography variant="h6">{node.data.title}</Typography>
        {is_copy
          ? <Box position="absolute" right={8} top={8}>
              <CopyToClipboard text={text_depth}>
              <IconButton size="small">
                <FileCopyIcon fontSize="inherit" />
              </IconButton>
              </CopyToClipboard>
            </Box>
          : null}
      </Box>
      <Box className={is_dark ? classes.dark : null} pb={2} pt={1} px={2} bgcolor={is_dark ? '#333d4e' : '#FFFFFF'} borderRadius="0 0 6px 6px">
        <PageNodes nodes={node.children} />
      </Box>
    </Box>
  );
});

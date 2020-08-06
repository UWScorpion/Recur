import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PageNodes from 'src/components/page/nodes/PageNodes';
import PageExplanation from 'src/components/page/PageExplanation';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  page: {
    position: 'relative',
    padding: theme.spacing(3, 0, 12),
    maxWidth: 800,
    '&:hover $hover': {
      display: 'block',
    },
  },
  hover: {
    display: 'none',
  },
}));

export default (function HOCPage(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const globalSelectedPage = useSelector(state => state.selectedPage);
  const page = props.page;

  var data = page.data || {}
  return (
    <div className={classes.page}>
      <PageNodes nodes={data.root || []} />
      {globalSelectedPage && page && globalSelectedPage.id === page.id
        ? <PageExplanation page={page} />
        : null}
    </div>
  );
});

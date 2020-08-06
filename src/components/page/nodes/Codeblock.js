import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Highlight from 'react-highlight/lib/optimized.js';
import PageNodes from 'src/components/page/nodes/PageNodes';
import { actionSetFormData } from 'src/actions/actions';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  code: {
    lineHeight: 1.5,
    fontFamily: 'Courier',
    display: 'table',
    fontSize: '0.8125rem',
    whiteSpace: 'pre-wrap',
    fontWeight: 400,
    marginTop: 15,
  },
}));

export default (function Codeblock(props) {
  const selectedFormData = useSelector(state => state.selectedFormData);
  const classes = useStyles();
  const dispatch = useDispatch();
  const { node } = props;

  const keypress = (e) => {
    if (e.target?.dataset?.onchange === '1' && e.target?.dataset?.key) {
      dispatch(actionSetFormData({ key: e.target.dataset.key, value: e.target.value }));
    }
  };

  // the random key forces Highlight to re-run on an updated DOM
  // by forcing the component to be rebuilt
  return (
    <div data-key={node.id} className={classes.code} onBlur={(e) => keypress(e)} tabIndex={0}>
      <Highlight key={Math.random()} languages={['swift']} className="swift">
        <PageNodes nodes={node.children} />
      </Highlight>
    </div>
  );
});

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actionSetFormData, actionUnsetFormData } from 'src/actions/actions';
import PageNodes from 'src/components/page/nodes/PageNodes';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  choice: {
    cursor: 'pointer',
    fontFamily: 'Courier',
    fontWeight: 'normal',
    fontSize: '0.8125rem',
    display: 'inline-block',
    margin: '10px 15px 10px 0',
    borderRadius: 3,
    border: '0.5px solid #4A4A4A',
    padding: '5px 10px',
    color: '#4A4A4A',
    '& .pageText': {
      whiteSpace: 'unset',
    }
  },
  used: {
    backgroundColor: '#bbb',
  },
}));

export default (function Choicebank(props) {
    const dispatch = useDispatch();

    const selectedFormData = useSelector(state => state.selectedFormData);
    const selectedPage = useSelector(state => state.selectedPage);

    const { node } = props;
    const classes = useStyles();

    const toggle = (choice) => {
      var key = choice.id;
      if (selectedFormData[key]) {
        dispatch(actionUnsetFormData({ key: selectedFormData[key] }));
        dispatch(actionUnsetFormData({ key: key }));
      } else {
        var next = getFirstFITB(selectedPage.data.root);
        if (next !== null) {
          dispatch(actionSetFormData({ key: key, value: next }));
          dispatch(actionSetFormData({ key: next, value: choice.data.value }));
        }
      }
    };

    const getFirstFITB = (nodes) => {
      for (var ii = 0; ii < nodes.length; ii++) {
        if (nodes[ii].type === 'fitb' && !Object.values(selectedFormData).includes(nodes[ii].id) && !nodes[ii].data.is_freeform) {
          return nodes[ii].id;
        }
        var next = getFirstFITB(nodes[ii].children || []);
        if (next) {
          return next;
        }
      }
      return null;
    }

    return (
      <div data-key={node.id}>
        {node.children.map(choice => (
          <div
            key={selectedPage.id+'_'+choice?.id}
            className={classes.choice+' '+(selectedFormData[choice?.id] ? classes.used : '')}
            onClick={() => toggle(choice)}>
            {<PageNodes nodes={choice.children} />}
          </div>
        ))}
      </div>
    );
});


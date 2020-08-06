import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actionSetFormData, actionUnsetFormData } from 'src/actions/actions';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  fitb: {
    color: '#fff',
    cursor: 'default',
    backgroundColor: '#282c34',
    display: 'inline-block',
    border: 'none',
    fontFamily: 'Courier',
    fontSize: '0.8125rem',
    fontWeight: 400,
    borderBottom: '1px solid #fff',
    padding: 0,
    marginRight: 6,
    outline: 'none',
    borderRadius: 0,
  },
  fitbAlone: {
    color: '#fff',
    cursor: 'default',
    backgroundColor: '#282c34',
    display: 'inline-block',
    border: 'none',
    fontFamily: 'Courier',
    fontSize: '0.8125rem',
    fontWeight: 400,
    borderBottom: '1px solid #fff',
    padding: 5,
    marginTop: 2,
    marginBottom: 2,
    marginRight: 6,
    outline: 'none',
    borderRadius: 0,
  },
}));

export default (function Fitb(props) {
  const classes = useStyles();
  const { node } = props;
  const dispatch = useDispatch();
  const selectedFormData = useSelector(state => state.selectedFormData);
  const selectedPage = useSelector(state => state.selectedPage);

  const reset = (key) => {
    dispatch(actionUnsetFormData({ key: key }));
    Object.keys(selectedFormData).forEach(k => {
      if (selectedFormData[k] === key) {
        dispatch(actionUnsetFormData({ key: k }));
      }
    });
  };

  const change = (e) => {
    if (node?.data?.is_standalone) {
      dispatch(actionSetFormData({ key: node.id, value: e.target.value }));
    }
  }

  var style = {};
  var value = '';
  if (node.id in selectedFormData) {
    value = (selectedFormData[node.id] || '') + '';
  } else {
    style.width = ((node.data.answer || '').length || 1) * 10;
  }
  var class_name = node?.data?.is_standalone ? classes.fitbAlone : classes.fitb;
  if (node.data.is_freeform) {
    return <input data-key={node.id} data-onchange="1" onChange={(e) => change(e)} size={Math.max(value.length, (node.data.answer || '').length)} type="text" style={style} className={class_name} defaultValue={value} />;
  } else {
    return (
      <span data-key={node.id} style={style} className={class_name} onClick={() => reset(node.id)}>
        &#x2800;{value || ''}&#x2800;
      </span>
    );
  }
});

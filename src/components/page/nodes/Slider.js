import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actionSetFormData } from 'src/actions/actions';
import PageNodes from 'src/components/page/nodes/PageNodes';
import _Slider from '@material-ui/core/Slider';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  slider: {
    width: 368,
  },
}));

export default (function Slider(props) {
  const classes = useStyles();
  const { node } = props;
  const dispatch = useDispatch();
  const selectedFormData = useSelector(state => state.selectedFormData);
  const selectedPage = useSelector(state => state.selectedPage);

  const toggle = (event, value) => {
    var data = selectedFormData[node.id] || [];
    dispatch(actionSetFormData({ key: node.id, value: value }));
  };

  var value = parseInt(selectedFormData[node.id] || node.data.start || 0);
  var step = parseInt(node.data.step) || 1;
  var min = parseInt(node.data.start) || 0;
  var max = min + (((parseInt(node.data.numsteps) || 10) - 1) * step);
  return (
    <Box data-key={node.id} pt={5} mb={3} px={2}>
			<_Slider
        className={classes.slider}
				defaultValue={value}
				valueLabelDisplay="on"
				step={step}
				min={min}
				max={max}
        marks={true}
        onChangeCommitted={(e, v) => toggle(e, v)}
			/>
    </Box>
  );
});

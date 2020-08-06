import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actionSetFormData } from 'src/actions/actions';
import { queryGuard } from 'src/utils/queryGuard';
import PageNodes from 'src/components/page/nodes/PageNodes';
import { readQuery } from 'src/utils/API/queryAPI';
import Box from '@material-ui/core/Box'
import List from '@material-ui/core/List';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { ColorContext } from 'src/utils/Context';

const useStyles = makeStyles(theme => ({
  outlined: {
		border: '1px solid #4A4A4A',
		borderRadius: 3,
  },
  selector: {
    width: 400,
  },
  selected: {
    backgroundColor: '#4A4A4A',
  },
}));

export default (function Multiple(props) {
  const { node } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const selectedFormData = useSelector(state => state.selectedFormData);
  const selectedPage = useSelector(state => state.selectedPage);
  const [currentChoices, setCurrentChoices] = useState(0);

  const toggle = (key, event) => {
    key = key === null ? event.target.value : key;
    var data = selectedFormData[node.id] || [];
    var num_choices = currentChoices;
    if (data.includes(key)) {
      data = data.filter(e => e !== key);
      num_choices--;
    } else {
      if (num_choices >= (node.data.max_choices || 99999)) {
        data.pop();
      }
      data.push(key);
      num_choices++;
    }
    dispatch(actionSetFormData({ key: node.id, value: data }));
    setCurrentChoices(num_choices);
  };

  var source = null;
  switch (node.data.type) {
    case 'selector':
      source = node.children;
      break;
    default:
      break;
  }

  var value = selectedFormData[node.id] || [];
  return (
    <Box data-key={node.id} mb={3}>
      {source
        ? <Box py={1}>
            <Select
              className={classes.selector}
              disabled={source.length === 0}
              input={<OutlinedInput margin="dense" inputProps={{ className: classes.outlined}} />}
              value={value.length > 0 ? value[0] : ''}
              onChange={(e) => toggle(null, e)}>
              {source.map(choice => (
                <MenuItem
                  key={selectedPage?.id+'_'+node?.id+'_'+choice?.id}
                  value={node.data.type === 'selector' ? choice.data.key : choice.id}>
                  {node.data.type === 'selector' ? <PageNodes nodes={choice.children} /> : choice.data.name}
                </MenuItem>
              ))}
            </Select>
          </Box>
        : <List style={{ width: 400 }}>
            {node.children.map(choice => {
              var selected = value.includes(choice.data.key);
              return (
                <ListItem
                  button
                  key={selectedPage?.id+'_'+node?.id+'_'+choice?.id}
                  selected={selected}
                  onClick={(e) => toggle(choice.data.key, e)}>
                  <ListItemText>
                    <Box display="flow-root">
                      <ColorContext.Provider value={selected ? 'bold' : null}>
                        <PageNodes nodes={choice.children} />
                      </ColorContext.Provider>
                    </Box>
                  </ListItemText>
                </ListItem>
              );
            })}
          </List>}
    </Box>
  );
});

import React, { Component } from 'react';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core/styles';

const useStyles = theme => ({
  bold: {
    fontWeight: 700,
  },
  title: {
    fontSize: '0.9rem',
    textAlign: 'center',
  },
  color: {},
  label: {
    fontWeight: 700,
    fontSize: '1.15rem',
    color: '#f0f0f0',
    textAlign: 'center',
    '&$color': {
      color: '#0fe296',
    }
  },
  box: {
    height: 100,
  },
});

class CheckpointSymbol extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      item,
      complete,
      classes,
      active,
      stepidx,
    } = this.props;
    var step = stepidx + 1;
    return (
      <Box display="flex" flexDirection="column" justifyContent="flex-end" height={100}>
        <Box className={[classes.title, active ? classes.bold : ''].join(' ')}>{item.data.name}</Box>
        <Box className={[classes.label, active ? classes.color : ''].join(' ')} mt={2}>
          {`${step < 10 ? '0' : ''}${step}`}
        </Box>
      </Box>
    );
  }
}

export default withStyles(useStyles)(CheckpointSymbol)

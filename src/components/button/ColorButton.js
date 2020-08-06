import Button from '@material-ui/core/Button';
import { withStyles, makeStyles } from '@material-ui/core/styles';

export default withStyles(theme => ({
  root: {
    fontSize: '1.25rem',
    fontFamily: [ 'Avenir', 'sans-serif' ],
    color: '#fff',
    backgroundColor: '#2974FF',
    borderRadius: 8,
    textTransform: 'none',
    padding: theme.spacing(1),
    marginTop: theme.spacing(2),
    '&:hover': {
      backgroundColor: '#1759D2',
    },
    '&:disabled': {
      backgroundColor: '#1759D2',
    },
    width: '100%',
  },
}))(Button);

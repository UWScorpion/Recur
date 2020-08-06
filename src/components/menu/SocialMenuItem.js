import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from "react-router";
import { requestFriends } from 'src/requests/studentRequests';
import { actionSetMenuItem, actionSetTopMenuItem } from 'src/actions/actions';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import _ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemIcon from '@material-ui/core/ListItemIcon';

const useStyles = makeStyles(theme => ({
  menu: {
    width: '300px',
    minWidth: '300px',
    backgroundColor: '#fafafa',
    marginTop: theme.spacing(5),
  },
  sectionMenu: {
    marginLeft: theme.spacing(-2),
  },
  sectionName: {
    fontSize: '1rem',
    textTransform: 'uppercase',
    fontWeight: 800,
    borderRadius: theme.spacing(1),
  },
  friendsPicOne: {
    zIndex: 1
  },
  friendsPicTwo: {
    marginTop: '10px',
    marginLeft: '-15px',
    marginRight: '5px',
    zIndex: 2,
  },
}));


const ListItem = withStyles(theme => ({
  root: {
    border: 'none',
    borderRadius: 30,
    display: 'inline-flex',
    width: 'auto',
    '&:hover': {
      backgroundColor: '#f2f2f2',
    },
    '&$selected': {
      border: 'none',
      backgroundColor: '#e6ebf0',
      '&:hover': {
        backgroundColor: '#f2f2f2',
      },
    },
  },
  selected: {},
}))(_ListItem);

export default withRouter(function SocialMenuItem(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { history } = props;
  const user = useSelector(state => state.session.user);
  const friends = useSelector(state => state.friends);
  const selectedMenuItem = useSelector(state => state.selectedMenuItem);
  const selectedTopMenuItem = useSelector(state => state.selectedTopMenuItem);

  useEffect(() => {
    dispatch(requestFriends(user.id));
  }, [])

  const friend1 = friends[0]?.photo?.data?.files[1]?.path;
  const friend2 = friends[1]?.photo?.data?.files[1]?.path;

  const handleClick = (lesson_id, url, main_select) => {
    if (!lesson_id && main_select === selectedTopMenuItem) {
      main_select = '';
    }
    dispatch(actionSetTopMenuItem(main_select || ''));
    dispatch(actionSetMenuItem(''));
    if (url) {
      history.push(url);
    }
  };

  const ss = selectedMenuItem;

  return (
    <List component="nav" className={classes.menu} dense={true} subheader={<ListSubheader disableSticky={true} className={classes.sectionName}>Social</ListSubheader>}>
      <Box px={2}>
        <ListItem button className={classes.sectionMenu} selected={ss === 'Friends'} onClick={() => handleClick(null, '/platform/friends', 'library')}>
          <ListItemIcon>
            <Avatar className={classes.friendsPicOne} alt="friend picture" src={friend1} /> 
            <Avatar className={classes.friendsPicTwo} alt="friend picture" src={friend2} />
          </ListItemIcon>
          <ListItemText
            primaryTypographyProps={{ variant: 'h5', color: 'textSecondary' }}
            primary={` Friends ( ${friends.length} )`}
          />
        </ListItem>
      </Box>
    </List>
  );
});
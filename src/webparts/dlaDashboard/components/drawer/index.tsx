import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Tooltip from '@material-ui/core/Tooltip';
import dashRoutes from '../routes/dashboard';
import clsx from 'clsx';
import drawerStyles from './index.module.scss';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: "#04487B",
            display: 'flex',
            '& .MuiDrawer-paper': {
                    backgroundColor: "#04487B",
                },
        },
        paper: {
            backgroundColor: "#04487B",
        },
        listRoot: {
            color:'#ffffff',
            maxWidth: 360,
            '& .Mui-selected': {
                backgroundColor: "#07243E",
            }},
        nested: {
            color:'#ffffff',
            backgroundColor:'#043057',
            paddingLeft: theme.spacing(4),
        },
        panelIcons: {
            color: '#ffffff !important',
            fontSize:'12px',
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
            }),
        },
        appBarShift: {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
            }),
        },
        menuButton: {
            marginRight: 36,
        },
        hide: {
            display: 'none',
        },
        drawer: {
            backgroundColor: "#04487B",
            width: drawerWidth,
            flexShrink: 0,
            whiteSpace: 'nowrap',
            color:"#ffffff"
        },
        drawerOpen: {
            width: drawerWidth,
            transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
            }),
        },
        drawerClose: {
            transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
            }),
            overflowX: 'hidden',
            width: theme.spacing(7) + 1,
            [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
            },
        },
        toolbar: {
            backgroundColor:"#04487B",
            color:"#ffffff",
            height:112,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: theme.spacing(0, 1),
            ...theme.mixins.toolbar,
        },
        content: {
            backgroundColor: "#04487B",
            flexGrow: 1,
        }
    })
);

function DrawerPanel({menu, collapse, setCollapse, drawerExpand = () => {}}){
  const group = useSelector(state => state.user.data.Group);
  const classes = useStyles();
  const location = useLocation();
  const [] = React.useState(false);
  const [] = React.useState(0);
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const menuGroup = menu.group;
  const Icon = menu.icon;
  var groupMenu = menuGroup.includes(group);

  if(collapse === true && open === true){
    setOpen(false);
  }
  const goTo = path => {
      console.log('Going to path: ', path, path.startsWith('http'));
      if (path.startsWith('http')) window.open(path, "_blank");
      else if (path) return history.push(menu.path);
  };


  const handleCollapse = () => {

    console.log('collapsing');

    if(collapse){
      drawerExpand();
    }

    if(menu.views){
      setOpen(!open);
    }else{
        if (menu.path.startsWith('http')) window.open(menu.path, "_blank");
        else if (menu.path) return history.push(menu.path);
    }
    
    
  };

  if(groupMenu){
    return (
        <List component="nav" aria-labelledby="nested-list-subheader" className={classes.listRoot}>
            <Tooltip title={menu.name} placement="right" arrow>
                <ListItem button selected={menu.path===location.pathname} onClick={handleCollapse}>
                    <ListItemIcon className={classes.panelIcons}>
                        <Icon />
                    </ListItemIcon>
                    <ListItemText primary={menu.name} />
                    {menu.views ? open ? <ExpandLess /> : <ExpandMore /> : ''}
                </ListItem>
            </Tooltip>
            { menu.views && 
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                  
                  {menu.views.map((route, key) => {
                      return (
                        <ListItem button className={classes.nested} onClick={() => goTo(route.path)} key={key}>
                          <ListItemText primary={"RANDOMTEXT"} />
                        </ListItem>
                      );
                  })}

                  <ListItem button className={classes.nested} onClick={() => goTo('http://uber.com')}>
                        <ListItemText primary={"RANDOMTEXT33"} />
                    </ListItem>
                  </List>
                </Collapse>
              }
        </List>
        
      );
  }

  return (<List style={{margin:0, padding:0}}></List>);

}

export default function PlatformDrawer({ drawer = false }) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
      setOpen(drawer);
    }, [drawer]);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >
                
                <div className={classes.toolbar}>
                    <IconButton onClick={toggleDrawer}>
                        {/* <MenuIcon style={{color:"#ffffff"}}/> */}
                    </IconButton>
                </div>
                {dashRoutes.map((route, key) => {
                    return (
                        <DrawerPanel menu={route} collapse={!open} setCollapse={setOpen} drawerExpand={toggleDrawer} key={key} />
                    );
                })}

                {/* <DrawerPanel menu={men} collapse={!open} setCollapse={setOpen} drawerExpand={toggleDrawer} /> */}

            </Drawer>
        </div>
    );
}

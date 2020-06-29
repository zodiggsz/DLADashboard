/* eslint-disable no-unreachable */
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import classnames from 'classnames';
import panelStyles from './index.module.scss';
import { actions } from '../../models/app';
import {Dashboard, TableChart, Equalizer, AccountCircle, AssignmentTurnedIn, Description, FileCopy} from '@material-ui/icons';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff !important',
        fontSize:'12px',
        border: '4px solid #6DB8EF',
        borderRadius: '50%',
        padding:3,
    },
  }));

export default function DrawerPanel({ children, isOpen, title, to, icon }) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [collapsed, setCollapsed] = useState(false);
    const [height, setHeight] = useState(0);
    const drawer = useSelector((state) => state.app.expandDrawer);
    const ref = useRef(null)
    const history = useHistory();
    const style = {
        height: !collapsed ? height: 0,
        width: !collapsed ? "auto": 0,
    }

    useEffect(() => {
        
        setCollapsed(!isOpen);
        if(!collapsed){
            setHeight(ref.current.clientHeight);
        }

    }, [isOpen, height]);

    function onClick() {
        if (to) return history.push(to);
    
        if (collapsed === true) {

            if(!drawer){
                dispatch(actions.toggleDrawer(!drawer));
            }
            
        }
        setCollapsed(!collapsed);
    }

    function PanelIcon(props){
        switch (icon) {
            case "Dashboard":
                return <div className={classes.root}><Dashboard {...props}></Dashboard></div>;
            case "TableChart":
                return <div className={classes.root}><TableChart {...props}></TableChart></div>;
            case "Equalizer":
                return <div className={classes.root}><Equalizer {...props}></Equalizer></div>;
            case "AccountCircle":
                return <div className={classes.root}><AccountCircle {...props}></AccountCircle></div>;
            case "AssignmentTurnedIn":
                return <div className={classes.root}><AssignmentTurnedIn {...props}></AssignmentTurnedIn></div>;
            case "Description":
                return <div className={classes.root}><Description {...props}></Description></div>;
            case "FileCopy":
                return <div className={classes.root}><FileCopy {...props}></FileCopy></div>;
            case "AccountBalanceIcon":
                return <div className={classes.root}><AccountBalanceIcon {...props}></AccountBalanceIcon></div>;
            case "CheckBoxIcon":
                return <div className={classes.root}><CheckBoxIcon {...props}></CheckBoxIcon></div>;  
            default:
                return <div className={classes.root}><Dashboard {...props}></Dashboard></div>;
        }
    }

    return (
        <List>
            <ListItem button onClick={onClick} className={classnames("drawerPanel", { collapsed })}>
                    <ListItemIcon>
                        <PanelIcon icon={icon} style={{ fontSize: 30 }}></PanelIcon>
                    </ListItemIcon>
                    
                    <ListItemText primary={title} />
                
            </ListItem>
            <List style={style} className={panelStyles.content}>
                <div ref={ref} style={{overflow:"hidden"}}>{children}</div>
            </List>
        </List>
        
    );
}
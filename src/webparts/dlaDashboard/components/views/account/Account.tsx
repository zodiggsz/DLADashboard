import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { actions } from '../../../models/user';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import AppLoader from '../../loader';
import EditAccount from './EditAccount';
import SelectPrograms from '../programs/SelectPrograms';
import dlaStyles from './index.module.scss';
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
    root: {
        '& > *': {
            padding: theme.spacing(0),
          },
    },
    form: {
        '& > *': {
            padding: theme.spacing(0),
        },
    }, 
    paper: {
        overflow:"hidden",
        padding: '20px',
        position: "relative",
        textAlign: 'center',
        color: theme.palette.text.secondary,
        borderRadius:20,
        marginBottom:10
    },
    select: {
        width:"100%",
        marginBottom: theme.spacing(1),
    },
    button: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
    submit:{
        backgroundColor:"#73B5EF",
        width: "80%",
        margin: 10
    },
    fileInput: {
        display: 'none',
    },
    profileInput: {
        fontSize: "6rem"
    }
}));

const userRoles = [
    {
        name: "ETM Admin Operator",
        value: "admin",
        group:["admin"]
    },
    {
        name: "ETM Operator",
        value: "operator",
        group:["admin"]
    },
    {
        name: "PEO",
        value: "peo",
        group:["admin","operator"]
    },
    {
        name: "Portfolio Manager",
        value: "portfolio",
        group:["admin","operator","peo"]
    },
    {
        name: "Program Manager",
        value: "program",
        group:["admin","operator","peo","portfolio"]
    },
    
  ];

export default function Account() {
    const dispatch = useDispatch();
    let { ID } = useParams();
    const isLoading = useSelector((state) => state.user.loading);
    const user = useSelector((state) => state.user.data);

    return(
        <Grid container spacing={2}>
            <Grid item xs={4}>
                <EditAccount id={ID} />
            </Grid>
            <Grid item xs={8}>
                <SelectPrograms userID={ID} />
            </Grid>
        </Grid>
    );
}
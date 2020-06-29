import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import AppLoader from '../../loader';
import ScoreCardForm from './ScoreCardForm';
import scoreStyles from './index.module.scss';
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

export default function EditScoreCard() {
    const dispatch = useDispatch();
    const { params: { ID } } = useRouteMatch();
    const isLoading = useSelector((state) => state.user.loading);
    const user = useSelector((state) => state.user.data);

    return(
        <Grid id={scoreStyles.scoreCardContainer} container spacing={2}>
            <Grid item xs={6}>
                <ScoreCardForm />
            </Grid>
            <Grid item xs={6}>
                
            </Grid>
        </Grid>
    );
}
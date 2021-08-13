import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import AppLoader from '../../loader';
import ListPrograms from './ListPrograms';
import ScoreCard from '../scorecards/ScoreCard';
import programStyles from './index.module.scss';
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            padding: theme.spacing(2)
        },
        paper: {
            position:'relative',
            padding: theme.spacing(2),
            margin: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
            maxHeight: 600,
        },
}));

const userRoles = [
    {
        name: "ECM Admin Operator",
        value: "admin",
        group:["admin"]
    },
    {
        name: "ECM Operator",
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

export default function Programs() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { params: { ID } }: any = useRouteMatch();
    const isLoading = useSelector((state) => state.user.loading);
    const user = useSelector((state) => state.user.data);

    return(
        <Grid container spacing={2}>
            <Grid item xs={5}>
                <h3 className={programStyles.listTitle}>Programs</h3>
                {user.Group == 'admin' && <ListPrograms userID={ID ? ID : ''} />}
                {user.Group == 'peo' && <ListPrograms userID={ID ? ID : ''} />}
                {user.Group == 'portfolio' && <ListPrograms userID={ID ? ID : ''} />}
                {user.Group == 'program' && <ListPrograms userID={ID ? ID : ''} />}
                {user.Group == 'operator' && <ListPrograms userID={user.ID} />}
            </Grid>
            <Grid item xs={7}>
            <h3 className={programStyles.listTitle}>Overview</h3>
                <ScoreCard />
            </Grid>
        </Grid>
    );
}

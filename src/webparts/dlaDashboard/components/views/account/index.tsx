import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import MyAccount from './MyAccount';
import ListAdminAccounts from './ListAdminAccounts';
import ListPrograms from '../programs/ListPrograms';
import ListHistory from '../programs/ListHistory';
import dlaStyles from './index.module.scss';
import styles from '../../DlaDashboard.module.scss';
import OverallCompositeScores from '../scorecards/OverallCompositeScores';

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
        height:"100%",
        borderRadius:20
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
        fontSize: "10rem"
    }
}));

export default function PFAccount() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.data);
    const programs = useSelector(state => state.programs);
    const group = useSelector(state => state.user.data.Group);
    const classes = useStyles();
    const [loading, setLoader] = React.useState(false);

    const [data, setData] = React.useState({
        First_Name: user.First_Name || "",
        Last_name: user.Last_name || "",
        Email: user.Email || "",
        Image: user.Image || ""
    });

    return (
        <div id={dlaStyles.pfAccount}>
            {user.ID ? (
                    <Grid container spacing={5}>
            
                        <Grid item sm={12} md={3}>
                            <MyAccount user={user} />
                        </Grid>
                        <Grid item sm={12} md={9}>
                            
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <div className="scoreCard">
                                        {programs && programs.list && group === 'admin' && <OverallCompositeScores etmTitle='Composite Scores' />}
                                        {group === 'peo' && <ListPrograms userID={user.ID} navigate={false} />}
                                    </div>
                                </Grid>
                                <Grid item xs={6}>
                                    <div className="scoreCard">
                                        {/* {group === 'admin' && <ListAdminAccounts />} */}
                                        {group === 'peo' && <ListHistory />}
                                    </div>
                                </Grid>
                            </Grid>
                            
                        </Grid>
                        
                    </Grid>
                    
                ) : null}
                
        </div>
    );
}

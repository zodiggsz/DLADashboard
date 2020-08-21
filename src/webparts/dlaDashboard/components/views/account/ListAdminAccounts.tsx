import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { actions } from '../../../models/user';

import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import dlaStyles from './index.module.scss';
import styles from '../../DlaDashboard.module.scss';

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
        overflow:"scroll",
        position: "relative",
        textAlign: 'center',
        color: theme.palette.text.secondary,
        minHeight:420,
        borderRadius:20,
        maxHeight:600,
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

export default function ListAdminAccounts() {
    const dispatch = useDispatch();
    const history = useHistory();
    const classes = useStyles();
    const userAccounts = useSelector(state => state.user.accounts);
    const [accounts, setAccounts] = React.useState(userAccounts);

    React.useEffect(() => {

        if(accounts.length < 1){
            dispatch(actions.getAccounts('operator'));
            setAccounts(userAccounts);
        }

    }, [accounts, userAccounts]);

    function handleAccountClick(id) {
        return () => history.push(`/account/${id}`);
    }

    return (
        <Paper className={`${classes.paper} ${dlaStyles.listManager}`}>
            <h1 className={dlaStyles.title}>ECM Operators</h1>
            <TableContainer>
                <Table aria-label="customized table">
                <TableBody>
                    {accounts.map((account, index) => (
                        <TableRow key={index}>
                            <TableCell align="center">{account.First_Name}</TableCell>
                            <TableCell align="center">{account.Last_Name}</TableCell>
                            <TableCell align="center">{account.Email}</TableCell>
                            <TableCell align="center">
                                <Button onClick={handleAccountClick(account.ID)} style={{fontWeight:700}}>VIEW</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
        </Paper>         
    );
}

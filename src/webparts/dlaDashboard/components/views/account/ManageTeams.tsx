import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { actions } from '../../../models/user';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Loader from '../../loader';
import AddAccount from './AddAccount';
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import dlaStyles from './index.module.scss';

const StyledTableCell = withStyles(theme => ({
    root: {
        padding:8,
    },
    head: {
        backgroundColor: "#4E81BD",
        color: theme.palette.common.white,
        fontFamily: "proxima-nova, sans-serif",
        fontWeight: 700,
        fontSize:18
    },
    body: {
        fontSize: 14
    },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
    root: {
        '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.background.default,
        },
    },
}))(TableRow);

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
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalPaper: {
        outline:'none',
        width:'50%',
        backgroundColor: 'transparent',
        border: '0px',
        padding: theme.spacing(2, 4, 3),
    },
    paper: {
        padding: '20px',
        position: "relative",
        textAlign: 'center',
        color: theme.palette.text.secondary,
        width:"100%",
        height:"100%",
        borderRadius:20,
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

export default function ManageTeams() {
    const dispatch = useDispatch();
    const history = useHistory();
    const isLoading = useSelector((state) => state.user.loading);
    const user = useSelector((state) => state.user.data);
    const classes = useStyles();
    const [addAccount, setAddAccount] = React.useState(false);
    const userAccounts = useSelector(state => state.user.accounts);
    const [accounts, setAccounts] = React.useState(userAccounts);

    React.useEffect(() => {

        if(accounts.length < 1){
            dispatch(actions.getAccounts('operator'));
            setAccounts(userAccounts);
        }
        
    }, [accounts, userAccounts]);

    const handleOpen = () => {
        setAddAccount(true);
    };

    const handleClose = () => {
        setAddAccount(false);
    };

    function handleAccountClick(ID) {
        return () => history.push(`/account/${ID}`);
    }

    function removeAccount(account) {
        const msg = `Are you sure you want to remove ${account.First_Name} ${account.Last_Name}?`;
        return () => window.confirm(msg) && dispatch(actions.removeAccount(account));
    }

    return (
        <Grid container className={dlaStyles.manageAccounts}>
            
            <Grid item xs={12}>
                <header className={dlaStyles.header}>
                    <h3>MANAGE OPERATORS</h3>
                </header>
            </Grid>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <TableContainer>
                        <Table aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center"></StyledTableCell>
                                <StyledTableCell align="center">FIRST NAME</StyledTableCell>
                                <StyledTableCell align="center">LAST NAME</StyledTableCell>
                                <StyledTableCell align="center">JCODE</StyledTableCell>
                                <StyledTableCell align="center">EMAIL</StyledTableCell>
                                <StyledTableCell align="center"></StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {userAccounts.map((account, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell align="center">{index + 1}</StyledTableCell>
                                    <StyledTableCell align="center">{account.First_Name}</StyledTableCell>
                                    <StyledTableCell align="center">{account.Last_Name}</StyledTableCell>
                                    <StyledTableCell align="center">{account.JCODE}</StyledTableCell>
                                    <StyledTableCell align="center">{account.Email}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        <ButtonGroup
                                            orientation="horizontal"
                                            color="primary"
                                            aria-label="vertical outlined primary button group">
                                            <Button onClick={handleAccountClick(account.ID)}>Edit</Button>
                                            <Button onClick={removeAccount(account)}>Remove</Button>
                                        </ButtonGroup>
                                        
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </TableContainer>
                    <Button onClick={handleOpen}> 
                        ADD OPERATORS
                    </Button>
                </Paper>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={addAccount}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={addAccount}>
                    <div className={classes.modalPaper}>
                        <AddAccount admin={user} closeModal={handleClose} />
                    </div>
                    </Fade>
                </Modal>
            </Grid>
            
        </Grid>

                        
    );
}
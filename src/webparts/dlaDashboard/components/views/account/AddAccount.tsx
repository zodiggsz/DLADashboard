import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { actions } from '../../../models/user';
import AppLoader from '../../loader';
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';

import dlaStyles from './index.module.scss';

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
    select: {
        width:"100%",
        marginBottom: theme.spacing(1),
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

export default function AddAccount({ admin, closeModal = () => {} }) {
    const dispatch = useDispatch();
    const classes = useStyles();
    const [loading, setLoader] = React.useState(false);
    const [labelWidth, setLabelWidth] = React.useState(0);
    const inputLabel = React.useRef(null);
    const [user, setUser] = React.useState({
        Title: "",
        First_Name: "",
        Last_Name: "",
        Middle_Initial: "",
        Email: "",
        Group: "SELECT GROUP"
    });

    React.useEffect(() => {
        
        setLabelWidth(inputLabel.current.offsetWidth);
        
        
    }, []);

    function setState(key) {
        return (event) => setUser({
            ...user,
            [key]: event.target.value
        });
    }

    function onSubmit() {
        // e.preventDefault();
        if(user.First_Name && user.Last_Name && user.Email && user.Group){
            const middleInitial = ` ${user.Middle_Initial}`;
            const title = {Title: `${user.Last_Name}, ${user.First_Name}${middleInitial}`};

            const updatedUser = {...user, ...title};

            console.log(updatedUser);
            dispatch(actions.addAccount(updatedUser));
            closeModal();
        }
       
    }

    return(
        <Paper className={classes.paper}>
            <AppLoader isLoading={loading} />
            <Grid container className={dlaStyles.myAccount}>
                
                <Grid item xs={12}>
                    <form className={classes.form} noValidate autoComplete="off">
                        <FormControl className={classes.select} variant="filled" >
                            <InputLabel ref={inputLabel} id="demo-simple-select-outlined-label">
                            Select Role
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={user.Group}
                                onChange={setState('Group')}
                                labelWidth={labelWidth}>
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {userRoles.map((role, index) => ( 
                                     
                                     role.group.includes(admin.Group) && <MenuItem value={role.value} key={index}>{role.name}</MenuItem>
                                ))}
                                
                            </Select>
                        </FormControl>
                        {   
                            user.Group == 'portfolio' || user.Group == 'program' || user.Group == 'admin'  ?
                                <TextField
                                    id="filled-full-width"
                                    label="JCODE"
                                    style={{ marginBottom: 8 }}
                                    fullWidth
                                    onChange={setState('JCODE')}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    variant="filled"
                                /> : ""
                        }
                        <TextField
                            id="filled-full-width"
                            label="First Name"
                            style={{ marginBottom: 8 }}
                            fullWidth
                            onChange={setState('First_Name')}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="filled"
                        />
                        <TextField
                            id="filled-full-width"
                            label="Middle Initial"
                            style={{ marginBottom: 8 }}
                            fullWidth
                            onChange={setState('Middle_Initial')}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="filled"
                        />
                        <TextField
                            id="filled-full-width"
                            label="Last Name"
                            style={{ marginBottom: 8 }}
                            fullWidth
                            onChange={setState('Last_Name')}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="filled"
                        />
                        <TextField
                            id="filled-full-width"
                            label="Email"
                            style={{ marginBottom: 8 }}
                            fullWidth
                            onChange={setState('Email')}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="filled"
                        />
                       
                        <Fab className={classes.submit} variant="extended" onClick={onSubmit}>
                            ADD ACCOUNT
                        </Fab>

                    </form>
                </Grid>
            </Grid>
            

        </Paper>
    );
}
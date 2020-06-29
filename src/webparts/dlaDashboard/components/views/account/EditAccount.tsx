import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
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

export default function EditAccounts({id}) {
    const dispatch = useDispatch();
    // const { params: { ID } } = useRouteMatch();
    const isLoading = useSelector((state) => state.user.loading);
    const user = useSelector((state) => state.user.data);
    const classes = useStyles();
    const group = user.Group;
    const [labelWidth, setLabelWidth] = React.useState(0);
    const inputLabel = React.useRef(null);
    const [loading, setLoader] = React.useState(false);
    const [data, setData] = React.useState({});
    const [account, setAccount] = React.useState({
        ID: "",
        Title:"",
        First_Name: "",
        Last_Name: "",
        Email:"",
        Role:"",
        JCODE:"",
        Group:""
    });


    React.useEffect(() => {

        setLabelWidth(inputLabel.current.offsetWidth);
        console.log(account.ID);
        if(!account.ID){
            dispatch(actions.getUserbyID(id)).then((response) => {
                setAccount(response);
            });
        }
        
    }, [account]);

    function setState(key) {
        return (event) => setAccount({
            ...account,
            [key]: event.target.value
        });
    }

    function onSubmit() {
        const updatedUser = {
            Title: account.Title,
            First_Name: account.First_Name,
            Last_Name: account.Last_Name,
            Email: account.Email,
            Group: account.Group
        };

        if(account){
            dispatch(actions.updateUser(account.ID, updatedUser));
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
                                value={account.Group}
                                onChange={setState('Group')}
                                labelWidth={labelWidth}>
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {userRoles.map((role, index) => ( 
                                     
                                     role.group.includes(user.Group) && <MenuItem value={role.value} key={index}>{role.name}</MenuItem>
                                ))}
                                
                            </Select>
                        </FormControl>
                        {   
                            user.Group == 'portfolio' || user.Group == 'program'  ?
                                <TextField
                                    id="filled-full-width"
                                    label="JCODE"
                                    style={{ marginBottom: 8 }}
                                    value={account.JCODE}
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
                            value={account.First_Name}
                            fullWidth
                            onChange={setState('First_Name')}
                            InputProps={{
                                readOnly: true,
                              }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="filled"
                        />
                        <TextField
                            id="filled-full-width"
                            label="Last Name"
                            style={{ marginBottom: 8 }}
                            value={account.Last_Name}
                            fullWidth
                            onChange={setState('Last_Name')}
                            InputProps={{
                                readOnly: true,
                              }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="filled"
                        />
                        <TextField
                            id="filled-full-width"
                            label="Email"
                            style={{ marginBottom: 8 }}
                            value={account.Email}
                            fullWidth
                            onChange={setState('Email')}
                            InputProps={{
                                readOnly: true,
                              }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="filled"
                        />
                        <TextField
                            id="filled-full-width"
                            label="JCODE"
                            style={{ marginBottom: 8 }}
                            value={account.JCODE}
                            fullWidth
                            onChange={setState('JCODE')}
                            InputProps={{
                                readOnly: true,
                              }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="filled"
                        />
                        <Fab className={classes.submit} variant="extended" onClick={onSubmit}>
                            UPDATE
                        </Fab>

                    </form>
                </Grid>
            </Grid>
            

        </Paper>
    );
}
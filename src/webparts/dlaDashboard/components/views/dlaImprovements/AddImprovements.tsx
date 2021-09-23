import * as React from 'react';
import ReactQuill from 'react-quill';
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

import 'react-quill/dist/quill.snow.css';
import './index.css';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
    root: {
        '& > *': {
            padding: theme.spacing(0),
          },
        '& .ql-editor': {
            minHeight: '220px',
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
}));
;

export default function AddImprovements({ options, closeModal = value => {} }) {
    const classes = useStyles();
    const [loading, setLoader] = React.useState(false);
    const [value, setValue] = React.useState(options.item[options.value]);

    function handleChange(value) {
      setValue(value);
    }

    function onSubmit() {
      let newOptions;
      console.log("options and value are: ", options, newOptions, value);
      if (options.value === 'Remediation') {
        newOptions = {
          ...options, Remediation: value
        }
      }
      // newOptions.item[options.value] = value;
      closeModal({ options: newOptions, value });
    }

    return(
        <Paper className={classes.paper}>
            <AppLoader isLoading={loading} />
            <Grid container>

                <Grid item xs={12}>
                  <ReactQuill theme="snow" value={value} onChange={handleChange} />
                  <Fab className={classes.submit} variant="extended" onClick={onSubmit}>
                      ADD { options.type }
                  </Fab>
                </Grid>
            </Grid>
        </Paper>
    );
}

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
      background: '#dfe6ef',
      color: theme.palette.text.secondary,
      height:"100%",
      fontSize: 18,
      borderRadius:20
    },
    messageField: {
      maxHeight: "250px",
      overflow: "auto",
      boxShadow: "inset 0 0 4px",
      padding: 10,
      borderRadius: 5,
      marginBottom: 15,
      '& > :last-child': {
        marginBottom: 0
      }
    },
    responseField: {
      background: "#fff",
      border: "1px solid #626365",
      maxHeight: "60vh",
      overflow: "auto",
      fontSize: 16
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
    }
  })
);

export default function Modal({ item, closeModal = value => {} }) {
    const classes = useStyles();
    const [loading, setLoader] = React.useState(false);

    console.log("opened item modal: ", item);
    return(
      <Paper className={classes.paper}>
        <AppLoader isLoading={loading} />
        <Grid container>
          <Grid item xs={12}>
            <h3><strong>Sent to:</strong> { item.Acronym }</h3>
            <hr />
            <h5><strong>{ item.Subject }</strong></h5>
            <div className={classes.messageField}>
              <p>{item.Message}</p>
            </div>
            <h4><strong>Status:</strong> <span style={{textTransform:'capitalize'}}>{ item.Status }</span></h4>
            {
              item.Status === 'responded' && (
                <div className={classes.responseField}>
                  { item.Response }
                </div>
              )
            }
          </Grid>
        </Grid>
      </Paper>
    );
}

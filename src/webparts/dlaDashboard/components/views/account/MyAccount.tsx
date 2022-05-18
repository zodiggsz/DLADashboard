import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { actions } from '../../../models/user';
import AppLoader from '../../loader';
import dlaStyles from './index.module.scss';
import styles from '../../DlaDashboard.module.scss';
import { useHistory, useLocation } from 'react-router-dom';

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
        fontSize: "6rem"
    },
    avatar : {
        marginLeft: 50,
        marginRight: 15,
        height: 50,
        borderRadius: '50%'
    }
}));

export default function MyAccount({ user, card }) {
    const dispatch = useDispatch();
    const classes = useStyles();
    const userImage = useSelector(state => state.user.image);
    const userID = user.ID;
    const group = user.Group;
    const [loading, setLoader] = React.useState(false);
    const [profile, setProfile] = React.useState(user.Image?user.Image: (userImage || "https://s3.amazonaws.com/yams-give/default_profile_picture.png"));
    const history = useHistory();
    const query = useQuery();
    const params = {
      acronym: query.get('acronym'),
      page: query.get('page'),
    }
    const ROUTE = `/${params.page}${params.acronym?'?acronym='+params.acronym:''}`;

    if (params.page) {
      setTimeout(() => {
        history.push(ROUTE)
      }, 999);
    }


    function useQuery() {
      const { search } = useLocation();
      return React.useMemo(() => new URLSearchParams(search), [search]);
    }


    const [data, setData] = React.useState({
        First_Name: user.First_Name || "",
        Last_Name: user.Last_Name || "",
        Email: user.Email || "",
        JCODE: user.JCODE || "",
        Image: user.Image || ""
    });

    function setState(key) {
        return (event) => setData({
            ...data,
            [key]: event.target.value
        });
    }

    function onSubmit() {
        const updatedUser = {
            First_Name: data.First_Name || "",
            Last_Name: data.Last_Name || "",
            Email: data.Email || "",
            Image: data.Image || ""
        };
        dispatch(actions.updateUser(userID, updatedUser));
    }

    async function uploadProfileImage(image){

        let folder = await actions.checkUserFolder(user.Title);
        dispatch(actions.updateUserImage(user.Title, image[0])).then( imageData => {
            const updatedUser = {
                First_Name: data.First_Name,
                Last_Name: data.Last_Name,
                Email: data.Email,
                Image: imageData['ServerRelativeUrl']
            };

            dispatch(actions.updateUser(userID, updatedUser));
            setProfile(imageData['ServerRelativeUrl']);
            setData({
                ...data,
                Image: imageData['ServerRelativeUrl']
            });

        });

    }

    return card == true ? (
            <Paper className={classes.paper}>
                <AppLoader isLoading={loading} />
                <Grid container className={dlaStyles.myAccount}>
                    <Grid item xs={5} style={{alignItems:'center', justifyContent:'center', display:'flex'}}>
                        <input accept="image/*" className={classes.fileInput} id="icon-button-file" type="file" onChange={(e) => uploadProfileImage(e.target.files)}/>
                        <label htmlFor="icon-button-file">
                            <IconButton className={dlaStyles.profile_image_container}  color="primary" aria-label="upload picture" component="span">
                            {(profile) ?
                                <div className={dlaStyles.profile_image_container} style={{ backgroundImage: `url("${profile}")`, backgroundSize:"cover" }}>
                                </div>
                                :
                                <AccountCircleIcon className={classes.profileInput} />
                            }
                            </IconButton>
                        </label>
                    </Grid>
                    <Grid className={dlaStyles.user_info} item xs={7}>
                        {group === 'dlaAdmin' && <h1> ECM ADMIN </h1>}
                        {group === 'etmAdmin' && <h1> ECM ADMIN </h1>}
                        {group === 'program' && <h1> PROGRAM MANAGER </h1>}
                        {group === 'peo' && <h1> PEO </h1>}
                        {group === 'portfolio' && <h1> PORTFOLIO MANAGER </h1>}
                        <h2> {data.First_Name + ' ' + data.Last_Name} </h2>
                    </Grid>
                    <Grid item xs={12}>
                        <form className={classes.form} noValidate autoComplete="off">
                            <TextField
                                id="filled-full-width"
                                label="First Name"
                                style={{ marginBottom: 8 }}
                                defaultValue={data.First_Name}
                                fullWidth
                                onChange={setState('First_Name')}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="filled"
                            />
                            <TextField
                                id="filled-full-width"
                                label="Last Name"
                                style={{ marginBottom: 8 }}
                                defaultValue={data.Last_Name}
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
                                defaultValue={data.Email}
                                fullWidth
                                onChange={setState('Email')}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="filled"
                            />
                            <TextField
                                id="filled-full-width"
                                label="JCODE"
                                style={{ marginBottom: 8 }}
                                defaultValue={data.JCODE}
                                fullWidth
                                onChange={setState('JCODE')}
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
            )
            : <div>
                <h5>
                    Welcome to your dashboard!
                    <img className={classes.avatar} src={profile} alt=""/>
                    <span>{data.First_Name + ' ' + data.Last_Name}</span>
                </h5>
            </div>;
}

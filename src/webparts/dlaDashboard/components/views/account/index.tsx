import * as React from 'react';
import * as XLSX from 'xlsx';
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
import { actions } from '../../../models/programs';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
    root: {
        '& > *': {
            padding: theme.spacing(0),
          },
    },
    deleteButton: {
        padding: 7, background: '#0B497A', color: 'white', marginBottom: 20
        , cursor: 'pointer', borderRadius: 5, display: 'inline-block'
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

    console.log('Account page  for user:', user);


    async function replaceBudgets(event){
        console.log('replacing budgets');
        event.preventDefault();
        convertBudgets();
    }

    const [data, setData] = React.useState({
        First_Name: user.First_Name || "",
        Last_name: user.Last_name || "",
        Email: user.Email || "",
        Image: user.Image || ""
    });

    const convertBudgets = () => {

        // const URL = 'https://codicast1.sharepoint.com/Shared%20Documents/Budget%20Dummy%20Data.xlsx';
        const URL = 'https://dlamil.dps.mil/teams/C36/N71/TestForDB/ALLPEOs.xlsx';

        const loadXLSX = url => {
            return new Promise((resolve, reject) => {
                const req = new XMLHttpRequest();
                req.open("GET", url, true);
                req.responseType = "arraybuffer";
                req.onload = _ => resolve(XLSX.read(new Uint8Array(req.response), {type:"array"}));
                req.onerror = e => reject(e);
                req.send();
            });
        };

        const sheetToJson = sheet => {
            const rows: any = Object.values(sheet)[0];
            const keys = rows[0];
            const result = [];
            const loop = n =>
                result.push((Object as any).fromEntries(keys.map((_, l) => [keys[l], rows[n][l]])));

            for (var i = 1; i < rows.length; i++) loop(i);
            return result;
        };

        const getSpreadSheetData = async spreadsheet => {
            const sheetNames = spreadsheet.SheetNames;
            if (sheetNames.length) {
                const sheets = sheetNames.map(name => {
                    const _ref = {};
                    const ws = spreadsheet.Sheets[name];
                    const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
                    return _ref[name] = dataParse, _ref;
                });
                const sheetData = sheetToJson(sheets[0]);
                const load = await dispatch(actions.replaceProgramBudgets(sheetData));
                console.log('parsed spreadsheet data: ', sheetData);
                console.log("spreadsheet data replaced?", load);
            } else {
                console.log('No spreadsheets found.');
            }
        };

        const handleDownload = () => loadXLSX(URL)
            .then((spreadsheet) => (console.log('got spreadsheet data', spreadsheet), getSpreadSheetData(spreadsheet)))
            .catch((error) => console.error('error loading spreadsheet: ', error));

        handleDownload();

    };

    return (
        <div id={dlaStyles.pfAccount}>
            {user.ID ? (
                <div>
                    <h5>Welcome to your dashboard!</h5>
                    <a className={classes.deleteButton} href="#"
                        onClick={(event) => replaceBudgets(event)}>
                        Refresh Budget Info
                    </a>
                    <Grid container spacing={5}>
            
                        <Grid item sm={12} md={3}>
                            <MyAccount user={user} />
                        </Grid>
                        <Grid item sm={12} md={9}>
                            
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <div className="scoreCard">
                                        {programs && programs.list && group === 'admin' && <OverallCompositeScores etmTitle='Composite Scores' />}
                                        {group === 'peo' && <div><h3 className={dlaStyles.listTitle}>Composite Scores</h3><ListPrograms userID={user.ID} navigate={true} /></div>}
                                    </div>
                                </Grid>
                                <Grid item xs={6}>
                                    <div className="scoreCard">
                                        {/* {group === 'admin' && <ListAdminAccounts />} */}
                                        {group === 'peo' && <div>
                                            {/* <h3 className={dlaStyles.listTitle}>Program History</h3> */}
                                        <ListHistory /></div>}
                                    </div>
                                </Grid>
                            </Grid>
                            
                        </Grid>
                        
                    </Grid>
                </div>
                    
                ) : null}
                
        </div>
    );
}

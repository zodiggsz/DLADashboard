import * as React from 'react';
import * as XLSX from 'xlsx';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import classNames from 'classnames/bind';
import { useSelector, useDispatch } from 'react-redux';
import { actions } from '../../../../models/programs';
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';
// import { useToasts } from 'react-toast-notifications';
import { toast } from 'react-toastify';
import scoreStyles from '../index.module.scss';
let cx = classNames.bind(scoreStyles);

const StyledTableCell = withStyles(theme => ({
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
    table: {
      width: "100%",
    },
    deleteButton: {
        padding: 7, background: 'white', color: '#0B497A', marginBottom: 20
        , cursor: 'pointer', borderRadius: 5, display: 'inline-block',
        '& a': { color: 'white' }
    },
    paper: {
        overflow:"hidden",
        padding: '20px',
        position: "relative",
        textAlign: 'center',
        borderRadius:20
    },
    box : {
        borderRadius: 3,
        padding: 10,
        textAlign: 'center',
        cursor: 'pointer',
        // color: 'white',
        // fontWeight: 'bold'
    }
  }));

function ScoreResult({ label, original=0, target=0, compositeResults=false }) {
    let composite = cx({
        compositeResults: compositeResults
    });

    let originalResults = cx({
        green: original >= 3.76,
        yellow: original < 3.76 && original > 2.50,
        red: original < 2.50 && original > 1,
        neutral: original == 0 || original == 0.0
    });

    let targetResults = cx({
        green: target >= 3.76,
        yellow: target < 3.76 && target > 2.50,
        red: target < 2.50 && target > 1,
        neutral: target == 0 || target == 0.0
    });

    return (
        <StyledTableRow className={composite}>
            <StyledTableCell align="center" className={scoreStyles.labelCell}>{label}</StyledTableCell>
            <StyledTableCell align="center" className={compositeResults ? targetResults : scoreStyles.targetCell}>{target}</StyledTableCell>
            <StyledTableCell align="center" className={compositeResults ? originalResults : scoreStyles.originCell}>{original}</StyledTableCell>
        </StyledTableRow>
    );
}

interface Results {
    OriginalScore: number;
    TargetScore: number;
}

interface Total {
    CompositeScore: number;
    TotalScore: number;
}

interface ScoreProps {
    governance: Results;
    people: Results;
    technology: Results;
    strategy: Results;
    operations: Results;
    total: Total;
}


interface ProgramData {
    ID: number;
    Acronym: string;
}

const defaultProgramData = {
    ID: 0,
    Acronym: 'Program'
};

(window as any).budgets = [];

export default function Budget() {
    const dispatch = useDispatch();
    const classes = useStyles();
    const selectedProgram = useSelector(state => state.programs.program);
    const [program, setProgram] = React.useState<ProgramData>(defaultProgramData);
    const [loading, setLoading] = React.useState(false);
    const budgets = useSelector((state) => state.programs.programBudgets);

    console.log("budgets: ", budgets);


    async function replaceBudgets(event){
        console.log('replacing budgets');
        event.preventDefault();
        if (!loading) setLoading(true), convertBudgets();
    }

    const convertBudgets = () => {
        // const URL = 'https://codicast1.sharepoint.com/Shared%20Documents/ALLPEOs-1.xlsx';
        // const URL = 'https://codicast1.sharepoint.com/Shared%20Documents/PEODBTEST.xlsx';
        // const URL = 'https://codicast1.sharepoint.com/Shared%20Documents/DFWB.xlsx';
        // const URL = 'https://codicast1.sharepoint.com/Shared%20Documents/ALLPEOs.xlsx';
        // const URL = 'https://dlamil.dps.mil/teams/C36/N71/TestForDB/ALLPEOs.xlsx';
        const URL = 'https://dlamil.dps.mil/sites/SPO_PEODashboard/Shared%20Documents/FY21%20DFW%20Requirements.xlsx';
        // const URL = 'https://dlamil.dps.mil/sites/STAGE_PEODashboard/Shared%20Documents/FY21%20DFW%20Requirements.xlsx';

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
                const sheets = sheetNames.filter(n => n.includes("Requirement")).map(name => {
                    const _ref = {};
                    const ws = spreadsheet.Sheets[name];
                    const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '', raw: false });
                    return _ref[name] = dataParse, _ref;
                });
                console.log('got sheets: ', sheets);
                const sheetData = sheetToJson(sheets[0]).filter(d => d.MANAGING_ESA === "PEO - J62");
                const load = await dispatch(actions.replaceProgramBudgets(sheetData));
                console.log('parsed spreadsheet data: ', sheetData);
                console.log("spreadsheet data replaced?", load);
                if (load) toast.success(`Budget Data updated successfully.`), setLoading(false), loadBudgets();
                else toast.error(`ERROR updating Budget Data.`), setLoading(false);
            } else {
                console.log('No spreadsheets found.');
            }
        };

        const handleDownload = () => loadXLSX(URL)
            .then((spreadsheet) => (console.log('got spreadsheet data', spreadsheet), getSpreadSheetData(spreadsheet)))
            .catch((error) => console.error('error loading spreadsheet: ', error));

        handleDownload();
    };

    const commalize = n => {
        if (!n) return '0.00';
        let digits = Number(n).toFixed(2).split('').reverse(), decimals = digits.splice(0, 3);
        for (let i = 0, l = digits.length; i < l; i++) if (i>0&&i%3===0) digits[i]+=',';
        return decimals.concat(digits).reverse().join('');
    };

    const agregate = key => {
        const BUDGETS = budgets.budgets;
        if (BUDGETS.length === 1) return commalize(BUDGETS[0][key]);
        const commas = commalize(BUDGETS.map(b=>b[key].toString().replace(/,/g, ''))
            .reduce((a, b)=>(Number(a)||0)+(Number(b)||0)));
        return commas;
    };

    React.useEffect(() => {
        if(selectedProgram){
            if(selectedProgram.ID && program.ID !== selectedProgram.ID){
                setProgram(selectedProgram);
                loadBudgets();
            }
        }
    }, [selectedProgram]);

    async function loadBudgets(){
        const load = await dispatch(actions.getProgramBudgets(selectedProgram.Acronym));
    }

    let ifBudgets = budgets.budgets.length;
    return (    
        <Grid container id={scoreStyles.scorecard}>
            <Grid container spacing={2} style={{marginBottom: 10}}>
                <Grid item xs>
                    <Paper className={classes.box} style={{background: 'purple'}}>
                        Revised Authority
                        <h4>{ifBudgets&&agregate('REVISED_AUTHORITY')?'$'+agregate('REVISED_AUTHORITY'):'N/A'}</h4>
                    </Paper>
                </Grid>
                <Grid item xs>
                    <Paper className={classes.box} style={{background: 'pink'}}>
                        Anticipated Reim
                        <h4>{ifBudgets&&agregate('ANTICIPATED_REIMB_AUTH')?'$'+agregate('ANTICIPATED_REIMB_AUTH'):'N/A'}</h4>
                    </Paper>
                </Grid>
                <Grid item xs>
                    <Paper className={classes.box} style={{background: 'green'}}>
                        Received Reim
                        <h4>{ifBudgets&&agregate('REIMB_AUTH_RCVD')?'$'+agregate('REIMB_AUTH_RCVD'):'N/A'}</h4>
                    </Paper>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs>
                    <Paper className={classes.box} style={{background: 'yellow'}}>
                        UFR
                        <h4>{ifBudgets&&agregate('UFR_AMT')?'$'+agregate('UFR_AMT'):'N/A'}</h4>
                    </Paper>
                </Grid>
                <Grid item xs>
                    <Paper className={classes.box} style={{background: 'blue'}}>
                        Committed
                        <h4>{ifBudgets&&agregate('COMMITMENT_AMT')?'$'+agregate('COMMITMENT_AMT'):'N/A'}</h4>
                    </Paper>
                </Grid>
                <Grid item xs>
                    <Paper className={classes.box} style={{background: 'grey'}}>
                        Obligated
                        <h4>{ifBudgets&&agregate('ACTUAL_OBL_AMT')?'$'+agregate('ACTUAL_OBL_AMT'):'N/A'}</h4>
                    </Paper>
                </Grid>
            </Grid>
            <div style={{width:'100%', textAlign:'center', paddingTop: 25, opacity:loading?0.3:1}}>
                <a className={classes.deleteButton} href="#"
                    style={loading?{cursor:'default'}:{}}
                    onClick={(event) => replaceBudgets(event)}>
                    { loading? 'Refreshing...' : 'Refresh Budget Overview' }
                </a>
            </div>
            <div style={{width:'100%', textAlign:'center', paddingBottom: 15}}>
                {loading ? <div className={scoreStyles.throbber}></div> :null }
            </div>
        </Grid>
            
    );
}

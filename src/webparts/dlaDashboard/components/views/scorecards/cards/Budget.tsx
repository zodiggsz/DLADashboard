import * as React from 'react';
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

export default function Budget() {
    const dispatch = useDispatch();
    const classes = useStyles();
    const selectedProgram = useSelector(state => state.programs.program);
    const [program, setProgram] = React.useState<ProgramData>(defaultProgramData);
    const budgets = useSelector((state) => state.programs.programBudgets);


    console.log("budgets: ", budgets);

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

    let ifBudgets = budgets.budgets.length, b = budgets.budgets[0];
    return (    
        <Grid container id={scoreStyles.scorecard}>

            <Grid container spacing={2} style={{marginBottom: 10}}>
                <Grid item xs>
                    <Paper className={classes.box} style={{background: 'purple'}}>
                        Revised Authority
                        <h4>{ifBudgets?'$'+0:'N/A'}</h4>
                    </Paper>
                </Grid>
                <Grid item xs>
                    <Paper className={classes.box} style={{background: 'pink'}}>
                        Anticipated Reim
                        <h4>{ifBudgets?'$'+b.Anticipated_x0020_Reimbursable_x:'N/A'}</h4>
                    </Paper>
                </Grid>
                <Grid item xs>
                    <Paper className={classes.box} style={{background: 'green'}}>
                        Received Reim
                        <h4>{ifBudgets?'$'+b.Reimbursable_x0020_Authority_x00:'N/A'}</h4>
                    </Paper>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs>
                    <Paper className={classes.box} style={{background: 'yellow'}}>
                        UFR
                        <h4>{ifBudgets?'$'+b.UFR_x0020_Amount:'N/A'}</h4>
                    </Paper>
                </Grid>
                <Grid item xs>
                    <Paper className={classes.box} style={{background: 'blue'}}>
                        Committed
                        <h4>{ifBudgets?'$'+b.Commitment_x0020_Amount:'N/A'}</h4>
                    </Paper>
                </Grid>
                <Grid item xs>
                    <Paper className={classes.box} style={{background: 'grey'}}>
                        Obligated
                        <h4>{ifBudgets?'$'+b.Actual_x0020_Obligation_x0020_To:'N/A'}</h4>
                    </Paper>
                </Grid>
            </Grid>

        </Grid>
            
    );
}

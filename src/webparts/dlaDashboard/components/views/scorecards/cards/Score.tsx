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
            <StyledTableCell align="center" className={compositeResults ? targetResults : scoreStyles.targetCell}>{target === 0 ? 'N/A' : target}</StyledTableCell>
            <StyledTableCell align="center" className={compositeResults ? originalResults : scoreStyles.originCell}>{original === 0 ? 'N/A' : original}</StyledTableCell>
        </StyledTableRow>
    );
}

interface Results {
    OriginalScore: any;
    TargetScore: any;
}

interface Total {
    CompositeScore: any;
    TotalScore: any;
}

interface ScoreProps {
    governance: Results;
    people: Results;
    technology: Results;
    strategy: Results;
    operations: Results;
    total: Total;
}

export default function Score(props: ScoreProps) {
    const { governance, people, technology, strategy, operations, total } = props;
    const classes = useStyles();

    return (    
        <Grid container id={scoreStyles.scorecard}>

            <Grid item xs={12}>
                <Paper className={classes.paper}>
                <TableContainer>
                    <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">LENS</StyledTableCell>
                            <StyledTableCell align="center">ORIGINAL</StyledTableCell>
                            <StyledTableCell align="center">POST-IMPROVEMENT</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        <ScoreResult
                            label="People & Culture"
                            original={parseFloat(people.OriginalScore) === 0 ? 'N/A' : people.OriginalScore}
                            target={parseFloat(people.TargetScore) === 0 ? 'N/A' : people.TargetScore}
                        />
                        
                        <ScoreResult
                            label="Strategy"
                            original={parseFloat(strategy.OriginalScore) === 0 ? 'N/A' : strategy.OriginalScore}
                            target={parseFloat(strategy.TargetScore) === 0 ? 'N/A' : strategy.TargetScore}
                        />
                        
                        <ScoreResult
                            label="Operations"
                            original={parseFloat(operations.OriginalScore) === 0 ? 'N/A' : operations.OriginalScore}
                            target={parseFloat(operations.TargetScore) === 0 ? 'N/A' : operations.TargetScore}
                        />

                        <ScoreResult
                            label="Governance"
                            original={parseFloat(governance.OriginalScore) === 0 ? 'N/A' : governance.OriginalScore}
                            target={parseFloat(governance.TargetScore) === 0 ? 'N/A' : governance.TargetScore}
                        />
                                                
                        <ScoreResult
                            label="Technology"
                            original={parseFloat(technology.OriginalScore) === 0 ? 'N/A' : technology.OriginalScore}
                            target={parseFloat(technology.TargetScore) === 0 ? 'N/A' : technology.TargetScore}
                        />
                        
                        <ScoreResult
                            label="Composite Score"
                            compositeResults={true}
                            original={parseFloat(total.CompositeScore) === 0 ? 'N/A' : total.CompositeScore}
                            target={parseFloat(total.TotalScore) === 0 ? 'N/A' : total.TotalScore}
                        />
                    </TableBody>
                    </Table>
                </TableContainer>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <section className={scoreStyles.legendText}>
                        The following scores are based on critical factors across the following 
                        five lenses: Strategy, Operations, Technology, People & Culture and 
                        Governance. Each lens and the composite are scored on a 5 point scale. 
                        Further, each lens is weighted and those weights are included in the 
                        calculation of the composite score. The scores are based on research, 
                        analysis of data, and interviews with government and contract personnel 
                        from the Functional Sponsor and Program Management Office, Customers, and 
                        System Vendors and Integrators.
                </section>
                <div className={scoreStyles.legend}>

                    <h1>LEGEND</h1>
                    <Grid container>
                        <Grid item xs={4}>
                            <div className={scoreStyles.indicatorContainer}>
                                <div className={`${scoreStyles.indicator} ${scoreStyles.red}`}></div>
                                <h3 className={scoreStyles.text}>1 - 2.50</h3>
                            </div>
                        </Grid>
                        <Grid item xs={4}>
                            <div className={scoreStyles.indicatorContainer}>
                                <div className={`${scoreStyles.indicator} ${scoreStyles.yellow}`}></div>
                                <h3 className={scoreStyles.text}>2.51 - 3.75</h3>
                            </div>
                        </Grid>
                        <Grid item xs={4}>
                            <div className={scoreStyles.indicatorContainer}>
                                <div className={`${scoreStyles.indicator} ${scoreStyles.green}`}></div>
                                <h3 className={scoreStyles.text}>3.76 - 5</h3>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </Grid>
        </Grid>
            
    );
}

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
import { Button } from 'reactstrap';
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

function GoalResult({ label, goal=0, compositeResults=false }) {
    let composite = cx({
        compositeResults: compositeResults
    });

    let results = cx({
        green: goal >= 3.76,
        yellow: goal < 3.76 && goal > 2.50,
        red: goal < 2.50 && goal > 1,
        neutral: goal == 0 || goal == 0.0
    });

    return (
        <StyledTableRow className={composite}>
            <StyledTableCell align="center" className={scoreStyles.labelCell}>{label}</StyledTableCell>
            <StyledTableCell align="center" className={scoreStyles.targetCell}>{goal === 0 ? 'N/A' : goal}</StyledTableCell>
        </StyledTableRow>
    );
}

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
    GoalScore: any;
}

interface Total {
    CompositeScore: any;
    TotalScore: any;
    TotalGoal: any;
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
    const [showGoalScores, setShowGoalScores] = React.useState(false);

    return (
        <Grid container id={scoreStyles.scorecard}>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
            <div>
              <div className={scoreStyles.goalScores}>
                {showGoalScores ?
                  <Button
                    onClick={() => setShowGoalScores(false)}
                  >
                    Hide Goal Scores
                  </Button>
                :
                  <Button
                    onClick={() => setShowGoalScores(true)}
                  >
                    Show Goal Scores
                  </Button>
                }
              </div>
                {/* <div className={scoreStyles.lens}>
                    <GoalScoreItem label="People & Culture" goalScore={scores.people.GoalScore || 'N/A'} />
                    <GoalScoreItem label="Strategy" goalScore={scores.strategy.GoalScore || 'N/A'} />
                    <GoalScoreItem label="Operations" goalScore={scores.operations.GoalScore || 'N/A'} />
                    <GoalScoreItem label="Governance" goalScore={scores.governance.GoalScore || 'N/A'} />
                    <GoalScoreItem label="Technology" goalScore={scores.technology.GoalScore || 'N/A'} />
                </div> :
                <div className={scoreStyles.lens}>
                    <Item label="People & Culture" score={!scores.people.OriginalScore ? scores.people.TargetScore || 'N/A' : scores.people.OriginalScore} />
                    <Item label="Strategy" score={!scores.strategy.OriginalScore ? scores.strategy.TargetScore || 'N/A' : scores.strategy.OriginalScore} />
                    <Item label="Operations" score={!scores.operations.OriginalScore ? scores.operations.TargetScore || 'N/A' : scores.operations.OriginalScore} />
                    <Item label="Governance" score={!scores.governance.OriginalScore ? scores.governance.TargetScore || 'N/A' : scores.governance.OriginalScore} />
                    <Item label="Technology" score={!scores.technology.OriginalScore ? scores.technology.TargetScore || 'N/A' : scores.technology.OriginalScore} />
                </div> */}
                </div>
                <TableContainer>
                    <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                          <StyledTableCell align="center">LENS</StyledTableCell>
                          {
                            showGoalScores ?
                            <StyledTableCell align="center">GOAL</StyledTableCell>
                            :
                            <StyledTableCell align="center">ORIGINAL</StyledTableCell>
                          }
                          {
                            showGoalScores ? null
                            :
                            <StyledTableCell align="center">POST-IMPROVEMENT</StyledTableCell>
                          }
                        </TableRow>
                    </TableHead>
                    <TableBody>

                      {
                        showGoalScores ?
                          <GoalResult
                              label="People & Culture"
                              goal={people.GoalScore || 0}
                          />
                        :
                        <ScoreResult
                            label="People & Culture"
                            original={people.OriginalScore || 'N/A'}
                            target={people.TargetScore || 'N/A'}
                        />
                      }

                      {
                        showGoalScores ?
                          <GoalResult
                              label="Strategy"
                              goal={strategy.GoalScore || 0}
                          />
                        :
                        <ScoreResult
                            label="Strategy"
                            original={strategy.OriginalScore || 'N/A'}
                            target={strategy.TargetScore || 'N/A'}
                        />
                      }

                      {
                        showGoalScores ?
                          <GoalResult
                              label="Operations"
                              goal={operations.GoalScore || 0}
                          />
                        :
                        <ScoreResult
                            label="Operations"
                            original={operations.OriginalScore || 'N/A'}
                            target={operations.TargetScore || 'N/A'}
                        />
                      }

                      {
                        showGoalScores ?
                          <GoalResult
                              label="Governance"
                              goal={governance.GoalScore || 0}
                          />
                        :
                        <ScoreResult
                            label="Governance"
                            original={governance.OriginalScore || 'N/A'}
                            target={governance.TargetScore || 'N/A'}
                        />
                      }

                      {
                        showGoalScores ?
                          <GoalResult
                              label="Technology"
                              goal={technology.GoalScore || 0}
                          />
                        :
                        <ScoreResult
                            label="Technology"
                            original={technology.OriginalScore || 'N/A'}
                            target={technology.TargetScore || 'N/A'}
                        />
                      }

                      {
                        showGoalScores ?
                          <GoalResult
                              label="Composite Score"
                              compositeResults={true}
                              goal={total.TotalGoal || 0}
                          />
                        :
                        <ScoreResult
                            label="Composite Score"
                            compositeResults={true}
                            original={total.CompositeScore || 'N/A'}
                            target={total.TotalScore || 'N/A'}
                        />
                      }
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

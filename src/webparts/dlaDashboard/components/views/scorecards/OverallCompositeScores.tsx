import * as React from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import classNames from 'classnames/bind';
import scoreStyle from './index.module.scss';
import { actions } from '../../../models/programs';

let cx = classNames.bind(scoreStyle);
const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
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

const StyledTableRow = withStyles((theme: Theme) =>
createStyles({
    root: {
        borderBottom:0,
        '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.background.default,
        },
    },
}))(TableRow);

const useStyles = makeStyles({
    table: {
      width: "100%",
    },
    paper: {
        overflow:"scroll",
        position: "relative",
        textAlign: 'center',
        borderRadius:20,
        maxHeight:400,
    },
  });

function EtmResult({ label, name, original, result=false }) {
    let data = original ? Number(original).toFixed(2) : 0.00;
    let scoreResults = cx({
        score: true,
        basic: data === 0,
        green: data >= 3.76,
        yellow: data < 3.76 && data > 2.50,
        red: data <= 2.50
    });

    let showResult = cx({
        result: result
    });

    return (
        <StyledTableRow className={showResult}>
            <StyledTableCell align="center" className={scoreStyle.labelCell}>{label}</StyledTableCell>
            <StyledTableCell align="center" 
                style={{width:80}}
                className={scoreResults}>
                {original}
            </StyledTableCell>
        </StyledTableRow>
    );
}

export default function OverallCompositeScores(props) {
    const dispatch = useDispatch();
    const classes = useStyles();
    const programs = useSelector((state) => state.programs.list);
    const [score, setScore] = React.useState({});
    const { etmTitle="ETM Scorecard Results" } = props;

    React.useEffect(() => {

        if(programs.length > 0){
            collectScores();
        }

    }, [programs]);

    function collectScores(){

        programs.map((item) => {
            actions.getCompositeScore(item.ID).then(data => {
                
                if(data){
                    setScore( scores => ({
                        ...scores,
                        [item.Acronym]:data['CompositeScore'],
                    }));
                    
                }else{
                    setScore( scores => ({
                        ...scores,
                        [item.Acronym]:0,
                    }));
                }
                
                
            });
            
        });
    }
    
    return (    
        <Grid container id={scoreStyle.scorecard}>

            <Grid item xs={12}>
                <Paper className={classes.paper}>
                <h1 className={scoreStyle.scorecard}>{etmTitle}</h1>
                <TableContainer>
                    <Table className={classes.table} aria-label="customized table">
                    <TableBody>
                    {programs.map((item) => {

                        return (
                            <EtmResult
                                name="score"
                                label={item.Acronym}
                                result={true}
                                original={score[item.Acronym]}
                            />
                        );

                    })}
                        
                    </TableBody>
                    </Table>
                </TableContainer>
                    
                </Paper>
                
            </Grid>
            
        </Grid>
            
    );
}

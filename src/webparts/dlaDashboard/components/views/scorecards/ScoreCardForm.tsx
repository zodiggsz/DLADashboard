import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import ProgramSelector from './ProgramSelector';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import scoreStyles from './index.module.scss';
import { actions } from '../../../models/programs';

const useStyles = makeStyles({
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
  });

interface ScoreData {
    ProgramID: number;
    Title: string;
    OriginalScore: number;
    TargetScore: number;
    TotalScoreID: number;
}

interface ProgramData {
    ID: number;
    Acronym: string;
}

const defaultData = {
    ProgramID: 0,
    Title: '',
    OriginalScore: 0,
    TargetScore: 0,
    TotalScoreID: 0
};

const defaultProgramData = {
    ID: 0,
    Acronym: ''
};

export default function ScoreCardForm() {
    const dispatch = useDispatch();
    const classes = useStyles();
    const scores = useSelector(state => state.programs.programScores);
    const selectedProgram = useSelector(state => state.programs.program);
    const [program, setProgram] = React.useState<ProgramData>(defaultProgramData);
    const [governance, setGovernance] = React.useState<ScoreData>(defaultData);
    const [people, setPeople] = React.useState<ScoreData>(defaultData);
    const [technology, setTechnology] = React.useState<ScoreData>(defaultData);
    const [strategy, setStrategy] = React.useState<ScoreData>(defaultData);
    const [operations, setOperations] = React.useState<ScoreData>(defaultData);
    const [totalOriginal, setTotalOriginal] = React.useState('');
    const [totalTarget, setTotalTarget] = React.useState('');

    React.useEffect(() => {

        if(Object.keys(scores).length > 0){
            
            setProgram(selectedProgram);
            setGovernance(scores.governance);
            setOperations(scores.operations);
            setPeople(scores.people);
            setStrategy(scores.strategy);
            setTechnology(scores.technology);
            actions.getCompositeScore(selectedProgram.ID).then(data => {
                setTotalOriginal(data.CompositeScore);
                setTotalTarget(data.TotalScore);
            });

        }

    }, [scores]);

    React.useEffect(() => {

        console.log(totalOriginal);

    }, [totalOriginal]);

    function governanceChange(key) {
        
        return (e) => {

            const value = e.target.value;
            setGovernance({
                ...governance,
                [key]: (value >= 0 && value <= 5) ? value : Math.min(Math.max(Number(value), 0), 5)
            });
        };
    }

    function peopleChange(key) {
        
        return (e) => {

            const value = e.target.value;
            setPeople({
                ...people,
                [key]: (value >= 0 && value <= 5) ? value : Math.min(Math.max(Number(value), 0), 5)
            });
        };
    }

    function technologyChange(key) {
        
        return (e) => {

            const value = e.target.value;
            setTechnology({
                ...technology,
                [key]: (value >= 0 && value <= 5) ? value : Math.min(Math.max(Number(value), 0), 5)
            });
        };
    }

    function strategyChange(key) {
        
        return (e) => {

            const value = e.target.value;
            setStrategy({
                ...strategy,
                [key]: (value >= 0 && value <= 5) ? value : Math.min(Math.max(Number(value), 0), 5)
            });
        };
    }

    function operationsChange(key) {
        
        return (e) => {

            const value = e.target.value;
            setOperations({
                ...operations,
                [key]: (value >= 0 && value <= 5) ? value : Math.min(Math.max(Number(value), 0), 5)
            });
        };
    }

    const onProgramChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
        const value = event.target.value;
        const prog = await dispatch(actions.getProgramByID(value));
        const calc = await dispatch(actions.getProgramScores(value, 'latest'));

    };

    function calcAvgOrig() {
        return ((
            (Number(governance.OriginalScore) * .10) + 
            (Number(operations.OriginalScore) * .10) + 
            (Number(people.OriginalScore) * .17) + 
            (Number(strategy.OriginalScore) * .35) + 
            (Number(technology.OriginalScore)) * .28)
        ).toFixed(2);
    }

    function calcAvgTarget() {
        return ((
            (Number(governance.TargetScore) * .10) + 
            (Number(operations.TargetScore) * .10) + 
            (Number(people.TargetScore) * .17) + 
            (Number(strategy.TargetScore) * .35) + 
            (Number(technology.TargetScore)) * .28)
        ).toFixed(2);
    }

    function originalScoreInput() {

        return (e) => {
            console.log(e.target.value);
            setTotalOriginal(e.target.value);
        };

    }

    function targetScoreInput() {

        return (e) => {
            console.log(e.target.value);
            setTotalTarget(e.target.value);
        };

    }

    async function onSubmit() {
    
        const composite_scores = {
            ProgramID: program.ID,
            Title: program.Acronym,
            CompositeScore: totalOriginal,
            TotalScore: totalTarget
        };

        const result = await dispatch(actions.addCompositeScore(composite_scores));
        console.log(result.data.ID);
        const update = {
            TotalScoreID: result.data.ID,
            ProgramID: program.ID,
            Title: program.Acronym
        };

        const updateGovernance = { 
            ...update, 
            OriginalScore: governance.OriginalScore,
            TargetScore: governance.TargetScore
        };
        const updatePeople = { 
            ...update, 
            OriginalScore: people.OriginalScore,
            TargetScore: people.TargetScore
        };
        const updateStrategy = { 
            ...update, 
            OriginalScore: strategy.OriginalScore,
            TargetScore: strategy.TargetScore
        };
        const updateTechnology = { 
            ...update, 
            OriginalScore: technology.OriginalScore,
            TargetScore: technology.TargetScore
        };
        const updateOperations = { 
            ...update, 
            OriginalScore: operations.OriginalScore,
            TargetScore: operations.TargetScore
        };

        dispatch(actions.addScore(updateGovernance, 'Program_Governance'));
        dispatch(actions.addScore(updatePeople, 'Program_People_Culture'));
        dispatch(actions.addScore(updateStrategy, 'Program_Strategy'));
        dispatch(actions.addScore(updateTechnology, 'Program_Technology'));
        dispatch(actions.addScore(updateOperations, 'Program_Operations'));

    }
        
    return (
        <Paper className={classes.paper}>
         <header>
            <h1 className={scoreStyles.header}>Create ECM Scorecard</h1>
        </header>
        <form onSubmit={onSubmit} className={scoreStyles.governanceInput}>
            <Grid container spacing={2}>
                
                    <Grid item xs={12}><ProgramSelector value={program.ID} onChange={onProgramChange} /></Grid>

                    <Grid item xs={4}><span className={scoreStyles.label}>People & Culture</span></Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="outlined-number"
                            label="Original"
                            type="number"
                            value={people.TargetScore}
                            onChange={peopleChange('TargetScore')}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="outlined-number"
                            label="Post-Improvement"
                            type="number"
                            value={people.OriginalScore}
                            onChange={peopleChange('OriginalScore')}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={4}><span className={scoreStyles.label}>Strategy</span></Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="outlined-number"
                            label="Original"
                            type="number"
                            value={strategy.TargetScore}
                            onChange={strategyChange('TargetScore')}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="outlined-number"
                            label="Post-Improvement"
                            type="number"
                            value={strategy.OriginalScore}
                            onChange={strategyChange('OriginalScore')}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={4}><span className={scoreStyles.label}>Operations</span></Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="outlined-number"
                            label="Original"
                            type="number"
                            value={operations.TargetScore}
                            onChange={operationsChange('TargetScore')}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="outlined-number"
                            label="Post-Improvement"
                            type="number"
                            value={operations.OriginalScore}
                            onChange={operationsChange('OriginalScore')}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={4}><span className={scoreStyles.label}>Governance</span></Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="outlined-number"
                            label="Original"
                            type="number"
                            value={governance.TargetScore}
                            onChange={governanceChange('TargetScore')}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="outlined-number"
                            label="Post-Improvement"
                            type="number"
                            value={governance.OriginalScore}
                            onChange={governanceChange('OriginalScore')}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={4}><span className={scoreStyles.label}>Technology</span></Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="outlined-number"
                            label="Original"
                            type="number"
                            value={technology.TargetScore}
                            onChange={technologyChange('TargetScore')}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="outlined-number"
                            label="Post-Improvement"
                            type="number"
                            value={technology.OriginalScore}
                            onChange={technologyChange('OriginalScore')}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={4}><span className={scoreStyles.label}>Composite Score</span></Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="outlined-read-only-input"
                            label="Total Original Score"
                            onChange={targetScoreInput()}
                            value={totalTarget}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            // InputProps={{
                            //     readOnly: true,
                            // }}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="outlined-read-only-input"
                            label="Post Total Score"
                            onChange={originalScoreInput()}
                            value={totalOriginal}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            // InputProps={{
                            //     readOnly: true,
                            // }}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                    <Fab variant="extended" onClick={() => {onSubmit();}} className={scoreStyles.submit} disabled={program.Acronym === ""}>
                    Submit
                    </Fab>
                        
                    </Grid>
            </Grid>

            
        </form>
        </Paper>
    );
}

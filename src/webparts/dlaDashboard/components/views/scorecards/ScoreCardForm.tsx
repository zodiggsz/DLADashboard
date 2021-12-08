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
    TargetScore: number;
    OriginalScore: number;
    GoalScore: number;
    TotalScoreID: number;
}

interface ProgramData {
    ID: number;
    Acronym: string;
}

const defaultData = {
    ProgramID: 0,
    Title: '',
    TargetScore: 0,
    OriginalScore: 0,
    TotalScoreID: 0,
    GoalScore: 0
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
    const [totalTarget, setTotalTarget] = React.useState('');
    const [totalOriginal, setTotalOriginal] = React.useState('');
    const [totalGoal, setTotalGoal] = React.useState('');

    React.useEffect(() => {

        if(Object.keys(scores).length > 0){

            setProgram(selectedProgram);
            setGovernance(scores.governance);
            setOperations(scores.operations);
            setPeople(scores.people);
            setStrategy(scores.strategy);
            setTechnology(scores.technology);
            actions.getCompositeScore(selectedProgram.ID).then(data => {
                setTotalTarget(data.CompositeScore ? data.CompositeScore.split(' ')[0] : '');
                setTotalOriginal(data.TotalScore);
                setTotalGoal(data.TotalGoal)
            });

        }

    }, [scores]);

    React.useEffect(() => {

        console.log(totalTarget);

    }, [totalTarget]);

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
            (Number(governance.TargetScore) * .10) +
            (Number(operations.TargetScore) * .10) +
            (Number(people.TargetScore) * .17) +
            (Number(strategy.TargetScore) * .35) +
            (Number(technology.TargetScore)) * .28)
        ).toFixed(2);
    }

    function calcAvgTarget() {
        return ((
            (Number(governance.OriginalScore) * .10) +
            (Number(operations.OriginalScore) * .10) +
            (Number(people.OriginalScore) * .17) +
            (Number(strategy.OriginalScore) * .35) +
            (Number(technology.OriginalScore)) * .28)
        ).toFixed(2);
    }

    function targetScoreInput() {

        return (e) => {
            console.log(e.target.value);
            setTotalTarget(e.target.value);
        };

    }

    function originalScoreInput() {

        return (e) => {
            console.log(e.target.value);
            setTotalOriginal(e.target.value);
        };

    }

    function goalInput() {

        return (e) => {
            console.log(e.target.value);
            setTotalGoal(e.target.value);
        };

    }

    async function onSubmit() {

        const composite_scores = {
            ProgramID: program.ID,
            Title: program.Acronym,
            CompositeScore: Number(totalTarget) ?
              (Number(totalTarget) || 0) + ' target' :
              (Number(totalOriginal) || 0) + ' original',
            TotalScore: Number(totalOriginal) || 0,
            TotalGoal: Number(totalGoal) || 0
        };

        const result = await dispatch(actions.addCompositeScore(composite_scores));
        console.log("Composite scores added: ", result, composite_scores);
        const update = {
            TotalScoreID: result.data.ID,
            ProgramID: program.ID,
            Title: program.Acronym
        };

        const updateGovernance = {
            ...update,
            TargetScore: governance.TargetScore || 0,
            OriginalScore: governance.OriginalScore || 0,
            GoalScore: governance.GoalScore || 0,
        };
        const updatePeople = {
            ...update,
            TargetScore: people.TargetScore || 0,
            OriginalScore: people.OriginalScore || 0,
            GoalScore: people.GoalScore || 0,
        };
        const updateStrategy = {
            ...update,
            TargetScore: strategy.TargetScore || 0,
            OriginalScore: strategy.OriginalScore || 0,
            GoalScore: strategy.GoalScore || 0,
        };
        const updateTechnology = {
            ...update,
            TargetScore: technology.TargetScore || 0,
            OriginalScore: technology.OriginalScore || 0,
            GoalScore: technology.GoalScore || 0,
        };
        const updateOperations = {
            ...update,
            TargetScore: operations.TargetScore || 0,
            OriginalScore: operations.OriginalScore || 0,
            GoalScore: operations.GoalScore || 0,
        };
        const updateScores = {
            Title: program.Acronym,
            People_Culture_Score: Number(updatePeople.TargetScore) || updatePeople.OriginalScore,
            Strategy_Score: Number(updateStrategy.TargetScore) || updateStrategy.OriginalScore,
            Operations_Score: Number(updateOperations.TargetScore) || updateOperations.OriginalScore,
            Governance_Score: Number(updateGovernance.TargetScore) || updateGovernance.OriginalScore,
            Technology_Score: Number(updateTechnology.TargetScore) || updateTechnology.OriginalScore,
            Date: new Date().toJSON()
        }

        console.log("updating scores: ", updateScores, updatePeople, updateStrategy);

        dispatch(actions.addScore(updateGovernance, 'Program_Governance'));
        dispatch(actions.addScore(updatePeople, 'Program_People_Culture'));
        dispatch(actions.addScore(updateStrategy, 'Program_Strategy'));
        dispatch(actions.addScore(updateTechnology, 'Program_Technology'));
        dispatch(actions.addScore(updateOperations, 'Program_Operations'));
        dispatch(actions.addScore(updateScores, '5LENS_Scores'));

    }

    return (
        <Paper className={classes.paper}>
         <header>
            <h1 className={scoreStyles.header}>Create ECM Scorecard</h1>
        </header>
        <form onSubmit={onSubmit} className={scoreStyles.governanceInput}>
            <Grid container spacing={2}>

                    <Grid item xs={12}><ProgramSelector value={program.ID} onChange={onProgramChange} /></Grid>

                    <Grid item xs={3}><span className={scoreStyles.label}>People & Culture</span></Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="outlined-number"
                            label="Original"
                            type="number"
                            value={people.OriginalScore || ''}
                            onChange={peopleChange('OriginalScore')}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="outlined-number"
                            label="Post-Improvement"
                            type="number"
                            value={people.TargetScore || ''}
                            onChange={peopleChange('TargetScore')}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="outlined-number"
                            label="Goal"
                            type="number"
                            value={people.GoalScore || ''}
                            onChange={peopleChange('GoalScore')}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={3}><span className={scoreStyles.label}>Strategy</span></Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="outlined-number"
                            label="Original"
                            type="number"
                            value={strategy.OriginalScore || ''}
                            onChange={strategyChange('OriginalScore')}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="outlined-number"
                            label="Post-Improvement"
                            type="number"
                            value={strategy.TargetScore || ''}
                            onChange={strategyChange('TargetScore')}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="outlined-number"
                            label="Goal"
                            type="number"
                            value={strategy.GoalScore || ''}
                            onChange={strategyChange('GoalScore')}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={3}><span className={scoreStyles.label}>Operations</span></Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="outlined-number"
                            label="Original"
                            type="number"
                            value={operations.OriginalScore || ''}
                            onChange={operationsChange('OriginalScore')}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="outlined-number"
                            label="Post-Improvement"
                            type="number"
                            value={operations.TargetScore || ''}
                            onChange={operationsChange('TargetScore')}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="outlined-number"
                            label="Goal"
                            type="number"
                            value={operations.GoalScore || ''}
                            onChange={operationsChange('GoalScore')}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={3}><span className={scoreStyles.label}>Governance</span></Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="outlined-number"
                            label="Original"
                            type="number"
                            value={governance.OriginalScore || ''}
                            onChange={governanceChange('OriginalScore')}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="outlined-number"
                            label="Post-Improvement"
                            type="number"
                            value={governance.TargetScore || ''}
                            onChange={governanceChange('TargetScore')}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="outlined-number"
                            label="Goal"
                            type="number"
                            value={governance.GoalScore || ''}
                            onChange={governanceChange('GoalScore')}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={3}><span className={scoreStyles.label}>Technology</span></Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="outlined-number"
                            label="Original"
                            type="number"
                            value={technology.OriginalScore || ''}
                            onChange={technologyChange('OriginalScore')}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="outlined-number"
                            label="Post-Improvement"
                            type="number"
                            value={technology.TargetScore || ''}
                            onChange={technologyChange('TargetScore')}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="outlined-number"
                            label="Goal"
                            type="number"
                            value={technology.GoalScore || ''}
                            onChange={technologyChange('GoalScore')}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={3}><span className={scoreStyles.label}>Composite Score</span></Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="outlined-read-only-input"
                            label="Total Original Score"
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
                    <Grid item xs={3}>
                        <TextField
                            id="outlined-read-only-input"
                            label="Post Total Score"
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
                    <Grid item xs={3}>
                        <TextField
                            id="outlined-read-only-input"
                            label="Goal Total Score"
                            onChange={goalInput()}
                            value={totalGoal}
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

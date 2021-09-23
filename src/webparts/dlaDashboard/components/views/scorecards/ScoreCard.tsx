import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import ProgramSelector from './ProgramSelector';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import scoreStyles from './scorecard.module.scss';
import classNames from 'classnames/bind';
import { actions } from '../../../models/programs';
import Score from './cards/Score';
import Budgets from './cards/Budget';
import Insights from './cards/Insights';
import Improvements from './cards/Improvements';
import './index.scss';

let cx = classNames.bind(scoreStyles);

const style = {
    invertBg: { backgroundColor: '#fff' },
    invertText: { color: '#04487b' },
};

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

interface CompositeData {
    CompositeScore: number;
    TotalScore:number;
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
    Acronym: 'Program'
};

const defaultComposite = {
    CompositeScore: 0,
    TotalScore: 0,
};

function Item({ label, score }) {
    const value = Number(score);
    let scoreResults = cx({
        green: score >= 3.76,
        yellow: score < 3.76 && score > 2.50,
        red: score > 0 && score <= 2.50,
        blue: !score || score == 'N/A'
    });

    return (
        <div className={scoreStyles.item}>
            <div className={scoreStyles.itemTitle}>
                {label}
            </div>
            <div className={scoreStyles.itemScore}>
                <div className={`${scoreStyles.score} ${scoreResults}`}>
                    {score}
                </div>
            </div>
        </div>
    );
}

function GoalScoreItem({ label, goalScore }) {
    const value = Number(goalScore);
    let scoreResults = cx({
        green: goalScore >= 3.76,
        yellow: goalScore < 3.76 && goalScore > 2.50,
        red: goalScore > 0 && goalScore <= 2.50,
        blue: !goalScore || goalScore == 'N/A'
    });

    return (
        <div className={scoreStyles.item}>
            <div className={scoreStyles.itemTitle}>
                {label}
            </div>
            <div className={scoreStyles.itemScore}>
                <div className={`${scoreStyles.goalScore} ${scoreResults}`}>
                    {goalScore}
                </div>
            </div>
        </div>
    );
}

export default function ScoreCard() {
    const dispatch = useDispatch();
    const group = useSelector(state => state.user.data.Group);
    const classes = useStyles();
    const [goalShown, setGoalShown] = React.useState(false);
    const scores = useSelector(state => state.programs.programScores);
    const selectedProgram = useSelector(state => state.programs.program);
    const [program, setProgram] = React.useState<ProgramData>(defaultProgramData);
    const [score, setComposite] = React.useState<CompositeData>(defaultComposite);
    const [card, setCard] = React.useState('Scorecard');
    let scoreResults = cx({
        green: (score.CompositeScore || score.TotalScore) >= 3.76,
        yellow: (score.CompositeScore || score.TotalScore) < 3.76 && (score.CompositeScore || score.TotalScore) > 2.50,
        red: score.CompositeScore && score.CompositeScore || score.TotalScore && score.TotalScore <= 2.50,
        white: !(score.CompositeScore || score.TotalScore)
    });

    React.useEffect(() => {
        if(selectedProgram){
            if(selectedProgram.ID && program.ID !== selectedProgram.ID){
                setProgram(selectedProgram);
                loadScores();
            }
        }

    }, [scores, score, selectedProgram]);

    async function loadScores(){
        const load = await dispatch(actions.getProgramScores(selectedProgram.ID, 'latest'));
        actions.getCompositeScore(selectedProgram.ID).then(data => {

            if(data){
                setComposite(data);
            }else{
                setComposite(defaultComposite);
            }

        });
    }

    const onSubmit = async (event, item) => {
        event.preventDefault();
        setCard(item);

    };


    return (
        <div className={scoreStyles.scoreCard}>
            <div className={scoreStyles.scoreCardHeader}>
                <div className={scoreStyles.info}>
                    <div className={scoreStyles.container}>
                        <h1 className={scoreStyles.title}>{program.Acronym}</h1>
                    </div>
                </div>
                <div className={scoreStyles.score}>
                    <div className={`${scoreStyles.display} ${scoreResults}`}>
                        <span>{!score.CompositeScore ? score.TotalScore || 'N/A' : score.CompositeScore}</span>
                    </div>
                    <span className={scoreStyles.label}>COMPOSITE SCORE</span>
                </div>
                <div className={scoreStyles.goalScores}>
                  <span
                    onMouseEnter={() => setGoalShown(true)}
                    onMouseLeave={() => setGoalShown(false)}>
                    Show Goal Scores
                  </span>
                </div>
            </div>
            <div className={scoreStyles.programHead}>
              {
                goalShown ?
                <div className={scoreStyles.lens}>
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
                </div>
              }
                <ul className={scoreStyles.programHeaderNav}>
                    <li style={card==='Scorecard'?style.invertBg:{}}>
                        <a style={card==='Scorecard'?style.invertText:{}} href="#"
                            onClick={(event) => onSubmit(event,'Scorecard')}>
                            SCORECARD
                        </a>
                    </li>
                    <li style={card==='Insights'?style.invertBg:{}}>
                        <a style={card==='Insights'?style.invertText:{}} href="#"
                            onClick={(event) => onSubmit(event,'Insights')}>
                            INSIGHTS
                        </a>
                    </li>
                    <li style={card==='Improvements'?style.invertBg:{}}>
                        <a style={card==='Improvements'?style.invertText:{}} href="#"
                            onClick={(event) => onSubmit(event,'Improvements')}>
                            IMPROVEMENTS
                        </a>
                    </li>
                    {group === 'peo' ?
                        <li style={card==='Budgets'?style.invertBg:{}}>
                            <a style={card==='Budgets'?style.invertText:{}} href="#"
                                onClick={(event) => onSubmit(event,'Budgets')}>
                                BUDGETS
                            </a>
                        </li>
                    : null}
                </ul>
            </div>
            <div className={`${scoreStyles.programMain}`}>
                {card == 'Scorecard' && <Score governance={scores.governance} technology={scores.technology} strategy={scores.strategy} people={scores.people} operations={scores.operations} total={score} />}
                {card == 'Insights' && <Insights />}
                {card == 'Budgets' && <Budgets />}
                {card == 'Improvements' && <Improvements />}
            </div>
        </div>
    );
}

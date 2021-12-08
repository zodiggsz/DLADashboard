/* eslint-disable jsx-a11y/alt-text */
import  * as React from 'react';
import { find } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import 'pure-react-carousel/dist/react-carousel.es.css';
import classNames from 'classnames/bind';
import { actions } from '../../../models/programs';
import Moment from 'react-moment';
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import programStyles from './index.module.scss';
import { maxWidth } from '@material-ui/system';
let cx = classNames.bind(programStyles);

import EqualizerIcon from '@material-ui/icons/Equalizer';
import TableChartIcon from '@material-ui/icons/TableChart';
import ShowChartIcon from '@material-ui/icons/ShowChart';

const people: string =  require("../../../assets/images/lens_icons/people.png");
const operations: string =  require("../../../assets/images/lens_icons/operations.png");
const strategy: string =  require("../../../assets/images/lens_icons/strategy.png");
const technology: string =  require("../../../assets/images/lens_icons/technology.png");
const governance: string =  require("../../../assets/images/lens_icons/governance.png");

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
    root: {
        width: '100%',
        padding: theme.spacing(2),
        '& > *': {
            margin: theme.spacing(1),
          },
    },
    listRoot: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        borderRadius:20,
        overflow:'hidden',
    },
    tab: {
        minWidth:'auto',
        width:140
    },
    tabs: {
        justifyContent:'space-evenly',
    },
    gridList: {
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    },
    title: {
        margin:10
    },
    titleBar: {
        background:
          'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
    paper: {

        flex:1,
        height:"100%",
        padding: theme.spacing(2),
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        textAlign: 'center',
        backgroundColor: "#F7F7F7",
        color: theme.palette.text.secondary,
        borderRadius:20
        // boxShadow: '0 6px 15px 1px rgba(0, 0, 0, .2)'
    },
}));

function ScoresHistoryPanel(props) {
    const { value, index, history, ...other } = props;
    const classes = useStyles();
    return (
        <TableContainer
            hidden={value !== index}
            id={`scrollable-force-tabpanel-${index}`}
            aria-labelledby={`scrollable-force-tab-${index}`}
            {...other}
        >
            <Table size="medium">
                <TableHead>
                    <TableRow>
                        <TableCell align="left">Date</TableCell>
                        {/* <TableCell align="left">Updated By</TableCell> */}
                        <TableCell align="left">Composite Score</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                { history && history.map( (item, key) => (

                    <TableRow key={key}>
                        <TableCell align="left">
                            <Moment format="MM-DD-YYYY h:mm">{item.Created}</Moment></TableCell>
                        {/* <TableCell align="left">{item.Author.Title}</TableCell> */}
                        <TableCell align="left">{item.CompositeScore ? item.CompositeScore.split(' ')[0] : 'N/A'}</TableCell>
                    </TableRow>

                ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function InsightHistoryPanel(props) {
    const { value, index, history, ...other } = props;
    const classes = useStyles();
    return (
        <TableContainer
            hidden={value !== index}
            id={`scrollable-force-tabpanel-${index}`}
            aria-labelledby={`scrollable-force-tab-${index}`}
            {...other}
        >
            <Table size="medium">
                <TableHead>
                    <TableRow>
                        <TableCell align="left">Date</TableCell>
                        {/* <TableCell align="left">Updated By</TableCell> */}
                        <TableCell align="left" style={{width:225}}>Content</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                { history && history.map( (item, key) => (

                    <TableRow key={key}>
                        <TableCell align="left"><Moment format="MM-DD-YYYY h:mm">{item.Created}</Moment></TableCell>
                        {/* <TableCell align="left">{item.Author.Title}</TableCell> */}
                        <TableCell align="left"><b>{item.Lens}:</b><br />{item.Content}</TableCell>
                    </TableRow>

                ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function ImprovementsHistoryPanel(props) {
    const { value, index, history, ...other } = props;
    const classes = useStyles();
    return (
        <TableContainer
            hidden={value !== index}
            id={`scrollable-force-tabpanel-${index}`}
            aria-labelledby={`scrollable-force-tab-${index}`}
            {...other}
        >
            <Table size="medium">
                <TableHead>
                    <TableRow>
                        <TableCell align="left">Date</TableCell>
                        {/* <TableCell align="left">Updated By</TableCell> */}
                        <TableCell align="left" style={{width:225}}>Content</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                { history && history.map( (item, key) => (

                    <TableRow key={key}>
                        <TableCell align="left"><Moment format="MM-DD-YYYY h:mm">{item.Created}</Moment></TableCell>
                        {/* <TableCell align="left">{item.Author.Title}</TableCell> */}
                        <TableCell align="left"><b>{item.Subject}:</b><br />{item.Description}</TableCell>
                    </TableRow>

                ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}


function a11yProps(index) {
    return {
        id: `scrollable-force-tab-${index}`,
        'aria-controls': `scrollable-force-tabpanel-${index}`,
    };
}

interface ProgramData {
    ID: number;
    Acronym: string;
}

const defaultProgramData = {
    ID: 0,
    Acronym: 'Program'
};

export default function ListHistory() {
    const dispatch = useDispatch();
    const classes = useStyles();
    const selectedProgram = useSelector(state => state.programs.program);
    const programHistory = useSelector((state) => state.programs.programHistory);
    const [program, setProgram] = React.useState<ProgramData>(defaultProgramData);
    const [value, setValue] = React.useState(0);

    console.log("history score: ", programHistory);

    React.useEffect(() => {

        if(selectedProgram){
            if(selectedProgram.ID && program.ID !== selectedProgram.ID){
                setProgram(selectedProgram);
                dispatch(actions.getProgramHistory(selectedProgram.ID));
            }
        }

    }, [selectedProgram]);

    async function loadInsights(){
        const load = await dispatch(actions.getProgramInsights(selectedProgram.ID));
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    function setLensLabel(label){
        switch (label) {
            case 'governance':
                return 'Governance';

            case 'people':
                return 'People & Culture';

            case 'technology':
                return 'Technology';

            case 'strategy':
                return 'Strategy';

            case 'operations':
                return 'Operations';
            default:
                return 'Governance';
        }
    }

    function setLensImage(lens){
        switch (lens) {
            case 'governance':
                return <img className="insightIcon" src={governance} width="50px" height="50px" />;

            case 'people':
                return <img className="insightIcon" src={people} width="50px" height="50px" />;

            case 'technology':
                return <img className="insightIcon" src={technology} width="50px" height="50px" />;

            case 'strategy':
                return <img className="insightIcon" src={strategy} width="50px" height="50px" />;

            case 'operations':
                return <img className="insightIcon" src={operations} width="50px" height="50px" />;

            case 'scores':
                return <TableChartIcon style={{width: 50, height: 50}}></TableChartIcon>;

            case 'insights':
                return <EqualizerIcon style={{width: 50, height: 50}}></EqualizerIcon>;

            case 'improvements':
                return <ShowChartIcon style={{width: 50, height: 50}}></ShowChartIcon>;
            default:
                return <img className="insightIcon" src={governance} width="50px" height="50px" />;
        }
    }

        return (
            <div id="programInsights" className={classes.listRoot}>
                <AppBar position="static" color="default">
                    <h3 style={{width:"100%", textAlign:"center", fontSize: "1.25rem", padding:10}}>
                        {/* {program.Acronym} History */}
                        Composite Score History
                    </h3>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons="on"
                        indicatorColor="primary"
                        textColor="primary"
                        aria-label="scrollable force tabs example"
                        className={classes.tabs}
                    >
                        <Tab className={classes.tab} label="Scores" icon={setLensImage('scores')} {...a11yProps(0)} key={0} />
                        {/* <Tab className={classes.tab} label="Insights" icon={setLensImage('insights')} {...a11yProps(1)} key={1} />
                        <Tab className={classes.tab} label="Improvements" icon={setLensImage('improvements')} {...a11yProps(2)} key={2} /> */}
                    </Tabs>
                </AppBar>
                <ScoresHistoryPanel value={value} history={programHistory.score} index={0} />
                <InsightHistoryPanel value={value} history={programHistory.insights} index={1} />
                <ImprovementsHistoryPanel value={value} history={programHistory.improvements} index={2} />
            </div>

        );
}

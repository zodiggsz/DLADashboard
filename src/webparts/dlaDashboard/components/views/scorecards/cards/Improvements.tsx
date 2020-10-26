/* eslint-disable jsx-a11y/alt-text */
import  * as React from 'react';
import { find } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import 'pure-react-carousel/dist/react-carousel.es.css';
import classNames from 'classnames/bind';
import { actions } from '../../../../models/programs';
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import scoreStyles from '../index.module.scss';
let cx = classNames.bind(scoreStyles);
var moment = require('moment');
const people =  require("../../../../assets/images/lens_icons/people.png");
const operations =  require("../../../../assets/images/lens_icons/operations.png");
const strategy =  require("../../../../assets/images/lens_icons/strategy.png");
const technology =  require("../../../../assets/images/lens_icons/technology.png");
const governance =  require("../../../../assets/images/lens_icons/governance.png");

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



// interface TabInterfact{
//     value:number;
//     index:number;
//     lens:Lens;
// }

function TabPanel(props) {
    const { value, index, lens, ...other } = props;
    const classes = useStyles();
    console.log(lens);
    return (
        <TableContainer
            hidden={value !== index}
            id={`scrollable-force-tabpanel-${index}`}
            aria-labelledby={`scrollable-force-tab-${index}`}
            {...other}
        >
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell style={{fontWeight:700}} align="left">Improvement</TableCell>
                        <TableCell style={{fontWeight:700}} align="left">Responsibility</TableCell>
                        <TableCell style={{fontWeight:700}} align="left">Estimated_Completion</TableCell>
                        <TableCell style={{fontWeight:700}} align="left">Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                { lens && lens.map( (item, key) => (
                        
                    <TableRow key={key}>
                        <TableCell align="left">{item.Remediation}</TableCell>
                        <TableCell align="left">{item.Responsibility}</TableCell>
                        <TableCell align="left">{moment(item.Estimated_Completion).format('LL')}</TableCell>
                        <TableCell align="left">{item.Status}</TableCell>
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

interface defaultImprovements {
    Remediation:string;
    Responsibility:string;
    Estimated_Completion:string;
    Status:string;
}

interface InsightData {
    governance: defaultImprovements;
    technology: defaultImprovements;
    strategy: defaultImprovements;
    operations: defaultImprovements;
    people: defaultImprovements;
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

export default function Improvements() {
    const dispatch = useDispatch();
    const classes = useStyles();
    const selectedProgram = useSelector(state => state.programs.program);
    const improvements = useSelector((state) => state.programs.programImprovements);
    const [program, setProgram] = React.useState<ProgramData>(defaultProgramData);
    // const [improvements, setInsights] = React.useState<InsightData>();
    const [value, setValue] = React.useState(0);
    
    React.useEffect(() => {
        if(selectedProgram){
            if(selectedProgram.ID && program.ID !== selectedProgram.ID){
                setProgram(selectedProgram);
                loadInsights();
            }
        }
    }, [selectedProgram]);

    async function loadInsights(){
        const load = await dispatch(actions.getDLAImprovements(selectedProgram.ID));
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
            default:
                return <img className="insightIcon" src={governance} width="50px" height="50px" />;
        }
    }
    
        return (
            <div id="programInsights" className={classes.listRoot}>
                <AppBar position="static" color="default">
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons="on"
                        indicatorColor="primary"
                        textColor="primary"
                        aria-label="scrollable force tabs example"
                    >      
                        <Tab label="People & Culture" icon={setLensImage('people')} {...a11yProps(3)} key={3} />                  
                        <Tab label="Strategy" icon={setLensImage('strategy')} {...a11yProps(2)} key={2} />
                        <Tab label="Operations" icon={setLensImage('operations')} {...a11yProps(1)} key={1} />
                        <Tab label="Governance" icon={setLensImage('governance')} {...a11yProps(0)} key={0} />
                        <Tab label="Technology" icon={setLensImage('technology')} {...a11yProps(4)} key={4} />
                    </Tabs>
                </AppBar>
                <TabPanel value={value} lens={improvements.governance} index={0} />
                <TabPanel value={value} lens={improvements.operations} index={1} />
                <TabPanel value={value} lens={improvements.strategy} index={2} />
                <TabPanel value={value} lens={improvements.people} index={3} />
                <TabPanel value={value} lens={improvements.technology} index={4} />
            </div>
            
        );
}
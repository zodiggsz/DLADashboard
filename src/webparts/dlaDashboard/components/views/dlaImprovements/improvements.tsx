import * as React from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import { actions } from '../../../models/programs';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';
import ListPrograms from '../programs/ListPrograms';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import AddIcon from '@material-ui/icons/Add';

import improvementStyle from './index.module.scss';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
    root: {
        display:"flex",
        flexDirection: "column",
        '& .MuiFormControl-root': {
            display:"flex",
        },
        '& > *': {
            margin: theme.spacing(1),
          },
    },
    form: {
        '& > *': {
          margin: theme.spacing(1),
        },
    },
    paper: {
        margin: theme.spacing(2),
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        '& > h1': {
            fontSize:18,
            textAlign: 'left',
        }
    },
    paperListing: {
        maxHeight: 600,
        overflow:"scroll",
        margin: theme.spacing(2),
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    fab: {
        position: 'absolute',
        width: 40,
        height: 40,
        bottom: -55,
        right: theme.spacing(1),
    },
    button: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
    alertModal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    alertPaper: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(2, 4, 3),
        borderRadius:20,
        outline:'none'
      },
}));

const defaultState = {
    program: '',
    governance: '',
    people_culture: '',
    technology: '',
    strategy: '',
    operations: ''
};

const defaultInsights = {
    people: 'People and Culture',
    strategy: 'Strategy',
    operations: 'Operations',
    governance: 'Governance',
    technology: 'Technology'
};

const defaultInputs = {
    input1: " ",
    input2: " "
};

function AlertModal({classes, alert, msg, handleAlert=()=>{}}){
    return(
        <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.alertModal}
        open={alert}
        onClose={handleAlert}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={alert}>
          <div className={classes.alertPaper}>
            <h2 id="transition-modal-title">{msg}</h2>
          </div>
        </Fade>
      </Modal>
    );
}

interface ProgramData {
    ID: number;
    Acronym: string;
}

interface defaultInsights {
    Lens: string;
    Content: string;
}

interface InsightData {
    governance: defaultInsights;
    technology: defaultInsights;
    strategy: defaultInsights;
    operations: defaultInsights;
    people: defaultInsights;
}

const date = new Date();

const defaultContent = {
    ID: 0,
    Lens: '',
    Remediation: '',
    Responsibility: '',
    Estimated_Completion: null,
    Status: '',
};

const defaultProgramData = {
    ID: 0,
    Acronym: 'Program'
};

const defaultLength: any = 100;

export default function DLAImprovements() {
    const dispatch = useDispatch();
    const classes = useStyles();
    const [inputs, addInput] = React.useState(defaultInputs);
    const [content, setContent] = React.useState([defaultContent]);
    const [lens, setLens] = React.useState('');
    const [alert, setAlert] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');
    const [labelWidth, setLabelWidth] = React.useState(0);
    const inputLabel = React.useRef(defaultLength);
    const user = useSelector((state) => state.user.data);
    const programs = useSelector((state) => state.programs.list);
    const selectedProgram = useSelector(state => state.programs.program);
    const improvements = useSelector((state) => state.programs.programImprovements);
    const [program, setProgram] = React.useState<ProgramData>(defaultProgramData);

    React.useEffect(() => {
        
        console.log(content);

    }, [content]);
    
    React.useEffect(() => {
        
        setLabelWidth(inputLabel.current ? inputLabel.current.offsetWidth: 100 );
        if(selectedProgram){
            if(selectedProgram.ID && program.ID !== selectedProgram.ID){
                setProgram(selectedProgram);
                loadImprovements();
                setContent([defaultContent]);
            }
        }

    }, [programs, selectedProgram]);

    async function loadImprovements(){
        const load = await dispatch(actions.getDLAImprovements(selectedProgram.ID));
        console.log(load);
        if (lens) {
            switch (lens) {
                case 'governance':
                    setContent(load.governance);
                    break;
                case 'people':
                    setContent(load.people);
                    break;
                case 'technology':
                    setContent(load.technology);
                    break;
                case 'strategy':
                    setContent(load.strategy);
                    break;
                case 'operations':
                    setContent(load.operations);
                    break;
                default:
                    setContent([]);
                    break;
            }
        }
    }

    function addInsight(){
        
        const newItem = {
            ID: 0,
            Lens: '',
            Remediation: '',
            Responsibility: '',
            Estimated_Completion: null,
            Status: '',
        };
        
        setContent([
            newItem,
            ...content,
        ]);

    }

    function toggleAlert(){
        setAlert(!alert);
    }

    const dateSubmitted = (estimatedDate, index, id, key) => {
        let newArray = [...content];
            newArray[index] = {
                ...newArray[index],
                ID: id ? id: 0,
                Lens: lens,
                [key]: estimatedDate,
            };

            setContent(newArray);
    };

    function handleInputChange(index, id, key) {

        return (e) => {
            // const index = content.findIndex(element => element.ID == item );
            let newArray = [...content];
            newArray[index] = {
                ...newArray[index],
                ID: id ? id: 0,
                Lens: lens,
                [key]: e.target.value,
            };

            setContent(newArray);

        };

    }

    async function deleteInput(index) {
        let newArray = [...content];
        let remove = newArray[index];
        const removeInsight = await dispatch(actions.removeImprovement(remove.ID));
        newArray.splice(index, 1);
        setContent(newArray);
    }

    function changeImprovements(e){
        if(Object.keys(program).length > 0){ 
            setLens(e.target.value);
            switch (e.target.value) {
                case 'governance':
                    setContent(improvements.governance);
                    break;
                case 'people':
                    setContent(improvements.people);
                    break;
                case 'technology':
                    setContent(improvements.technology);
                    break;
                case 'strategy':
                    setContent(improvements.strategy);
                    break;
                case 'operations':
                    setContent(improvements.operations);
                    break;
                default:
                    setContent([]);
                    break;
            }
            
        }else{
            const msg = 'Please Select the Program First';
            setAlertMessage(msg);
            toggleAlert();
        }

    }

    function saveImprovement(){
        // const insightData = Object.values(inputs);
        console.log(content);
        content.map(item => {
            const update = {
                Title:selectedProgram.Acronym,
                ProgramID: selectedProgram.ID,
                Lens: lens,
                Remediation: item.Remediation,
                Responsibility: item.Responsibility,
                Estimated_Completion: item.Estimated_Completion,
                Status: item.Status
            };

            dispatch(actions.addDLAImprovement(item.ID, update)).then((result) => {
                loadImprovements();
            });
            
        });

    }

    return (
        <Grid container id={improvementStyle.improvements} spacing={3}>
            <Grid item xs={5}>
                <ListPrograms userID={""} />
            </Grid>
            <Grid item xs={7}>
                <AlertModal classes={classes} alert={alert} msg={alertMessage} handleAlert={toggleAlert} />
                <Paper className={classes.paper}>
                    <h1> {Object.keys(program).length > 0 ? program.Acronym : "Choose Program"} </h1>
                    <FormControl variant="outlined" style={{width:"100%", marginBottom:10}}  >
                        <InputLabel ref={inputLabel} id="demo-simple-select-outlined-label">
                        Select Lens
                        </InputLabel>
                        <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={lens}
                        onChange={changeImprovements}
                        labelWidth={labelWidth}>

                        {Object.keys(defaultInsights).map((key) => {
                            return (
                                <MenuItem value={key} key={key}>{defaultInsights[key]}</MenuItem>
                            );
                        })}

                        </Select>
                    </FormControl>
                    <Fab color="primary" onClick={() => addInsight()} aria-label="add">
                        <AddIcon />
                    </Fab>
                    {content.map( (item, key) => (
                        <Grid container className={improvementStyle.improvementData} style={{backgroundColor: key % 2 === 0 ? '#E7ECF3' : '#ffffff'}} spacing={3}>
                            <Grid item xs={6}>
                                <FormControl variant="outlined" style={{width:"100%", margin:5}} key={key} >
                                    <TextField
                                        label="Improvements"
                                        multiline
                                        onChange={handleInputChange(key, item.ID, 'Remediation')}
                                        rows="4"
                                        value={item.Remediation}
                                        variant="outlined"
                                    />   
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl variant="outlined" style={{width:"100%", margin:5}} key={key} >
                                    <TextField
                                        label="Responsibility"
                                        multiline
                                        onChange={handleInputChange(key, item.ID, 'Responsibility')}
                                        rows="4"
                                        value={item.Responsibility}
                                        variant="outlined"
                                    />   
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl variant="outlined" style={{width:"100%", margin:0}} key={key} >
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                            disableToolbar
                                            variant="inline"
                                            format="MM/dd/yyyy"
                                            margin="normal"
                                            id="date-picker-inline"
                                            label="Estimated Completion"
                                            value={item.Estimated_Completion}
                                            onChange={(estimatedDate) => dateSubmitted(estimatedDate, key, item.ID, 'Estimated_Completion')}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        />
                                    </MuiPickersUtilsProvider>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl variant="outlined" style={{width:"100%", marginBottom:10}}  >
                                    <InputLabel ref={inputLabel} id="demo-simple-select-outlined-label">
                                    Status
                                    </InputLabel>
                                    <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={item.Status}
                                    onChange={handleInputChange(key, item.ID, 'Status')}
                                    labelWidth={labelWidth}>

                                        <MenuItem style={{backgroundColor: '#73B5EF'}} value="To Do">To Do</MenuItem>
                                        <MenuItem style={{backgroundColor: '#FFCC3F'}} value="Work In Progress">Work In Progress</MenuItem>
                                        <MenuItem style={{backgroundColor: '#00FF00'}} value="Completed">Completed</MenuItem>

                                    </Select>
                                    <Fab className={classes.fab} color="secondary" onClick={() => deleteInput(key)}>x</Fab> 
                                </FormControl>
                            </Grid>
                        </Grid>
                        
                    ))}
                    <div style={{padding:20}}>
                        <Button variant="contained" color="primary" onClick={() => saveImprovement()}>SAVE IMPROVEMENT</Button>
                    </div>
                    
                </Paper>
            </Grid>
        </Grid>
    );
}

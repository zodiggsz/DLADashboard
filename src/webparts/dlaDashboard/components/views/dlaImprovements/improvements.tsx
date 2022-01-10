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
import EditIcon from '@material-ui/icons/Edit';
import AddImprovements from './AddImprovements';

import improvementStyle from './index.module.scss';
import { useLocation } from 'react-router-dom';

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
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalPaper: {
        outline:'none',
        width:'50%',
        backgroundColor: 'transparent',
        border: '0px',
        padding: theme.spacing(2, 4, 3),
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
    buttonSuccess: {
      color: 'white',
      backgroundColor: 'green',
      '&:hover': {
        backgroundColor: '#076807'
      }
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
    Manager: null
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
    const [openModal, setOpenModal] = React.useState(false);
    const [improvementOptions, setImprovementOptions] = React.useState({});
    const [lensLoaded, setLensLoaded] = React.useState(false);
    const [programLoaded, setProgramLoaded] = React.useState(false);
    // const [improvementData, setImprovementData] = React.useState('');
    // const [responsibilityData, setResponsibilityData] = React.useState('');

    React.useEffect(() => {

        console.log('state content:', content);

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

    // A custom hook that builds on useLocation to parse
    // the query string for you.
    // function useQuery() {
    //   const { search } = useLocation();

    //   return React.useMemo(() => new URLSearchParams(search), [search]);
    // }

    // const query = useQuery();
    // const params = {
    //   acronym: query.get('acronym'),
    //   lens: query.get('lens'),
    // }

    // console.log('Query Params are: ', params, programs, programs && programs.length, selectedProgram)
    // console.log("Lens content is: ", lens, content);

    // if (programs && programs.length) {
    //   if (!programLoaded && params.acronym && !(selectedProgram && selectedProgram.Acronym == params.acronym)) {
    //     console.log("setting program acronym: ", params.acronym)
    //     dispatch(actions.getProgramByAcronym(params.acronym));
    //     setProgramLoaded(true);
    //   }
    //   if (!lensLoaded && params.lens && lens != params.lens) {
    //     changeImprovements({ target: { value: params.lens }})
    //     setLensLoaded(true);
    //   }
    // } else {
    //   dispatch(actions.getAllPrograms());
    //   console.log("getting programs from improvements")
    // }


    console.log("programs: ", programs, programs.length)

    async function loadImprovements(){
        const load = await dispatch(actions.getDLAImprovements(selectedProgram.ID));
        console.log("loaded improvements:", load);
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

    const handleOpen = (options) => {
      setImprovementOptions(options);
      setOpenModal(true);
    }

    const handleClose = improvement => {
      setOpenModal(false);
      console.log("got improvement from modal: ", improvement)
      handleInputUpdate(improvement.options.key, improvement.options.item.ID, improvement.options.value, improvement.value);
    }

    function addImprovements(){

        const newItem = {
            ID: 0,
            Lens: '',
            Remediation: '',
            Responsibility: '',
            Estimated_Completion: null,
            Status: '',
            Manager: user.Group == 'portfolio' || user.Group == 'program' ? user.Title : null
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
          console.log("event is : ", e)
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

    function handleInputUpdate(index, id, key, value) {

        let newArray = [...content];
        newArray[index] = {
            ...newArray[index],
            ID: id ? id: 0,
            Lens: lens,
            [key]: value,
        };

        setContent(newArray);

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
        console.log("Improvement content: ", content);
        content.map(item => {
            const update: any = {
                Title:selectedProgram.Acronym,
                ProgramID: selectedProgram.ID,
                Lens: lens,
                Remediation: item.Remediation,
                Responsibility: item.Responsibility,
                Estimated_Completion: item.Estimated_Completion,
                Status: item.Status,
                Manager: item.Manager || null
            };


            console.log("Saving Improvements: ", update);

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
                    <div style={{padding:20, textAlign: 'right'}}>
                      <Fab color="primary" onClick={() => addImprovements()} aria-label="add">
                        <AddIcon />
                      </Fab>
                      <Button variant="contained" className={classes.buttonSuccess} style={{ marginLeft: 20 }} onClick={() => saveImprovement()}>SAVE</Button>
                    </div>
                    {content.map( (item, key) => {
                      function isManager(): boolean {
                        return ((user.Group == 'program' || user.Group == 'portfolio') && !item.Manager)
                      }
                      return (
                        <Grid container className={improvementStyle.improvementData} style={{backgroundColor: '#a3bdd1'}} spacing={3}>
                            <Grid item xs={8}>
                                <div style={{padding:20, backgroundColor: 'white', border: '1px solid blue', textAlign: 'left'}}>
                                  {
                                    item.Remediation ?
                                    item.Remediation.replace(/(<([^>]+)>)/ig, '').substr(0, 150) + (
                                      item.Remediation.replace(/(<([^>]+)>)/ig, '').length > 150 ? '...' : '') : ''
                                  }
                                </div>
                                <div style={{padding: '10px 0', textAlign: 'right'}}>
                                    <Button variant="contained" color="primary" disabled={isManager()} onClick={() =>
                                      handleOpen({ type: 'improvement', value: 'Remediation', key, item })}>
                                        <EditIcon />
                                    </Button>
                                </div>
                            </Grid>
                            <Grid item xs={4}>
                                {/* <div style={{padding:20}}>
                                  {
                                    item.Responsibility ?
                                    item.Responsibility.replace(/(<([^>]+)>)/ig, '').substr(0, 50) + (item.Responsibility.length > 50 ? '...' : '') : ''
                                  }
                                </div>
                                <div style={{padding:20}}>
                                    <Button variant="contained" color="primary" disabled={isManager()} onClick={() =>
                                      handleOpen({ type: 'responsibility', value: 'Responsibility', key, item })}>{item.Responsibility ? 'Edit' : 'Add'} Responsibility</Button>
                                </div> */}
                                <FormControl variant="standard" style={{width:"100%", margin:5}} key={key} >
                                    <TextField
                                        label="Responsibility"
                                        multiline
                                        onChange={handleInputChange(key, item.ID, 'Responsibility')}
                                        rows="4"
                                        value={item.Responsibility}
                                        variant="outlined"
                                        disabled={isManager()}
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

)})}

                </Paper>
            </Grid>
            <Grid item xs={12}>
              <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={openModal}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={openModal}>
                    <div className={classes.modalPaper}>
                        <AddImprovements options={improvementOptions} closeModal={handleClose} />
                    </div>
                    </Fade>
                </Modal>
            </Grid>
        </Grid>
    );
}

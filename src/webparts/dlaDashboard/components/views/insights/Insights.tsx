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

import AddIcon from '@material-ui/icons/Add';

import insightStyle from './index.module.scss';

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
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        padding: '0px',
        width: '35px',
        height: '30px',
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
    people: defaultInsights;
    strategy: defaultInsights;
    operations: defaultInsights;
    governance: defaultInsights;
    technology: defaultInsights;
}

const defaultContent = {
    ID: 0,
    Lens: '',
    Content: '',
};

const defaultProgramData = {
    ID: 0,
    Acronym: 'Program'
};

export default function Insights() {
    const dispatch = useDispatch();
    const classes = useStyles();
    const [inputs, addInput] = React.useState(defaultInputs);
    const [content, setContent] = React.useState([defaultContent]);
    const [lens, setLens] = React.useState('');
    const [alert, setAlert] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');
    const [labelWidth, setLabelWidth] = React.useState(0);
    const inputLabel = React.useRef(null);

    const user = useSelector((state) => state.user.data);
    const programs = useSelector((state) => state.programs.list);
    const selectedProgram = useSelector(state => state.programs.program);
    const insight = useSelector((state) => state.programs.programInsights);
    const [program, setProgram] = React.useState<ProgramData>(defaultProgramData);


    React.useEffect(() => {
        
        setLabelWidth(inputLabel.current.offsetWidth);
        if(selectedProgram){
            if(selectedProgram.ID && program.ID !== selectedProgram.ID){
                setProgram(selectedProgram);
                loadInsights();
                setContent([defaultContent]);
            }
        }

    }, [programs, selectedProgram]);

    async function loadInsights(){
        const load = await dispatch(actions.getProgramInsights(selectedProgram.ID));
    }

    function addInsight(){
        
        const newItem = {
            ID: 0,
            Lens: '',
            Content: '',
        };
        
        setContent([
            ...content,
            newItem
        ]);

    }

    function toggleAlert(){
        setAlert(!alert);
    }

    function handleInputChange(index, id) {

        return (e) => {
            // const index = content.findIndex(element => element.ID == item );
            let newArray = [...content];
            newArray[index] = {
                ...newArray[index],
                ID: id ? id: 0,
                Lens: lens,
                Content: e.target.value,
            };

            console.log(newArray[index]);
            setContent(newArray);

        };

    }

    async function deleteInput(index) {
        let newArray = [...content];
        let remove = newArray[index];
        console.log(newArray);
        if (index > 0) {
            if(remove.ID > 0){
                const removeInsight = await dispatch(actions.removeInsight(remove.ID));
            }
            newArray.splice(index, 1);
            setContent(newArray);
        }

    }

    function changeInsight(e){
        if(Object.keys(program).length > 0){ 
            setLens(e.target.value);
            switch (e.target.value) {
                case 'governance':
                    setContent(insight.governance);
                    break;
                case 'people':
                    setContent(insight.people);
                    break;
                case 'technology':
                    setContent(insight.technology);
                    break;
                case 'strategy':
                    setContent(insight.strategy);
                    break;
                case 'operations':
                    setContent(insight.operations);
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

    function saveInsight(){
        // const insightData = Object.values(inputs);
        console.log(content);
        content.map(item => {
            const update = {
                Title:selectedProgram.Acronym,
                ProgramID: selectedProgram.ID,
                Lens: lens,
                Content: item.Content
            };
            dispatch(actions.addInsight(item.ID, update));
            
        });

    }

    return (
        <Grid container id={insightStyle.insights} spacing={3}>
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
                        onChange={changeInsight}
                        labelWidth={labelWidth}>

                        {Object.keys(defaultInsights).map((key) => {
                            return (
                                <MenuItem value={key} key={key}>{defaultInsights[key]}</MenuItem>
                            );
                        })}

                        </Select>
                    </FormControl>
                    
                    {content.map( (item, key) => (
                        <FormControl variant="outlined" style={{width:"100%", margin:5}} key={key} >
                            <TextField
                                label="Insight"
                                multiline
                                onChange={handleInputChange(key, item.ID)}
                                rows="4"
                                value={item.Content}
                                variant="outlined"
                            />   
                            <Fab className={classes.fab} color="secondary" onClick={() => deleteInput(key)}>x</Fab> 
                        </FormControl>
                    ))}
                    <Fab color="primary" onClick={() => addInsight()} aria-label="add">
                        <AddIcon />
                    </Fab>
                    <div style={{padding:20}}>
                        <Button variant="contained" color="primary" onClick={() => saveInsight()}>SAVE INSIGHT</Button>
                    </div>
                    
                </Paper>
            </Grid>
        </Grid>
    );
}

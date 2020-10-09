import * as React from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import { actions } from '../../../models/programs';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';
import ListPrograms from '../programs/ListPrograms';
import FormControl from '@material-ui/core/FormControl';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import ProgramSelector from '../scorecards/ProgramSelector';
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';

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
            marginTop: theme.spacing(2),
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
            overflow:"hidden",
            margin: theme.spacing(2),
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },
        fab: {
            position: 'absolute',
            bottom: theme.spacing(2),
            right: theme.spacing(2),
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

const defaultProgramData = {
    ID: 0,
    Acronym: 'Program'
};

const defaultImprovementData = {
    ID: 0,
    ProgramID: 0,
    Title: '',
    Subject: '',
    Description: ''
};

export default function Improvements() {
    const dispatch = useDispatch();
    const classes = useStyles();
    const [alert, setAlert] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState(false);
    const [edit, setEdit] = React.useState(false);
    const [labelWidth, setLabelWidth] = React.useState(0);
    const inputLabel = React.useRef(null);

    const user = useSelector((state) => state.user.data);
    const programs = useSelector((state) => state.programs.list);
    const selectedProgram = useSelector(state => state.programs.program);
    const improvements = useSelector((state) => state.programs.programImprovements);
    const [program, setProgram] = React.useState<ProgramData>(defaultProgramData);
    const [improvement, setImprovement] = React.useState(defaultImprovementData);

    React.useEffect(() => {
        
        if(selectedProgram){
            if(selectedProgram.ID && program.ID !== selectedProgram.ID){
                setProgram(selectedProgram);
                loadImprovements();
            }
        }

    }, [programs, selectedProgram]);

    async function loadImprovements(){
        const load = await dispatch(actions.getProgramImprovements(selectedProgram.ID));
        setImprovement({
            ...improvement,
            Title: selectedProgram.Acronym,
            ProgramID: selectedProgram.ID
        });
    }

    const onProgramChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
        const value = event.target.value;
        const prog = await dispatch(actions.getProgramByID(value));
    };

    function handleInputChange(key) {
        return (e) => {
            setImprovement({
                ...improvement,
                [key]: e.target.value
            });
        };
    }
 
    function toggleAlert(){
        setAlert(!alert);
    }

    async function addImprovement(){ 
        const index = improvements.findIndex(element => element.ID == improvement.ID );
        console.log(index);
        if(index > -1){
            let update = [...improvements];
            update[index] = {
                ...update[index], 
                Subject: improvement.Subject,
                Description: improvement.Description
            };
            let progImp = await dispatch(actions.setProgramImprovements(update));
        }

        //let imp = await dispatch(actions.addImprovement(improvement.ID, improvement));
    }

    function deleteImprovement(item){
        const deleteItem = improvements.find( ({ ID }) => ID === item );

    }

    function editImprovement(item){
        setEdit(true);
        const editItem = improvements.find( ({ ID }) => ID === item );
        setImprovement(editItem);        
    }

    function newImprovement(){
        setEdit(false);
        setImprovement({
            ID:0,
            Title: selectedProgram.Acronym,
            ProgramID: selectedProgram.ID,
            Subject: '',
            Description: ''
        });
        
    }

    return (
        <Grid container spacing={0}>
             <Grid item xs={4}>
                <Paper className={classes.paper}>
                    <h1>Improvements</h1>
                    <Grid item xs={12}><ProgramSelector onChange={onProgramChange} value={program.ID} /></Grid>
                    <FormControl variant="outlined" style={{width:"100%", margin:5}} >
                        <TextField
                            label="Subject"
                            value={improvement.Subject}
                            variant="outlined"
                            onChange={handleInputChange('Subject')}
                        />   
                    </FormControl>
                    <FormControl variant="outlined" style={{width:"100%", margin:5}} >
                        <TextField
                            label="Description"
                            multiline
                            value={improvement.Description}
                            onChange={handleInputChange('Description')}
                            rows="4"
                            variant="outlined"
                        />   
                    </FormControl>
                    <Button variant="contained" color="primary" onClick={addImprovement}>{edit ? 'EDIT' : 'ADD'} IMPROVEMENT</Button>
                    {edit && <Button variant="contained" color="primary" onClick={newImprovement}> ADD NEW</Button>}
                </Paper>
            </Grid>
            <Grid item xs={8}>
                <Paper className={classes.paperListing}>
                    <AlertModal classes={classes} alert={alert} msg={alertMessage} handleAlert={toggleAlert} />
                    <TableContainer>
                        <Table size="medium">
                            <TableHead>
                            <TableRow>
                                <TableCell style={{fontWeight:700}} align="left">Subject</TableCell>
                                <TableCell style={{fontWeight:700}} align="left">Description</TableCell>
                                <TableCell style={{fontWeight:700, width:100}} align="left"></TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {improvements.length > 0 && improvements.map((item, key) => {
                                return (
                                    <TableRow key={key}>
                                        <TableCell align="left">{item.Subject}</TableCell>
                                        <TableCell align="left">{item.Description}</TableCell>
                                        <TableCell align="center">
                                            <ButtonGroup
                                                orientation="horizontal"
                                                color="primary"
                                                aria-label="horizontal outlined primary button group">
                                                <Button onClick={() => editImprovement(item.ID)}>Edit</Button>
                                                <Button onClick={() => deleteImprovement(item.ID)}>Delete</Button>
                                            </ButtonGroup>
                                        </TableCell>
                                    </TableRow>
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
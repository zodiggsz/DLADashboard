import * as React from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import { actions } from '../../../../models/programs';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';
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
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';

import AddIcon from '@material-ui/icons/Add';

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
    )
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

    return (
        <Paper className={classes.paperListing}>
            <TableContainer>
                <Table size="medium">
                    <TableHead>
                    <TableRow>
                        <TableCell style={{fontWeight:700}} align="left">Subject</TableCell>
                        <TableCell style={{fontWeight:700}} align="left">Description</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {improvements.length > 0 && improvements.map(function(item, key) {
                        return (
                            <TableRow key={key}>
                                <TableCell align="left">{item.Subject}</TableCell>
                                <TableCell align="left">{item.Description}</TableCell>
                            </TableRow>
                        );
                    })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
       
    );
}
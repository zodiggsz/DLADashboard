import * as React from 'react';
import { ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useRouteMatch, useLocation } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import AppLoader from '../../loader';
import programStyles from './index.module.scss';
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { actions } from '../../../models/programs';
import ProgramSelector from '../scorecards/ProgramSelector';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import Backdrop from '@material-ui/core/Backdrop';
import ItemOfInterestModal from './ItemOfInterestModal';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      padding: theme.spacing(2)
    },
    paper: {
      position:'relative',
      padding: theme.spacing(2),
      margin: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
      maxHeight: 600,
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
}));

interface ItemOfInterest extends ProgramData {
  Title: any;
  Subject: string;
  Message: string;
  Status: 'sent' | 'read' | 'responded';
  Response: string;
}

interface ProgramData {
  ID?: number;
  ProgramID?: number;
  Acronym: string;
}

const defaultProgramData = {
  ID: 0,
  Acronym: ''
};

export default function ItemsOfInterest() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.user.loading);
  const user = useSelector((state) => state.user.data);
  const selectedProgram = useSelector(state => state.programs.program);
  const programs = useSelector((state) => state.programs.list);
  const itemsOfInterest = useSelector<ItemOfInterest[]>((state) => state.programs.programItems);
  const [program, setProgram] = React.useState<ProgramData>(defaultProgramData);
  const [topic, setTopic] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [itemModal, setItemModal] = React.useState({});
  const [openModal, setOpenModal] = React.useState(false);

  const onProgramChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
    changeProgram(event);
  };

  const changeProgram = (event: ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value;
    const PROGRAM = programs.find(program => program.ID === value);
    console.log("got new program: ", value, PROGRAM);
    if (PROGRAM) {
      const { ID, Acronym } = PROGRAM;
      dispatch(actions.setProgram(PROGRAM));
      setProgram({ ID, Acronym });
    }
  }

  const [itemsLoaded, setItemsLoaded] = React.useState(false);
  const [programLoaded, setProgramLoaded] = React.useState(false);
  const query = useQuery();
  const params = {
    acronym: query.get('acronym'),
  }

  function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
  }

  console.log('Query Params are: ', params, programs, programs && programs.length, selectedProgram);

  if (programs && programs.length) {
    if (!programLoaded && params.acronym && !(selectedProgram && selectedProgram.Acronym == params.acronym)) {
      console.log("setting program acronym: ", params.acronym)
      dispatch(actions.getProgramByAcronym(params.acronym));
      setProgramLoaded(true);
    }
  } else {
    const { pathname } = useLocation();
    const page = pathname.replace('/', '');
    dispatch(actions.getAllPrograms());
    console.log("getting programs from list programs")
    if (page) history.push(`/?page=${page}${params.acronym?`?acronym=${params.acronym}`:''}`);
  }

  async function loadItems(){
    if (!itemsLoaded) {
      if (selectedProgram && selectedProgram.ID) {
        const load = await dispatch(actions.getDLAItems(selectedProgram.ID));
        console.log("loaded items:", load);
        await dispatch(actions.setProgramItems(load));
        setItemsLoaded(true);
        console.log("loaded items of Interest: ", itemsOfInterest);
      }
    }
  }
  loadItems();

  function handleTopicChange() {
    return (e) => { setTopic(e.target.value); };
  }

  function handleMessageChange() {
    return (e) => { setMessage(e.target.value); };
  }

  const handleOpen = (item) => {
    setItemModal(item);
    setOpenModal(true);
  }

  const handleClose = item => {
    setOpenModal(false);
    console.log("got item from modal: ", item);
  }

  function setSelectedProgram() {
    console.log("currently selected program: ", program);
    if (selectedProgram && program.ID != selectedProgram.ID) {
      console.log("setting selected program: ", program, selectedProgram);
      const { ID, Acronym } = selectedProgram;
      const p = { ID, Acronym };
      console.log("setting ID, Acronym: ", ID, Acronym);
      if (ID && Acronym) {
        setProgram(p);
        const e: any = { target: { value: ID } };
        changeProgram(e);
        console.log("setting program: ", e, p, program, { ID, Acronym });
      }
    }
  }
  setSelectedProgram();

  function saveItem(){
    const update: any = {
      ProgramID: selectedProgram.ID,
      Acronym: selectedProgram.Acronym,
      Subject: topic,
      Message: message,
      Status: 'sent'
    };

    console.log("Saving Item: ", update);

    if (update.Message.trim()) {
      dispatch(actions.addDLAItem(0, update)).then((result) => {
        setItemsLoaded(false);
        setTopic('');
        setMessage('');
        loadItems();
      });
    }
  }

  return(
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <h1 style={{ marginBottom: 50 }}>Items Of Interest</h1>
        <div className={programStyles.listBg}>
          <h2 className={programStyles.listTitle}>Create an Item of Interest</h2>
          <div style={{width:"100%", margin:5}}>
            <ProgramSelector value={program.ID || ''} onChange={onProgramChange} />
          </div>
          <FormControl variant="standard" style={{width:"100%", margin:5}}>
            <TextField
              label="Topic"
              onChange={handleTopicChange()}
              value={topic}
              variant="outlined"
            />
          </FormControl>
          <FormControl variant="standard" style={{width:"100%", margin:5}}>
            <TextField
              label="Enter information here..."
              multiline
              onChange={handleMessageChange()}
              rows="4"
              value={message}
              variant="outlined"
            />
          </FormControl>
          <div style={{width:"100%", margin:5, textAlign: 'right'}}>
            <Button variant="contained" color="primary" onClick={() => saveItem()}>
              Send
            </Button>
          </div>

        </div>
        <hr /><br /><br />
        <Grid container spacing={2}>
          {
            itemsOfInterest.length > 0 ?
            <Grid item xs={10}>
                <h2 className={programStyles.listTitle}>Sent Items of Interest</h2>
              </Grid> : null
          }
          {
            itemsOfInterest.length > 0 ?
            <Grid item xs={2}>
              <h2 className={programStyles.listTitle}>Status</h2>
            </Grid> : null
          }
          {
            itemsOfInterest.map((item, key) =>
              <Grid container spacing={1}>
                <Grid item xs={10}>
                  <div className={key % 2 ? programStyles.lightGrey : programStyles.darkGrey}
                    onClick={() => handleOpen(item)}>
                    <h5>
                      { item.Subject }
                    </h5>
                    {
                      item.Message.replace(/(<([^>]+)>)/ig, '').substr(0, 150) + (
                        item.Message.replace(/(<([^>]+)>)/ig, '').length > 150 ? '...' : '')
                    }
                  </div>
                </Grid>
                <Grid item xs={2} style={{textAlign:'center'}}>
                  <div className={key % 2 ? programStyles.darkGrey : programStyles.lightGrey}
                    onClick={() => handleOpen(item)}>
                    { item.Status.toUpperCase() }
                  </div>
                </Grid>
              </Grid>
            )
          }
        </Grid>
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
          }}>
            <Fade in={openModal}>
              <div className={classes.modalPaper}>
                <ItemOfInterestModal item={itemModal} closeModal={handleClose} />
              </div>
            </Fade>
        </Modal>
      </Grid>
    </Grid>
  );
}

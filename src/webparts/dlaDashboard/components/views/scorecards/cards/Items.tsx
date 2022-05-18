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
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import 'pure-react-carousel/dist/react-carousel.es.css';
import classNames from 'classnames/bind';
import { actions } from '../../../../models/programs';
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import scoreStyles from '../index.module.scss';
import { useLocation } from 'react-router-dom';
let cx = classNames.bind(scoreStyles);
var moment: any = require('moment');
const people: string =  require("../../../../assets/images/lens_icons/people.png");
const operations: string =  require("../../../../assets/images/lens_icons/operations.png");
const strategy: string =  require("../../../../assets/images/lens_icons/strategy.png");
const technology: string =  require("../../../../assets/images/lens_icons/technology.png");
const governance: string =  require("../../../../assets/images/lens_icons/governance.png");

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
    blue: {
        backgroundColor: '#73B5EF'
    },
    yellow: {
        backgroundColor: '#FFCC3F'
    },
    green: {
        backgroundColor: '#00FF00'
    },

  }));



function TabPanel(props) {
  const { items, select, read, respond } = props;
  const classes = useStyles();
  const [response, setResponse] = React.useState('');

  function handleResponseChange() {
    return (e) => { setResponse(e.target.value); };
  }


  return (
    <TableContainer>
      <div className={scoreStyles.lensLegend}>
        <strong>Status: </strong>
        <span className={`${scoreStyles.legendScore} ${scoreStyles.lensBlue}`}></span> Sent &nbsp;&nbsp;
        <span className={`${scoreStyles.legendScore} ${scoreStyles.lensYellow}`}></span> Read &nbsp;&nbsp;
        <span className={`${scoreStyles.legendScore} ${scoreStyles.lensGreen}`}></span> Responded
      </div>
      <Table>
        <TableHead>
            <TableRow >
                <TableCell style={{fontWeight:700}} align="left">Item Of Interest</TableCell>
                <TableCell style={{fontWeight:700,width:40}} align="left">Status</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
        { items && items.map((item, key) => (
          <TableRow key={key} onClick={() => read(item)}>
            <TableCell align="left">
              <h6 style={{fontWeight:700}}>{item.Subject}</h6>
              <div dangerouslySetInnerHTML={{__html: item.Message ? item.ID === select.ID ?
                item.Message : item.Message.substr(0, 300) : ''}} />
              <hr />
              <div dangerouslySetInnerHTML={{__html: item.Response ? item.ID === select.ID ?
                item.Response : item.Response.substr(0, 300) : item.ID === select.ID ? '' : 'No response'}}
                style={{opacity:item.ID === select.ID?1:0.6}} />
              {
                item.ID === select.ID && item.Status === 'read' ? (
                  <div>
                    <FormControl variant="standard" style={{width:"100%", margin:5}}>
                      <TextField
                        label="Enter response here..."
                        multiline
                        onChange={handleResponseChange()}
                        rows="4"
                        value={response}
                        variant="outlined"
                      />
                    </FormControl>
                    <div style={{width:"100%", margin:5, textAlign: 'right'}}>
                      <Button variant="contained" color="primary" onClick={() =>
                        respond(item.ID, response).then(() => setResponse(''))
                      }>
                        Respond
                      </Button>
                    </div>
                  </div>
                ) : null
              }
            </TableCell>
            <TableCell align="left" style={{ textAlign: 'center' }}>
              <span className={`${scoreStyles.lensStatus} ${
                item.Status === 'sent' ? scoreStyles.lensBlue :
                item.Status === 'read' ? scoreStyles.lensYellow :
                item.Status === 'responded' ? scoreStyles.lensGreen : ''
              }`}></span>
            </TableCell>
          </TableRow>
        ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

interface ProgramData {
  ID?: number;
  Acronym?: string;
}

const defaultProgramData = {
  ID: 0,
  Acronym: 'Program'
};

export default function Items() {
    const dispatch = useDispatch();
    const classes = useStyles();
    const selectedProgram = useSelector(state => state.programs.program);
    const items = useSelector((state) => state.programs.programItems);
    const [program, setProgram] = React.useState<ProgramData>(defaultProgramData);

    async function saveItemResponse(id, Response){
      const update: any = { Response, Status: 'responded' };
      console.log("Responding to Item: ", update);

      if (update.Response.trim()) {
        await dispatch(actions.addDLAItem(id, update)).then((result) => {
          loadItems();
        });
      }
    }


    function readItem(item) {
      setSelectedItem(item);
      if (item.Status === 'sent') {
        dispatch(actions.addDLAItem(item.ID, { ID: item.ID, Status: 'read' })).then(async result => {
          console.log("Item status updated: ", result);
          await loadItems();
        });
      }
    }

    const [selectedItem, setSelectedItem] = React.useState<ProgramData>({});

    React.useEffect(() => {
        if(selectedProgram){
            if(selectedProgram.ID && program.ID !== selectedProgram.ID){
                setProgram(selectedProgram);
                loadItems();
            }
        }
    }, [selectedProgram]);

    async function loadItems(){
        const load = await dispatch(actions.getDLAItems(selectedProgram.ID));
    }

    return (
      <div id="programInsights" className={classes.listRoot}>
        <TabPanel items={items} select={selectedItem} read={readItem} respond={saveItemResponse} />
      </div>
    );
}

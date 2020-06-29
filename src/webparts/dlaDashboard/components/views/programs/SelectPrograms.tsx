import * as React from 'react';
import clsx from 'clsx';
import { withStyles, createStyles, lighten, makeStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import Button from '@material-ui/core/Button';

import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { actions as userActions } from '../../../models/user';
import { actions as programActions } from '../../../models/programs';

import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import classnames from 'classnames/bind';
import listStyles from './index.module.scss';
let cx = classnames.bind(listStyles);

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof ProgramData;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  { id: 'ID', numeric: true, disablePadding: true, label: 'ID' },
  { id: 'Title', numeric: false, disablePadding: false, label: 'Program Name' },
  { id: 'Acronym', numeric: false, disablePadding: false, label: 'Acronym' },
  { id: 'JCODE', numeric: false, disablePadding: false, label: 'JCODE' },
  { id: 'PortfolioManager', numeric: false, disablePadding: false, label: 'Portfolio Manager' },
  { id: 'ProgramManager', numeric: false, disablePadding: false, label: 'Program Manager' },
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof ProgramData) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { classes, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property: keyof ProgramData) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
};

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
            className={headCell.id == 'Title' ? classes.titleCell : classes.labelCell}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}


const programTheme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#CED7E7',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      light: '#73B5EF',
      main: '#04487B',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#78BE20',
    },
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    contrastThreshold: 3,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  },
});

let useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: '#ffffff',
            backgroundColor: '#73B5EF',
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    title: {
      flex: '1 1 100%',
    },
  }),
);

interface EnhancedTableToolbarProps {
  numSelected: number;
  filterPrograms: (event: React.MouseEvent<unknown>) => void;
  filtered: boolean;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const { numSelected, filterPrograms, filtered } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
        {numSelected > 0 ? (
            <Button onClick={filterPrograms} style={{backgroundColor:'#04487B', fontWeight:700, lineHeight:'normal', color:'#ffffff', marginRight:8}}>
                {filtered ? 'Show All Programs' : 'Show User Programs'}
            </Button>
        ) : (
            <Tooltip title="Filter list">
            <IconButton aria-label="filter list">
                <FilterListIcon />
            </IconButton>
            </Tooltip>
        )}
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} Assigned Programs
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          <h2>Programs</h2>
        </Typography>
      )}
      
    </Toolbar>
  );
};

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&selected, &selected:hover': {
        backgroundColor: "#73B5EF !important"
      },
    },
  }),
)(TableRow);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    selected:{ 

    },
    table: {
      minWidth: 750,
    },
    tableRow: {
        "&selected, &selected:hover": {
            backgroundColor: "#73B5EF"
        }
    },
    titleCell: {
        width: 250,
    },
    labelCell: {
        maxWidth: 'none',
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
  }),
);

interface ProgramData {
    ID: string;
    Title: string;
    Acronym: string;
    JCODE: string;
    PortfolioManager: string;
    ProgramManager: string;
}

export default function SelectPrograms({userID}) {
    const classes = useStyles();
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof ProgramData>('Title');
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const dispatch = useDispatch();
    const history = useHistory();
    const isLoading = useSelector((state) => state.user.loading);
    const programs = useSelector((state) => state.programs.list);
    const userPrograms = useSelector((state) => state.programs.userPrograms);
    // const user = useSelector((state) => state.user.data);
    const userAccounts = useSelector(state => state.user.accounts);
    const [selected, setSelected] = React.useState<string[]>(userPrograms);
    const [programFilter, setProgramFilter] = React.useState(false);
    const [user, setUser] = React.useState({
        ID: "",
        Title:"",
        First_Name: "",
        Last_Name: "",
        Email:"",
        Role:"",
        JCODE:"",
        Group:""
    });
    
    React.useEffect(() => {

        if(programs.length < 1){
            dispatch(programActions.getAllPrograms());
        }

        if(userPrograms.length < 1){
            dispatch(programActions.getUserPrograms(user.ID));
            setSelected(userPrograms);            
        }

        if(!user.ID){
            dispatch(userActions.getUserbyID(userID)).then((response) => {
                setUser(response);
            });
        }
        
    }, [user, userAccounts, userPrograms, selected]);

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof ProgramData) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

    const handleClick = (event: React.MouseEvent<unknown>, program) => {
        const id = `${program.ID}`;
        const selectedIndex = userPrograms.indexOf(id);
        let newSelected: string[] = [];
        const userProg = {
            UserID: user.ID,
            ProgramID: program.ID,
            Title: program.Acronym,
            ProgramManager: program.ProgramManager,
            PortfolioManager: program.PortfolioManager,
            JCODE: program.JCODE,
            Active: 'Active'
        };

        if (selectedIndex === -1) {
            //adding a User Program
            dispatch(programActions.addUserProgram(userProg));
            newSelected = newSelected.concat(userPrograms, id);
        } else if (selectedIndex === 0) {
            //removing a User Program
            userProg.Active = 'Inactive';
            dispatch(programActions.updateUserProgram(userProg));
            newSelected = newSelected.concat(userPrograms.slice(1));
        } else if (selectedIndex === userPrograms.length - 1) {
            //removing all User Programs at once
            newSelected = newSelected.concat(userPrograms.slice(0, -1));
        } else if (selectedIndex > 0) {
            //removing User Programs from an array of programs
            userProg.Active = 'Inactive';
            dispatch(programActions.updateUserProgram(userProg));
            newSelected = newSelected.concat(
                userPrograms.slice(0, selectedIndex),
                userPrograms.slice(selectedIndex + 1),
            );
        }
        dispatch(programActions.setUserPrograms(newSelected));
    // setSelected(newSelected);
    };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const isSelected = (name: string) => userPrograms.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, programs.length - page * rowsPerPage);

  function filterPrograms(){
    if(programs && !programFilter){
        const items = [];
        programs.map( program => {
            if(userPrograms.includes(`${program.ID}`)){
                items.push(program);
            }
        });
        dispatch(programActions.setPrograms(items));
        setProgramFilter(!programFilter);
        setPage(0);
    }else{
        dispatch(programActions.getAllPrograms());
        setProgramFilter(!programFilter);
        setPage(0);
    }
  }

  return (
    <div className={classes.root}>
        <ThemeProvider theme={programTheme}>
        <Paper className={classes.paper}>
            <EnhancedTableToolbar numSelected={userPrograms.length} filterPrograms={filterPrograms} filtered={programFilter} />
            <TableContainer>
            <Table
                className={`${listStyles.programList} ${classes.table}`}
                aria-labelledby="tableTitle"
                size={dense ? 'small' : 'medium'}
                aria-label="enhanced table"
            >
                <EnhancedTableHead
                classes={classes}
                numSelected={userPrograms.length}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={programs.length}
                />
                <TableBody>
                {stableSort(programs, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                        const isItemSelected = isSelected(`${row.ID}`);
                        const labelId = `enhanced-table-checkbox-${index}`;
                        const showSelected = cx({
                            selected: isItemSelected
                        });
                    return (
                        <StyledTableRow
                        hover
                        onClick={(event) => handleClick(event, row)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.ID}
                        selected={isItemSelected}
                        className={`${showSelected} ${listStyles.tableRow}`}
                        >
                            <TableCell padding="checkbox">
                            <Checkbox
                                checked={isItemSelected}
                                inputProps={{ 'aria-labelledby': labelId }}
                            />
                            </TableCell>
                            <TableCell component="th" id={labelId} scope="row" padding="none">
                            {row.ID}
                            </TableCell>
                            <TableCell align="left">{row.Title}</TableCell>
                            <TableCell align="left">{row.Acronym}</TableCell>
                            <TableCell align="left">{row.JCODE}</TableCell>
                            <TableCell align="left">{row.PortfolioManager}</TableCell>
                            <TableCell align="left">{row.ProgramManager}</TableCell>
                        </StyledTableRow>
                    );
                    })}
                {emptyRows > 0 && (
                    <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                    <TableCell colSpan={7} />
                    </TableRow>
                )}
                </TableBody>
            </Table>
            </TableContainer>
            <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={programs.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Paper>

        </ThemeProvider>
    </div>
  );
}

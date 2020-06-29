import * as React from 'react';
import { useSelector } from 'react-redux';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import scoreStyles from './index.module.scss';

export function ProgramSelector({ onChange=(event:React.ChangeEvent<{ value: unknown }>)=>{}, value }) {
    const programs = useSelector((state) => state.programs.list);
    const [labelWidth, setLabelWidth] = React.useState(0);
    const inputLabel = React.useRef(null);
    
    React.useEffect(() => {
        setLabelWidth(inputLabel.current.offsetWidth);
    }, []);

    return (
        <FormControl variant="outlined" style={{width:"100%"}}  >
            <InputLabel ref={inputLabel} id="demo-simple-select-outlined-label">
            Select Program
            </InputLabel>
            <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={value}
            onChange={onChange}
            labelWidth={labelWidth}
            >
           {programs.map((program, index) => {
                return (
                    <MenuItem value={program.ID} key={index}>{program.Acronym}</MenuItem>
                );
            })}
            </Select>
        </FormControl>
    );
}

export default ProgramSelector;

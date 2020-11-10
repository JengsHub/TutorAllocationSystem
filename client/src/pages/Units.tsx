import React, {useState, useEffect} from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

const Units = () => {

    const[units, setUnits] = useState<IUnit[]>([]);

    const getAllUnits = async() =>{
        try{
            const response = await fetch("http://localhost:8888/units");
            const jsonData = await response.json();

            setUnits(jsonData);
        }catch(err){
            console.log(err.message);
        }
    }

    useEffect(() => {
        getAllUnits();
      }, []);

    return (
        <div id="main">
        <h1>Units</h1>
        <TableContainer component={Paper}>
        <Table className={""} size="small" aria-label="a dense table" >
            <TableHead>
            <TableRow>
                <TableCell>Unit Code</TableCell>
                <TableCell align="right">Year</TableCell>
                <TableCell align="right">Campus</TableCell>
                <TableCell align="right">Offering</TableCell>
                <TableCell align="right">AQF Target</TableCell>
                <TableCell align="center">Activities</TableCell>
                <TableCell align="center">Preference</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {units.map(unit => (
                <TableRow key={unit.id}>
                <TableCell align="left">{unit.unitCode}</TableCell>
                <TableCell align="right">{unit.year}</TableCell>
                <TableCell align="right">{unit.campus}</TableCell>
                <TableCell align="right">{unit.offeringPeriod}</TableCell>
                <TableCell align="right">{unit.aqfTarget}</TableCell>
                <TableCell align="right"><Button variant="contained" color="secondary">View Activities</Button></TableCell>
                <TableCell align="right"><Button variant="contained" color="default">View Preferences</Button></TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
        
        </div>
    );
};

export default Units;
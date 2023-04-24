
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React from 'react';
import { BoxStyled, ContainerStyled } from './info-table.styles';

const InfoTable = () => {

  function createData(
    name: string,
    usage: number,
    total: number,
    measure: string
  ) {
    return { name, usage, total, measure };
  }


  const rows = [
    createData('RAM', 2, 8, " GB"),
    createData('ROM', 20, 120, " GB"),
    createData('CPU', 54, 100, "%"),
  ];


  return (
    <BoxStyled>
      <ContainerStyled sx={{ width: 550 }} >
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{color: "#fff"}}>Resource</TableCell>
              <TableCell sx={{color: "#fff"}} align="right">In Use</TableCell>
              <TableCell sx={{color: "#fff"}} align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell sx={{color: "#fff !important"}} component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell sx={{color: "#fff !important"}} align="right">{row.usage}{row.measure}</TableCell>
                <TableCell sx={{color: "#fff !important"}} align="right">{row.total}{row.measure}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ContainerStyled>
      {/* <Typography variant={"h2"}>InfoTable</Typography>
      <Typography>Total RAM/Free RAM: 8gb/2gb</Typography>
      <Typography>Total ROM/Free ROM: 120gb/23gb</Typography>
      <Typography>Total CPU/Free CPU: 100%/56%</Typography> */}

    </BoxStyled>
  );
};

export default InfoTable;
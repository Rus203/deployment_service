
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import React, { FC } from 'react';
import { BoxStyled, ContainerStyled } from './info-table.styles';
import { IStatistic } from '../../interface/statictic.interface';
import { getByPattern } from '../../utils/getByPattern';

type Props = {
  statistic: IStatistic
}

const InfoTable: FC<Props> = ({ statistic }) => {
  function createData(
    name: string,
    usage: number,
    total: number,
    measure: string
  ) {
    return { name, usage, total, measure };
  }

  const converterToGB = (value: string): any => {
    if (!value) return;
    const type = value.match(/[a-zA-Z]/g)!.join('').toLowerCase()

    return {
      "m": +getByPattern(value, /[0-9.]+/g) / 1000, 
      "g": +getByPattern(value, /[0-9.]+/g),
      "gb": +getByPattern(value, /[0-9.]+/g),
      "mb": +getByPattern(value, /[0-9.]+/g) / 1000
    }[type]?.toFixed(3)
  }


  const rows = [
    createData('RAM', converterToGB(statistic.value.ram?.usedMemory), +statistic.value.ram?.totalMemory.slice(0, -2), " GB"),
    createData('ROM', converterToGB(statistic.value.rom?.usedSpace), converterToGB(statistic.value.rom?.totalSpace), " GB"),
    createData('CPU', Math.floor(statistic.value.cpuUsage * 100), 100, "%"),
  ];


  return (
    <BoxStyled>
      <ContainerStyled sx={{ width: 420 }} >
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#fff" }}>Resource</TableCell>
              <TableCell sx={{ color: "#fff" }} align="right">In Use</TableCell>
              <TableCell sx={{ color: "#fff" }} align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell sx={{ color: "#fff !important" }} component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell sx={{ color: "#fff !important" }} align="right">{row.usage}{row.measure}</TableCell>
                <TableCell sx={{ color: "#fff !important" }} align="right">{row.total}{row.measure}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ContainerStyled>
    </BoxStyled>
  );
};

export default InfoTable;
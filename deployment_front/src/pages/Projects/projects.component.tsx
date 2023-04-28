import React, { FC } from 'react';
import { Navigate } from 'react-router-dom';
import ApexChartWrapper from '../../@core/styles/libs/react-apexcharts';
import Grid from '@mui/material/Grid';
import Table from '../../views/dashboard-project-table/dashboard-project-table';

const Projects: FC<{ hasAccess: boolean }> = ({ hasAccess = false }) => {
  return !hasAccess
    ? <Navigate to="/login" replace={true} />
    : (<ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Table />
        </Grid>
      </Grid>
    </ApexChartWrapper>)
};

export default Projects;
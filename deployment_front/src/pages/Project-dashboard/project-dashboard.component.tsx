import Grid from '@mui/material/Grid';
import { FC } from 'react';
import ApexChartWrapper from '../../@core/styles/libs/react-apexcharts';
import Table from '../../views/dashboard-project-table';


const ProjectDashboard: FC = () => {
  return (<ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Table />
        </Grid>
      </Grid>
    </ApexChartWrapper>)
};

export default ProjectDashboard;
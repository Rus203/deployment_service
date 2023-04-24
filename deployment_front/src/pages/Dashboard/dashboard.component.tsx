import Grid from '@mui/material/Grid';
import { FC } from 'react';
import ApexChartWrapper from '../../@core/styles/libs/react-apexcharts';
import Table from '../../views/dashboard/dashboard-table';
import { Navigate } from 'react-router-dom';



const Dashboard: FC<{ hasAccess: boolean }> = ({ hasAccess }) => {
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

export default Dashboard;
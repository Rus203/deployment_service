import React, { FC } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "../pages/Register";
import Whooops from "../pages/Whoops";
import ProjectDashboard from "../pages/Project-dashboard";
import Login from "../pages/Login";
import UserLayout from "../layouts/UserLayout";
import Project from "../pages/Project";
import Diagrams from "../pages/Diagrams";
import DashboardMiniBack from "../pages/mini-back-dashboard/mini-back-dashboard.component";
import MiniBack from '../pages/Mini-Back';
import ProtectedComponent from "../Components/Protected-Component";


const BaseRouter: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/'>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path='/' element={<UserLayout />} >
            <Route index element={<ProtectedComponent component={DashboardMiniBack} />} />
            <Route path='mini-back'>
            <Route index element={<ProtectedComponent component={MiniBack} />} />
              <Route path="diagrams" element={<ProtectedComponent component={Diagrams} /> } />
              <Route path=':miniBackId' element={<ProtectedComponent component={ProjectDashboard} /> } />
              <Route path=":miniBackId/project" element={<ProtectedComponent component={Project} /> } />
          
            </Route>
          </Route>
        <Route path="/*" element={<Whooops />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default BaseRouter;

import React, { FC } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "../pages/Register";
import Whooops from "../pages/Whoops";
import ProjectDashboard from "../pages/Project-dashboard";
import Login from "../pages/Login";
import UserLayout from "../layouts/UserLayout";
import Project from "../pages/Project";
import Graph from "../pages/Graphs/graphs.component";
import DashboardMiniBack from "../pages/mini-back-dashboard/project-dashboard.component";
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
            <Route path='mini-back' element={<ProtectedComponent component={MiniBack} />}>
              <Route path=':miniBackId'>
                <Route index element={<ProtectedComponent component={ProjectDashboard} /> } />
                <Route path="diagrams" element={<ProtectedComponent component={Graph} /> } />
                <Route path="project" element={<ProtectedComponent component={Project} /> } />
              </Route>
              </Route>
          </Route>
        </Route>
        <Route path="/*" element={<Whooops />} />
      </Routes>
    </BrowserRouter>
  );
};

export default BaseRouter;

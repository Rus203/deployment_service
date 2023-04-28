import React, { FC } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "../pages/Register";
import Whooops from "../pages/Whoops";
import ProjectDashboard from "../pages/Project-dashboard";
import Login from "../pages/Login";
import UserLayout from "../layouts/UserLayout";
import Project from "../pages/Project";
import { useAppSelector } from "../store/hooks";
import Graph from "../pages/Graphs/graphs.component";
import DashboardMiniBack from "../pages/mini-back-dashboard/project-dashboard.component";
import MiniBack from '../pages/Mini-Back';


const BaseRouter: FC = () => {
  // const hasAccess = useAppSelector(state => state.auth.accessToken) !== null
  const hasAccess = true

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/'>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path='/' element={<UserLayout />} >
            <Route index element={<DashboardMiniBack hasAccess={hasAccess} />} />
            <Route path="mini-back" element={<MiniBack hasAccess={hasAccess} />} />
              <Route path=':miniBackId'>
                <Route index element={<ProjectDashboard hasAccess={hasAccess} />} />
                <Route path="diagrams" element={<Graph hasAccess={hasAccess} />} />
                <Route path="project" element={<Project hasAccess={hasAccess} />} />
              </Route>
          </Route>
        </Route>
        <Route path="/*" element={<Whooops />} />
      </Routes>
    </BrowserRouter>
  );
};

export default BaseRouter;

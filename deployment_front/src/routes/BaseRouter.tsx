import React, { FC } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "../pages/Register";
import Whooops from "../pages/Whoops";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import UserLayout from "../layouts/UserLayout";
import { Deploy } from "../pages/Deploy/deploy.component";
import { useAppSelector } from "../store/hooks";
import Graph from "../pages/Graphs/graphs.component";
import Projects from "../pages/Projects/projects.component";


const BaseRouter: FC = () => {
  const hasAccess = useAppSelector(state => state.auth.accessToken) !== null
  // const hasAccess = true

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/'>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path='/' element={<UserLayout />} >
            <Route index element={<Dashboard hasAccess={hasAccess} />} />
            <Route path="diagrams" element={<Graph hasAccess={hasAccess} />} />
            <Route path="deploy/" element={<Deploy hasAccess={hasAccess} />} />
            <Route path="mini-back/:projectId/projects/" element={<Projects hasAccess={hasAccess} />} />
            <Route path="deploy/:projectId" element={<Deploy hasAccess={hasAccess} />} />
          </Route>
        </Route>
        <Route path="/*" element={<Whooops />} />
      </Routes>
    </BrowserRouter>
  );
};

export default BaseRouter;

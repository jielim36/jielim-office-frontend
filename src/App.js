import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import SysRole from './component/System/SysRole/SysRole';
import Home from './component/Home/Home';
import Layout from './component/Layout/Layout';
import SysUser from './component/System/SysUser/SysUser';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="System/SysRole" element={<SysRole />} />
          <Route path="System/SysUser" element={<SysUser />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

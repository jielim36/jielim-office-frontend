import React from 'react'
import { Outlet } from 'react-router-dom'
import './Layout.css';
import NavSideBar from '../NavigationSideBar/NavSideBar';

const Layout = () => {
  return (
    <>
        <NavSideBar />
        <div className='ContentContainer'>
            <Outlet />
        </div>
    </>
  )
}

export default Layout
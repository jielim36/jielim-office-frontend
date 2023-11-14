import React from 'react'
import { Link } from 'react-router-dom'
import './NavSideBar.css';

const NavSideBar = () => {
  return (
    <nav className='NavSideBarContainer'>
        <h2 className='SideBarTittle'>Dashboard</h2>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/System/SysRole">System Role</Link>
          </li>
        </ul>
    </nav>
  )
}

export default NavSideBar
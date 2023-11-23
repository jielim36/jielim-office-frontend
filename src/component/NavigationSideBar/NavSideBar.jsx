// NavSideBar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavSideBar.css';

const NavSideBar = () => {
  const [isSystemManagementSubMenuOpen, setSubMenuOpen] = useState(false);

  const toggleSubMenu = () => {
    setSubMenuOpen(!isSystemManagementSubMenuOpen);
  };

  return (
    <nav className='NavSideBarContainer'>
      <h2 className='SideBarTittle'>Dashboard</h2>
      <ul className='mainSelection'>
        <li className='homeSelection'>
          <Link to="/">Home</Link>
        </li>
        <li className={`SystemManagementSubMenu ${isSystemManagementSubMenuOpen ? 'Open' : ''}`}>
          <button onClick={toggleSubMenu}>System Management</button>
          <ul>
            <li>
              <Link to="/System/SysRole">System Role</Link>
            </li>
            <li>
              <Link to="/System/SysUser">System User</Link>
            </li>
            <li>
              <Link to="/System/SysMenu">System Menu</Link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default NavSideBar;

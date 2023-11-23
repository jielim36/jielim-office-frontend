import React, { useEffect, useState } from 'react'
import './SysMenu.css';
import AxiosUtil from '../../../Axios/AxiosUtil';

const SysMenu = () => {

    const [menuData, setMenuData] = useState([]);
    const baseAPI = `/admin/system/sysMenu`;

    useEffect(()=>{
        AxiosUtil('get',`${baseAPI}`).then(
            (res) => {
                if (res.message === 'Success') {
                setMenuData(res.data);
                } else {
                console.error('Invalid response format:', res);
                }
            },
            (error) => {
                console.log('Error:', error);
            }
        );
    },[])

    return (
        <div className='SysMenuContainer'>
            <h2 className='SysMenuTittle'>System Menu</h2>
            <div>
                <table className='SysMenuTable'>
                    <thead>
                    <tr>
                        <th>Menu Name</th>
                        <th>Permission Identifier</th>
                        <th>Path</th>
                        <th>Component Path</th>
                        <th>Order</th>
                        <th>Status</th>
                        <th>Operations</th>
                    </tr>
                    </thead>
                    <tbody>
                        {menuData.length > 0 ? <MenuTable menuData={menuData} level={1}/> : ''}
                    </tbody>
                </table>
            </div>
        </div>
    )
    
    
}

const MenuTable = ({ menuData , level }) => {

    const [isExpanded, setIsExpanded] = useState(false);


    const handleMenuClick = () => {
        setIsExpanded(!isExpanded);
    };

    if (menuData && menuData.length > 0) {
      return (
        <>
          {menuData.map((menu) => (
            <React.Fragment key={menu.id}>
              <tr onClick={handleMenuClick}>
                <MenuItem menu={menu} level={level}/>
              </tr>
              {menu.children && menu.children.length > 0 && isExpanded? (
                <MenuTable menuData={menu.children} level={level+1.5}/>
              ) : null}
            </React.Fragment>
          ))}
        </>
      );
    }
  
    return null; // Add this line to handle the case when menuData is undefined or an empty array
  };
  

const MenuItem = ({ menu , level}) => {

    const paddingLevel = `${level*10}px`;

    return (
        <>
            <td className='menuName' style={{paddingLeft: paddingLevel}}>{menu.name}</td>
            <td>{menu.perms}</td>
            <td>{menu.path}</td>
            <td>{menu.component}</td>
            <td>{menu.sortValue}</td>
            <td>{menu.status}</td>
            <td></td>
        </>
    );
  };

export default SysMenu
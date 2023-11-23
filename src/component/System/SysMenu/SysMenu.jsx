import React, { useEffect, useState } from 'react'
import './SysMenu.css';
import AxiosUtil from '../../../Axios/AxiosUtil';
import arrowRight_img from '../../../assets/arrow-right.png';
import arrowDown_img from '../../../assets/arrow-down.png';
import point_img from '../../../assets/point.png';


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

    if (menuData && menuData.length > 0) {
      return (
        <>
          {menuData.map((menu) => (
            <React.Fragment key={menu.id}>
                <MenuItem menu={menu} level={level}/>
            </React.Fragment>
          ))}
        </>
      );
    }
  
    return null;
  };
  

const MenuItem = ({ menu , level}) => {

    const paddingLevel = `${level*10}px`;
    const [isExpanded, setIsExpanded] = useState(false);
    const [animation, setAnimation] = useState(false);

    useEffect(() => {
      setAnimation(true);
    }, []); 


    const handleMenuClick = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <>
          <tr onClick={handleMenuClick} className={animation ? 'slideAnimation' : ''}>
            <td className='menuName' style={{ paddingLeft: paddingLevel }}>
              {menu.children && menu.children.length > 0 ? 
                <img src={arrowRight_img} alt='' className={isExpanded ? 'expanded' : ''}/>
                :
                <img src={point_img} style={{boxSizing:'border-box',padding:'3px'}} alt=''/>
              }
              {menu.name}
            </td>
            <td>{menu.perms}</td>
            <td>{menu.path}</td>
            <td>{menu.component}</td>
            <td>{menu.sortValue}</td>
            <td>{menu.status}</td>
            <td></td>
          </tr>
          {isExpanded && menu.children && menu.children.length > 0 ? (
            <MenuTable menuData={menu.children} level={level + 1.5}/>
          ) : null}
        </>
      );
  };

export default SysMenu
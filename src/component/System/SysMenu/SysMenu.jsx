import React, { useEffect, useState } from 'react'
import './SysMenu.css';
import AxiosUtil from '../../../Axios/AxiosUtil';
import arrowRight_img from '../../../assets/arrow-right.png';
import point_img from '../../../assets/point.png';
import CustomModal from '../../Tools/Modal/CustomModal';
import { Radio,Switch } from 'antd';
import Alert from '../../Tools/Alert/Alert';
import OperationsSysMenu from './OperationsSysMenu';


const SysMenu = () => {

    const [menuData, setMenuData] = useState([]);
    const baseAPI = `/admin/system/sysMenu`;
    const [menuForm , setMenuForm] = useState({
        parentId: 0,
        type: 0,
        name:'',
        sortValue: 1,
        path:'',
        status: 1,
    });
    const [isOpenMenuForm , setIsOpenMenuForm] = useState(false);
    const [alertContent , setAlertContent] = useState('');
    const [showAlert , setShowAlert] = useState(false);

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

    const handleCancleAddMenuModal = ()=>{
        setIsOpenMenuForm(false);
    }

    const handleOpenAddMenuModal = ()=>{
        setIsOpenMenuForm(true);
    }

    const handleAddMenuFormChange = (e) => {
        const { name, value } = e.target;

        //verify
        if(name === 'sortValue' && value < 1){
            return;
        }

        setMenuForm((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };

    const handleAddMenuSubmit = ()=>{
        AxiosUtil('post',`${baseAPI}`,menuForm).then(
            (res) => {
                if (res.message === 'Success') {
                setAlertContent("Added new system menu...");
                // updateInformation();
                popupAlert();
                } else {
                console.error('Invalid response format:', res);
                }
            },
            (error) => {
                console.log('Error:', error);
            }
        );
    }

    const popupAlert = ()=>{
        setShowAlert(true);
        const timeout = setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    
        // 清理定时器以防止内存泄漏
        return () => clearTimeout(timeout);
    }

    return (
        <>
        <div className='SysMenuContainer'>
            <h2 className='SysMenuTittle'>System Menu</h2>
            <button className='addBtn' onClick={handleOpenAddMenuModal}><p>+</p><p>Add</p></button>

            <CustomModal
                isOpen={isOpenMenuForm}
                onRequestClose={handleCancleAddMenuModal}
                contentLabel="Custom Modal"
                >
                <h2>Create Role</h2>
                <form onSubmit={handleAddMenuSubmit}>
                <div className='addRoleFormConatainer'>  
                    <label>
                    Upper Level:
                    <input
                        name="parentId"
                        value={0}
                        onChange={handleAddMenuFormChange}
                        disabled={true}
                        />
                    </label>
                    <label>
                    Menu Type:
                    <Radio.Group name="type" defaultValue={0} onChange={handleAddMenuFormChange} disabled={true}>
                        <Radio value={0}>Source</Radio>
                        <Radio value={1}>Menu</Radio>
                        <Radio value={2}>Button</Radio>
                    </Radio.Group>
                    </label>
                    <label>
                    Menu Name:
                    <input
                        name="name"
                        value={menuForm.name}
                        onChange={handleAddMenuFormChange}
                        />
                    </label>
                    <label>
                    Order Value:
                    <input
                        name="sortValue"
                        value={menuForm.sortValue}
                        onChange={handleAddMenuFormChange}
                        type='number'
                        min={1}
                        />
                    </label>
                    <label>
                    Path:
                    <input
                        name="path"
                        value={menuForm.path}
                        onChange={handleAddMenuFormChange}
                        />
                    </label>
                    <label>
                    Status:
                    <Radio.Group name="status" defaultValue={1} onChange={handleAddMenuFormChange}>
                        <Radio value={1}>Enable</Radio>
                        <Radio value={0}>Disable</Radio>
                    </Radio.Group>
                    </label>
                    <button type="submit" className={`submitAddMenuBtn ${menuForm.name === '' ? 'disabled' : ''}`} disabled={menuForm.name === ''}>Submit</button>
                </div>
                </form>
            </CustomModal> 

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
        
        <Alert content={alertContent} show={showAlert}/>
        </>
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

    //edit status of the menu
    const handleChangeStatus = (checked) =>{
        menu.status = checked ? 1 : 0;
        AxiosUtil('put',`/admin/system/sysMenu`,menu).then(
            (res) => {
                if (res.message === 'Success') {
                    //...
                } else {
                console.error('Invalid response format:', res);
                }
            },
            (error) => {
                console.log('Error:', error);
            }
        );
    }

    return (
        <>
          <tr className={animation ? 'slideAnimation' : ''}>
            <td className='menuName' style={{ paddingLeft: paddingLevel , cursor: menu.children && menu.children.length > 0 ? 'pointer' : ''}} onClick={handleMenuClick}>
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
            <td><Switch checked={menu.status} onChange={handleChangeStatus} /></td>
            <td>
                <OperationsSysMenu menu={menu}/>
            </td>
          </tr>
          {isExpanded && menu.children && menu.children.length > 0 ? (
            <MenuTable menuData={menu.children} level={level + 1.5}/>
          ) : null}
        </>
      );
  };

export default SysMenu
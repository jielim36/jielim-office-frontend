import React, { useState } from 'react'
import './OperationsSysMenu.css';
import { Radio,Alert, Space } from 'antd';
import AxiosUtil from '../../../Axios/AxiosUtil';
import CustomModal from '../../Tools/Modal/CustomModal';

const OperationsSysMenu = ({menu}) => {

    const baseAPI = `/admin/system/sysMenu`;
    const [menuForm , setMenuForm] = useState(menu);
    const [isOpenMenuForm , setIsOpenMenuForm] = useState(false);
    const [alertContent , setAlertContent] = useState('');
    const [showAlert , setShowAlert] = useState(false);

    const handleCancleEditMenuModal = ()=>{
        setIsOpenMenuForm(false);
    }

    const handleOpenEditMenuModal = ()=>{
        setIsOpenMenuForm(true);
    }

    const handleEditMenuFormChange = (e) => {
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

    const handleEditMenuSubmit = ()=>{
        AxiosUtil('put',`${baseAPI}`,menuForm).then(
            (res) => {
                if (res.message === 'Success') {
                setAlertContent("Edited new system menu...");
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
        <div>
            <button className='operationBtn' onClick={handleOpenEditMenuModal}>Edit</button>
            {/* <button className='operationBtn .deleteBtn' onClick={handleDelete}>Delete</button>
            <button className='operationBtn' onClick={handleOpenAssignRoles}>Assign Role</button> */}
        </div>

        <CustomModal
                isOpen={isOpenMenuForm}
                onRequestClose={handleCancleEditMenuModal}
                contentLabel="Custom Modal"
                >
                <h2>Create Role</h2>
                <form onSubmit={handleEditMenuSubmit}>
                <div className='addRoleFormConatainer'>  
                    <label>
                    Upper Level:
                    <input
                        name="parentId"
                        value={0}
                        onChange={handleEditMenuFormChange}
                        disabled={true}
                        />
                    </label>
                    <label>
                    Menu Type:
                    <Radio.Group name="type" defaultValue={0} onChange={handleEditMenuFormChange} disabled={true}>
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
                        onChange={handleEditMenuFormChange}
                        />
                    </label>
                    <label>
                    Order Value:
                    <input
                        name="sortValue"
                        value={menuForm.sortValue}
                        onChange={handleEditMenuFormChange}
                        type='number'
                        min={1}
                        />
                    </label>
                    <label>
                    Path:
                    <input
                        name="path"
                        value={menuForm.path}
                        onChange={handleEditMenuFormChange}
                        />
                    </label>
                    <label>
                    Status:
                    <Radio.Group name="status" onChange={handleEditMenuFormChange} defaultValue={menu.status}>
                        <Radio value={1}>Enable</Radio>
                        <Radio value={0}>Disable</Radio>
                    </Radio.Group>
                    </label>
                    <button type="submit" className={`submitEditMenuBtn ${menuForm.name === '' ? 'disabled' : ''}`} disabled={menuForm.name === ''}>Submit</button>
                </div>
                </form>
            </CustomModal> 
    </>
  )
}

export default OperationsSysMenu
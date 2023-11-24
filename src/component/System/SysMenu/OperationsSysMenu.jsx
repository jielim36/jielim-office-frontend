import React, { useState } from 'react'
import './OperationsSysMenu.css';
import { Radio } from 'antd';
import AxiosUtil from '../../../Axios/AxiosUtil';
import CustomModal from '../../Tools/Modal/CustomModal';

const OperationsSysMenu = ({menu , level ,onUpdateInfo}) => {

    const baseAPI = `/admin/system/sysMenu`;
    const [editMenuForm , setEditMenuForm] = useState(menu);
    const [isOpenEditMenuForm , setIsOpenEditMenuForm] = useState(false);
    const [addMenuForm , setAddMenuForm] = useState({
        parentId: menu.id,
        type: 0,
        name:'',
        sortValue: 1,
        path:'',
        status: 1,
    });
    const [isOpenAddMenuForm , setIsOpenAddMenuForm] = useState(false);

    const handleCancleEditMenuModal = ()=>{
        setIsOpenEditMenuForm(false);
    }

    const handleOpenEditMenuModal = ()=>{
        setIsOpenEditMenuForm(true);
    }

    const handleEditMenuFormChange = (e) => {
        const { name, value } = e.target;

        //verify
        if(name === 'sortValue' && value < 1){
            return;
        }

        setEditMenuForm((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };

    const handleEditMenuSubmit = ()=>{
        AxiosUtil('put',`${baseAPI}`,editMenuForm).then(
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

    const handleCancleAddMenuModal = ()=>{
        setIsOpenAddMenuForm(false);
    }

    const handleOpenAddMenuModal = ()=>{
        setIsOpenAddMenuForm(true);
    }

    const handleAddMenuFormChange = (e) => {
        const { name, value } = e.target;

        //verify
        if(name === 'sortValue' && value < 1){
            return;
        }

        setAddMenuForm((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };

    const handleAddMenuSubmit = ()=>{
        AxiosUtil('post',`${baseAPI}`,addMenuForm).then(
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

    const handleDeleteMenu = ()=>{
        AxiosUtil('delete',`${baseAPI}/${menu.id}`).then(
            (res) => {
                if (res.message === 'Success') {
                    onUpdateInfo();
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
        <div>
            <button className='operationBtn' onClick={handleOpenEditMenuModal}>Edit</button>
            <button className='operationBtn' onClick={handleOpenAddMenuModal}>Add</button>
            <button className={`operationBtn .deleteBtn ${menu.children.length > 0 ? 'disabledBtn' : ''}`} onClick={handleDeleteMenu} disabled={menu.children.length > 0}>Delete</button>
        </div>

        <CustomModal
                isOpen={isOpenEditMenuForm}
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
                    <Radio.Group name="type" defaultValue={menu.type} onChange={handleEditMenuFormChange}>
                        <Radio value={0} disabled={menu.parentId===0}>Source</Radio>
                        <Radio value={1} disabled={menu.parentId===0}>Menu</Radio>
                        <Radio value={2} disabled={menu.parentId===0 || level < 2.6}>Button</Radio>
                    </Radio.Group>
                    </label>
                    <label>
                    Menu Name:
                    <input
                        name="name"
                        value={editMenuForm.name}
                        onChange={handleEditMenuFormChange}
                        />
                    </label>
                    <label>
                    Order Value:
                    <input
                        name="sortValue"
                        value={editMenuForm.sortValue}
                        onChange={handleEditMenuFormChange}
                        type='number'
                        min={1}
                        />
                    </label>
                    <label>
                    Path:
                    <input
                        name="path"
                        value={editMenuForm.path}
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
                    <button type="submit" className={`submitEditMenuBtn ${editMenuForm.name === '' ? 'disabledBtn' : ''}`} disabled={editMenuForm.name === ''}>Submit</button>
                </div>
                </form>
            </CustomModal>

            <CustomModal
                isOpen={isOpenAddMenuForm}
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
                        value={menu.name}
                        onChange={handleAddMenuFormChange}
                        disabled={true}
                        />
                    </label>
                    <label>
                    Menu Type:
                    <Radio.Group name="type" defaultValue={menu.type} onChange={handleEditMenuFormChange}>
                        <Radio value={0} >Source</Radio>
                        <Radio value={1} disabled={level+1.5 < 1}>Menu</Radio>
                        <Radio value={2} disabled={level+1.5 < 2.6}>Button</Radio>
                    </Radio.Group>
                    </label>
                    <label>
                    Menu Name:
                    <input
                        name="name"
                        value={addMenuForm.name}
                        onChange={handleAddMenuFormChange}
                        />
                    </label>
                    <label>
                    Order Value:
                    <input
                        name="sortValue"
                        value={addMenuForm.sortValue}
                        onChange={handleAddMenuFormChange}
                        type='number'
                        min={1}
                        />
                    </label>
                    <label>
                    Path:
                    <input
                        name="path"
                        value={addMenuForm.path}
                        onChange={handleAddMenuFormChange}
                        />
                    </label>
                    <label>
                    Status:
                    <Radio.Group name="status" onChange={handleAddMenuFormChange} defaultValue={menu.status}>
                        <Radio value={1}>Enable</Radio>
                        <Radio value={0}>Disable</Radio>
                    </Radio.Group>
                    </label>
                    <button type="submit" className={`submitAddMenuBtn ${addMenuForm.name === '' ? 'disabledBtn' : ''}`} disabled={addMenuForm.name === ''}>Submit</button>
                </div>
                </form>
            </CustomModal> 
    </>
  )
}

export default OperationsSysMenu
import React from 'react'
import Alert from '../../Tools/Alert/Alert';
import { useState } from 'react';
import CustomModal from '../../Tools/Modal/CustomModal';
import './Operations.css';
import AxiosUtil from '../../../Axios/AxiosUtil';

const Operations = ({roleObject, onUpdateInfo}) => {

    const baseAPI = `/admin/system/sysRole`;
    const [showAlert, setShowAlert] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [alertContent , setAlertContent] = useState('default content');
    const [editRoleForm , setEditRoleForm] = useState(false);

    const [formData, setFormData] = useState(roleObject);
  
    const handleOpenEditRoleModal = () =>{
      setEditRoleForm(true);
    }
  
    const handleCancleEditRoleModal = () =>{
      setEditRoleForm(false);
    }
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
  
    const handleAddRoleSubmit = (e) => {
      e.preventDefault();
      editSysRoleRequest();
      handleCancleEditRoleModal();
    };

    const handleDelete = () => {
        setIsModalOpen(true);
      };
    
      const handleConfirmDelete = () => {
        // 在这里执行删除逻辑
        setIsModalOpen(false);
        AxiosUtil('delete', `${baseAPI}/${roleObject.id}` ).then(
            (res) => {
              if (res.message === 'Success') {
                setAlertContent(`${roleObject.roleName} Role is Deleted!`)
              } else {
                setAlertContent(`Invalid delete operation...`)
              }
            },
            (error) => {
                console.log('异常啦', error);
            }
            );
            popupAlertWithUpdate();
      };

      
      const editSysRoleRequest = ()=>{
        AxiosUtil('put',`${baseAPI}`,formData).then(
          (res) => {
            if (res.message === 'Success') {
              setAlertContent("Edit Successful...");
              updateInformationTimer();
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
    
      const handleCancelDelete = () => {
        setIsModalOpen(false);
      };

    const updateInformationTimer = ()=>{
      const timeout = setTimeout(() => {
          onUpdateInfo();
      }, 100);
  
      // 清理定时器以防止内存泄漏
      return () => clearTimeout(timeout);
    }

    const popupAlert = ()=>{
      setShowAlert(true);
      const timeout = setTimeout(() => {
          setShowAlert(false);
          // onUpdateInfo();
      }, 3000);
  
      // 清理定时器以防止内存泄漏
      return () => clearTimeout(timeout);
    }

    const popupAlertWithUpdate = ()=>{
      setShowAlert(true);
      const timeout = setTimeout(() => {
          setShowAlert(false);
          onUpdateInfo();
      }, 3000);
  
      // 清理定时器以防止内存泄漏
      return () => clearTimeout(timeout);
    }
  
    return (
        <>
            <div>
                <button className='operationBtn' onClick={handleOpenEditRoleModal}>Edit</button>
                <button className='operationBtn .deleteBtn' onClick={handleDelete}>Delete</button>
            </div>
            <CustomModal
                isOpen={isModalOpen}
                onRequestClose={handleCancelDelete}
            >
                <p>Are you sure you want to delete this role?</p>
                <button className='deleteBtn' onClick={handleConfirmDelete}>Yes</button>
                <button className='cancelDeleteBtn' onClick={handleCancelDelete}>No</button>
            </CustomModal>
            <CustomModal
              isOpen={editRoleForm}
              onRequestClose={handleCancleEditRoleModal}
              contentLabel="Custom Modal"
            >
              <h2>Create Role</h2>
              <form onSubmit={handleAddRoleSubmit}>
                <div className='addRoleFormConatainer'>  
                  <label>
                    Role Name:
                    <input
                      type="text"
                      name="roleName"
                      value={formData.roleName}
                      onChange={handleChange}
                    />
                  </label>
                  <label>
                    Role Code:
                    <input
                      type="text"
                      name="roleCode"
                      value={formData.roleCode}
                      onChange={handleChange}
                    />
                  </label>
                  <label>
                    Description:
                    <input
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </label>
                  <button type="submit">Submit</button>
                </div>
              </form>
          </CustomModal> 
            <Alert content={alertContent} show={showAlert}/>
        </>
    );
}

export default Operations
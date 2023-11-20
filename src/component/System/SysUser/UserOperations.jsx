import React, { useEffect } from 'react'
import Alert from '../../Tools/Alert/Alert';
import { useState } from 'react';
import CustomModal from '../../Tools/Modal/CustomModal';
import './UserOperations.css';
import AxiosUtil from '../../../Axios/AxiosUtil';

const UserOperations = ({userObject, onUpdateInfo}) => {

    const baseAPI = `/admin/system/sysUser`;
    const [showAlert, setShowAlert] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [alertContent , setAlertContent] = useState('default content');
    const [editUserForm , setEditUserForm] = useState(false);
    const [isAssignRolesModalOpen, setIsAssignRolesModalOpen] = useState(false);
    const [allRoles,setAllRoles] = useState([]);
    const [userRoles, setUserRoles] = useState([]);
    const [formData, setFormData] = useState(userObject);
  
    const baseSysRoleAPI = `/admin/system/sysRole`;
    const getUserRoles = (userId)=>{
      AxiosUtil('get',`${baseSysRoleAPI}/user/${userId}`).then(
        (res) => {
          if (res.message === 'Success') {
            setAllRoles(res.data.allRolesList);
            setUserRoles(res.data.assignRoleList.map(role=>role.id));
          } else {
            console.error('Invalid response format:', res);
          }
        },
        (error) => {
          console.log('Error:', error);
        }
      );
    }

    useEffect(()=>{
      getUserRoles(userObject.id);
    },[])

    const handleOpenEditUserModal = () =>{
      setEditUserForm(true);
    }
  
    const handleCancleEditUserModal = () =>{
      setEditUserForm(false);
    }
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
  
    const handleAddUserSubmit = (e) => {
      e.preventDefault();
      editSysUserRequest();
      handleCancleEditUserModal();
    };

    const handleDelete = () => {
        setIsModalOpen(true);
      };
    
    const handleConfirmDelete = () => {
      // 在这里执行删除逻辑
      setIsModalOpen(false);
      AxiosUtil('delete', `${baseAPI}/${userObject.id}` ).then(
          (res) => {
            if (res.message === 'Success') {
              setAlertContent(`User: ${userObject.username} is Deleted!`)
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
    
    const editSysUserRequest = ()=>{
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

    const handleOpenAssignRoles = ()=>{
      setIsAssignRolesModalOpen(true);
    };

    const handleCancelAssignRoles = ()=>{
      setIsAssignRolesModalOpen(false);
    };

    const handleAssignUserRolesCheckboxChange = (roleId) => {
      setUserRoles((prevUserRoles) => {
        // 在 checkedRoles 状态中切换 roleId
        return prevUserRoles.includes(roleId)
          ? prevUserRoles.filter((id) => id !== roleId)
          : [...prevUserRoles, roleId];
      });
    };

    const handleSubmitUserRoles = ()=>{
      const submitUserRolesForm = {
        userId: userObject.id,
        roleIdList: userRoles,
      }
      console.log(submitUserRolesForm);

      AxiosUtil('put',`${baseSysRoleAPI}/role`,submitUserRolesForm).then(
        (res) => {
          if (res.message === 'Success') {
            setAlertContent("Update User Roles Successful...");
            updateInformationTimer();
            popupAlert();
            handleCancelAssignRoles();
          } else {
            console.error('Invalid response format:', res);
          }
        },
        (error) => {
          console.log('Error:', error);
        }
      );
    }
    

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
                <button className='operationBtn' onClick={handleOpenEditUserModal}>Edit</button>
                <button className='operationBtn .deleteBtn' onClick={handleDelete}>Delete</button>
                <button className='operationBtn' onClick={handleOpenAssignRoles}>Assign Role</button>
            </div>
            <CustomModal
                isOpen={isModalOpen}
                onRequestClose={handleCancelDelete}
            >
                <p>Are you sure you want to delete this user?</p>
                <button className='deleteBtn' onClick={handleConfirmDelete}>Yes</button>
                <button className='cancelDeleteBtn' onClick={handleCancelDelete}>No</button>
            </CustomModal>
            <CustomModal
              isOpen={editUserForm}
              onRequestClose={handleCancleEditUserModal}
              contentLabel="Custom Modal"
            >
              <h2>Create User</h2>
              <form onSubmit={handleAddUserSubmit}>
                <div className='addUserFormConatainer'>  
                  <label>
                    User Name:
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </label>
                  <label>
                    Password:
                    <input
                      type="text"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </label>
                  <label>
                    Name:
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </label>
                  <label>
                    Phone:
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </label>
                  <button type="submit">Submit</button>
                </div>
              </form>
          </CustomModal>
          {allRoles && userRoles ? 
              <CustomModal
                isOpen={isAssignRolesModalOpen}
                onRequestClose={handleCancelAssignRoles}
              >
                <h2>Assign User Roles</h2>
                {allRoles.map((role) => (
                  <div className='userRoleCheckBox' key={role.id}>
                    <input
                      type="checkbox"
                      id={`roleCheckbox_${role.id}`}
                      checked={userRoles.includes(role.id)}
                      onChange={()=>handleAssignUserRolesCheckboxChange(role.id)}
                    />
                    <p>{role.roleName}</p>
                  </div>
                ))}
                <button className='submitAssignRolesBtn' onClick={handleSubmitUserRoles}>Submit</button>
                <button className='cancelDeleteBtn' onClick={handleCancelAssignRoles}>Cancel</button>
              </CustomModal>
            : ''}
          <Alert content={alertContent} show={showAlert}/>

        </>
    );
}

export default UserOperations
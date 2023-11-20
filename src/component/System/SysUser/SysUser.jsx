import './SysUser.css';
import React, { useEffect, useState,useCallback } from 'react'
import {Switch} from 'antd';
import AxiosUtil from '../../../Axios/AxiosUtil';
import UserOperations from './UserOperations';
import CustomModal from '../../Tools/Modal/CustomModal';
import Alert from '../../Tools/Alert/Alert';


const SysUser = () => {

  const [addUserForm , setAddUserForm] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertContent , setAlertContent] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [deleteBatch,setDeleteBatch] = useState(false);
  const [isBatchDeleteModalOpen, setIsBatchDeleteModalOpen] = useState(false);
  const baseAPI = `/admin/system/sysUser`;
  const [sysUserData, setSysUserData] = useState({
    dataList: [],
    page: 1,
    limit:5,
    totalData:0,
    totalPage:0,
    searchObject:{
      username: ''
    }
  });

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    phone: "",
  });

  const handleOpenAddUserModal = () =>{
    setAddUserForm(true);
  }

  const handleCancleAddUserModal = () =>{
    setAddUserForm(false);
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
    addSysUserRequest();
    setFormData({
      username: "",
      password: "",
      name: "",
      phone: "",
    });
    handleCancleAddUserModal();
  };

  const addSysUserRequest = ()=>{
    AxiosUtil('post',`${baseAPI}`,formData).then(
      (res) => {
        if (res.message === 'Success') {
          setAlertContent("Added new system user...");
          updateInformation();
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

  const getSysUserPage = useCallback(() => {
    AxiosUtil('get', `${baseAPI}/${sysUserData.page}/${sysUserData.limit}`, sysUserData.searchObject).then(
      (res) => {
        if (res.data && res.data.records) {
          setSysUserData((prevState) => ({
            ...prevState,  // Spread the previous state to retain its values
            dataList: res.data.records,  // Update the specific property you want to change
            page: res.data.current,
            totalData: res.data.total,
            totalPage: res.data.pages,
            searchObject: {
              username: ''
            },
          }));
        } else {
          console.error('Invalid response format:', res);
        }
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }, [baseAPI,sysUserData]);
  
  useEffect(()=>{
    getSysUserPage();
  },[sysUserData.page,sysUserData.totalData])

  const popupAlert = ()=>{
    setShowAlert(true);
    const timeout = setTimeout(() => {
        setShowAlert(false);
        getSysUserPage();
    }, 3000);

    // 清理定时器以防止内存泄漏
    return () => clearTimeout(timeout);
  }

  const updateInformation = ()=>{
    const timeout = setTimeout(() => {
        getSysUserPage();
    }, 100);

    // 清理定时器以防止内存泄漏
    return () => clearTimeout(timeout);
  }

  const handleSearchChange = (e) => {
    setSysUserData((prevData) => ({
      ...prevData,
      searchObject: {
        ...prevData.searchObject,
        username: e.target.value,
      },
    }));
  };

  const handleSearch = () => {
    // You may add more search parameters as needed
    getSysUserPage();
  };

  const handlePageChange = (newPage) => {
    if(newPage <= sysUserData.totalPage){
      setSysUserData((prevData) => ({
        ...prevData,
        page: newPage,
      }));
    }
  };
  
  const del_function = () =>{
    getSysUserPage();
  }

  const handleBatchDeleteCheckbox = ()=>{
    setDeleteBatch(!deleteBatch);
    if(deleteBatch){
      const allIds = sysUserData.dataList.map((user) => user.id);
      setSelectedRows(allIds);
    }else{
      setSelectedRows([]);
    }
  }

  const handleRowSelect = (userId) => {
    setSelectedRows((prevSelectedRows) => {
      return prevSelectedRows.includes(userId)
        ? prevSelectedRows.filter((id) => id !== userId)
        : [...prevSelectedRows, userId];
    });
  };

  const handleBatchDelete = () => {
    // Perform batch delete operation using selectedRows
    if (selectedRows.length === 0) {
      alert('Please select at least one row to delete.');
      return;
    }

    AxiosUtil('delete', `${baseAPI}`, selectedRows ).then(
      (res) => {
        if (res.message === 'Success') {
          // Update the state or fetch data again if needed
          updateInformation();
          // Clear selected rows
          setSelectedRows([]);
          popupAlert();
        } else {
          setAlertContent(`Invalid delete operation...`)
        }
      },
      (error) => {
          console.log('异常啦', error);
      }
      );
      setIsBatchDeleteModalOpen(false);
  };

  const handleCancelBatchDeleteModal = () => {
    setIsBatchDeleteModalOpen(false);
  };

  const handleOpenBatchDeleteModal = () => {
    if (selectedRows.length === 0) {
      alert('Please select at least one row to delete.');
      return;
    }
    setIsBatchDeleteModalOpen(true);
  };

  const statusOnChange = (user) => (checked) => {
    console.log(`User ID: ${user.id}, Status: ${checked}`);
    user.status = checked ? 1:0;
    console.log(user.status);
    editSysUserRequest(user);
  };

  const editSysUserRequest = (userObejct)=>{
    AxiosUtil('put',`${baseAPI}`,userObejct).then(
      (res) => {
        if (res.message === 'Success') {
          setAlertContent(`${userObejct.status === 1 ? "Enabeld" : "Disabled"} user: ${userObejct.username}(${userObejct.id})`);
          updateInformation();
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

  return (
    <div className='SysUserContainer'>
      
      <h2 className='SysUserTittle'>System Role Information</h2>

      {/* Search Bar */}
      <div className='searchBar'>
        <p>User Name:</p>
        <input
          type="text"
          value={sysUserData.searchObject.username}
          onChange={handleSearchChange}
          placeholder="Search by User Name"
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <button 
        className='batchDeleteUserBtn'
        onClick={handleOpenBatchDeleteModal}
        >
          Batch Delete
      </button>

      <button 
        className='addUserBtn'
        onClick={handleOpenAddUserModal}
        >
          Add
      </button>

      <table className='SysUserTable'>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={()=> handleBatchDeleteCheckbox()}
                checked={selectedRows.length === sysUserData.dataList.length && sysUserData.dataList.length !== 0}
              />
            </th>
            <th>ID</th>
            <th>User Name</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Position</th>
            <th>Department</th>
            <th>Character</th>
            <th>Status</th>
            <th>Create Time</th>
            <th>Operations</th>
          </tr>
        </thead>
        <tbody>
          {sysUserData.dataList.map((user) => (
            <tr key={user.id}>
              <td>
                <input
                  type="checkbox"
                  onChange={(event) => handleRowSelect(user.id)}
                  checked={selectedRows.includes(user.id)}
                />
              </td>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.name}</td>
              <td>{user.phone}</td>
              <td>{user.postId}</td>
              <td>{user.deptId}</td>
              <td>character</td>
              <th>
                <Switch defaultChecked onChange={statusOnChange(user)} checked={user.status}/>
              </th>
              <th>{user.createTime}</th>
              <td>
                <UserOperations userObject={user} onUpdateInfo={() => del_function()}/>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className='Pagination'>
        <p className='totalPage'>Total Pages: {sysUserData.totalPage}</p>
        <div className='core'>
          <button
            disabled={sysUserData.page === 1}
            onClick={() => handlePageChange(sysUserData.page - 1)}
            className="arrowButton"
          >
            &lt; {/* 左箭头 */}
          </button>
          <span>{sysUserData.page}</span>
          <button
            disabled={sysUserData.page === sysUserData.totalPage}
            onClick={() => handlePageChange(sysUserData.page + 1)}
            className="arrowButton"
          >
            &gt; {/* 右箭头 */}
          </button>
        </div>
        <p>Go to page: </p>
        <input
          type="number"
          value={sysUserData.page}
          onChange={(e) => handlePageChange(Number(e.target.value))}
          min={1}
          max={sysUserData.totalPage}
        />
        <button onClick={getSysUserPage} disabled={sysUserData.page > sysUserData.totalPage}>Go</button>
      </div>
      <CustomModal
        isOpen={addUserForm}
        onRequestClose={handleCancleAddUserModal}
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
    <CustomModal
        isOpen={isBatchDeleteModalOpen}
        onRequestClose={handleCancelBatchDeleteModal}
    >
        <p>Are you sure you want to delete {selectedRows.length} users?</p>
        <button className='deleteBtn' onClick={handleBatchDelete}>Yes</button>
        <button className='cancelDeleteBtn' onClick={handleCancelBatchDeleteModal}>No</button>
    </CustomModal>

    <Alert content={alertContent} show={showAlert}/>
    </div>
  )
}

export default SysUser
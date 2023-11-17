import './SysUser.css';
import React, { useEffect, useState,useCallback } from 'react'
import AxiosUtil from '../../../Axios/AxiosUtil';
import UserOperations from './UserOperations';
import CustomModal from '../../Tools/Modal/CustomModal';
import Alert from '../../Tools/Alert/Alert';

const SysUser = () => {

  const [addRoleForm , setAddRoleForm] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertContent , setAlertContent] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [deleteBatch,setDeleteBatch] = useState(false);
  const [isBatchDeleteModalOpen, setIsBatchDeleteModalOpen] = useState(false);


  const [formData, setFormData] = useState({
    roleName: "",
    roleCode: "",
    description: ""
  });

  const handleOpenAddRoleModal = () =>{
    setAddRoleForm(true);
  }

  const handleCancleAddRoleModal = () =>{
    setAddRoleForm(false);
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
    addSysRoleRequest();
    setFormData({
      roleName: '',
      roleCode: '',
      description: '',
    });
    handleCancleAddRoleModal();
  };

  const baseAPI = `/admin/system/sysRole`;
  const [sysRoleData, setSysRoleData] = useState({
    dataList: [],
    page: 1,
    limit:10,
    totalData:0,
    totalPage:0,
    searchObject:{
      roleName: ''
    }
  });

  const addSysRoleRequest = ()=>{
    AxiosUtil('post',`${baseAPI}`,formData).then(
      (res) => {
        if (res.message === 'Success') {
          setAlertContent("Added new system role...");
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

  const getSysRolePage = useCallback(() => {
    AxiosUtil('get', `${baseAPI}/${sysRoleData.page}/${sysRoleData.limit}`, sysRoleData.searchObject).then(
      (res) => {
        if (res.data && res.data.records) {
          setSysRoleData((prevState) => ({
            ...prevState,  // Spread the previous state to retain its values
            dataList: res.data.records,  // Update the specific property you want to change
            page: res.data.current,
            totalData: res.data.total,
            totalPage: res.data.pages,
            searchObject: {
              roleName: ''
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
  }, [baseAPI,sysRoleData]);
  
  useEffect(()=>{
    getSysRolePage();
  },[sysRoleData.page,sysRoleData.totalData])

  const popupAlert = ()=>{
    setShowAlert(true);
    const timeout = setTimeout(() => {
        setShowAlert(false);
        getSysRolePage();
    }, 3000);

    // 清理定时器以防止内存泄漏
    return () => clearTimeout(timeout);
  }

  const updateInformation = ()=>{
    const timeout = setTimeout(() => {
        getSysRolePage();
    }, 100);

    // 清理定时器以防止内存泄漏
    return () => clearTimeout(timeout);
  }

  const handleSearchChange = (e) => {
    setSysRoleData((prevData) => ({
      ...prevData,
      searchObject: {
        ...prevData.searchObject,
        roleName: e.target.value,
      },
    }));
  };

  const handleSearch = () => {
    // You may add more search parameters as needed
    getSysRolePage();
  };

  const handlePageChange = (newPage) => {
    setSysRoleData((prevData) => ({
      ...prevData,
      page: newPage,
    }));
  };
  
  const del_function = () =>{
    getSysRolePage();
  }

  const handleBatchDeleteCheckbox = ()=>{
    setDeleteBatch(!deleteBatch);
    if(deleteBatch){
      const allIds = sysRoleData.dataList.map((role) => role.id);
      setSelectedRows(allIds);
    }else{
      setSelectedRows([]);
    }
  }

  const handleRowSelect = (roleId) => {
    setSelectedRows((prevSelectedRows) => {
      return prevSelectedRows.includes(roleId)
        ? prevSelectedRows.filter((id) => id !== roleId)
        : [...prevSelectedRows, roleId];
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


  return (
    <div className='SysRoleContainer'>
      
      <h2 className='SysRoleTittle'>System Role Information</h2>

      {/* Search Bar */}
      <div className='searchBar'>
        <p>Role Name:</p>
        <input
          type="text"
          value={sysRoleData.searchObject.roleName}
          onChange={handleSearchChange}
          placeholder="Search by Role Name"
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <button 
        className='batchDeleteRoleBtn'
        onClick={handleOpenBatchDeleteModal}
        >
          Batch Delete
      </button>

      <button 
        className='addRoleBtn'
        onClick={handleOpenAddRoleModal}
        >
          Add
      </button>

      <table className='SysRoleTable'>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={()=> handleBatchDeleteCheckbox()}
                checked={selectedRows.length === sysRoleData.dataList.length}
              />
            </th>
            <th>ID</th>
            <th>Role Name</th>
            <th>Role Code</th>
            <th>Description</th>
            <th>Create Time</th>
            <th>Update Time</th>
            <th>Operations</th>
          </tr>
        </thead>
        <tbody>
          {sysRoleData.dataList.map((role) => (
            <tr key={role.id}>
              <td>
                <input
                  type="checkbox"
                  onChange={(event) => handleRowSelect(role.id)}
                  checked={selectedRows.includes(role.id)}
                />
              </td>
              <td>{role.id}</td>
              <td>{role.roleName}</td>
              <td>{role.roleCode}</td>
              <td>{role.description}</td>
              <td>{role.createTime}</td>
              <td>{role.updateTime}</td>
              <td><UserOperations roleObject={role} onUpdateInfo={() => del_function()}/></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className='Pagination'>
        <p className='totalPage'>Total Pages: {sysRoleData.totalPage}</p>
        <div className='core'>
          <button
            disabled={sysRoleData.page === 1}
            onClick={() => handlePageChange(sysRoleData.page - 1)}
            className="arrowButton"
          >
            &lt; {/* 左箭头 */}
          </button>
          <span>{sysRoleData.page}</span>
          <button
            disabled={sysRoleData.page === sysRoleData.totalPage}
            onClick={() => handlePageChange(sysRoleData.page + 1)}
            className="arrowButton"
          >
            &gt; {/* 右箭头 */}
          </button>
        </div>
        <p>Go to page: </p>
        <input
          type="number"
          value={sysRoleData.page}
          onChange={(e) => handlePageChange(Number(e.target.value))}
          min={1}
          max={sysRoleData.totalPage}
        />
        <button onClick={getSysRolePage}>Go</button>
      </div>
      <CustomModal
        isOpen={addRoleForm}
        onRequestClose={handleCancleAddRoleModal}
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
    <CustomModal
        isOpen={isBatchDeleteModalOpen}
        onRequestClose={handleCancelBatchDeleteModal}
    >
        <p>Are you sure you want to delete {selectedRows.length} roles?</p>
        <button className='deleteBtn' onClick={handleBatchDelete}>Yes</button>
        <button className='cancelDeleteBtn' onClick={handleCancelBatchDeleteModal}>No</button>
    </CustomModal>

    <Alert content={alertContent} show={showAlert}/>
    </div>
  )
}

export default SysUser
import './SysRole.css';
import React, { useEffect, useState,useCallback } from 'react'
import AxiosUtil from '../../../Axios/AxiosUtil';
import Operations from './Operations';

const SysRole = () => {

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
        console.log('异常啦', error);
      }
    );
  }, [baseAPI,sysRoleData]);
  
  useEffect(()=>{
    getSysRolePage();
  },[sysRoleData.page])

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

      <table className='SysRoleTable'>
        <thead>
          <tr>
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
              <td>{role.id}</td>
              <td>{role.roleName}</td>
              <td>{role.roleCode}</td>
              <td>{role.description}</td>
              <td>{role.createTime}</td>
              <td>{role.updateTime}</td>
              <td><Operations roleObject={role}/></td>
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
    </div>
  )
}

export default SysRole
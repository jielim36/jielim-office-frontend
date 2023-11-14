import React from 'react'
import Alert from '../../Tools/Alert/Alert';
import AxiosUtil from '../../../Axios/AxiosUtil';
import { useState } from 'react';

const Operations = ({roleObject}) => {

    const [showAlert, setShowAlert] = useState(false);


    const handleDelete = () => {
      const confirmDelete = window.confirm('Are you sure you want to delete this role?');
  
      if (confirmDelete) {
        const content = 'Role ID: ' + roleObject.id + ' has been deleted!'
        AxiosUtil('delete', `/admin/system/sysRole/${roleObject.id}` ).then(
            (res) => {
              if (res.message === 'Success') {
                return <Alert content={content}/>
              } else {
                return <Alert content={"Invalid Operation!"} />
              }
            },
            (error) => {
              console.log('异常啦', error);
            }
        );
        window.location.reload();
      }
    };
  
    const handleEdit = () => {
      // Navigate to the edit page (You need to define the route and component)
      console.log("Edit...");
      return <Alert content={"hihii"} />
    };
  
    return (
      <div>
        <button className='operationBtn' onClick={handleEdit}>Edit</button>
        <button className='operationBtn' onClick={handleDelete}>Delete</button>
      </div>
    );
}

export default Operations
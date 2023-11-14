import React from 'react'
import { useState,useEffect } from 'react';
import './Alert.css';

const Alert = ({content}) => {
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
      // 显示提示窗口
      setShowAlert(true);
  
      // 3秒后关闭提示窗口
      const timeout = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
  
      // 清理定时器以防止内存泄漏
      return () => clearTimeout(timeout);
    }, []); // 这里的空数组表示只在组件挂载时运行一次
  
    return (
      <div className='alertContainer'>
        {showAlert && <div className="alert">{content}</div>}
        {/* 其他组件内容 */}
      </div>
    );
}

export default Alert
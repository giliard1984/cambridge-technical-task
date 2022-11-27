import React from 'react';
import { useNavigate } from "react-router-dom";
import { FloatButton } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const LeaveActivityFloatButton: React.FC = () => {
  let navigate = useNavigate(); 

  return (
    <FloatButton icon={<ArrowLeftOutlined />} tooltip={<div>Go home</div>} onClick={() => navigate('/')} />
  )
};

export default LeaveActivityFloatButton;
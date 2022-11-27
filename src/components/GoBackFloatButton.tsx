import React from 'react';
import { useNavigate } from "react-router-dom";
import { FloatButton } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const GoBackFloatButton: React.FC = () => {
  let navigate = useNavigate(); 

  return (
    <FloatButton icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} />
  )
};

export default GoBackFloatButton;
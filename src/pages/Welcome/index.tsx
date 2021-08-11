
import { Button, Modal } from 'antd';
import React, { lazy, useState } from 'react';
import { useHistory } from 'react-router-dom';
const LoadModel = lazy(() => import("../index"));
export const Welcome: React.FC = () => {
  const history = useHistory();
  const [load, setLoad] = useState(false);
  const Ok = () => {
    setLoad(true);
    setTimeout(() => {
      history.replace("/main");
    }, 300)
  }
  return <>
    {load ? <LoadModel /> : null}
    <div className="flex items-center justify-center text-4xl">
      <div> Welcome!</div>
      <Button type="primary" onClick={Ok}>进入.</Button>
    </div>
  </>;
}
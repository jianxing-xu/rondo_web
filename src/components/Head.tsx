import React, { useEffect } from 'react';
import { Button } from "antd";
import { themeChange } from 'utils';
import { useGlobalModel } from 'models/globalModel';

interface Properties {
  title: string;
}

export default function Head({ title }: Properties) {

  const { changeSettings } = useGlobalModel();

  useEffect(() => {
    document.title = title;
  }, [title]);

  // eslint-disable-next-line unicorn/no-null
  return <div className="fixed text-gray-900 bottom-2 right-2 dark:text-white">
    < Button type="primary" onClick={() => changeSettings("dark")
    }> 改变主题</Button >
  </div >
}

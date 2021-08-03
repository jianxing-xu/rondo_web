import React, { useEffect } from 'react';
import { Button } from "antd";
import { themeChange } from 'utils';
import { useGlobalModel } from 'models/globalModel';
import { useSocketModel } from 'models/socketModel';

interface Properties {
  title: string;
}

export default function Head({ title }: Properties) {
  const { changeRoom } = useSocketModel();

  useEffect(() => {
    document.title = title;
  }, [title]);

  // eslint-disable-next-line unicorn/no-null
  return <div className="fixed text-gray-900 bottom-2 right-2 dark:text-white">
    < Button type="primary" onClick={() => changeRoom()
    }> 改变房间</Button >
  </div >
}

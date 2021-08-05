import React, { useContext, useEffect } from 'react';
import { Button } from "antd";
import { themeChange } from 'utils';
import { useGlobalModel } from 'models/globalModel';
import { useSocketModel } from 'models/socketModel';
import { useCoreModel } from 'models/coreModule';
import { MPopoverContext } from './MPopover';

interface Properties {
  title: string;
}

export default function Head({ title }: Properties) {
  const { changeRoom } = useCoreModel();
  const context = useContext(MPopoverContext);

  useEffect(() => {
    document.title = title;
  }, [title]);

  // eslint-disable-next-line unicorn/no-null
  return <div className="fixed text-gray-900 bottom-2 right-2 dark:text-white">
    < Button type="primary" onClick={() => {
      // context.setVis("Search");
      // console.log(context);
    }
    }> 改变房间</Button >
  </div >
}

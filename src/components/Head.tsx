import React, { useContext, useEffect } from 'react';
import { Button } from "antd";
import { useCoreModel } from 'models/coreModule';

interface Properties {
  title: string;
}

export default function Head({ title }: Properties) {
  const { changeRoom } = useCoreModel(model => []);

  useEffect(() => {
    document.title = title;
  }, [title]);
  console.log("Document title render!");
  return <div className="fixed text-gray-900 bottom-2 right-2 dark:text-white">
    < Button type="primary" onClick={() => {
      // context.setVis("Search");
      // console.log(context);
    }
    }> 改变房间</Button >
  </div >
}

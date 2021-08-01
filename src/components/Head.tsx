import React, { useEffect } from 'react';
import { Button } from "antd";

interface Properties {
  title: string;
}

export default function Head({ title }: Properties) {

  const themeChange = () => {
    if (document.body.parentElement?.classList.contains("dark")) {
      document.body.parentElement?.classList.remove("dark");
    } else {
      document.body.parentElement?.classList.add("dark");
    }
  }
  useEffect(() => {
    document.title = title;
  }, [title]);

  // eslint-disable-next-line unicorn/no-null
  return <div className="fixed text-gray-900 bottom-2 right-2 dark:text-white">
    < Button type="primary" onClick={() => themeChange()
    }> 改变主题</Button >
  </div >
}

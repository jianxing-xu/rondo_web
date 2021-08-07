import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { classNames } from 'utils';


export interface IMpopoverContext {
  vis: boolean;
}
export const MPopoverContext = React.createContext<any>({});

export interface IMPopover {
  width?: number;
  cref: any;
}

let MPopover = ({ children, width = 400, popKeys }: any, ref: any) => {
  const [flagVis, setFlagVis] = useState<any>({});
  const handleTouch = (e: any) => {

  }
  /**
   * 设置哪一个组件的显示/其他全部影藏
   * @param name 组件标记
   */
  const setShow = (name: string) => {
    setFlagVis((f: any) => {
      for (let item in f) {
        if (item == name) {
          f[item] = !f[item];
        } else {
          f[item] = false;
        }
      }
      return f;
    });
  }
  // 隐藏所有
  const hideAll = () => {
    setFlagVis((f: any) => {
      for (let item in f) {
        f[item] = false;
      }
      console.log(f);
      return f;
    })
  }
  // 提供调用方法
  // useImperativeHandle(ref, () => ({
  //   setShow,
  //   hideAll
  // }))
  // useEffect(() => {
  //   setFlagVis((f: any) => {
  //     popKeys.forEach((k: any) => {
  //       f[k] = false;
  //     });
  //     return f;
  //   })
  //   document.body.addEventListener("click", handleTouch, false);
  //   return () => document.body.removeEventListener("click", handleTouch, false);
  // }, [])

  return (
    <MPopoverContext.Provider value={{ setShow, hideAll, handleTouch }}>
      {/* <div className={classNames("rondo_popover absolute top-0 bottom-0 right-0")} style={{ width }}> */}
      {
        !Array.isArray(children) ? !!flagVis[children['props']['mkey']] ? children : null :
          children.map((item: any) => {
            console.log(item['props']['mkey']);
            if (!item['props']['mkey']) throw new Error("SideBar mkey is required ! 通过这个key来控制显示隐藏");
            return !!flagVis[item['props']['mkey']] ? item : null;
          })
      }
      {/* </div> */}
    </MPopoverContext.Provider>
  );
}
export default forwardRef(MPopover)


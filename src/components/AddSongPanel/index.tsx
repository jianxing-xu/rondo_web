import { message, Spin } from 'antd';
import { addSong, ISearchSongParam, searchSong } from 'api/song';
import { MInput } from 'components/MInput';
import { MPopoverContext } from 'components/MPopover';
import { useCoreModel } from 'models/coreModule';
import { useSocketModel } from 'models/socketModel';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { classNames } from 'utils';
import CST from 'utils/CST';

import _ from './index.module.css';

export const RightHead = ({ title = "" }) => {
  return (
    <div className="py-3 text-2xl">
      {title}
    </div>
  );
}
/**
 * 
 * @param fetch 返回 promis 的请求函数
 * @param p 初始化参数对象 需要和第一个参数匹配，传递歌第一个函数
 * @returns 状态对象
 */
export interface IUseFetchConfig {
  init?: boolean; // 初始化是否发出请求 默认 true 
  append?: boolean; // 数组形式数据，请求后追加到原数据后面 默认 false
}
export const useFetch = (fetch: (param: any) => Promise<any>, p?: any, config: IUseFetchConfig = { init: true, append: false }) => {
  const [param, setParam] = useState(p);
  const [data, setData] = useState<any>();
  const [err, setErr] = useState<any>();
  const [loading, setLoading] = useState(false);
  const fetching = (p?: any) => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      fetch(p ?? param).then(d => {
        if (config.append) {
          if (!Array.isArray(d)) throw new Error("开启配置：{config:{ append: true}}返回的数据不是数组形式");
          setData((old: any) => [...old, ...d]);
        } else {
          setData(d);
        }
        setErr(null);
        resolve(d);
      }).catch(e => {
        setErr(e);
        reject(e);
      }).finally(() => setLoading(false));
    });
  }
  useEffect(() => {
    if (config.init) {
      fetching();
    }
  }, [param])
  return { loading, data, setData, err, fetching, setParam };
}



export const RightPanelWrapper: React.FC = ({ children }) => {
  return <div onClick={(e) => e.stopPropagation()} style={{ width: 400 }} className="absolute top-0 bottom-0 right-0 h-full p-2 shadow-2xl bg-bgc">
    {children}
  </div>
}
interface IAddSongPanel {

}
export const AddSongPanel: React.FC<IAddSongPanel> = ({ children }) => {
  const { room } = useSocketModel(model => [model.room]);
  const { at, setAt } = useCoreModel(model => [model.at]);
  const [param, setParam] = useState<ISearchSongParam>({
    isHot: true,
    keyword: "",
    page: 1
  });
  const { data, setData, loading, fetching, err } = useFetch(searchSong, param);

  // 搜索处理
  const onSearch = async (v: any) => {
    setParam(p => ({ ...p, isHot: false }));
    fetching({ keyword: v, page: 1, isHot: false }).catch(e => {
      message.error("搜索失败");
    });
  }
  // 点歌处理
  const addSongHandle = (mid: any, index: number) => {
    attachLoading(index);
    addSong({ roomId: room['room']?.room_id, mid, atUser: at?.user_id }).then(() => {
      message.success("点歌成功！");
    }).catch(e => {
      console.log(e);
    }).finally(() => attachLoading(index, false))
  }
  // 给搜索条目附加loading状态
  const attachLoading = (index: number, flag: boolean = true) => {
    setData((data: any) => {
      for (let i = 0; i < data?.length || 0; i++) {
        if (i == index) {
          if (flag) {
            data[i]['loading'] = flag;
          } else {
            delete data[i]['loading'];
          }
          break;
        }
      }
      return data;
    });
  }

  return <RightPanelWrapper>
    {at && at.type == 0 ? <div className="absolute bottom-0 z-10 flex flex-1 px-2 py-2 m-2 rounded-sm shadow-md bg-primary left-3 right-3">
      <img className="w-12 h-12 rounded-sm" src={CST.static_url + at?.user_head} alt="" />
      <div className="w-2/3 pl-2">
        <div className="truncate">
          {at?.user_name}
        </div>
        <div className="pt-2 truncate text-xxs text-light">你正在为TA挑选一首歌</div>
      </div>
      <div onClick={() => setAt(null)} className="absolute w-10 px-1 text-center transition border rounded-sm cursor-pointer select-none right-2 text-xxs active:text-gray-900 dark:active:text-gray-100 active:bg-opacity-60" style={{ borderColor: "var(--font-normal)" }}>取消</div>
    </div> : null}
    <RightHead title="点歌" />
    <MInput onSearch={onSearch} />
    <div className="absolute bottom-0 left-0 right-0 overflow-y-auto m_scroll" style={{ top: 120 }}>
      <Spin spinning={loading}  >
        <h2 className={classNames(`text-2xl text-center text-current ${(loading && data?.length == 0) ? 'pt-20' : ''}`)}>
          {
            (!!err && !loading) ? <span className="py-4">搜索失败</span> : (!!!err && !loading && data?.length == 0) ? <span className="py-4">世界的尽头</span> : null
          }
        </h2>
        {param.isHot ? <div className="pl-2">本周热门点播</div> : null}
        {loading && param.isHot ? <div className="py-40"></div> : null}
        {data?.map((item: any, index: number) => (
          // 单个
          <Spin spinning={item?.loading ?? false} key={index}>
            <div key={index} className="relative flex flex-1 px-2 py-2 m-2 rounded-sm bg-bg-light">
              <img className="w-12 h-12 rounded-sm" src={item?.pic} alt="" />
              <div className="w-2/3 pl-2">
                <div className="truncate">
                  {!!item?.week ? <span className="text-primary">({item?.week})</span> : null}
                  {item?.name}
                </div>
                <div className="pt-2 truncate text-xxs text-light">{item?.singer}</div>
              </div>
              <div onClick={() => addSongHandle(item.mid, index)} className="absolute w-10 px-1 text-center transition border rounded-sm cursor-pointer select-none right-2 text-xxs active:text-gray-900 dark:active:text-gray-100 active:bg-opacity-60" style={{ borderColor: "var(--font-normal)" }}>点歌</div>
            </div>
          </Spin>
        ))}
      </Spin>
    </div>
  </RightPanelWrapper>
}
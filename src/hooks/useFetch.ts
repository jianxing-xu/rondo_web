import { useEffect, useMemo, useRef, useState } from "react";
/**
 *
 * @param fetch 返回 promis 的请求函数
 * @param p 初始化参数对象 需要和第一个参数匹配，传递歌第一个函数
 * @returns 状态对象
 */
export interface IUseFetchConfig {
  init?: boolean; // 初始化是否发出请求 默认 true
  def?: any; // 默认初始数据data
  append?: boolean; // 数组形式数据，请求后追加到原数据后面 默认 false
  before?: Function;
}

export const useFetch = (
  fetch: (param: any) => Promise<any>,
  p?: any,
  config: IUseFetchConfig = {
    init: true,
    append: false,
    def: null,
    before: () => {},
  }
) => {
  config.init = config.init ?? true;
  config.append = config.append ?? false;
  config.def = config.def ?? null;
  const countRef = useRef(0);
  const [param, setParam] = useState(p);
  const [data, setData] = useState<any>(config.def);
  const [err, setErr] = useState<any>();
  const [loading, setLoading] = useState(false);
  const fetching = async (p?: any) => {
    countRef.current++;
    return new Promise((resolve, reject) => {
      setLoading(true);
      fetch(p ?? param)
        .then((d) => {
          resolve(d);
          if (config.append) {
            if (!Array.isArray(d))
              throw new Error(
                "开启配置：{config:{ append: true}}返回的数据不是数组形式"
              );
            setData((old: any) => {
              config.before && config.before(d);
              return [...old, ...d];
            });
          } else {
            setData(() => {
              config.before && config.before(d);
              return d;
            });
          }
          setErr(null);
        })
        .catch((e) => {
          setErr(e);
          reject(e);
        })
        .finally(() => setLoading(false));
    });
  };
  const isFirst = useMemo(() => {
    return countRef.current === 1;
  }, [countRef.current]);
  useEffect(() => {
    if (config.init) {
      fetching();
    }
  }, [param]);
  return { loading, data, setData, err, fetching, setParam, isFirst };
};

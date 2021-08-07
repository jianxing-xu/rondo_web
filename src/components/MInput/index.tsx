
import React, { useState } from 'react'
import { classNames } from 'utils';
import _ from './index.module.css';
interface IMInput {
  btnTxt?: string;
  onSearch?: (v: string) => void
  hint?: string;
}
export const MInput: React.FC<IMInput> = ({ btnTxt = "搜索", hint = "搜索歌手/歌曲", onSearch = () => { } }) => {
  const [v, setV] = useState<any>("");
  return (
    <div className={classNames("flex rounded-sm overflow-hidden h-9", _.minput_w)}>
      <input placeholder={hint} type="text" className={classNames("inline flex-grow border-0 outline-none bg-bg-light", _.minput)} value={v} onChange={e => setV(e.target.value)} />
      <span className="inline-block px-3 leading-9 cursor-pointer" onClick={() => onSearch(v)}>{btnTxt}</span>
    </div>
  );
}
import React, { forwardRef, useState } from "react";
import { classNames } from "utils";
import _ from "./index.module.css";
interface IMInput {
  btnTxt?: string;
  onSearch?: (v: string) => void;
  hint?: string;
  type?: string;
}
export const MInput: React.FC<IMInput> = forwardRef(
  (
    {
      btnTxt = "搜索",
      hint = "搜索歌手/歌曲",
      onSearch = () => {},
      type = "text",
    },
    ref: any
  ) => {
    const [v, setV] = useState<any>("");
    const handleInputKeyDown = (e: any) => {
      if (e.key == "Enter") {
        onSearch(v);
        e.preventDefault();
      }
      return false;
    };
    return (
      <div
        className={classNames(
          "flex rounded overflow-hidden ring-0",
          _.minput_w
        )}
      >
        <input
          ref={ref}
          onKeyDown={handleInputKeyDown}
          placeholder={hint}
          type={type}
          className={classNames(
            "inline flex-grow border-0 outline-none bg-input ring-0",
            _.minput
          )}
          value={v}
          onChange={(e) => setV(e.target.value)}
        />
        <span
          className="inline-block px-3 leading-9 cursor-pointer"
          onClick={() => onSearch(v)}
        >
          {btnTxt}
        </span>
      </div>
    );
  }
);

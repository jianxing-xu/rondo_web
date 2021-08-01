import { Button } from "antd";
import { useSocketModel } from "models/socketModel";
import { useUserModel } from "models/userModel";
import React, { ReactElement, useEffect } from "react";


export default function MainWindow(): ReactElement {
  const { user } = useUserModel();
  const sm = useSocketModel();

  useEffect(() => {
    console.log("MainWidnow User: ", user);
  }, [user])
  return (
    <>
      <button>{100}</button>
      <Button type="dashed" onClick={() => useUserModel.data?.resetUser()} >resetUser</Button>
      <h2 className="text-5xl">
        {user?.user_name}
      </h2>
    </>
  );
}

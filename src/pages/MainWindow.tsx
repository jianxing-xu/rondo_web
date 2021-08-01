import Head from "components/Head";
import { useSocketModel } from "models/socketModel";
import { useUserModel } from "models/userModel";
import React, { ReactElement } from "react";
import { Panel } from "rsuite";


export default function MainWindow(): ReactElement {
  const { user } = useUserModel();
  const sm = useSocketModel();

  return (
    <>
      <Head title="Vitamin" />
      <button>{100}</button>
      {/* <Button appearance="primary" onClick={() => sm.changeRoom()} >changeRoom</Button> */}

      <Panel>
        {user.user_name}
      </Panel>
    </>
  );
}

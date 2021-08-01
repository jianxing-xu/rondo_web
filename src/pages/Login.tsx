

import Head from "components/Head";
import React, { ReactElement } from "react";
import { RouteComponentProps } from "react-router-dom";


export default function DetailsPage({
  match,
}: RouteComponentProps<{ fruitName: string }>): ReactElement {
  // const { isLoading, isError, error, data } = useQuery("fruits", getFruits);
  // if (isLoading || isError) {
  //   return <LoadingOrError error={error as Error} />;
  // }



  const isMobile = window.matchMedia("(min-width: 640px)").matches;
  const imageWidth =
    (isMobile ? window.innerWidth * 0.4 : window.innerWidth) *
    window.devicePixelRatio;
  const imageHeight =
    (isMobile ? window.innerHeight : window.innerHeight * 0.3) *
    window.devicePixelRatio;

  return (
    <>
      <Head title={"Hello World!"} />
    </>
  );
}

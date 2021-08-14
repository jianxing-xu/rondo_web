import React, { ReactElement } from "react";

interface Properties {
  error?: Error;
}
export default function LoadingOrError({ error }: Properties): ReactElement {
  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ background: "#333" }}
    >
      <h1
        className="text-xl"
        style={{ color: "#eee" }}
        data-cy="LoadingOrError"
      >
        {error ? error.message : "Loading..."}
      </h1>
    </div>
  );
}
LoadingOrError.defaultProps = {
  error: undefined,
};

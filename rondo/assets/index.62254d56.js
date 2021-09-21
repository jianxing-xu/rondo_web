import {
  r as e,
  R as t,
  c as r,
  a as n,
  S as o,
  b as l,
  d as s,
} from "./vendor.a6a4925f.js";
let a;
const c = {},
  i = function (e, t) {
    if (!t || 0 === t.length) return e();
    if (void 0 === a) {
      const e = document.createElement("link").relList;
      a =
        e && e.supports && e.supports("modulepreload")
          ? "modulepreload"
          : "preload";
    }
    return Promise.all(
      t.map((e) => {
        if ((e = `/rondo/${e}`) in c) return;
        c[e] = !0;
        const t = e.endsWith(".css"),
          r = t ? '[rel="stylesheet"]' : "";
        if (document.querySelector(`link[href="${e}"]${r}`)) return;
        const n = document.createElement("link");
        return (
          (n.rel = t ? "stylesheet" : a),
          t || ((n.as = "script"), (n.crossOrigin = "")),
          (n.href = e),
          document.head.appendChild(n),
          t
            ? new Promise((e, t) => {
                n.addEventListener("load", e), n.addEventListener("error", t);
              })
            : void 0
        );
      })
    ).then(() => e());
  };
function m({ title: t }) {
  return (
    e.exports.useEffect(() => {
      document.title = t;
    }, [t]),
    null
  );
}
function d({ error: e }) {
  return t.createElement(
    "div",
    {
      className: "flex items-center justify-center min-h-screen",
      style: { background: "#333" },
    },
    t.createElement(
      "h1",
      {
        className: "text-xl",
        style: { color: "#eee" },
        "data-cy": "LoadingOrError",
      },
      e ? e.message : "Loading..."
    )
  );
}
d.defaultProps = { error: void 0 };
const u = e.exports.lazy(() =>
    i(
      () => import("./index.5a8e1009.js"),
      [
        "assets/index.5a8e1009.js",
        "assets/index.8a7c8f39.css",
        "assets/index.f6e0add2.js",
        "assets/index.b086f93a.css",
        "assets/vendor.a6a4925f.js",
      ]
    )
  ),
  p = e.exports.lazy(() =>
    i(
      () => import("./Login.59cd9e84.js"),
      [
        "assets/Login.59cd9e84.js",
        "assets/Login.71165e16.css",
        "assets/index.f6e0add2.js",
        "assets/index.b086f93a.css",
        "assets/vendor.a6a4925f.js",
      ]
    )
  ),
  E = r();
function f() {
  return (
    console.log("APP RENDER"),
    t.createElement(
      t.Fragment,
      null,
      t.createElement(
        n,
        { history: E },
        t.createElement(m, { title: "App" }),
        t.createElement(
          e.exports.Suspense,
          { fallback: t.createElement(d, null) },
          t.createElement(
            o,
            null,
            t.createElement(l, { exact: !0, path: "/", component: u }),
            t.createElement(l, { path: "/login", component: p })
          )
        )
      )
    )
  );
}
s.render(
  t.createElement(t.StrictMode, null, t.createElement(f, null)),
  document.querySelector("#root")
);
export { E as h };

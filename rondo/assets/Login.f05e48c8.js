var e = Object.defineProperty,
  a = Object.getOwnPropertySymbols,
  t = Object.prototype.hasOwnProperty,
  r = Object.prototype.propertyIsEnumerable,
  l = (a, t, r) =>
    t in a
      ? e(a, t, { enumerable: !0, configurable: !0, writable: !0, value: r })
      : (a[t] = r);
import {
  a6 as n,
  u as c,
  M as s,
  p as o,
  n as i,
  R as m,
  af as u,
  aT as p,
  aU as d,
  aV as f,
  q as g,
} from "./index.2974fcfe.js";
import { r as v, u as y, R as h } from "./vendor.a6a4925f.js";
import "./index.5fe6a9c3.js";
var b = {
    icon: {
      tag: "svg",
      attrs: { viewBox: "64 64 896 896", focusable: "false" },
      children: [
        {
          tag: "path",
          attrs: {
            d: "M832 464h-68V240c0-70.7-57.3-128-128-128H388c-70.7 0-128 57.3-128 128v224h-68c-17.7 0-32 14.3-32 32v384c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V496c0-17.7-14.3-32-32-32zM332 240c0-30.9 25.1-56 56-56h248c30.9 0 56 25.1 56 56v224H332V240zm460 600H232V536h560v304zM484 701v53c0 4.4 3.6 8 8 8h40c4.4 0 8-3.6 8-8v-53a48.01 48.01 0 10-56 0z",
          },
        },
      ],
    },
    name: "lock",
    theme: "outlined",
  },
  x = function (e, a) {
    return v.exports.createElement(
      n,
      Object.assign({}, e, { ref: a, icon: b })
    );
  };
x.displayName = "LockOutlined";
var E = v.exports.forwardRef(x),
  w = {
    icon: {
      tag: "svg",
      attrs: { viewBox: "64 64 896 896", focusable: "false" },
      children: [
        {
          tag: "path",
          attrs: {
            d: "M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z",
          },
        },
      ],
    },
    name: "user",
    theme: "outlined",
  },
  N = function (e, a) {
    return v.exports.createElement(
      n,
      Object.assign({}, e, { ref: a, icon: w })
    );
  };
N.displayName = "UserOutlined";
var j = v.exports.forwardRef(N);
var _ = { login_panel: "_login_panel_ryq59_1" };
function z() {
  const e = y(),
    [n, b] = v.exports.useState(!1),
    { user: x } = c((e) => [e.user]),
    [w] = s.useForm();
  v.exports.useEffect(() => {
    (null == x ? void 0 : x.user_id) !== o.guestUserInfo.user_id &&
      e.replace("/");
  }, []);
  return h.createElement(
    h.Fragment,
    null,
    h.createElement(
      "div",
      {
        className:
          "z-10 flex items-center justify-center w-full h-full bg-opacity-50 login bg-bgc",
      },
      h.createElement("div", {
        style: { backgroundImage: 'url("/public/bg.jpg")' },
        className:
          "fixed top-0 bottom-0 left-0 right-0 w-full h-full dark:opacity-30 opacity-60",
      }),
      h.createElement(
        "div",
        {
          className: i(
            "bg-gray-200 dark:bg-gray-700 w-3/5 rounded-lg p-8 divide-gray-700 z-10",
            null == _ ? void 0 : _.login_panel
          ),
        },
        h.createElement(
          "div",
          {
            className:
              "flex items-center justify-between divide-x-2 divide-gray-400 login_panel_head",
          },
          h.createElement(
            "h2",
            { className: "text-3xl font-semibold text-current" },
            "先登录后在一起玩耍"
          ),
          h.createElement(
            "a",
            {
              onClick: () => {
                var a;
                e.replace("/"), null == (a = c.data) || a.reconnect();
              },
              className:
                "pl-8 text-lg text-gray-400 cursor-pointer select-none hover:text-gray-500",
            },
            "游客登录"
          )
        ),
        h.createElement(
          "div",
          { className: "pt-8 login_panel_form" },
          h.createElement(
            s,
            {
              form: w,
              onFinish: (n) => {
                b(!0),
                  (n.plat = p().name),
                  d(
                    ((e, n) => {
                      for (var c in n || (n = {}))
                        t.call(n, c) && l(e, c, n[c]);
                      if (a) for (var c of a(n)) r.call(n, c) && l(e, c, n[c]);
                      return e;
                    })({}, n)
                  )
                    .then(async (a) => {
                      var t;
                      null == (t = c.data) || t.reconnect(), e.replace("/");
                    })
                    .finally(() => b(!1));
              },
            },
            h.createElement(
              s.Item,
              {
                name: "account",
                rules: [{ required: !0, message: "你是谁？" }],
              },
              h.createElement(m, {
                addonAfter: h.createElement(
                  u,
                  {
                    loading: n,
                    type: "link",
                    className: "cursor-pointer",
                    onClick: () => {
                      b(!0),
                        w
                          .validateFields(["account"])
                          .then(async (e) => {
                            await f(e.account), g.success("邮件发送成功");
                          })
                          .finally(() => b(!1));
                    },
                  },
                  "发送邮件"
                ),
                size: "large",
                prefix: h.createElement(j, {
                  className: "site-form-item-icon",
                }),
                placeholder: "账户/邮箱/ID",
              })
            ),
            h.createElement(
              s.Item,
              {
                name: "password",
                rules: [{ required: !0, message: "啊这..." }],
              },
              h.createElement(m, {
                size: "large",
                prefix: h.createElement(E, {
                  className: "site-form-item-icon",
                }),
                type: "password",
                placeholder: "密码/邮箱验证码",
              })
            ),
            h.createElement(
              s.Item,
              null,
              h.createElement(
                u,
                {
                  loading: n,
                  style: { width: "100px" },
                  size: "large",
                  type: "primary",
                  htmlType: "submit",
                  className: "login-form-button",
                },
                "登录"
              )
            )
          )
        )
      )
    )
  );
}
export default z;

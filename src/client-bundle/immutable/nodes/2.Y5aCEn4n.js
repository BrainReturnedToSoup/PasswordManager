import { s as p, n as f, e as h } from "../chunks/scheduler.BbOnFq8D.js";
import {
  S as g,
  i as l,
  r as $,
  u as d,
  v as S,
  d as _,
  t as A,
  w as k,
} from "../chunks/index.r4Y_ernq.js";
import {
  L as C,
  c as b,
  g as c,
  f as x,
  p as y,
  a as v,
} from "../chunks/authState.KF5z5tHC.js";
function w(r) {
  let e, n;
  return (
    (e = new C({})),
    {
      c() {
        $(e.$$.fragment);
      },
      l(t) {
        d(e.$$.fragment, t);
      },
      m(t, s) {
        S(e, t, s), (n = !0);
      },
      p: f,
      i(t) {
        n || (_(e.$$.fragment, t), (n = !0));
      },
      o(t) {
        A(e.$$.fragment, t), (n = !1);
      },
      d(t) {
        k(e, t);
      },
    }
  );
}
function L(r, e, n) {
  const t = {
      firstAuthCheckStore: x,
      pendingAuthCheckStore: y,
      authStateStore: v,
    },
    s = {};
  let o = {};
  for (const [a, u] of Object.entries(t))
    (s[a] = u.subscribe((m) => {
      const i = { ...o };
      (i[a] = m), n(0, (o = i));
    })),
      h(s[a]);
  return (
    o.pendingAuthCheckStore || b(),
    (r.$$.update = () => {
      r.$$.dirty & 1 &&
        (o.pendingAuthCheckStore ||
          (o.authStateStore ? c("/home") : c("/log-in")));
    }),
    [o]
  );
}
class O extends g {
  constructor(e) {
    super(), l(this, e, L, w, p, {});
  }
}
export { O as component };

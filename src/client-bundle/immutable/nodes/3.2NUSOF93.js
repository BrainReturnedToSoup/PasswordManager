import { s as d, n as _, e as A } from "../chunks/scheduler.BbOnFq8D.js";
import {
  S as h,
  i as g,
  g as v,
  h as x,
  x as w,
  a as $,
  f as k,
  e as p,
  t as l,
  b as D,
  d as f,
  p as L,
  r as S,
  u as b,
  v as y,
  w as C,
} from "../chunks/index.r4Y_ernq.js";
import {
  c as V,
  g as j,
  f as q,
  p as z,
  a as H,
  L as I,
} from "../chunks/authState.KF5z5tHC.js";
function N(a) {
  let t,
    n = "this is home page";
  return {
    c() {
      (t = v("div")), (t.textContent = n);
    },
    l(e) {
      (t = x(e, "DIV", { "data-svelte-h": !0 })),
        w(t) !== "svelte-1ty9hz0" && (t.textContent = n);
    },
    m(e, o) {
      $(e, t, o);
    },
    p: _,
    i: _,
    o: _,
    d(e) {
      e && k(t);
    },
  };
}
class O extends h {
  constructor(t) {
    super(), g(this, t, null, N, d, {});
  }
}
function P(a) {
  let t, n;
  return (
    (t = new O({})),
    {
      c() {
        S(t.$$.fragment);
      },
      l(e) {
        b(t.$$.fragment, e);
      },
      m(e, o) {
        y(t, e, o), (n = !0);
      },
      i(e) {
        n || (f(t.$$.fragment, e), (n = !0));
      },
      o(e) {
        l(t.$$.fragment, e), (n = !1);
      },
      d(e) {
        C(t, e);
      },
    }
  );
}
function B(a) {
  let t, n;
  return (
    (t = new I({})),
    {
      c() {
        S(t.$$.fragment);
      },
      l(e) {
        b(t.$$.fragment, e);
      },
      m(e, o) {
        y(t, e, o), (n = !0);
      },
      i(e) {
        n || (f(t.$$.fragment, e), (n = !0));
      },
      o(e) {
        l(t.$$.fragment, e), (n = !1);
      },
      d(e) {
        C(t, e);
      },
    }
  );
}
function E(a) {
  let t, n, e, o;
  const i = [B, P],
    s = [];
  function u(r, c) {
    return r[0].pendingAuthCheckStore
      ? 0
      : !r[0].pendingAuthCheckStore && r[0].localAuthStateStore
      ? 1
      : -1;
  }
  return (
    ~(t = u(a)) && (n = s[t] = i[t](a)),
    {
      c() {
        n && n.c(), (e = p());
      },
      l(r) {
        n && n.l(r), (e = p());
      },
      m(r, c) {
        ~t && s[t].m(r, c), $(r, e, c), (o = !0);
      },
      p(r, [c]) {
        let m = t;
        (t = u(r)),
          t !== m &&
            (n &&
              (L(),
              l(s[m], 1, 1, () => {
                s[m] = null;
              }),
              D()),
            ~t
              ? ((n = s[t]),
                n || ((n = s[t] = i[t](r)), n.c()),
                f(n, 1),
                n.m(e.parentNode, e))
              : (n = null));
      },
      i(r) {
        o || (f(n), (o = !0));
      },
      o(r) {
        l(n), (o = !1);
      },
      d(r) {
        r && k(e), ~t && s[t].d(r);
      },
    }
  );
}
function F(a, t, n) {
  const e = {
      firstAuthCheckStore: q,
      pendingAuthCheckStore: z,
      authStateStore: H,
    },
    o = {};
  let i = {};
  for (const [s, u] of Object.entries(e))
    (o[s] = u.subscribe((r) => {
      const c = { ...i };
      (c[s] = r), n(0, (i = c));
    })),
      A(o[s]);
  return (
    i.pendingAuthCheckStore || V(),
    (a.$$.update = () => {
      a.$$.dirty & 1 &&
        !i.pendingAuthCheckStore &&
        !i.authStateStore &&
        j("/log-in");
    }),
    [i]
  );
}
class M extends h {
  constructor(t) {
    super(), g(this, t, F, E, d, {});
  }
}
export { M as component };

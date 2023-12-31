import {
  s as G,
  n as z,
  r as Z,
  e as ee,
} from "../chunks/scheduler.BbOnFq8D.js";
import {
  S as H,
  i as J,
  g,
  s as $,
  m as te,
  h as b,
  j as A,
  x as U,
  c as w,
  f as S,
  n as re,
  k as p,
  a as K,
  y as f,
  z as I,
  A as E,
  e as F,
  t as N,
  b as ne,
  d as B,
  p as oe,
  r as Q,
  u as W,
  v as X,
  w as Y,
} from "../chunks/index.r4Y_ernq.js";
import {
  c as se,
  g as ae,
  f as ie,
  p as le,
  a as ue,
  L as ce,
} from "../chunks/authState.KF5z5tHC.js";
import { s as fe, r as pe } from "../chunks/index.iWJlEOvB.js";
function de(s) {
  let e,
    t,
    r,
    n,
    l = "Email",
    i,
    a,
    o,
    u,
    d,
    L = "Password",
    C,
    c,
    v,
    _,
    P,
    x,
    V,
    k,
    j = "New user? Sign up here!",
    O,
    q;
  return {
    c() {
      (e = g("div")),
        (t = g("form")),
        (r = g("div")),
        (n = g("label")),
        (n.textContent = l),
        (i = $()),
        (a = g("input")),
        (o = $()),
        (u = g("div")),
        (d = g("label")),
        (d.textContent = L),
        (C = $()),
        (c = g("input")),
        (v = $()),
        (_ = g("button")),
        (P = te("Log in!")),
        (V = $()),
        (k = g("a")),
        (k.textContent = j),
        this.h();
    },
    l(m) {
      e = b(m, "DIV", { class: !0 });
      var h = A(e);
      t = b(h, "FORM", {});
      var y = A(t);
      r = b(y, "DIV", { class: !0 });
      var T = A(r);
      (n = b(T, "LABEL", { for: !0, "data-svelte-h": !0 })),
        U(n) !== "svelte-1p9d3fm" && (n.textContent = l),
        (i = w(T)),
        (a = b(T, "INPUT", { type: !0, id: !0, autocomplete: !0 })),
        T.forEach(S),
        (o = w(y)),
        (u = b(y, "DIV", { class: !0 }));
      var D = A(u);
      (d = b(D, "LABEL", { for: !0, "data-svelte-h": !0 })),
        U(d) !== "svelte-pepa0a" && (d.textContent = L),
        (C = w(D)),
        (c = b(D, "INPUT", { type: !0, id: !0, autocomplete: !0 })),
        D.forEach(S),
        (v = w(y)),
        (_ = b(y, "BUTTON", { type: !0 }));
      var R = A(_);
      (P = re(R, "Log in!")),
        R.forEach(S),
        y.forEach(S),
        (V = w(h)),
        (k = b(h, "A", { class: !0, href: !0, "data-svelte-h": !0 })),
        U(k) !== "svelte-180bc3l" && (k.textContent = j),
        h.forEach(S),
        this.h();
    },
    h() {
      p(n, "for", "email"),
        p(a, "type", "email"),
        p(a, "id", "email"),
        p(a, "autocomplete", "on"),
        p(r, "class", "input-container"),
        p(d, "for", "password"),
        p(c, "type", "password"),
        p(c, "id", "password"),
        p(c, "autocomplete", "on"),
        p(u, "class", "input-container"),
        p(_, "type", "submit"),
        (_.disabled = x = !s[2]),
        p(k, "class", "page-redirect-link"),
        p(k, "href", "/sign-up"),
        p(e, "class", "page log-in");
    },
    m(m, h) {
      K(m, e, h),
        f(e, t),
        f(t, r),
        f(r, n),
        f(r, i),
        f(r, a),
        I(a, s[0]),
        f(t, o),
        f(t, u),
        f(u, d),
        f(u, C),
        f(u, c),
        I(c, s[1]),
        f(t, v),
        f(t, _),
        f(_, P),
        f(e, V),
        f(e, k),
        O ||
          ((q = [
            E(a, "input", s[3]),
            E(a, "input", s[7]),
            E(c, "input", s[3]),
            E(c, "input", s[8]),
            E(t, "submit", s[4]),
          ]),
          (O = !0));
    },
    p(m, [h]) {
      h & 1 && a.value !== m[0] && I(a, m[0]),
        h & 2 && c.value !== m[1] && I(c, m[1]),
        h & 4 && x !== (x = !m[2]) && (_.disabled = x);
    },
    i: z,
    o: z,
    d(m) {
      m && S(e), (O = !1), Z(q);
    },
  };
}
const M = "";
function me(s, e, t) {
  let r,
    n,
    l,
    i = !1,
    a = M;
  function o() {
    t(6, (a = M));
  }
  async function u(C) {
    C.preventDefault(), t(5, (i = !0));
    let c, v;
    try {
      c = await fe(n, l);
    } catch (_) {
      v = _;
    }
    v
      ? console.error("log-in submit error", v, v.stack)
      : c.valid
      ? pe("/home")
      : t(6, (a = c.message)),
      t(5, (i = !1));
  }
  function d() {
    (n = this.value), t(0, n);
  }
  function L() {
    (l = this.value), t(1, l);
  }
  return (
    (s.$$.update = () => {
      s.$$.dirty & 99 && t(2, (r = n && l && !a && !i));
    }),
    [n, l, r, o, u, i, a, d, L]
  );
}
class _e extends H {
  constructor(e) {
    super(), J(this, e, me, de, G, {});
  }
}
function he(s) {
  let e, t;
  return (
    (e = new _e({})),
    {
      c() {
        Q(e.$$.fragment);
      },
      l(r) {
        W(e.$$.fragment, r);
      },
      m(r, n) {
        X(e, r, n), (t = !0);
      },
      i(r) {
        t || (B(e.$$.fragment, r), (t = !0));
      },
      o(r) {
        N(e.$$.fragment, r), (t = !1);
      },
      d(r) {
        Y(e, r);
      },
    }
  );
}
function ge(s) {
  let e, t;
  return (
    (e = new ce({})),
    {
      c() {
        Q(e.$$.fragment);
      },
      l(r) {
        W(e.$$.fragment, r);
      },
      m(r, n) {
        X(e, r, n), (t = !0);
      },
      i(r) {
        t || (B(e.$$.fragment, r), (t = !0));
      },
      o(r) {
        N(e.$$.fragment, r), (t = !1);
      },
      d(r) {
        Y(e, r);
      },
    }
  );
}
function be(s) {
  let e, t, r, n;
  const l = [ge, he],
    i = [];
  function a(o, u) {
    return o[0].pendingAuthCheckStore
      ? 0
      : !o[0].pendingAuthCheckStore && !o[0].localAuthStateStore
      ? 1
      : -1;
  }
  return (
    ~(e = a(s)) && (t = i[e] = l[e](s)),
    {
      c() {
        t && t.c(), (r = F());
      },
      l(o) {
        t && t.l(o), (r = F());
      },
      m(o, u) {
        ~e && i[e].m(o, u), K(o, r, u), (n = !0);
      },
      p(o, [u]) {
        let d = e;
        (e = a(o)),
          e !== d &&
            (t &&
              (oe(),
              N(i[d], 1, 1, () => {
                i[d] = null;
              }),
              ne()),
            ~e
              ? ((t = i[e]),
                t || ((t = i[e] = l[e](o)), t.c()),
                B(t, 1),
                t.m(r.parentNode, r))
              : (t = null));
      },
      i(o) {
        n || (B(t), (n = !0));
      },
      o(o) {
        N(t), (n = !1);
      },
      d(o) {
        o && S(r), ~e && i[e].d(o);
      },
    }
  );
}
function ve(s, e, t) {
  const r = {
      firstAuthCheckStore: ie,
      pendingAuthCheckStore: le,
      authStateStore: ue,
    },
    n = {};
  let l = {};
  for (const [i, a] of Object.entries(r))
    (n[i] = a.subscribe((o) => {
      const u = { ...l };
      (u[i] = o), t(0, (l = u));
    })),
      ee(n[i]);
  return (
    l.pendingAuthCheckStore || se(),
    (s.$$.update = () => {
      s.$$.dirty & 1 &&
        !l.pendingAuthCheckStore &&
        l.authStateStore &&
        ae("/home");
    }),
    [l]
  );
}
class $e extends H {
  constructor(e) {
    super(), J(this, e, ve, be, G, {});
  }
}
export { $e as component };

import {
  s as ge,
  n as _e,
  r as ke,
  e as Ae,
} from "../chunks/scheduler.BbOnFq8D.js";
import {
  S as be,
  i as ve,
  g as d,
  m as K,
  s as S,
  h as m,
  j as T,
  n as Q,
  f as P,
  c as k,
  x as Y,
  k as u,
  a as we,
  y as s,
  z as F,
  A as U,
  o as x,
  e as he,
  t as $,
  b as ye,
  d as ee,
  p as Te,
  r as Ee,
  u as Pe,
  v as Ce,
  w as Se,
} from "../chunks/index.r4Y_ernq.js";
import {
  c as Le,
  g as Ve,
  f as ze,
  p as Ie,
  a as De,
  L as Be,
} from "../chunks/authState.KF5z5tHC.js";
import { a as Ne, r as Ue } from "../chunks/index.iWJlEOvB.js";
function Ze(r) {
  return r
    ? /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(r)
      ? ""
      : "Email is invalid"
    : "";
}
function Me(r) {
  return r
    ? r.length < 12
      ? "Password is too large. Must be between 12 and 20 characters"
      : r.length > 20
      ? "Password is too small. Must be between 12 and 20 characters"
      : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(
          r
        )
      ? ""
      : `Password is invalid. Must adhere to the following rules;
     Atleast one uppercase and lowercase letter, atleast one digit,
      atleast one special character, and only letters, digits, and specialized characters`
    : "";
}
function qe(r, t) {
  return r && r !== t ? "Confirm password does not match password" : "";
}
function Oe(r) {
  let t,
    e,
    n,
    i,
    l,
    a,
    _,
    o,
    f,
    c,
    B = "Email",
    V,
    v,
    Z,
    w,
    z,
    M,
    G,
    L,
    W = "Password",
    H,
    E,
    J,
    b,
    C,
    q,
    te,
    N,
    ie = "Confirm Password",
    re,
    A,
    ne,
    I,
    se,
    X,
    ae,
    D,
    le = "Existing User? Log in here!",
    oe,
    ue;
  return {
    c() {
      (t = d("div")),
        (e = d("form")),
        (n = d("p")),
        (i = K(r[6])),
        (l = S()),
        (a = d("div")),
        (_ = d("p")),
        (o = K(r[3])),
        (f = S()),
        (c = d("label")),
        (c.textContent = B),
        (V = S()),
        (v = d("input")),
        (Z = S()),
        (w = d("div")),
        (z = d("p")),
        (M = K(r[4])),
        (G = S()),
        (L = d("label")),
        (L.textContent = W),
        (H = S()),
        (E = d("input")),
        (J = S()),
        (b = d("div")),
        (C = d("p")),
        (q = K(r[5])),
        (te = S()),
        (N = d("label")),
        (N.textContent = ie),
        (re = S()),
        (A = d("input")),
        (ne = S()),
        (I = d("button")),
        (se = K("Sign up!")),
        (ae = S()),
        (D = d("a")),
        (D.textContent = le),
        this.h();
    },
    l(p) {
      t = m(p, "DIV", { class: !0 });
      var h = T(t);
      e = m(h, "FORM", {});
      var y = T(e);
      n = m(y, "P", { class: !0 });
      var fe = T(n);
      (i = Q(fe, r[6])),
        fe.forEach(P),
        (l = k(y)),
        (a = m(y, "DIV", { class: !0 }));
      var O = T(a);
      _ = m(O, "P", { class: !0 });
      var ce = T(_);
      (o = Q(ce, r[3])),
        ce.forEach(P),
        (f = k(O)),
        (c = m(O, "LABEL", { for: !0, "data-svelte-h": !0 })),
        Y(c) !== "svelte-1p9d3fm" && (c.textContent = B),
        (V = k(O)),
        (v = m(O, "INPUT", { id: !0, type: !0 })),
        O.forEach(P),
        (Z = k(y)),
        (w = m(y, "DIV", { class: !0 }));
      var j = T(w);
      z = m(j, "P", { class: !0 });
      var pe = T(z);
      (M = Q(pe, r[4])),
        pe.forEach(P),
        (G = k(j)),
        (L = m(j, "LABEL", { for: !0, "data-svelte-h": !0 })),
        Y(L) !== "svelte-pepa0a" && (L.textContent = W),
        (H = k(j)),
        (E = m(j, "INPUT", { id: !0, type: !0 })),
        j.forEach(P),
        (J = k(y)),
        (b = m(y, "DIV", { class: !0 }));
      var R = T(b);
      C = m(R, "P", { class: !0 });
      var de = T(C);
      (q = Q(de, r[5])),
        de.forEach(P),
        (te = k(R)),
        (N = m(R, "LABEL", { for: !0, "data-svelte-h": !0 })),
        Y(N) !== "svelte-1kqgfb9" && (N.textContent = ie),
        (re = k(R)),
        (A = m(R, "INPUT", { id: !0, type: !0 })),
        R.forEach(P),
        (ne = k(y)),
        (I = m(y, "BUTTON", { type: !0 }));
      var me = T(I);
      (se = Q(me, "Sign up!")),
        me.forEach(P),
        y.forEach(P),
        (ae = k(h)),
        (D = m(h, "A", { class: !0, href: !0, "data-svelte-h": !0 })),
        Y(D) !== "svelte-wkans" && (D.textContent = le),
        h.forEach(P),
        this.h();
    },
    h() {
      u(n, "class", "server-error-response"),
        u(_, "class", "input-error email"),
        u(c, "for", "email"),
        u(v, "id", "email"),
        u(v, "type", "email"),
        u(a, "class", "input-container"),
        u(z, "class", "input-error password"),
        u(L, "for", "password"),
        u(E, "id", "password"),
        u(E, "type", "password"),
        u(w, "class", "input-container"),
        u(C, "class", "input-error confirm-password"),
        u(N, "for", "confirm-password"),
        u(A, "id", "confirm-password"),
        u(A, "type", "password"),
        u(b, "class", "input-container"),
        u(I, "type", "submit"),
        (I.disabled = X = !r[7]),
        u(D, "class", "page-redirect-link"),
        u(D, "href", "/log-in"),
        u(t, "class", "page sign-up");
    },
    m(p, h) {
      we(p, t, h),
        s(t, e),
        s(e, n),
        s(n, i),
        s(e, l),
        s(e, a),
        s(a, _),
        s(_, o),
        s(a, f),
        s(a, c),
        s(a, V),
        s(a, v),
        F(v, r[0]),
        s(e, Z),
        s(e, w),
        s(w, z),
        s(z, M),
        s(w, G),
        s(w, L),
        s(w, H),
        s(w, E),
        F(E, r[1]),
        s(e, J),
        s(e, b),
        s(b, C),
        s(C, q),
        s(b, te),
        s(b, N),
        s(b, re),
        s(b, A),
        F(A, r[2]),
        s(e, ne),
        s(e, I),
        s(I, se),
        s(t, ae),
        s(t, D),
        oe ||
          ((ue = [
            U(v, "input", r[14]),
            U(v, "input", r[15]),
            U(E, "input", r[16]),
            U(E, "input", r[17]),
            U(A, "input", r[18]),
            U(A, "input", r[19]),
            U(e, "submit", r[12]),
          ]),
          (oe = !0));
    },
    p(p, [h]) {
      h & 64 && x(i, p[6]),
        h & 8 && x(o, p[3]),
        h & 1 && v.value !== p[0] && F(v, p[0]),
        h & 16 && x(M, p[4]),
        h & 2 && E.value !== p[1] && F(E, p[1]),
        h & 32 && x(q, p[5]),
        h & 4 && A.value !== p[2] && F(A, p[2]),
        h & 128 && X !== (X = !p[7]) && (I.disabled = X);
    },
    i: _e,
    o: _e,
    d(p) {
      p && P(t), (oe = !1), ke(ue);
    },
  };
}
const g = "";
function je(r, t, e) {
  let n,
    i,
    l,
    a,
    _ = !1,
    o = g,
    f = g,
    c = g,
    B = g;
  function V() {
    e(6, (B = g));
  }
  function v() {
    e(3, (o = g));
  }
  function Z() {
    e(4, (f = g));
  }
  function w() {
    e(5, (c = g));
  }
  async function z(J) {
    J.preventDefault(), e(13, (_ = !0));
    let b, C;
    try {
      b = await Ne(i, l, a);
    } catch (q) {
      C = q;
    }
    C
      ? console.error("sign-up submit error", C, C.stack)
      : b.valid
      ? Ue("/home")
      : e(6, (B = b.message)),
      e(13, (_ = !1));
  }
  const M = () => {
    V(), v();
  };
  function G() {
    (i = this.value), e(0, i);
  }
  const L = () => {
    V(), Z();
  };
  function W() {
    (l = this.value), e(1, l);
  }
  const H = () => {
    V(), w();
  };
  function E() {
    (a = this.value), e(2, a);
  }
  return (
    (r.$$.update = () => {
      r.$$.dirty & 1 && (i !== g ? e(3, (o = Ze(i))) : e(3, (o = g))),
        r.$$.dirty & 2 && (l !== g ? e(4, (f = Me(l))) : e(4, (f = g))),
        r.$$.dirty & 6 &&
          (a !== g && l !== g ? e(5, (c = qe(a, l))) : e(5, (c = g))),
        r.$$.dirty & 8319 &&
          e(7, (n = i && l && a && !o && !f && !c && !B && !_));
    }),
    [i, l, a, o, f, c, B, n, V, v, Z, w, z, _, M, G, L, W, H, E]
  );
}
class Re extends be {
  constructor(t) {
    super(), ve(this, t, je, Oe, ge, {});
  }
}
function Fe(r) {
  let t, e;
  return (
    (t = new Re({})),
    {
      c() {
        Ee(t.$$.fragment);
      },
      l(n) {
        Pe(t.$$.fragment, n);
      },
      m(n, i) {
        Ce(t, n, i), (e = !0);
      },
      i(n) {
        e || (ee(t.$$.fragment, n), (e = !0));
      },
      o(n) {
        $(t.$$.fragment, n), (e = !1);
      },
      d(n) {
        Se(t, n);
      },
    }
  );
}
function Ge(r) {
  let t, e;
  return (
    (t = new Be({})),
    {
      c() {
        Ee(t.$$.fragment);
      },
      l(n) {
        Pe(t.$$.fragment, n);
      },
      m(n, i) {
        Ce(t, n, i), (e = !0);
      },
      i(n) {
        e || (ee(t.$$.fragment, n), (e = !0));
      },
      o(n) {
        $(t.$$.fragment, n), (e = !1);
      },
      d(n) {
        Se(t, n);
      },
    }
  );
}
function He(r) {
  let t, e, n, i;
  const l = [Ge, Fe],
    a = [];
  function _(o, f) {
    return o[0].pendingAuthCheckStore
      ? 0
      : !o[0].pendingAuthCheckStore && !o[0].localAuthStateStore
      ? 1
      : -1;
  }
  return (
    ~(t = _(r)) && (e = a[t] = l[t](r)),
    {
      c() {
        e && e.c(), (n = he());
      },
      l(o) {
        e && e.l(o), (n = he());
      },
      m(o, f) {
        ~t && a[t].m(o, f), we(o, n, f), (i = !0);
      },
      p(o, [f]) {
        let c = t;
        (t = _(o)),
          t !== c &&
            (e &&
              (Te(),
              $(a[c], 1, 1, () => {
                a[c] = null;
              }),
              ye()),
            ~t
              ? ((e = a[t]),
                e || ((e = a[t] = l[t](o)), e.c()),
                ee(e, 1),
                e.m(n.parentNode, n))
              : (e = null));
      },
      i(o) {
        i || (ee(e), (i = !0));
      },
      o(o) {
        $(e), (i = !1);
      },
      d(o) {
        o && P(n), ~t && a[t].d(o);
      },
    }
  );
}
function Je(r, t, e) {
  const n = {
      firstAuthCheckStore: ze,
      pendingAuthCheckStore: Ie,
      authStateStore: De,
    },
    i = {};
  let l = {};
  for (const [a, _] of Object.entries(n))
    (i[a] = _.subscribe((o) => {
      const f = { ...l };
      (f[a] = o), e(0, (l = f));
    })),
      Ae(i[a]);
  return (
    l.pendingAuthCheckStore || Le(),
    (r.$$.update = () => {
      r.$$.dirty & 1 &&
        !l.pendingAuthCheckStore &&
        l.authStateStore &&
        Ve("/home");
    }),
    [l]
  );
}
class Ye extends be {
  constructor(t) {
    super(), ve(this, t, Je, He, ge, {});
  }
}
export { Ye as component };

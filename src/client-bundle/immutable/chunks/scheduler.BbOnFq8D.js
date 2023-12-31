function q() {}
function k(t, n) {
  for (const e in n) t[e] = n[e];
  return t;
}
function x(t) {
  return t();
}
function M() {
  return Object.create(null);
}
function w(t) {
  t.forEach(x);
}
function z(t) {
  return typeof t == "function";
}
function D(t, n) {
  return t != t
    ? n == n
    : t !== n || (t && typeof t == "object") || typeof t == "function";
}
function F(t) {
  return Object.keys(t).length === 0;
}
function P(t, n, e, o) {
  if (t) {
    const r = m(t, n, e, o);
    return t[0](r);
  }
}
function m(t, n, e, o) {
  return t[1] && o ? k(e.ctx.slice(), t[1](o(n))) : e.ctx;
}
function S(t, n, e, o) {
  if (t[2] && o) {
    const r = t[2](o(e));
    if (n.dirty === void 0) return r;
    if (typeof r == "object") {
      const a = [],
        f = Math.max(n.dirty.length, r.length);
      for (let u = 0; u < f; u += 1) a[u] = n.dirty[u] | r[u];
      return a;
    }
    return n.dirty | r;
  }
  return n.dirty;
}
function U(t, n, e, o, r, a) {
  if (r) {
    const f = m(n, e, o, a);
    t.p(f, r);
  }
}
function A(t) {
  if (t.ctx.length > 32) {
    const n = [],
      e = t.ctx.length / 32;
    for (let o = 0; o < e; o++) n[o] = -1;
    return n;
  }
  return -1;
}
let i;
function h(t) {
  i = t;
}
function p() {
  if (!i) throw new Error("Function called outside component initialization");
  return i;
}
function B(t) {
  p().$$.on_mount.push(t);
}
function C(t) {
  p().$$.after_update.push(t);
}
function G(t) {
  p().$$.on_destroy.push(t);
}
const l = [],
  g = [];
let s = [];
const y = [],
  b = Promise.resolve();
let d = !1;
function j() {
  d || ((d = !0), b.then(v));
}
function H() {
  return j(), b;
}
function E(t) {
  s.push(t);
}
const _ = new Set();
let c = 0;
function v() {
  if (c !== 0) return;
  const t = i;
  do {
    try {
      for (; c < l.length; ) {
        const n = l[c];
        c++, h(n), O(n.$$);
      }
    } catch (n) {
      throw ((l.length = 0), (c = 0), n);
    }
    for (h(null), l.length = 0, c = 0; g.length; ) g.pop()();
    for (let n = 0; n < s.length; n += 1) {
      const e = s[n];
      _.has(e) || (_.add(e), e());
    }
    s.length = 0;
  } while (l.length);
  for (; y.length; ) y.pop()();
  (d = !1), _.clear(), h(t);
}
function O(t) {
  if (t.fragment !== null) {
    t.update(), w(t.before_update);
    const n = t.dirty;
    (t.dirty = [-1]),
      t.fragment && t.fragment.p(t.ctx, n),
      t.after_update.forEach(E);
  }
}
function I(t) {
  const n = [],
    e = [];
  s.forEach((o) => (t.indexOf(o) === -1 ? n.push(o) : e.push(o))),
    e.forEach((o) => o()),
    (s = n);
}
export {
  C as a,
  g as b,
  P as c,
  S as d,
  G as e,
  M as f,
  A as g,
  v as h,
  z as i,
  F as j,
  E as k,
  I as l,
  i as m,
  q as n,
  B as o,
  h as p,
  x as q,
  w as r,
  D as s,
  H as t,
  U as u,
  l as v,
  j as w,
};

import {
  r as h,
  n as p,
  f as g,
  h as S,
  i as N,
  j as E,
  k as w,
  l as j,
  m as C,
  p as b,
  q as B,
  v as I,
  w as L,
} from "./scheduler.BbOnFq8D.js";
let $ = !1;
function P() {
  $ = !0;
}
function T() {
  $ = !1;
}
function q(e, t, n, i) {
  for (; e < t; ) {
    const s = e + ((t - e) >> 1);
    n(s) <= i ? (e = s + 1) : (t = s);
  }
  return e;
}
function H(e) {
  if (e.hydrate_init) return;
  e.hydrate_init = !0;
  let t = e.childNodes;
  if (e.nodeName === "HEAD") {
    const r = [];
    for (let a = 0; a < t.length; a++) {
      const o = t[a];
      o.claim_order !== void 0 && r.push(o);
    }
    t = r;
  }
  const n = new Int32Array(t.length + 1),
    i = new Int32Array(t.length);
  n[0] = -1;
  let s = 0;
  for (let r = 0; r < t.length; r++) {
    const a = t[r].claim_order,
      o =
        (s > 0 && t[n[s]].claim_order <= a
          ? s + 1
          : q(1, s, (_) => t[n[_]].claim_order, a)) - 1;
    i[r] = n[o] + 1;
    const c = o + 1;
    (n[c] = r), (s = Math.max(c, s));
  }
  const u = [],
    l = [];
  let f = t.length - 1;
  for (let r = n[s] + 1; r != 0; r = i[r - 1]) {
    for (u.push(t[r - 1]); f >= r; f--) l.push(t[f]);
    f--;
  }
  for (; f >= 0; f--) l.push(t[f]);
  u.reverse(), l.sort((r, a) => r.claim_order - a.claim_order);
  for (let r = 0, a = 0; r < l.length; r++) {
    for (; a < u.length && l[r].claim_order >= u[a].claim_order; ) a++;
    const o = a < u.length ? u[a] : null;
    e.insertBefore(l[r], o);
  }
}
function M(e, t) {
  if ($) {
    for (
      H(e),
        (e.actual_end_child === void 0 ||
          (e.actual_end_child !== null &&
            e.actual_end_child.parentNode !== e)) &&
          (e.actual_end_child = e.firstChild);
      e.actual_end_child !== null && e.actual_end_child.claim_order === void 0;

    )
      e.actual_end_child = e.actual_end_child.nextSibling;
    t !== e.actual_end_child
      ? (t.claim_order !== void 0 || t.parentNode !== e) &&
        e.insertBefore(t, e.actual_end_child)
      : (e.actual_end_child = t.nextSibling);
  } else (t.parentNode !== e || t.nextSibling !== null) && e.appendChild(t);
}
function X(e, t, n) {
  $ && !n
    ? M(e, t)
    : (t.parentNode !== e || t.nextSibling != n) &&
      e.insertBefore(t, n || null);
}
function O(e) {
  e.parentNode && e.parentNode.removeChild(e);
}
function z(e) {
  return document.createElement(e);
}
function y(e) {
  return document.createTextNode(e);
}
function Y() {
  return y(" ");
}
function Z() {
  return y("");
}
function k(e, t, n, i) {
  return e.addEventListener(t, n, i), () => e.removeEventListener(t, n, i);
}
function ee(e, t, n) {
  n == null
    ? e.removeAttribute(t)
    : e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function te(e) {
  return e.dataset.svelteH;
}
function D(e) {
  return Array.from(e.childNodes);
}
function R(e) {
  e.claim_info === void 0 &&
    (e.claim_info = { last_index: 0, total_claimed: 0 });
}
function A(e, t, n, i, s = !1) {
  R(e);
  const u = (() => {
    for (let l = e.claim_info.last_index; l < e.length; l++) {
      const f = e[l];
      if (t(f)) {
        const r = n(f);
        return (
          r === void 0 ? e.splice(l, 1) : (e[l] = r),
          s || (e.claim_info.last_index = l),
          f
        );
      }
    }
    for (let l = e.claim_info.last_index - 1; l >= 0; l--) {
      const f = e[l];
      if (t(f)) {
        const r = n(f);
        return (
          r === void 0 ? e.splice(l, 1) : (e[l] = r),
          s
            ? r === void 0 && e.claim_info.last_index--
            : (e.claim_info.last_index = l),
          f
        );
      }
    }
    return i();
  })();
  return (
    (u.claim_order = e.claim_info.total_claimed),
    (e.claim_info.total_claimed += 1),
    u
  );
}
function U(e, t, n, i) {
  return A(
    e,
    (s) => s.nodeName === t,
    (s) => {
      const u = [];
      for (let l = 0; l < s.attributes.length; l++) {
        const f = s.attributes[l];
        n[f.name] || u.push(f.name);
      }
      u.forEach((l) => s.removeAttribute(l));
    },
    () => i(t)
  );
}
function ne(e, t, n) {
  return U(e, t, n, z);
}
function V(e, t) {
  return A(
    e,
    (n) => n.nodeType === 3,
    (n) => {
      const i = "" + t;
      if (n.data.startsWith(i)) {
        if (n.data.length !== i.length) return n.splitText(i.length);
      } else n.data = i;
    },
    () => y(t),
    !0
  );
}
function ie(e) {
  return V(e, " ");
}
function re(e, t) {
  (t = "" + t), e.data !== t && (e.data = t);
}
function ae(e, t) {
  e.value = t ?? "";
}
function le(e, t, n, i) {
  n == null
    ? e.style.removeProperty(t)
    : e.style.setProperty(t, n, i ? "important" : "");
}
function se(e, t) {
  return new e(t);
}
const m = new Set();
let d;
function fe() {
  d = { r: 0, c: [], p: d };
}
function ue() {
  d.r || h(d.c), (d = d.p);
}
function W(e, t) {
  e && e.i && (m.delete(e), e.i(t));
}
function ce(e, t, n, i) {
  if (e && e.o) {
    if (m.has(e)) return;
    m.add(e),
      d.c.push(() => {
        m.delete(e), i && (n && e.d(1), i());
      }),
      e.o(t);
  } else i && i();
}
function oe(e) {
  e && e.c();
}
function de(e, t) {
  e && e.l(t);
}
function F(e, t, n) {
  const { fragment: i, after_update: s } = e.$$;
  i && i.m(t, n),
    w(() => {
      const u = e.$$.on_mount.map(B).filter(N);
      e.$$.on_destroy ? e.$$.on_destroy.push(...u) : h(u), (e.$$.on_mount = []);
    }),
    s.forEach(w);
}
function G(e, t) {
  const n = e.$$;
  n.fragment !== null &&
    (j(n.after_update),
    h(n.on_destroy),
    n.fragment && n.fragment.d(t),
    (n.on_destroy = n.fragment = null),
    (n.ctx = []));
}
function J(e, t) {
  e.$$.dirty[0] === -1 && (I.push(e), L(), e.$$.dirty.fill(0)),
    (e.$$.dirty[(t / 31) | 0] |= 1 << t % 31);
}
function _e(e, t, n, i, s, u, l = null, f = [-1]) {
  const r = C;
  b(e);
  const a = (e.$$ = {
    fragment: null,
    ctx: [],
    props: u,
    update: p,
    not_equal: s,
    bound: g(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(t.context || (r ? r.$$.context : [])),
    callbacks: g(),
    dirty: f,
    skip_bound: !1,
    root: t.target || r.$$.root,
  });
  l && l(a.root);
  let o = !1;
  if (
    ((a.ctx = n
      ? n(e, t.props || {}, (c, _, ...x) => {
          const v = x.length ? x[0] : _;
          return (
            a.ctx &&
              s(a.ctx[c], (a.ctx[c] = v)) &&
              (!a.skip_bound && a.bound[c] && a.bound[c](v), o && J(e, c)),
            _
          );
        })
      : []),
    a.update(),
    (o = !0),
    h(a.before_update),
    (a.fragment = i ? i(a.ctx) : !1),
    t.target)
  ) {
    if (t.hydrate) {
      P();
      const c = D(t.target);
      a.fragment && a.fragment.l(c), c.forEach(O);
    } else a.fragment && a.fragment.c();
    t.intro && W(e.$$.fragment), F(e, t.target, t.anchor), T(), S();
  }
  b(r);
}
class me {
  $$ = void 0;
  $$set = void 0;
  $destroy() {
    G(this, 1), (this.$destroy = p);
  }
  $on(t, n) {
    if (!N(n)) return p;
    const i = this.$$.callbacks[t] || (this.$$.callbacks[t] = []);
    return (
      i.push(n),
      () => {
        const s = i.indexOf(n);
        s !== -1 && i.splice(s, 1);
      }
    );
  }
  $set(t) {
    this.$$set &&
      !E(t) &&
      ((this.$$.skip_bound = !0), this.$$set(t), (this.$$.skip_bound = !1));
  }
}
const K = "4";
typeof window < "u" &&
  (window.__svelte || (window.__svelte = { v: new Set() })).v.add(K);
export {
  k as A,
  me as S,
  X as a,
  ue as b,
  ie as c,
  W as d,
  Z as e,
  O as f,
  z as g,
  ne as h,
  _e as i,
  D as j,
  ee as k,
  le as l,
  y as m,
  V as n,
  re as o,
  fe as p,
  se as q,
  oe as r,
  Y as s,
  ce as t,
  de as u,
  F as v,
  G as w,
  te as x,
  M as y,
  ae as z,
};

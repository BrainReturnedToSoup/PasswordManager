import { n as d, s as m } from "./scheduler.BbOnFq8D.js";
const u = [];
function p(t, e = d) {
  let n;
  const o = new Set();
  function a(s) {
    if (m(t, s) && ((t = s), n)) {
      const c = !u.length;
      for (const i of o) i[1](), u.push(i, t);
      if (c) {
        for (let i = 0; i < u.length; i += 2) u[i][0](u[i + 1]);
        u.length = 0;
      }
    }
  }
  function l(s) {
    a(s(t));
  }
  function r(s, c = d) {
    const i = [s, c];
    return (
      o.add(i),
      o.size === 1 && (n = e(a, l) || d),
      s(t),
      () => {
        o.delete(i), o.size === 0 && n && (n(), (n = null));
      }
    );
  }
  return { set: a, update: l, subscribe: r };
}
const E = globalThis.__sveltekit_rovia9?.base ?? "",
  A = globalThis.__sveltekit_rovia9?.assets ?? E,
  R = "1704003123410",
  I = "sveltekit:snapshot",
  y = "sveltekit:scroll",
  N = "sveltekit:states",
  U = "sveltekit:pageurl",
  L = "sveltekit:history",
  O = "sveltekit:navigation",
  _ = { tap: 1, hover: 2, viewport: 3, eager: 4, off: -1, false: -1 },
  g = location.origin;
function Y(t) {
  if (t instanceof URL) return t;
  let e = document.baseURI;
  if (!e) {
    const n = document.getElementsByTagName("base");
    e = n.length ? n[0].href : document.URL;
  }
  return new URL(t, e);
}
function x() {
  return { x: pageXOffset, y: pageYOffset };
}
function f(t, e) {
  return t.getAttribute(`data-sveltekit-${e}`);
}
const b = { ..._, "": _.hover };
function v(t) {
  let e = t.assignedSlot ?? t.parentNode;
  return e?.nodeType === 11 && (e = e.host), e;
}
function P(t, e) {
  for (; t && t !== e; ) {
    if (t.nodeName.toUpperCase() === "A" && t.hasAttribute("href")) return t;
    t = v(t);
  }
}
function V(t, e) {
  let n;
  try {
    n = new URL(
      t instanceof SVGAElement ? t.href.baseVal : t.href,
      document.baseURI
    );
  } catch {}
  const o = t instanceof SVGAElement ? t.target.baseVal : t.target,
    a =
      !n ||
      !!o ||
      S(n, e) ||
      (t.getAttribute("rel") || "").split(/\s+/).includes("external"),
    l = n?.origin === g && t.hasAttribute("download");
  return { url: n, external: a, target: o, download: l };
}
function G(t) {
  let e = null,
    n = null,
    o = null,
    a = null,
    l = null,
    r = null,
    s = t;
  for (; s && s !== document.documentElement; )
    o === null && (o = f(s, "preload-code")),
      a === null && (a = f(s, "preload-data")),
      e === null && (e = f(s, "keepfocus")),
      n === null && (n = f(s, "noscroll")),
      l === null && (l = f(s, "reload")),
      r === null && (r = f(s, "replacestate")),
      (s = v(s));
  function c(i) {
    switch (i) {
      case "":
      case "true":
        return !0;
      case "off":
      case "false":
        return !1;
      default:
        return;
    }
  }
  return {
    preload_code: b[o ?? "off"],
    preload_data: b[a ?? "off"],
    keepfocus: c(e),
    noscroll: c(n),
    reload: c(l),
    replace_state: c(r),
  };
}
function h(t) {
  const e = p(t);
  let n = !0;
  function o() {
    (n = !0), e.update((r) => r);
  }
  function a(r) {
    (n = !1), e.set(r);
  }
  function l(r) {
    let s;
    return e.subscribe((c) => {
      (s === void 0 || (n && c !== s)) && r((s = c));
    });
  }
  return { notify: o, set: a, subscribe: l };
}
function T() {
  const { set: t, subscribe: e } = p(!1);
  let n;
  async function o() {
    clearTimeout(n);
    try {
      const a = await fetch(`${A}/_app/version.json`, {
        headers: { pragma: "no-cache", "cache-control": "no-cache" },
      });
      if (!a.ok) return !1;
      const r = (await a.json()).version !== R;
      return r && (t(!0), clearTimeout(n)), r;
    } catch {
      return !1;
    }
  }
  return { subscribe: e, check: o };
}
function S(t, e) {
  return t.origin !== g || !t.pathname.startsWith(e);
}
let k;
function K(t) {
  k = t.client;
}
function j(t) {
  return (...e) => k[t](...e);
}
const q = { url: h({}), page: h({}), navigating: p(null), updated: T() };
export {
  L as H,
  O as N,
  U as P,
  y as S,
  N as a,
  I as b,
  G as c,
  q as d,
  E as e,
  P as f,
  V as g,
  _ as h,
  S as i,
  K as j,
  j as k,
  g as o,
  Y as r,
  x as s,
  p as w,
};

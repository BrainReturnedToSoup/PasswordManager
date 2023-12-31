import { k as l, w as o } from "./singletons.37NuikPb.js";
import { s as i, n as r } from "./scheduler.BbOnFq8D.js";
import {
  S as h,
  i as f,
  g as d,
  h as p,
  x as g,
  a as m,
  f as S,
} from "./index.r4Y_ernq.js";
const w = l("goto");
function _(t) {
  let e,
    s = "Loading Page";
  return {
    c() {
      (e = d("div")), (e.textContent = s);
    },
    l(a) {
      (e = p(a, "DIV", { "data-svelte-h": !0 })),
        g(e) !== "svelte-9c5yrp" && (e.textContent = s);
    },
    m(a, u) {
      m(a, e, u);
    },
    p: r,
    i: r,
    o: r,
    d(a) {
      a && S(e);
    },
  };
}
class y extends h {
  constructor(e) {
    super(), f(this, e, null, _, i, {});
  }
}
const k = () => {
    const { subscribe: t, set: e } = o(!1);
    return {
      subscribe: t,
      checkTrue: () => {
        e(!0);
      },
      checkFalse: () => {
        e(!1);
      },
      reset: () => {
        e(!1);
      },
    };
  },
  C = () => {
    const { subscribe: t, set: e } = o(!1);
    return {
      subscribe: t,
      pendingTrue: () => {
        e(!0);
      },
      pendingFalse: () => {
        e(!1);
      },
      reset: () => {
        e(!1);
      },
    };
  },
  b = () => {
    const { subscribe: t, set: e } = o(!1);
    return {
      subscribe: t,
      authedTrue: () => {
        e(!0);
      },
      authedFalse: () => {
        e(!1);
      },
      reset: () => {
        e(!1);
      },
    };
  },
  T = k(),
  c = C(),
  n = b(),
  x = async () => await (await fetch("/auth-state")).json().auth,
  L = async () => {
    c.pendingTrue();
    let t, e;
    try {
      t = await x();
    } catch (s) {
      e = s;
    }
    e ? n.authedFalse() : t ? n.authedTrue() : n.authedFalse(),
      c.pendingFalse();
  };
export { y as L, n as a, L as c, T as f, w as g, c as p };

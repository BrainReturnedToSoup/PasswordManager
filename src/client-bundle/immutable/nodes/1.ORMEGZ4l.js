import { s as r, n } from "../chunks/scheduler.BbOnFq8D.js";
import {
  S as i,
  i as l,
  g as c,
  h as m,
  x as d,
  a as f,
  f as p,
} from "../chunks/index.r4Y_ernq.js";
function u(o) {
  let t,
    a = "An Error Occured";
  return {
    c() {
      (t = c("div")), (t.textContent = a);
    },
    l(e) {
      (t = m(e, "DIV", { "data-svelte-h": !0 })),
        d(t) !== "svelte-gdmtno" && (t.textContent = a);
    },
    m(e, s) {
      f(e, t, s);
    },
    p: n,
    i: n,
    o: n,
    d(e) {
      e && p(t);
    },
  };
}
class v extends i {
  constructor(t) {
    super(), l(this, t, null, u, r, {});
  }
}
export { v as component };

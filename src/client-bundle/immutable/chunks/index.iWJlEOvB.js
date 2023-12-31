import { R as r } from "./control.pJ1mnnAb.js";
async function c(e, n) {
  const t = {
    method: "POST",
    header: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: e, password: n }),
  };
  return await (await fetch("/log-in", t)).json();
}
async function d(e, n, t) {
  const s = {
    method: "POST",
    header: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: e, password: n, confirmPassword: t }),
  };
  return await (await fetch("/sign-up", s)).json();
}
function p(e, n) {
  throw new r(e, n.toString());
}
new TextEncoder();
export { d as a, p as r, c as s };

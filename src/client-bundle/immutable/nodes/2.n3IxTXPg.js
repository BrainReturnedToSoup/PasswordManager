import{s as p,n as f,e as g}from"../chunks/scheduler.XwmuOfpH.js";import{S as l,i as h,r as $,u as d,v as S,d as _,t as b,w as k}from"../chunks/index.BP64-74v.js";import{L as A,c as C,g as a,p as x,a as y}from"../chunks/navigation.SwcUdgsl.js";function v(r){let e,o;return e=new A({}),{c(){$(e.$$.fragment)},l(t){d(e.$$.fragment,t)},m(t,n){S(e,t,n),o=!0},p:f,i(t){o||(_(e.$$.fragment,t),o=!0)},o(t){b(e.$$.fragment,t),o=!1},d(t){k(e,t)}}}function w(r,e,o){const t={pendingAuthCheckStore:x,authStateStore:y};let n={};for(const[i,c]of Object.entries(t)){const u=c.subscribe(m=>{const s={...n};s[i]=m,o(0,n=s)});g(u)}return n.pendingAuthCheckStore||C(),r.$$.update=()=>{r.$$.dirty&1&&(n.pendingAuthCheckStore||(n.authStateStore?a("/home"):a("/log-in")))},[n]}class D extends l{constructor(e){super(),h(this,e,w,v,p,{})}}export{D as component};
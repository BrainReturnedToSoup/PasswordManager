import{s as W,n as G,r as se,e as ae}from"../chunks/scheduler.ycOvhNHW.js";import{S as X,i as Y,g as b,s as L,m as Z,h as g,j as A,c as w,x as F,f as S,n as x,k as f,a as H,y as l,z as P,A as E,o as ie,e as J,t as V,b as le,d as q,p as ue,r as ee,u as te,v as re,w as ne}from"../chunks/index.5tyFQWbo.js";import{i as ce,a as oe,c as fe,g as pe,p as de,r as me,L as _e}from"../chunks/homeState.iXkWzTlx.js";import{h as he,r as be}from"../chunks/loginSignupHandlers.e20cCqSm.js";function K(s){let e,t;return{c(){e=b("p"),t=Z(s[3]),this.h()},l(r){e=g(r,"P",{class:!0});var o=A(e);t=x(o,s[3]),o.forEach(S),this.h()},h(){f(e,"class","server-error-response")},m(r,o){H(r,e,o),l(e,t)},p(r,o){o&8&&ie(t,r[3])},d(r){r&&S(e)}}}function ge(s){let e,t,r,o,a,i="Email",m,n,_,p,v,T="Password",C,d,B,k,O,I,U,$,R="New user? Sign up here!",j,z,u=s[3]&&K(s);return{c(){e=b("div"),t=b("form"),u&&u.c(),r=L(),o=b("div"),a=b("label"),a.textContent=i,m=L(),n=b("input"),_=L(),p=b("div"),v=b("label"),v.textContent=T,C=L(),d=b("input"),B=L(),k=b("button"),O=Z("Log in!"),U=L(),$=b("a"),$.textContent=R,this.h()},l(c){e=g(c,"DIV",{class:!0});var h=A(e);t=g(h,"FORM",{});var y=A(t);u&&u.l(y),r=w(y),o=g(y,"DIV",{class:!0});var D=A(o);a=g(D,"LABEL",{for:!0,"data-svelte-h":!0}),F(a)!=="svelte-1p9d3fm"&&(a.textContent=i),m=w(D),n=g(D,"INPUT",{type:!0,id:!0,autocomplete:!0}),D.forEach(S),_=w(y),p=g(y,"DIV",{class:!0});var N=A(p);v=g(N,"LABEL",{for:!0,"data-svelte-h":!0}),F(v)!=="svelte-pepa0a"&&(v.textContent=T),C=w(N),d=g(N,"INPUT",{type:!0,id:!0,autocomplete:!0}),N.forEach(S),B=w(y),k=g(y,"BUTTON",{type:!0});var M=A(k);O=x(M,"Log in!"),M.forEach(S),y.forEach(S),U=w(h),$=g(h,"A",{class:!0,href:!0,"data-svelte-h":!0}),F($)!=="svelte-180bc3l"&&($.textContent=R),h.forEach(S),this.h()},h(){f(a,"for","email"),f(n,"type","email"),f(n,"id","email"),f(n,"autocomplete","on"),n.disabled=s[2],n.required=!0,f(o,"class","input-container"),f(v,"for","password"),f(d,"type","password"),f(d,"id","password"),f(d,"autocomplete","on"),d.disabled=s[2],d.required=!0,f(p,"class","input-container"),f(k,"type","submit"),k.disabled=I=!s[4],t.noValidate=!0,f($,"class","page-redirect-link"),f($,"href","/sign-up"),f(e,"class","page log-in")},m(c,h){H(c,e,h),l(e,t),u&&u.m(t,null),l(t,r),l(t,o),l(o,a),l(o,m),l(o,n),P(n,s[0]),l(t,_),l(t,p),l(p,v),l(p,C),l(p,d),P(d,s[1]),l(t,B),l(t,k),l(k,O),l(e,U),l(e,$),j||(z=[E(n,"input",s[5].server),E(n,"input",s[7]),E(d,"input",s[5].server),E(d,"input",s[8]),E(t,"submit",s[6])],j=!0)},p(c,[h]){c[3]?u?u.p(c,h):(u=K(c),u.c(),u.m(t,r)):u&&(u.d(1),u=null),h&4&&(n.disabled=c[2]),h&1&&n.value!==c[0]&&P(n,c[0]),h&4&&(d.disabled=c[2]),h&2&&d.value!==c[1]&&P(d,c[1]),h&16&&I!==(I=!c[4])&&(k.disabled=I)},i:G,o:G,d(c){c&&S(e),u&&u.d(),j=!1,se(z)}}}const Q="";function ve(s,e,t){let r,o,a,i=!1,m=Q;const n={server:()=>{t(3,m=Q)}};async function _(T){T.preventDefault(),t(2,i=!0);const C=await he(o,a);!C.success&&!C.auth?t(3,m=C.error):(ce.true(),oe.authedTrue()),t(2,i=!1)}function p(){o=this.value,t(0,o)}function v(){a=this.value,t(1,a)}return s.$$.update=()=>{s.$$.dirty&15&&t(4,r=o&&a&&!m&&!i)},[o,a,i,m,r,n,_,p,v]}class Se extends X{constructor(e){super(),Y(this,e,ve,ge,W,{})}}function ke(s){let e,t;return e=new _e({}),{c(){ee(e.$$.fragment)},l(r){te(e.$$.fragment,r)},m(r,o){re(e,r,o),t=!0},i(r){t||(q(e.$$.fragment,r),t=!0)},o(r){V(e.$$.fragment,r),t=!1},d(r){ne(e,r)}}}function $e(s){let e,t;return e=new Se({}),{c(){ee(e.$$.fragment)},l(r){te(e.$$.fragment,r)},m(r,o){re(e,r,o),t=!0},i(r){t||(q(e.$$.fragment,r),t=!0)},o(r){V(e.$$.fragment,r),t=!1},d(r){ne(e,r)}}}function ye(s){let e,t,r,o;const a=[$e,ke],i=[];function m(n,_){return!n[0].pendingAuthCheckStore&&!n[0].authStateStore?0:1}return e=m(s),t=i[e]=a[e](s),{c(){t.c(),r=J()},l(n){t.l(n),r=J()},m(n,_){i[e].m(n,_),H(n,r,_),o=!0},p(n,[_]){let p=e;e=m(n),e!==p&&(ue(),V(i[p],1,1,()=>{i[p]=null}),le(),t=i[e],t||(t=i[e]=a[e](n),t.c()),q(t,1),t.m(r.parentNode,r))},i(n){o||(q(t),o=!0)},o(n){V(t),o=!1},d(n){n&&S(r),i[e].d(n)}}}function Ce(s,e,t){const r={pendingAuthCheckStore:de,authStateStore:oe,redirectToLoginStore:me},o={};let a={};for(const[i,m]of Object.entries(r))o[i]=m.subscribe(n=>{const _={...a};_[i]=n,t(0,a=_)}),ae(o[i]);return!a.pendingAuthCheckStore&&!a.redirectToLoginStore&&fe(),r.redirectToLoginStore.false(),s.$$.update=()=>{s.$$.dirty&1&&(!a.pendingAuthCheckStore&&a.authStateStore?pe("/home"):be())},[a]}class Te extends X{constructor(e){super(),Y(this,e,Ce,ye,W,{})}}export{Te as component};
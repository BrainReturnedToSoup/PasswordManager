import{s as X,n as H,r as ae,e as se}from"../chunks/scheduler.ycOvhNHW.js";import{S as Y,i as Z,g as b,m as J,s as $,h as g,j as L,n as K,f as C,c as E,x as F,k as p,a as ee,y as u,C as N,A as T,o as ie,e as Q,t as P,b as le,d as V,p as ue,r as te,u as re,v as ne,w as oe}from"../chunks/index.sSTwxT2d.js";import{c as ce,g as pe,p as fe,a as de,r as me,L as _e}from"../chunks/authState.C8gL6B-P.js";import{h as he}from"../chunks/loginSignupHandlers.f9D-f3kt.js";function be(o){let t,e,r,s,c,n,l,a="Email",m,i,w,v,h,A="Password",B,f,O,S,U,q,j,k,M="New user? Sign up here!",R,x;return{c(){t=b("div"),e=b("form"),r=b("p"),s=J(o[0]),c=$(),n=b("div"),l=b("label"),l.textContent=a,m=$(),i=b("input"),w=$(),v=b("div"),h=b("label"),h.textContent=A,B=$(),f=b("input"),O=$(),S=b("button"),U=J("Log in!"),j=$(),k=b("a"),k.textContent=M,this.h()},l(d){t=g(d,"DIV",{class:!0});var _=L(t);e=g(_,"FORM",{});var y=L(e);r=g(y,"P",{class:!0});var z=L(r);s=K(z,o[0]),z.forEach(C),c=E(y),n=g(y,"DIV",{class:!0});var D=L(n);l=g(D,"LABEL",{for:!0,"data-svelte-h":!0}),F(l)!=="svelte-1p9d3fm"&&(l.textContent=a),m=E(D),i=g(D,"INPUT",{type:!0,id:!0,autocomplete:!0}),D.forEach(C),w=E(y),v=g(y,"DIV",{class:!0});var I=L(v);h=g(I,"LABEL",{for:!0,"data-svelte-h":!0}),F(h)!=="svelte-pepa0a"&&(h.textContent=A),B=E(I),f=g(I,"INPUT",{type:!0,id:!0,autocomplete:!0}),I.forEach(C),O=E(y),S=g(y,"BUTTON",{type:!0});var G=L(S);U=K(G,"Log in!"),G.forEach(C),y.forEach(C),j=E(_),k=g(_,"A",{class:!0,href:!0,"data-svelte-h":!0}),F(k)!=="svelte-180bc3l"&&(k.textContent=M),_.forEach(C),this.h()},h(){p(r,"class","server-error-response"),p(l,"for","email"),p(i,"type","email"),p(i,"id","email"),p(i,"autocomplete","on"),i.disabled=o[3],i.required=!0,p(n,"class","input-container"),p(h,"for","password"),p(f,"type","password"),p(f,"id","password"),p(f,"autocomplete","on"),f.disabled=o[3],f.required=!0,p(v,"class","input-container"),p(S,"type","submit"),S.disabled=q=!o[4],e.noValidate=!0,p(k,"class","page-redirect-link"),p(k,"href","/sign-up"),p(t,"class","page log-in")},m(d,_){ee(d,t,_),u(t,e),u(e,r),u(r,s),u(e,c),u(e,n),u(n,l),u(n,m),u(n,i),N(i,o[1]),u(e,w),u(e,v),u(v,h),u(v,B),u(v,f),N(f,o[2]),u(e,O),u(e,S),u(S,U),u(t,j),u(t,k),R||(x=[T(i,"input",o[5]),T(i,"input",o[7]),T(f,"input",o[5]),T(f,"input",o[8]),T(e,"submit",o[6])],R=!0)},p(d,[_]){_&1&&ie(s,d[0]),_&8&&(i.disabled=d[3]),_&2&&i.value!==d[1]&&N(i,d[1]),_&8&&(f.disabled=d[3]),_&4&&f.value!==d[2]&&N(f,d[2]),_&16&&q!==(q=!d[4])&&(S.disabled=q)},i:H,o:H,d(d){d&&C(t),R=!1,ae(x)}}}const W="";function ge(o,t,e){let r,s=W;function c(){e(0,s=W)}let n,l,a=!1;async function m(v){v.preventDefault(),e(3,a=!0);let h;try{h=await he(n,l)}catch(A){console.error("log-in submit error",A,A.stack)}h&&e(0,s=h),e(3,a=!1)}function i(){n=this.value,e(1,n)}function w(){l=this.value,e(2,l)}return o.$$.update=()=>{o.$$.dirty&15&&e(4,r=n&&l&&!s&&!a)},[s,n,l,a,r,c,m,i,w]}class ve extends Y{constructor(t){super(),Z(this,t,ge,be,X,{})}}function Se(o){let t,e;return t=new _e({}),{c(){te(t.$$.fragment)},l(r){re(t.$$.fragment,r)},m(r,s){ne(t,r,s),e=!0},i(r){e||(V(t.$$.fragment,r),e=!0)},o(r){P(t.$$.fragment,r),e=!1},d(r){oe(t,r)}}}function ke(o){let t,e;return t=new ve({}),{c(){te(t.$$.fragment)},l(r){re(t.$$.fragment,r)},m(r,s){ne(t,r,s),e=!0},i(r){e||(V(t.$$.fragment,r),e=!0)},o(r){P(t.$$.fragment,r),e=!1},d(r){oe(t,r)}}}function ye(o){let t,e,r,s;const c=[ke,Se],n=[];function l(a,m){return!a[0].pendingAuthCheckStore&&!a[0].authStateStore?0:1}return t=l(o),e=n[t]=c[t](o),{c(){e.c(),r=Q()},l(a){e.l(a),r=Q()},m(a,m){n[t].m(a,m),ee(a,r,m),s=!0},p(a,[m]){let i=t;t=l(a),t!==i&&(ue(),P(n[i],1,1,()=>{n[i]=null}),le(),e=n[t],e||(e=n[t]=c[t](a),e.c()),V(e,1),e.m(r.parentNode,r))},i(a){s||(V(e),s=!0)},o(a){P(e),s=!1},d(a){a&&C(r),n[t].d(a)}}}function Ce(o,t,e){const r={pendingAuthCheckStore:fe,authStateStore:de,redirectToLoginStore:me},s={};let c={};for(const[n,l]of Object.entries(r))s[n]=l.subscribe(a=>{const m={...c};m[n]=a,e(0,c=m)}),se(s[n]);return!c.pendingAuthCheckStore&&!c.redirectToLoginStore&&ce(),r.redirectToLoginStore.false(),o.$$.update=()=>{o.$$.dirty&1&&!c.pendingAuthCheckStore&&c.authStateStore&&pe("/home")},[c]}class Ae extends Y{constructor(t){super(),Z(this,t,Ce,ye,X,{})}}export{Ae as component};
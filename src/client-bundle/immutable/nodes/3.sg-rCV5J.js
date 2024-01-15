import{s as Y,n as D,b as le,f as Se,e as Ce,t as Me,r as Je}from"../chunks/scheduler.ycOvhNHW.js";import{S as Z,i as x,g as v,h as S,x as ge,k as C,a as G,f as _,j as T,p as ke,t as I,b as ye,d as O,r as J,u as K,v as W,w as X,y as Le,s as Q,c as R,z as d,A as ae,m as ie,n as ce,B as oe,o as ze,e as je}from"../chunks/index.b1LXnWHE.js";import{b as Ke,a as Ue,r as We,c as Xe,g as Ye,p as Ze,d as xe,L as et}from"../chunks/authState.ultGfI7G.js";import{w as Qe}from"../chunks/singletons._DhEapdS.js";function tt(s){let e,n='<div class="credentials-search"></div>';return{c(){e=v("div"),e.innerHTML=n,this.h()},l(t){e=S(t,"DIV",{class:!0,"data-svelte-h":!0}),ge(e)!=="svelte-1rvj1ra"&&(e.innerHTML=n),this.h()},h(){C(e,"class","credentials-main")},m(t,r){G(t,e,r)},p:D,i:D,o:D,d(t){t&&_(e)}}}function nt(s,e,n){let{pendingLogout:t}=e;return s.$$set=r=>{"pendingLogout"in r&&n(0,t=r.pendingLogout)},[t]}class st extends Z{constructor(e){super(),x(this,e,nt,tt,Y,{pendingLogout:0})}}function rt(s){let e,n='<form action="/new-credentials" method="POST"></form>';return{c(){e=v("div"),e.innerHTML=n,this.h()},l(t){e=S(t,"DIV",{class:!0,"data-svelte-h":!0}),ge(e)!=="svelte-14exx1w"&&(e.innerHTML=n),this.h()},h(){C(e,"class","credentials-creator")},m(t,r){G(t,e,r)},p:D,i:D,o:D,d(t){t&&_(e)}}}function ot(s,e,n){let{pendingLogout:t}=e;return s.$$set=r=>{"pendingLogout"in r&&n(0,t=r.pendingLogout)},[t]}class it extends Z{constructor(e){super(),x(this,e,ot,rt,Y,{pendingLogout:0})}}const B=Object.freeze({credentials:"credentials",settings:"settings"}),p=Object.freeze({credentials:Object.freeze({main:"main",creator:"creator"}),settings:Object.freeze({account:"account",preferences:"preferences",faq:"faq"})});function ct(s){let e,n;return e=new it({props:{pendingLogout:s[1]}}),{c(){J(e.$$.fragment)},l(t){K(e.$$.fragment,t)},m(t,r){W(e,t,r),n=!0},p(t,r){const o={};r&2&&(o.pendingLogout=t[1]),e.$set(o)},i(t){n||(O(e.$$.fragment,t),n=!0)},o(t){I(e.$$.fragment,t),n=!1},d(t){X(e,t)}}}function at(s){let e,n;return e=new st({props:{pendingLogout:s[1]}}),{c(){J(e.$$.fragment)},l(t){K(e.$$.fragment,t)},m(t,r){W(e,t,r),n=!0},p(t,r){const o={};r&2&&(o.pendingLogout=t[1]),e.$set(o)},i(t){n||(O(e.$$.fragment,t),n=!0)},o(t){I(e.$$.fragment,t),n=!1},d(t){X(e,t)}}}function lt(s){let e,n,t,r;const o=[at,ct],i=[];function m(c,l){return c[0]===p.credentials.main?0:c[0]===p.credentials.creator?1:-1}return~(n=m(s))&&(t=i[n]=o[n](s)),{c(){e=v("div"),t&&t.c(),this.h()},l(c){e=S(c,"DIV",{class:!0});var l=T(e);t&&t.l(l),l.forEach(_),this.h()},h(){C(e,"class","credentials container")},m(c,l){G(c,e,l),~n&&i[n].m(e,null),r=!0},p(c,[l]){let u=n;n=m(c),n===u?~n&&i[n].p(c,l):(t&&(ke(),I(i[u],1,1,()=>{i[u]=null}),ye()),~n?(t=i[n],t?t.p(c,l):(t=i[n]=o[n](c),t.c()),O(t,1),t.m(e,null)):t=null)},i(c){r||(O(t),r=!0)},o(c){I(t),r=!1},d(c){c&&_(e),~n&&i[n].d()}}}function ut(s,e,n){let{secondaryFocus:t}=e,{pendingLogout:r}=e;return s.$$set=o=>{"secondaryFocus"in o&&n(0,t=o.secondaryFocus),"pendingLogout"in o&&n(1,r=o.pendingLogout)},[t,r]}class ft extends Z{constructor(e){super(),x(this,e,ut,lt,Y,{secondaryFocus:0,pendingLogout:1})}}function dt(s){let e,n='<h2 class="settings-account header">Account</h2>';return{c(){e=v("div"),e.innerHTML=n,this.h()},l(t){e=S(t,"DIV",{class:!0,"data-svelte-h":!0}),ge(e)!=="svelte-1gx8zye"&&(e.innerHTML=n),this.h()},h(){C(e,"class","settings-account container svelte-1lhfk67")},m(t,r){G(t,e,r),s[2](e)},p:D,i:D,o:D,d(t){t&&_(e),s[2](null)}}}function gt(s,e,n){let{accountContainer:t}=e,{pendingLogout:r}=e;function o(i){le[i?"unshift":"push"](()=>{t=i,n(0,t)})}return s.$$set=i=>{"accountContainer"in i&&n(0,t=i.accountContainer),"pendingLogout"in i&&n(1,r=i.pendingLogout)},[t,r,o]}class ht extends Z{constructor(e){super(),x(this,e,gt,dt,Y,{accountContainer:0,pendingLogout:1})}}function pt(s){let e,n='<h2 class="settings-preferences header">Preferences</h2>';return{c(){e=v("div"),e.innerHTML=n,this.h()},l(t){e=S(t,"DIV",{class:!0,"data-svelte-h":!0}),ge(e)!=="svelte-1bo91qe"&&(e.innerHTML=n),this.h()},h(){C(e,"class","settings-preferences container svelte-svrx2m")},m(t,r){G(t,e,r),s[2](e)},p:D,i:D,o:D,d(t){t&&_(e),s[2](null)}}}function _t(s,e,n){let{preferencesContainer:t}=e,{pendingLogout:r}=e;function o(i){le[i?"unshift":"push"](()=>{t=i,n(0,t)})}return s.$$set=i=>{"preferencesContainer"in i&&n(0,t=i.preferencesContainer),"pendingLogout"in i&&n(1,r=i.pendingLogout)},[t,r,o]}class mt extends Z{constructor(e){super(),x(this,e,_t,pt,Y,{preferencesContainer:0,pendingLogout:1})}}function bt(s){let e,n='<h2 class="settings-faq header">FAQ</h2>';return{c(){e=v("div"),e.innerHTML=n,this.h()},l(t){e=S(t,"DIV",{class:!0,"data-svelte-h":!0}),ge(e)!=="svelte-1ayohci"&&(e.innerHTML=n),this.h()},h(){C(e,"class","settings-faq container svelte-iytjw8")},m(t,r){G(t,e,r),s[2](e)},p:D,i:D,o:D,d(t){t&&_(e),s[2](null)}}}function vt(s,e,n){let{faqContainer:t}=e,{pendingLogout:r}=e;function o(i){le[i?"unshift":"push"](()=>{t=i,n(0,t)})}return s.$$set=i=>{"faqContainer"in i&&n(0,t=i.faqContainer),"pendingLogout"in i&&n(1,r=i.pendingLogout)},[t,r,o]}class St extends Z{constructor(e){super(),x(this,e,vt,bt,Y,{faqContainer:0,pendingLogout:1})}}const Lt=()=>{const{subscribe:s,set:e}=Qe(p.settings.account);return{subscribe:s,account:()=>{e(p.settings.account)},preferences:()=>{e(p.settings.preferences)},faq:()=>{e(p.settings.faq)}}},Ct=()=>{const{subscribe:s,set:e}=Qe(!1);return{subscribe:s,true:()=>{e(!0)},false:()=>{e(!1)}}},Re=Lt(),Ge=Ct();function kt(s){let e,n,t,r,o,i,m,c,l,u,y,q;function M(a){s[8](a)}let E={pendingLogout:s[0]};s[2]!==void 0&&(E.accountContainer=s[2]),n=new ht({props:E}),le.push(()=>Le(n,"accountContainer",M));function P(a){s[9](a)}let j={pendingLogout:s[0]};s[3]!==void 0&&(j.preferencesContainer=s[3]),o=new mt({props:j}),le.push(()=>Le(o,"preferencesContainer",P));function F(a){s[10](a)}let f={pendingLogout:s[0]};return s[4]!==void 0&&(f.faqContainer=s[4]),c=new St({props:f}),le.push(()=>Le(c,"faqContainer",F)),{c(){e=v("div"),J(n.$$.fragment),r=Q(),J(o.$$.fragment),m=Q(),J(c.$$.fragment),this.h()},l(a){e=S(a,"DIV",{class:!0});var g=T(e);K(n.$$.fragment,g),r=R(g),K(o.$$.fragment,g),m=R(g),K(c.$$.fragment,g),g.forEach(_),this.h()},h(){C(e,"class","settings container svelte-101m1sm")},m(a,g){G(a,e,g),W(n,e,null),d(e,r),W(o,e,null),d(e,m),W(c,e,null),s[11](e),u=!0,y||(q=ae(e,"scroll",s[5]),y=!0)},p(a,[g]){const H={};g&1&&(H.pendingLogout=a[0]),!t&&g&4&&(t=!0,H.accountContainer=a[2],Se(()=>t=!1)),n.$set(H);const ee={};g&1&&(ee.pendingLogout=a[0]),!i&&g&8&&(i=!0,ee.preferencesContainer=a[3],Se(()=>i=!1)),o.$set(ee);const k={};g&1&&(k.pendingLogout=a[0]),!l&&g&16&&(l=!0,k.faqContainer=a[4],Se(()=>l=!1)),c.$set(k)},i(a){u||(O(n.$$.fragment,a),O(o.$$.fragment,a),O(c.$$.fragment,a),u=!0)},o(a){I(n.$$.fragment,a),I(o.$$.fragment,a),I(c.$$.fragment,a),u=!1},d(a){a&&_(e),X(n),X(o),X(c),s[11](null),y=!1,q()}}}function yt(s,e,n){let{setFocus:t}=e,{pendingLogout:r}=e;const o={settingsSecondaryFocusStore:Re,settingsHasScrolledStore:Ge},i={};let m={};for(const[f,a]of Object.entries(o))i[f]=a.subscribe(g=>{const H={...m};H[f]=g,n(7,m=H)}),Ce(i[f]);let c,l,u,y;async function q(){if(await Me(),!c||!l||!u||!y)return;const f={[p.settings.account]:l.offsetTop,[p.settings.preferences]:u.offsetTop,[p.settings.faq]:y.offsetTop};n(1,c.scrollTop=f[m.settingsSecondaryFocusStore]-f[p.settings.account],c)}async function M(){if(await Me(),!c||!l||!u||!y)return;const{scrollTop:f}=c,a={[p.settings.account]:l.offsetTop,[p.settings.preferences]:u.offsetTop,[p.settings.faq]:y.offsetTop};o.settingsHasScrolledStore.true(),f>=0&&f<a[p.settings.account]?t({primary:B.settings,secondary:p.settings.account}):f>a[p.settings.account]&&f<=a[p.settings.preferences]?t({primary:B.settings,secondary:p.settings.preferences}):t({primary:B.settings,secondary:p.settings.faq})}function E(f){l=f,n(2,l)}function P(f){u=f,n(3,u)}function j(f){y=f,n(4,y)}function F(f){le[f?"unshift":"push"](()=>{c=f,n(1,c)})}return s.$$set=f=>{"setFocus"in f&&n(6,t=f.setFocus),"pendingLogout"in f&&n(0,r=f.pendingLogout)},s.$$.update=()=>{s.$$.dirty&128&&(m.settingsHasScrolledStore||q())},[r,c,l,u,y,M,t,m,E,P,j,F]}class Tt extends Z{constructor(e){super(),x(this,e,yt,kt,Y,{setFocus:6,pendingLogout:0})}}function Ne(s){let e,n;return{c(){e=v("p"),n=ie(s[3]),this.h()},l(t){e=S(t,"P",{class:!0});var r=T(e);n=ce(r,s[3]),r.forEach(_),this.h()},h(){C(e,"class","error-message")},m(t,r){G(t,e,r),d(e,n)},p(t,r){r&8&&ze(n,t[3])},d(t){t&&_(e)}}}function Be(s){let e,n,t,r;return{c(){e=v("button"),n=ie("Back to main"),this.h()},l(o){e=S(o,"BUTTON",{class:!0});var i=T(e);n=ce(i,"Back to main"),i.forEach(_),this.h()},h(){C(e,"class","credentials-main button"),e.disabled=s[4]},m(o,i){G(o,e,i),d(e,n),t||(r=ae(e,"click",s[13]),t=!0)},p(o,i){i&16&&(e.disabled=o[4])},d(o){o&&_(e),t=!1,r()}}}function qt(s){let e,n;return e=new Tt({props:{pendingLogout:s[4],setFocus:s[11]}}),{c(){J(e.$$.fragment)},l(t){K(e.$$.fragment,t)},m(t,r){W(e,t,r),n=!0},p(t,r){const o={};r&16&&(o.pendingLogout=t[4]),e.$set(o)},i(t){n||(O(e.$$.fragment,t),n=!0)},o(t){I(e.$$.fragment,t),n=!1},d(t){X(e,t)}}}function Ft(s){let e,n;return e=new ft({props:{pendingLogout:s[4]}}),{c(){J(e.$$.fragment)},l(t){K(e.$$.fragment,t)},m(t,r){W(e,t,r),n=!0},p(t,r){const o={};r&16&&(o.pendingLogout=t[4]),e.$set(o)},i(t){n||(O(e.$$.fragment,t),n=!0)},o(t){I(e.$$.fragment,t),n=!1},d(t){X(e,t)}}}function Et(s){let e,n,t,r,o,i,m=s[0].currAuthEmailCensoredStore+"",c,l,u,y,q,M,E,P,j,F,f,a,g,H,ee="Settings",k,L,te,ue,z,pe,_e,U,me,be,fe,w,A,N,ve,Te,V=s[3]&&Ne(s),$=s[2]!==p.credentials.main&&Be(s);const qe=[Ft,qt],ne=[];function Fe(h,b){return h[1]===B.credentials?0:h[1]===B.settings?1:-1}return~(w=Fe(s))&&(A=ne[w]=qe[w](s)),{c(){e=v("div"),n=v("div"),V&&V.c(),t=Q(),r=v("nav"),o=v("div"),i=v("h1"),c=ie(m),l=Q(),u=v("button"),y=ie("Log out"),M=Q(),E=v("div"),$&&$.c(),P=Q(),j=v("div"),F=v("button"),f=ie("New Credentials+"),a=Q(),g=v("div"),H=v("h1"),H.textContent=ee,k=Q(),L=v("button"),te=ie("Account"),ue=Q(),z=v("button"),pe=ie("Preferences"),_e=Q(),U=v("button"),me=ie("FAQ"),be=Q(),fe=v("main"),A&&A.c(),this.h()},l(h){e=S(h,"DIV",{class:!0});var b=T(e);n=S(b,"DIV",{class:!0});var de=T(n);V&&V.l(de),de.forEach(_),t=R(b),r=S(b,"NAV",{});var se=T(r);o=S(se,"DIV",{class:!0});var he=T(o);i=S(he,"H1",{class:!0});var Ee=T(i);c=ce(Ee,m),Ee.forEach(_),l=R(he),u=S(he,"BUTTON",{class:!0});var He=T(u);y=ce(He,"Log out"),He.forEach(_),he.forEach(_),M=R(se),E=S(se,"DIV",{class:!0});var we=T(E);$&&$.l(we),we.forEach(_),P=R(se),j=S(se,"DIV",{class:!0});var Ae=T(j);F=S(Ae,"BUTTON",{class:!0});var Ve=T(F);f=ce(Ve,"New Credentials+"),Ve.forEach(_),Ae.forEach(_),a=R(se),g=S(se,"DIV",{class:!0});var re=T(g);H=S(re,"H1",{class:!0,"data-svelte-h":!0}),ge(H)!=="svelte-d985ew"&&(H.textContent=ee),k=R(re),L=S(re,"BUTTON",{class:!0});var $e=T(L);te=ce($e,"Account"),$e.forEach(_),ue=R(re),z=S(re,"BUTTON",{class:!0});var De=T(z);pe=ce(De,"Preferences"),De.forEach(_),_e=R(re),U=S(re,"BUTTON",{class:!0});var Ie=T(U);me=ce(Ie,"FAQ"),Ie.forEach(_),re.forEach(_),se.forEach(_),be=R(b),fe=S(b,"MAIN",{});var Oe=T(fe);A&&A.l(Oe),Oe.forEach(_),b.forEach(_),this.h()},h(){C(n,"class","error-message container"),C(i,"class","censored-email"),C(u,"class","log-out"),u.disabled=q=s[4]||s[5],C(o,"class","profile container"),C(E,"class","credentials-main button container"),C(F,"class","credentials-creator button svelte-qi1hey"),F.disabled=s[4],oe(F,"selected",s[9]),C(j,"class","credentials-creator button container"),C(H,"class","settings header"),C(L,"class","settings-account button svelte-qi1hey"),L.disabled=s[4],oe(L,"selected",s[8]),C(z,"class","settings-preferences button svelte-qi1hey"),z.disabled=s[4],oe(z,"selected",s[7]),C(U,"class","settings-faq button svelte-qi1hey"),U.disabled=s[4],oe(U,"selected",s[6]),C(g,"class","settings-button container"),C(e,"class","page home")},m(h,b){G(h,e,b),d(e,n),V&&V.m(n,null),d(e,t),d(e,r),d(r,o),d(o,i),d(i,c),d(o,l),d(o,u),d(u,y),d(r,M),d(r,E),$&&$.m(E,null),d(r,P),d(r,j),d(j,F),d(F,f),d(r,a),d(r,g),d(g,H),d(g,k),d(g,L),d(L,te),d(g,ue),d(g,z),d(z,pe),d(g,_e),d(g,U),d(U,me),d(e,be),d(e,fe),~w&&ne[w].m(fe,null),N=!0,ve||(Te=[ae(u,"click",s[12]),ae(F,"click",s[14]),ae(L,"click",s[15]),ae(z,"click",s[16]),ae(U,"click",s[17])],ve=!0)},p(h,[b]){h[3]?V?V.p(h,b):(V=Ne(h),V.c(),V.m(n,null)):V&&(V.d(1),V=null),(!N||b&1)&&m!==(m=h[0].currAuthEmailCensoredStore+"")&&ze(c,m),(!N||b&48&&q!==(q=h[4]||h[5]))&&(u.disabled=q),h[2]!==p.credentials.main?$?$.p(h,b):($=Be(h),$.c(),$.m(E,null)):$&&($.d(1),$=null),(!N||b&16)&&(F.disabled=h[4]),(!N||b&512)&&oe(F,"selected",h[9]),(!N||b&16)&&(L.disabled=h[4]),(!N||b&256)&&oe(L,"selected",h[8]),(!N||b&16)&&(z.disabled=h[4]),(!N||b&128)&&oe(z,"selected",h[7]),(!N||b&16)&&(U.disabled=h[4]),(!N||b&64)&&oe(U,"selected",h[6]);let de=w;w=Fe(h),w===de?~w&&ne[w].p(h,b):(A&&(ke(),I(ne[de],1,1,()=>{ne[de]=null}),ye()),~w?(A=ne[w],A?A.p(h,b):(A=ne[w]=qe[w](h),A.c()),O(A,1),A.m(fe,null)):A=null)},i(h){N||(O(A),N=!0)},o(h){I(A),N=!1},d(h){h&&_(e),V&&V.d(),$&&$.d(),~w&&ne[w].d(),ve=!1,Je(Te)}}}const Pe="",Ht=2e3;function wt(s,e,n){let t,r,o,i,m=Pe;const c={currAuthEmailCensoredStore:Ke,settingsSecondaryFocusStore:Re,settingsHasScrolledStore:Ge},l={};let u={};for(const[k,L]of Object.entries(c))l[k]=L.subscribe(te=>{const ue={...u};ue[k]=te,n(0,u=ue)}),Ce(l[k]);let y=B.credentials,q=p.credentials.main;function M({primary:k,secondary:L}){if(k in B&&L in p[k])n(1,y=k),n(2,q=L);else throw new Error("Invalid setFocus args",`Primary: ${k} Secondary: ${L}`)}let E=!1,P=!1;function j(){n(5,P=!0),setTimeout(()=>{n(5,P=!1)},Ht)}async function F(){n(4,E=!0);let k,L;try{k=await(await fetch("/log-out",{method:"POST"})).json()}catch(te){L=te}L?(console.error("handleLogout: ",L,L.stack),n(3,m=`Fatal ${L}`),j()):k.success?(n(3,m=Pe),Ue.authedFalse(),We.true()):(n(3,m=k.error),j()),n(4,E=!1)}const f=()=>{c.settingsHasScrolledStore.false(),M({primary:B.credentials,secondary:p.credentials.main})},a=()=>{c.settingsHasScrolledStore.false(),M({primary:B.credentials,secondary:p.credentials.creator})},g=()=>{c.settingsHasScrolledStore.false(),M({primary:B.settings,secondary:p.settings.account})},H=()=>{c.settingsHasScrolledStore.false(),M({primary:B.settings,secondary:p.settings.preferences})},ee=()=>{c.settingsHasScrolledStore.false(),M({primary:B.settings,secondary:p.settings.faq})};return s.$$.update=()=>{s.$$.dirty&7&&y===B.settings&&!u.settingsHasScrolledStore&&c.settingsSecondaryFocusStore[q](),s.$$.dirty&4&&n(9,t=q===p.credentials.creator),s.$$.dirty&4&&n(8,r=q===p.settings.account),s.$$.dirty&4&&n(7,o=q===p.settings.preferences),s.$$.dirty&4&&n(6,i=q===p.settings.faq)},[u,y,q,m,E,P,i,o,r,t,c,M,F,f,a,g,H,ee]}class At extends Z{constructor(e){super(),x(this,e,wt,Et,Y,{})}}function Vt(s){let e,n;return e=new et({}),{c(){J(e.$$.fragment)},l(t){K(e.$$.fragment,t)},m(t,r){W(e,t,r),n=!0},i(t){n||(O(e.$$.fragment,t),n=!0)},o(t){I(e.$$.fragment,t),n=!1},d(t){X(e,t)}}}function $t(s){let e,n;return e=new At({}),{c(){J(e.$$.fragment)},l(t){K(e.$$.fragment,t)},m(t,r){W(e,t,r),n=!0},i(t){n||(O(e.$$.fragment,t),n=!0)},o(t){I(e.$$.fragment,t),n=!1},d(t){X(e,t)}}}function Dt(s){let e,n,t,r;const o=[$t,Vt],i=[];function m(c,l){return!c[0].pendingAuthCheckStore&&c[0].authStateStore?0:1}return e=m(s),n=i[e]=o[e](s),{c(){n.c(),t=je()},l(c){n.l(c),t=je()},m(c,l){i[e].m(c,l),G(c,t,l),r=!0},p(c,[l]){let u=e;e=m(c),e!==u&&(ke(),I(i[u],1,1,()=>{i[u]=null}),ye(),n=i[e],n||(n=i[e]=o[e](c),n.c()),O(n,1),n.m(t.parentNode,t))},i(c){r||(O(n),r=!0)},o(c){I(n),r=!1},d(c){c&&_(t),i[e].d(c)}}}function It(s,e,n){const t={pendingAuthCheckStore:Ze,authStateStore:Ue,redirectToHomeStore:xe},r={};let o={};for(const[i,m]of Object.entries(t))r[i]=m.subscribe(c=>{const l={...o};l[i]=c,n(0,o=l)}),Ce(r[i]);return!o.pendingAuthCheckStore&&!o.redirectToHomeStore&&Xe(),t.redirectToHomeStore.false(),s.$$.update=()=>{s.$$.dirty&1&&!o.pendingAuthCheckStore&&!o.authStateStore&&Ye("/log-in")},[o]}class Bt extends Z{constructor(e){super(),x(this,e,It,Dt,Y,{})}}export{Bt as component};

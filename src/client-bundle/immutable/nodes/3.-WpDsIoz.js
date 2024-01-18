import{s as fe,n as K,r as Ne,b as Se,f as Fe,e as De,t as $e}from"../chunks/scheduler.ycOvhNHW.js";import{S as de,i as ge,g as h,h as m,x as Z,k as g,a as se,f as w,j as q,p as Ve,t as W,b as He,d as X,r as ae,u as le,v as ce,w as ue,s as k,m as te,c as P,n as ne,y as i,z as ie,A as Q,o as Ee,B as Ae,C as Ce,e as Qe}from"../chunks/index.5tyFQWbo.js";import{b as Pe,r as qe,a as Te,c as et,g as tt,p as nt,d as st,L as rt}from"../chunks/authState.jdjan_4n.js";import{v as ot,a as it}from"../chunks/constraintValidation.du7N9Ism.js";import{w as We}from"../chunks/singletons.BUfRPfwA.js";function at(s){let e,t='<div class="credentials-search"></div>';return{c(){e=h("div"),e.innerHTML=t,this.h()},l(n){e=m(n,"DIV",{class:!0,"data-svelte-h":!0}),Z(e)!=="svelte-1rvj1ra"&&(e.innerHTML=t),this.h()},h(){g(e,"class","credentials-main")},m(n,r){se(n,e,r)},p:K,i:K,o:K,d(n){n&&w(e)}}}function lt(s,e,t){let{pendingLogout:n}=e;return s.$$set=r=>{"pendingLogout"in r&&t(0,n=r.pendingLogout)},[n]}class ct extends de{constructor(e){super(),ge(this,e,lt,at,fe,{pendingLogout:0})}}function ut(s){let e,t='<form action="/new-credentials" method="POST"></form>';return{c(){e=h("div"),e.innerHTML=t,this.h()},l(n){e=m(n,"DIV",{class:!0,"data-svelte-h":!0}),Z(e)!=="svelte-14exx1w"&&(e.innerHTML=t),this.h()},h(){g(e,"class","credentials-creator")},m(n,r){se(n,e,r)},p:K,i:K,o:K,d(n){n&&w(e)}}}function ft(s,e,t){let{pendingLogout:n}=e;return s.$$set=r=>{"pendingLogout"in r&&t(0,n=r.pendingLogout)},[n]}class dt extends de{constructor(e){super(),ge(this,e,ft,ut,fe,{pendingLogout:0})}}const oe=Object.freeze({credentials:"credentials",settings:"settings"}),H=Object.freeze({credentials:Object.freeze({main:"main",creator:"creator"}),settings:Object.freeze({account:"account",preferences:"preferences",faq:"faq"})});function gt(s){let e,t;return e=new dt({props:{pendingLogout:s[1]}}),{c(){ae(e.$$.fragment)},l(n){le(e.$$.fragment,n)},m(n,r){ce(e,n,r),t=!0},p(n,r){const o={};r&2&&(o.pendingLogout=n[1]),e.$set(o)},i(n){t||(X(e.$$.fragment,n),t=!0)},o(n){W(e.$$.fragment,n),t=!1},d(n){ue(e,n)}}}function pt(s){let e,t;return e=new ct({props:{pendingLogout:s[1]}}),{c(){ae(e.$$.fragment)},l(n){le(e.$$.fragment,n)},m(n,r){ce(e,n,r),t=!0},p(n,r){const o={};r&2&&(o.pendingLogout=n[1]),e.$set(o)},i(n){t||(X(e.$$.fragment,n),t=!0)},o(n){W(e.$$.fragment,n),t=!1},d(n){ue(e,n)}}}function ht(s){let e,t,n,r;const o=[pt,gt],a=[];function f(l,p){return l[0]===H.credentials.main?0:l[0]===H.credentials.creator?1:-1}return~(t=f(s))&&(n=a[t]=o[t](s)),{c(){e=h("div"),n&&n.c(),this.h()},l(l){e=m(l,"DIV",{class:!0});var p=q(e);n&&n.l(p),p.forEach(w),this.h()},h(){g(e,"class","credentials container")},m(l,p){se(l,e,p),~t&&a[t].m(e,null),r=!0},p(l,[p]){let c=t;t=f(l),t===c?~t&&a[t].p(l,p):(n&&(Ve(),W(a[c],1,1,()=>{a[c]=null}),He()),~t?(n=a[t],n?n.p(l,p):(n=a[t]=o[t](l),n.c()),X(n,1),n.m(e,null)):n=null)},i(l){r||(X(n),r=!0)},o(l){W(n),r=!1},d(l){l&&w(e),~t&&a[t].d()}}}function mt(s,e,t){let{secondaryFocus:n}=e,{pendingLogout:r}=e;return s.$$set=o=>{"secondaryFocus"in o&&t(0,n=o.secondaryFocus),"pendingLogout"in o&&t(1,r=o.pendingLogout)},[n,r]}class _t extends de{constructor(e){super(),ge(this,e,mt,ht,fe,{secondaryFocus:0,pendingLogout:1})}}async function Xe(s,e){const t={method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)};return await(await fetch(s,t)).json()}async function bt(s,e){let t,n;try{t=await Xe("/home/settings/delete-account",{email:s,password:e})}catch(r){n=r}if(n)return console.error("handleDeleteAccount catch block: ",n,n.stack),n;if(!t.success)return"auth"in t&&!t.auth?(setTimeout(()=>{Pe.clearEmail(),qe.true(),Te.authedFalse()},4e3),"Session expired, please log-in and attempt again"):t.error;t.success&&(Pe.clearEmail(),qe.true(),Te.authedFalse())}async function vt(s,e){let t,n;try{t=await Xe("/home/settings/new-password",{oldPassword:s,newPassword:e})}catch(r){n=r}if(n)return console.error("handleNewPassword catch block: ",n,n.stack),n;if(!t.success)return"auth"in t&&!t.auth?(setTimeout(()=>{Pe.clearEmail(),qe.true(),Te.authedFalse()},4e3),"Session expired, please log-in and attempt again"):t.error;t.success&&(Pe.clearEmail(),qe.true(),Te.authedFalse())}function wt(s){let e,t,n="Delete Your Account",r,o,a,f,l,p,c,d,C="Email",D,L,y,E,T="Password",_,u,b,S,J="Confirm Password",V,v,x,j,z,re,pe,$;return{c(){e=h("div"),t=h("h3"),t.textContent=n,r=k(),o=h("p"),a=k(),f=h("p"),l=te(s[4]),p=k(),c=h("form"),d=h("label"),d.textContent=C,D=k(),L=h("input"),y=k(),E=h("label"),E.textContent=T,_=k(),u=h("input"),b=k(),S=h("label"),S.textContent=J,V=k(),v=h("input"),x=k(),j=h("button"),z=te("Delete Your Account"),this.h()},l(U){e=m(U,"DIV",{class:!0});var B=q(e);t=m(B,"H3",{class:!0,"data-svelte-h":!0}),Z(t)!=="svelte-bjgs3s"&&(t.textContent=n),r=P(B),o=m(B,"P",{class:!0}),q(o).forEach(w),a=P(B),f=m(B,"P",{class:!0});var R=q(f);l=ne(R,s[4]),R.forEach(w),p=P(B),c=m(B,"FORM",{action:!0,method:!0});var N=q(c);d=m(N,"LABEL",{for:!0,"data-svelte-h":!0}),Z(d)!=="svelte-2vstyi"&&(d.textContent=C),D=P(N),L=m(N,"INPUT",{id:!0,name:!0,type:!0}),y=P(N),E=m(N,"LABEL",{for:!0,"data-svelte-h":!0}),Z(E)!=="svelte-9e3l82"&&(E.textContent=T),_=P(N),u=m(N,"INPUT",{id:!0,name:!0,type:!0}),b=P(N),S=m(N,"LABEL",{for:!0,"data-svelte-h":!0}),Z(S)!=="svelte-14qrn4n"&&(S.textContent=J),V=P(N),v=m(N,"INPUT",{id:!0,name:!0,type:!0}),x=P(N),j=m(N,"BUTTON",{type:!0});var O=q(j);z=ne(O,"Delete Your Account"),O.forEach(w),N.forEach(w),B.forEach(w),this.h()},h(){g(t,"class","delete-account header"),g(o,"class","delete-account description"),g(f,"class","delete-account server error-message"),g(d,"for","delete-account-email"),g(L,"id","delete-account-email"),g(L,"name","email"),g(L,"type","email"),L.disabled=s[0],g(E,"for","delete-account-password"),g(u,"id","delete-account-password"),g(u,"name","password"),g(u,"type","password"),u.disabled=s[0],g(S,"for","delete-account-confirm-password"),g(v,"id","delete-account-confirm-password"),g(v,"name","confirmPassword"),g(v,"type","password"),v.disabled=s[0],g(j,"type","submit"),j.disabled=re=!s[5],g(c,"action","/home/settings/delete-account"),g(c,"method","POST"),g(e,"class","delete-account container")},m(U,B){se(U,e,B),i(e,t),i(e,r),i(e,o),i(e,a),i(e,f),i(f,l),i(e,p),i(e,c),i(c,d),i(c,D),i(c,L),ie(L,s[1]),i(c,y),i(c,E),i(c,_),i(c,u),ie(u,s[2]),i(c,b),i(c,S),i(c,V),i(c,v),ie(v,s[3]),i(c,x),i(c,j),i(j,z),pe||($=[Q(L,"input",s[9]),Q(L,"input",s[10]),Q(u,"input",s[11]),Q(u,"input",s[12]),Q(v,"input",s[13]),Q(v,"input",s[14]),Q(c,"submit",s[6])],pe=!0)},p(U,[B]){B&16&&Ee(l,U[4]),B&1&&(L.disabled=U[0]),B&2&&L.value!==U[1]&&ie(L,U[1]),B&1&&(u.disabled=U[0]),B&4&&u.value!==U[2]&&ie(u,U[2]),B&1&&(v.disabled=U[0]),B&8&&v.value!==U[3]&&ie(v,U[3]),B&32&&re!==(re=!U[5])&&(j.disabled=re)},i:K,o:K,d(U){U&&w(e),pe=!1,Ne($)}}}const Ye="";function Ct(s,e,t){let n,{pendingLogout:r}=e,o=!1,a,f,l,p=Ye;async function c(_){t(8,o=!0),_.preventDefault();let u,b;try{u=await bt(a,f)}catch(S){b=S}b&&t(4,p=b),u&&t(4,p=u),t(8,o=!1)}function d(){t(4,p=Ye)}function C(){a=this.value,t(1,a)}const D=()=>{d()};function L(){f=this.value,t(2,f)}const y=()=>{d()};function E(){l=this.value,t(3,l)}const T=()=>{d()};return s.$$set=_=>{"pendingLogout"in _&&t(0,r=_.pendingLogout)},s.$$.update=()=>{s.$$.dirty&287&&t(5,n=a&&f&&l&&!r&&!o&&!p)},[r,a,f,l,p,n,c,d,o,C,D,L,y,E,T]}class Lt extends de{constructor(e){super(),ge(this,e,Ct,wt,fe,{pendingLogout:0})}}function St(s){let e,t,n="New Password",r,o,a,f,l,p,c,d,C,D="Old Password",L,y,E,T,_,u,b,S,J="New Password",V,v,x,j,z,re,pe,$,U="Confirm New Password",B,R,N,O,G,ve,ye,Y;return{c(){e=h("div"),t=h("h3"),t.textContent=n,r=k(),o=h("p"),a=k(),f=h("p"),l=te(s[4]),p=k(),c=h("form"),d=h("div"),C=h("label"),C.textContent=D,L=k(),y=h("input"),E=k(),T=h("div"),_=h("p"),u=te(s[5]),b=k(),S=h("label"),S.textContent=J,V=k(),v=h("input"),x=k(),j=h("div"),z=h("p"),re=te(s[6]),pe=k(),$=h("label"),$.textContent=U,B=k(),R=h("input"),N=k(),O=h("button"),G=te("Set New Password"),this.h()},l(A){e=m(A,"DIV",{class:!0});var M=q(e);t=m(M,"H3",{class:!0,"data-svelte-h":!0}),Z(t)!=="svelte-1pzclo9"&&(t.textContent=n),r=P(M),o=m(M,"P",{class:!0}),q(o).forEach(w),a=P(M),f=m(M,"P",{class:!0});var he=q(f);l=ne(he,s[4]),he.forEach(w),p=P(M),c=m(M,"FORM",{});var me=q(c);d=m(me,"DIV",{class:!0});var F=q(d);C=m(F,"LABEL",{for:!0,"data-svelte-h":!0}),Z(C)!=="svelte-1dztljq"&&(C.textContent=D),L=P(F),y=m(F,"INPUT",{id:!0,name:!0,type:!0}),F.forEach(w),E=P(me),T=m(me,"DIV",{class:!0});var I=q(T);_=m(I,"P",{class:!0});var be=q(_);u=ne(be,s[5]),be.forEach(w),b=P(I),S=m(I,"LABEL",{for:!0,"data-svelte-h":!0}),Z(S)!=="svelte-gu95ju"&&(S.textContent=J),V=P(I),v=m(I,"INPUT",{id:!0,name:!0,type:!0}),I.forEach(w),x=P(me),j=m(me,"DIV",{class:!0});var ee=q(j);z=m(ee,"P",{class:!0});var Le=q(z);re=ne(Le,s[6]),Le.forEach(w),pe=P(ee),$=m(ee,"LABEL",{for:!0,"data-svelte-h":!0}),Z($)!=="svelte-1w1roi4"&&($.textContent=U),B=P(ee),R=m(ee,"INPUT",{id:!0,name:!0,type:!0}),ee.forEach(w),N=P(me),O=m(me,"BUTTON",{type:!0});var ke=q(O);G=ne(ke,"Set New Password"),ke.forEach(w),me.forEach(w),M.forEach(w),this.h()},h(){g(t,"class","new-password header"),g(o,"class","new-password description"),g(f,"class","new-password server error-message"),g(C,"for","new-password-old-password"),g(y,"id","new-password-old-password"),g(y,"name","oldPassword"),g(y,"type","password"),y.disabled=s[0],g(d,"class","new-password-old-password container"),g(_,"class","new-password-new-password error-message"),g(S,"for","new-password-new-password"),g(v,"id","new-password-password"),g(v,"name","newPassword"),g(v,"type","password"),v.disabled=s[0],g(T,"class","new-password-new-password container"),g(z,"class","new-password-confirm-password error-message"),g($,"for","new-password-confirm-password"),g(R,"id","new-password-confirm-password"),g(R,"name","confirmPassword"),g(R,"type","password"),R.disabled=s[0],g(j,"class","new-password-confirm-password container"),g(O,"type","submit"),O.disabled=ve=!s[7],g(e,"class","new-password container")},m(A,M){se(A,e,M),i(e,t),i(e,r),i(e,o),i(e,a),i(e,f),i(f,l),i(e,p),i(e,c),i(c,d),i(d,C),i(d,L),i(d,y),ie(y,s[1]),i(c,E),i(c,T),i(T,_),i(_,u),i(T,b),i(T,S),i(T,V),i(T,v),ie(v,s[2]),i(c,x),i(c,j),i(j,z),i(z,re),i(j,pe),i(j,$),i(j,B),i(j,R),ie(R,s[3]),i(c,N),i(c,O),i(O,G),ye||(Y=[Q(y,"input",s[13]),Q(y,"input",s[9]),Q(v,"input",s[14]),Q(v,"input",s[15]),Q(R,"input",s[16]),Q(R,"input",s[17]),Q(c,"submit",s[8])],ye=!0)},p(A,[M]){M&16&&Ee(l,A[4]),M&1&&(y.disabled=A[0]),M&2&&y.value!==A[1]&&ie(y,A[1]),M&32&&Ee(u,A[5]),M&1&&(v.disabled=A[0]),M&4&&v.value!==A[2]&&ie(v,A[2]),M&64&&Ee(re,A[6]),M&1&&(R.disabled=A[0]),M&8&&R.value!==A[3]&&ie(R,A[3]),M&128&&ve!==(ve=!A[7])&&(O.disabled=ve)},i:K,o:K,d(A){A&&w(e),ye=!1,Ne(Y)}}}const _e="";function yt(s,e,t){let n,{pendingLogout:r}=e,o=!1,a,f,l,p=_e,c=_e,d=_e;async function C(S){t(12,o=!0),S.preventDefault();let J,V;try{J=await vt(a,f)}catch(v){V=v}V&&t(4,p=V),J&&t(4,p=J),t(12,o=!1)}function D(){t(4,p=_e)}function L(){t(5,c=_e)}function y(){t(6,d=_e)}function E(){a=this.value,t(1,a)}function T(){f=this.value,t(2,f)}const _=()=>{D(),L()};function u(){l=this.value,t(3,l)}const b=()=>{D(),y()};return s.$$set=S=>{"pendingLogout"in S&&t(0,r=S.pendingLogout)},s.$$.update=()=>{s.$$.dirty&4&&(f!==_e?t(5,c=ot(f)):t(5,c=_e)),s.$$.dirty&12&&(l!==_e&&f!==_e?t(6,d=it(l,f)):t(6,d=_e)),s.$$.dirty&4223&&t(7,n=a&&f&&l&&!p&&!c&&!d&&!r&&!o)},[r,a,f,l,p,c,d,n,C,D,L,y,o,E,T,_,u,b]}class Et extends de{constructor(e){super(),ge(this,e,yt,St,fe,{pendingLogout:0})}}function Tt(s){let e,t,n="Verify Email",r,o,a,f,l="Send Verification Code",p,c,d,C="Verification Code",D,L,y,E,T;return{c(){e=h("div"),t=h("h3"),t.textContent=n,r=k(),o=h("p"),a=k(),f=h("button"),f.textContent=l,p=k(),c=h("form"),d=h("label"),d.textContent=C,D=k(),L=h("input"),y=k(),E=h("button"),T=te("Verify"),this.h()},l(_){e=m(_,"DIV",{class:!0});var u=q(e);t=m(u,"H3",{class:!0,"data-svelte-h":!0}),Z(t)!=="svelte-1soy2pv"&&(t.textContent=n),r=P(u),o=m(u,"P",{class:!0}),q(o).forEach(w),a=P(u),f=m(u,"BUTTON",{"data-svelte-h":!0}),Z(f)!=="svelte-1s0g8uw"&&(f.textContent=l),p=P(u),c=m(u,"FORM",{action:!0,method:!0});var b=q(c);d=m(b,"LABEL",{for:!0,"data-svelte-h":!0}),Z(d)!=="svelte-1879wan"&&(d.textContent=C),D=P(b),L=m(b,"INPUT",{id:!0}),y=P(b),E=m(b,"BUTTON",{type:!0});var S=q(E);T=ne(S,"Verify"),S.forEach(w),b.forEach(w),u.forEach(w),this.h()},h(){g(t,"class","verify-email header"),g(o,"class","verify-email description"),g(d,"for","verify-email-code-input"),g(L,"id","verify-email-code-input"),L.value="verificationCode",L.disabled=s[0],g(E,"type","submit"),E.disabled=s[0],g(c,"action","/home/settings/verify-email"),g(c,"method","POST"),g(e,"class","verify-email container")},m(_,u){se(_,e,u),i(e,t),i(e,r),i(e,o),i(e,a),i(e,f),i(e,p),i(e,c),i(c,d),i(c,D),i(c,L),i(c,y),i(c,E),i(E,T)},p(_,[u]){u&1&&(L.disabled=_[0]),u&1&&(E.disabled=_[0])},i:K,o:K,d(_){_&&w(e)}}}function kt(s,e,t){let{pendingLogout:n}=e;return s.$$set=r=>{"pendingLogout"in r&&t(0,n=r.pendingLogout)},[n]}class Pt extends de{constructor(e){super(),ge(this,e,kt,Tt,fe,{pendingLogout:0})}}function qt(s){let e,t,n="Account",r,o,a,f,l,p,c;return o=new Lt({props:{pendingLogout:s[1]}}),f=new Et({props:{pendingLogout:s[1]}}),p=new Pt({props:{pendingLogout:s[1]}}),{c(){e=h("div"),t=h("h2"),t.textContent=n,r=k(),ae(o.$$.fragment),a=k(),ae(f.$$.fragment),l=k(),ae(p.$$.fragment),this.h()},l(d){e=m(d,"DIV",{class:!0});var C=q(e);t=m(C,"H2",{class:!0,"data-svelte-h":!0}),Z(t)!=="svelte-xopwpk"&&(t.textContent=n),r=P(C),le(o.$$.fragment,C),a=P(C),le(f.$$.fragment,C),l=P(C),le(p.$$.fragment,C),C.forEach(w),this.h()},h(){g(t,"class","settings-account header"),g(e,"class","settings-account container svelte-1lhfk67")},m(d,C){se(d,e,C),i(e,t),i(e,r),ce(o,e,null),i(e,a),ce(f,e,null),i(e,l),ce(p,e,null),s[2](e),c=!0},p(d,[C]){const D={};C&2&&(D.pendingLogout=d[1]),o.$set(D);const L={};C&2&&(L.pendingLogout=d[1]),f.$set(L);const y={};C&2&&(y.pendingLogout=d[1]),p.$set(y)},i(d){c||(X(o.$$.fragment,d),X(f.$$.fragment,d),X(p.$$.fragment,d),c=!0)},o(d){W(o.$$.fragment,d),W(f.$$.fragment,d),W(p.$$.fragment,d),c=!1},d(d){d&&w(e),ue(o),ue(f),ue(p),s[2](null)}}}function Ft(s,e,t){let{accountContainer:n}=e,{pendingLogout:r}=e;function o(a){Se[a?"unshift":"push"](()=>{n=a,t(0,n)})}return s.$$set=a=>{"accountContainer"in a&&t(0,n=a.accountContainer),"pendingLogout"in a&&t(1,r=a.pendingLogout)},[n,r,o]}class At extends de{constructor(e){super(),ge(this,e,Ft,qt,fe,{accountContainer:0,pendingLogout:1})}}function Nt(s){let e,t='<h2 class="settings-preferences header">Preferences</h2> <div class="settings-preferences general container svelte-svrx2m"></div> <div class="settings-preferences theme container svelte-svrx2m"></div> <div class="settings-preferences font container svelte-svrx2m"></div>';return{c(){e=h("div"),e.innerHTML=t,this.h()},l(n){e=m(n,"DIV",{class:!0,"data-svelte-h":!0}),Z(e)!=="svelte-h1uwy9"&&(e.innerHTML=t),this.h()},h(){g(e,"class","settings-preferences container svelte-svrx2m")},m(n,r){se(n,e,r),s[2](e)},p:K,i:K,o:K,d(n){n&&w(e),s[2](null)}}}function Dt(s,e,t){let{preferencesContainer:n}=e,{pendingLogout:r}=e;function o(a){Se[a?"unshift":"push"](()=>{n=a,t(0,n)})}return s.$$set=a=>{"preferencesContainer"in a&&t(0,n=a.preferencesContainer),"pendingLogout"in a&&t(1,r=a.pendingLogout)},[n,r,o]}class Vt extends de{constructor(e){super(),ge(this,e,Dt,Nt,fe,{preferencesContainer:0,pendingLogout:1})}}function Ht(s){let e,t='<h2 class="settings-faq header">FAQ</h2> <div class="settings-faq about container svelte-iytjw8"></div> <div class="settings-faq is-it-safe container svelte-iytjw8"></div>';return{c(){e=h("div"),e.innerHTML=t,this.h()},l(n){e=m(n,"DIV",{class:!0,"data-svelte-h":!0}),Z(e)!=="svelte-7lj1tf"&&(e.innerHTML=t),this.h()},h(){g(e,"class","settings-faq container svelte-iytjw8")},m(n,r){se(n,e,r),s[2](e)},p:K,i:K,o:K,d(n){n&&w(e),s[2](null)}}}function It(s,e,t){let{faqContainer:n}=e,{pendingLogout:r}=e;function o(a){Se[a?"unshift":"push"](()=>{n=a,t(0,n)})}return s.$$set=a=>{"faqContainer"in a&&t(0,n=a.faqContainer),"pendingLogout"in a&&t(1,r=a.pendingLogout)},[n,r,o]}class Ot extends de{constructor(e){super(),ge(this,e,It,Ht,fe,{faqContainer:0,pendingLogout:1})}}const Bt=()=>{const{subscribe:s,set:e}=We(H.settings.account);return{subscribe:s,account:()=>{e(H.settings.account)},preferences:()=>{e(H.settings.preferences)},faq:()=>{e(H.settings.faq)}}},jt=()=>{const{subscribe:s,set:e}=We(!1);return{subscribe:s,true:()=>{e(!0)},false:()=>{e(!1)}}},Ze=Bt(),xe=jt();function Ut(s){let e,t,n,r,o,a,f,l,p,c,d,C;function D(u){s[8](u)}let L={pendingLogout:s[0]};s[2]!==void 0&&(L.accountContainer=s[2]),t=new At({props:L}),Se.push(()=>Ae(t,"accountContainer",D));function y(u){s[9](u)}let E={pendingLogout:s[0]};s[3]!==void 0&&(E.preferencesContainer=s[3]),o=new Vt({props:E}),Se.push(()=>Ae(o,"preferencesContainer",y));function T(u){s[10](u)}let _={pendingLogout:s[0]};return s[4]!==void 0&&(_.faqContainer=s[4]),l=new Ot({props:_}),Se.push(()=>Ae(l,"faqContainer",T)),{c(){e=h("div"),ae(t.$$.fragment),r=k(),ae(o.$$.fragment),f=k(),ae(l.$$.fragment),this.h()},l(u){e=m(u,"DIV",{class:!0});var b=q(e);le(t.$$.fragment,b),r=P(b),le(o.$$.fragment,b),f=P(b),le(l.$$.fragment,b),b.forEach(w),this.h()},h(){g(e,"class","settings container svelte-3os9or")},m(u,b){se(u,e,b),ce(t,e,null),i(e,r),ce(o,e,null),i(e,f),ce(l,e,null),s[11](e),c=!0,d||(C=Q(e,"scroll",s[5]),d=!0)},p(u,[b]){const S={};b&1&&(S.pendingLogout=u[0]),!n&&b&4&&(n=!0,S.accountContainer=u[2],Fe(()=>n=!1)),t.$set(S);const J={};b&1&&(J.pendingLogout=u[0]),!a&&b&8&&(a=!0,J.preferencesContainer=u[3],Fe(()=>a=!1)),o.$set(J);const V={};b&1&&(V.pendingLogout=u[0]),!p&&b&16&&(p=!0,V.faqContainer=u[4],Fe(()=>p=!1)),l.$set(V)},i(u){c||(X(t.$$.fragment,u),X(o.$$.fragment,u),X(l.$$.fragment,u),c=!0)},o(u){W(t.$$.fragment,u),W(o.$$.fragment,u),W(l.$$.fragment,u),c=!1},d(u){u&&w(e),ue(t),ue(o),ue(l),s[11](null),d=!1,C()}}}function Mt(s,e,t){let{setFocus:n}=e,{pendingLogout:r}=e;const o={settingsSecondaryFocusStore:Ze,settingsHasScrolledStore:xe},a={};let f={};for(const[_,u]of Object.entries(o))a[_]=u.subscribe(b=>{const S={...f};S[_]=b,t(7,f=S)}),De(a[_]);let l,p,c,d;async function C(){if(await $e(),!l||!p||!c||!d)return;const _={[H.settings.account]:p.offsetTop,[H.settings.preferences]:c.offsetTop,[H.settings.faq]:d.offsetTop};t(1,l.scrollTop=_[f.settingsSecondaryFocusStore]-_[H.settings.account],l)}async function D(){if(await $e(),!l||!p||!c||!d)return;const _={[H.settings.account]:p.offsetTop,[H.settings.preferences]:c.offsetTop,[H.settings.faq]:d.offsetTop},{scrollTop:u}=l;o.settingsHasScrolledStore.true(),u>=0&&u<_[H.settings.account]?n({primary:oe.settings,secondary:H.settings.account}):u>_[H.settings.account]&&u<=_[H.settings.preferences]?n({primary:oe.settings,secondary:H.settings.preferences}):n({primary:oe.settings,secondary:H.settings.faq})}function L(_){p=_,t(2,p)}function y(_){c=_,t(3,c)}function E(_){d=_,t(4,d)}function T(_){Se[_?"unshift":"push"](()=>{l=_,t(1,l)})}return s.$$set=_=>{"setFocus"in _&&t(6,n=_.setFocus),"pendingLogout"in _&&t(0,r=_.pendingLogout)},s.$$.update=()=>{s.$$.dirty&128&&(f.settingsHasScrolledStore||C())},[r,l,p,c,d,D,n,f,L,y,E,T]}class Rt extends de{constructor(e){super(),ge(this,e,Mt,Ut,fe,{setFocus:6,pendingLogout:0})}}function Je(s){let e,t;return{c(){e=h("p"),t=te(s[3]),this.h()},l(n){e=m(n,"P",{class:!0});var r=q(e);t=ne(r,s[3]),r.forEach(w),this.h()},h(){g(e,"class","error-message")},m(n,r){se(n,e,r),i(e,t)},p(n,r){r&8&&Ee(t,n[3])},d(n){n&&w(e)}}}function Ge(s){let e,t,n,r;return{c(){e=h("button"),t=te("Back to main"),this.h()},l(o){e=m(o,"BUTTON",{class:!0});var a=q(e);t=ne(a,"Back to main"),a.forEach(w),this.h()},h(){g(e,"class","credentials-main button"),e.disabled=s[4]},m(o,a){se(o,e,a),i(e,t),n||(r=Q(e,"click",s[13]),n=!0)},p(o,a){a&16&&(e.disabled=o[4])},d(o){o&&w(e),n=!1,r()}}}function zt(s){let e,t;return e=new Rt({props:{pendingLogout:s[4],setFocus:s[11]}}),{c(){ae(e.$$.fragment)},l(n){le(e.$$.fragment,n)},m(n,r){ce(e,n,r),t=!0},p(n,r){const o={};r&16&&(o.pendingLogout=n[4]),e.$set(o)},i(n){t||(X(e.$$.fragment,n),t=!0)},o(n){W(e.$$.fragment,n),t=!1},d(n){ue(e,n)}}}function $t(s){let e,t;return e=new _t({props:{pendingLogout:s[4]}}),{c(){ae(e.$$.fragment)},l(n){le(e.$$.fragment,n)},m(n,r){ce(e,n,r),t=!0},p(n,r){const o={};r&16&&(o.pendingLogout=n[4]),e.$set(o)},i(n){t||(X(e.$$.fragment,n),t=!0)},o(n){W(e.$$.fragment,n),t=!1},d(n){ue(e,n)}}}function Qt(s){let e,t,n,r,o,a,f=s[0].currAuthEmailCensoredStore+"",l,p,c,d,C,D,L,y,E,T,_,u,b,S,J="Settings",V,v,x,j,z,re,pe,$,U,B,R,N,O,G,ve,ye,Y=s[3]&&Je(s),A=s[2]!==H.credentials.main&&Ge(s);const M=[$t,zt],he=[];function me(F,I){return F[1]===oe.credentials?0:F[1]===oe.settings?1:-1}return~(N=me(s))&&(O=he[N]=M[N](s)),{c(){e=h("div"),t=h("div"),Y&&Y.c(),n=k(),r=h("nav"),o=h("div"),a=h("h1"),l=te(f),p=k(),c=h("button"),d=te("Log out"),D=k(),L=h("div"),A&&A.c(),y=k(),E=h("div"),T=h("button"),_=te("New Credentials+"),u=k(),b=h("div"),S=h("h1"),S.textContent=J,V=k(),v=h("button"),x=te("Account"),j=k(),z=h("button"),re=te("Preferences"),pe=k(),$=h("button"),U=te("FAQ"),B=k(),R=h("main"),O&&O.c(),this.h()},l(F){e=m(F,"DIV",{class:!0});var I=q(e);t=m(I,"DIV",{class:!0});var be=q(t);Y&&Y.l(be),be.forEach(w),n=P(I),r=m(I,"NAV",{});var ee=q(r);o=m(ee,"DIV",{class:!0});var Le=q(o);a=m(Le,"H1",{class:!0});var ke=q(a);l=ne(ke,f),ke.forEach(w),p=P(Le),c=m(Le,"BUTTON",{class:!0});var Ie=q(c);d=ne(Ie,"Log out"),Ie.forEach(w),Le.forEach(w),D=P(ee),L=m(ee,"DIV",{class:!0});var Oe=q(L);A&&A.l(Oe),Oe.forEach(w),y=P(ee),E=m(ee,"DIV",{class:!0});var Be=q(E);T=m(Be,"BUTTON",{class:!0});var je=q(T);_=ne(je,"New Credentials+"),je.forEach(w),Be.forEach(w),u=P(ee),b=m(ee,"DIV",{class:!0});var we=q(b);S=m(we,"H1",{class:!0,"data-svelte-h":!0}),Z(S)!=="svelte-d985ew"&&(S.textContent=J),V=P(we),v=m(we,"BUTTON",{class:!0});var Ue=q(v);x=ne(Ue,"Account"),Ue.forEach(w),j=P(we),z=m(we,"BUTTON",{class:!0});var Me=q(z);re=ne(Me,"Preferences"),Me.forEach(w),pe=P(we),$=m(we,"BUTTON",{class:!0});var Re=q($);U=ne(Re,"FAQ"),Re.forEach(w),we.forEach(w),ee.forEach(w),B=P(I),R=m(I,"MAIN",{});var ze=q(R);O&&O.l(ze),ze.forEach(w),I.forEach(w),this.h()},h(){g(t,"class","error-message container"),g(a,"class","censored-email"),g(c,"class","log-out"),c.disabled=C=s[4]||s[5],g(o,"class","profile container"),g(L,"class","credentials-main button container"),g(T,"class","credentials-creator button svelte-qi1hey"),T.disabled=s[4],Ce(T,"selected",s[9]),g(E,"class","credentials-creator button container"),g(S,"class","settings header"),g(v,"class","settings-account button svelte-qi1hey"),v.disabled=s[4],Ce(v,"selected",s[8]),g(z,"class","settings-preferences button svelte-qi1hey"),z.disabled=s[4],Ce(z,"selected",s[7]),g($,"class","settings-faq button svelte-qi1hey"),$.disabled=s[4],Ce($,"selected",s[6]),g(b,"class","settings-button container"),g(e,"class","page home")},m(F,I){se(F,e,I),i(e,t),Y&&Y.m(t,null),i(e,n),i(e,r),i(r,o),i(o,a),i(a,l),i(o,p),i(o,c),i(c,d),i(r,D),i(r,L),A&&A.m(L,null),i(r,y),i(r,E),i(E,T),i(T,_),i(r,u),i(r,b),i(b,S),i(b,V),i(b,v),i(v,x),i(b,j),i(b,z),i(z,re),i(b,pe),i(b,$),i($,U),i(e,B),i(e,R),~N&&he[N].m(R,null),G=!0,ve||(ye=[Q(c,"click",s[12]),Q(T,"click",s[14]),Q(v,"click",s[15]),Q(z,"click",s[16]),Q($,"click",s[17])],ve=!0)},p(F,[I]){F[3]?Y?Y.p(F,I):(Y=Je(F),Y.c(),Y.m(t,null)):Y&&(Y.d(1),Y=null),(!G||I&1)&&f!==(f=F[0].currAuthEmailCensoredStore+"")&&Ee(l,f),(!G||I&48&&C!==(C=F[4]||F[5]))&&(c.disabled=C),F[2]!==H.credentials.main?A?A.p(F,I):(A=Ge(F),A.c(),A.m(L,null)):A&&(A.d(1),A=null),(!G||I&16)&&(T.disabled=F[4]),(!G||I&512)&&Ce(T,"selected",F[9]),(!G||I&16)&&(v.disabled=F[4]),(!G||I&256)&&Ce(v,"selected",F[8]),(!G||I&16)&&(z.disabled=F[4]),(!G||I&128)&&Ce(z,"selected",F[7]),(!G||I&16)&&($.disabled=F[4]),(!G||I&64)&&Ce($,"selected",F[6]);let be=N;N=me(F),N===be?~N&&he[N].p(F,I):(O&&(Ve(),W(he[be],1,1,()=>{he[be]=null}),He()),~N?(O=he[N],O?O.p(F,I):(O=he[N]=M[N](F),O.c()),X(O,1),O.m(R,null)):O=null)},i(F){G||(X(O),G=!0)},o(F){W(O),G=!1},d(F){F&&w(e),Y&&Y.d(),A&&A.d(),~N&&he[N].d(),ve=!1,Ne(ye)}}}const Ke="",Yt=2e3;function Jt(s,e,t){let n,r,o,a,f=Ke;const l={currAuthEmailCensoredStore:Pe,settingsSecondaryFocusStore:Ze,settingsHasScrolledStore:xe},p={};let c={};for(const[V,v]of Object.entries(l))p[V]=v.subscribe(x=>{const j={...c};j[V]=x,t(0,c=j)}),De(p[V]);let d=oe.credentials,C=H.credentials.main;function D({primary:V,secondary:v}){if(V in oe&&v in H[V])t(1,d=V),t(2,C=v);else throw new Error("Invalid setFocus args",`Primary: ${V} Secondary: ${v}`)}let L=!1,y=!1;function E(){t(5,y=!0),setTimeout(()=>{t(5,y=!1)},Yt)}async function T(){t(4,L=!0);let V,v;try{V=await(await fetch("/home/log-out",{method:"POST"})).json()}catch(x){v=x}if(v){console.error("handleLogout: ",v,v.stack),t(3,f=`Fatal ${v}`),E();return}V.success?(t(3,f=Ke),Te.authedFalse(),qe.true()):(t(3,f=V.error?V.error:"Server Error"),E()),t(4,L=!1)}const _=()=>{l.settingsHasScrolledStore.false(),D({primary:oe.credentials,secondary:H.credentials.main})},u=()=>{l.settingsHasScrolledStore.false(),D({primary:oe.credentials,secondary:H.credentials.creator})},b=()=>{l.settingsHasScrolledStore.false(),D({primary:oe.settings,secondary:H.settings.account})},S=()=>{l.settingsHasScrolledStore.false(),D({primary:oe.settings,secondary:H.settings.preferences})},J=()=>{l.settingsHasScrolledStore.false(),D({primary:oe.settings,secondary:H.settings.faq})};return s.$$.update=()=>{s.$$.dirty&7&&d===oe.settings&&!c.settingsHasScrolledStore&&l.settingsSecondaryFocusStore[C](),s.$$.dirty&4&&t(9,n=C===H.credentials.creator),s.$$.dirty&4&&t(8,r=C===H.settings.account),s.$$.dirty&4&&t(7,o=C===H.settings.preferences),s.$$.dirty&4&&t(6,a=C===H.settings.faq)},[c,d,C,f,L,y,a,o,r,n,l,D,T,_,u,b,S,J]}class Gt extends de{constructor(e){super(),ge(this,e,Jt,Qt,fe,{})}}function Kt(s){let e,t;return e=new rt({}),{c(){ae(e.$$.fragment)},l(n){le(e.$$.fragment,n)},m(n,r){ce(e,n,r),t=!0},i(n){t||(X(e.$$.fragment,n),t=!0)},o(n){W(e.$$.fragment,n),t=!1},d(n){ue(e,n)}}}function Wt(s){let e,t;return e=new Gt({}),{c(){ae(e.$$.fragment)},l(n){le(e.$$.fragment,n)},m(n,r){ce(e,n,r),t=!0},i(n){t||(X(e.$$.fragment,n),t=!0)},o(n){W(e.$$.fragment,n),t=!1},d(n){ue(e,n)}}}function Xt(s){let e,t,n,r;const o=[Wt,Kt],a=[];function f(l,p){return!l[0].pendingAuthCheckStore&&l[0].authStateStore?0:1}return e=f(s),t=a[e]=o[e](s),{c(){t.c(),n=Qe()},l(l){t.l(l),n=Qe()},m(l,p){a[e].m(l,p),se(l,n,p),r=!0},p(l,[p]){let c=e;e=f(l),e!==c&&(Ve(),W(a[c],1,1,()=>{a[c]=null}),He(),t=a[e],t||(t=a[e]=o[e](l),t.c()),X(t,1),t.m(n.parentNode,n))},i(l){r||(X(t),r=!0)},o(l){W(t),r=!1},d(l){l&&w(n),a[e].d(l)}}}function Zt(s,e,t){const n={pendingAuthCheckStore:nt,authStateStore:Te,redirectToHomeStore:st},r={};let o={};for(const[a,f]of Object.entries(n))r[a]=f.subscribe(l=>{const p={...o};p[a]=l,t(0,o=p)}),De(r[a]);return!o.pendingAuthCheckStore&&!o.redirectToHomeStore&&et(),n.redirectToHomeStore.false(),s.$$.update=()=>{s.$$.dirty&1&&!o.pendingAuthCheckStore&&!o.authStateStore&&tt("/log-in")},[o]}class rn extends de{constructor(e){super(),ge(this,e,Zt,Xt,fe,{})}}export{rn as component};
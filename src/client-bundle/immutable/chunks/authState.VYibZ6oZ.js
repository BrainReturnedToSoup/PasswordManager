import{k as u,w as n}from"./singletons.G6eYfJxP.js";import{s as h,n as o}from"./scheduler.BbOnFq8D.js";import{S as i,i as d,g as f,h as p,x as g,a as S,f as m}from"./index.r4Y_ernq.js";const F=u("goto");function _(t){let e,s="Loading Page";return{c(){e=f("div"),e.textContent=s},l(a){e=p(a,"DIV",{"data-svelte-h":!0}),g(e)!=="svelte-9c5yrp"&&(e.textContent=s)},m(a,l){S(a,e,l)},p:o,i:o,o,d(a){a&&m(e)}}}class w extends i{constructor(e){super(),d(this,e,null,_,h,{})}}const k=()=>{const{subscribe:t,set:e}=n(!1);return{subscribe:t,checkTrue:()=>{e(!0)},checkFalse:()=>{e(!1)},reset:()=>{e(!1)}}},A=()=>{const{subscribe:t,set:e}=n(!1);return{subscribe:t,pendingTrue:()=>{e(!0)},pendingFalse:()=>{e(!1)},reset:()=>{e(!1)}}},C=()=>{const{subscribe:t,set:e}=n(!1);return{subscribe:t,authedTrue:()=>{e(!0)},authedFalse:()=>{e(!1)},reset:()=>{e(!1)}}},T=k(),c=A(),r=C(),b=async()=>{const s=(await(await fetch("/auth-state")).json()).auth;return console.log("authStateBool",s),s},B=async()=>{c.pendingTrue(),(async()=>{try{await b()?r.authedTrue():r.authedFalse()}catch(t){console.log("checkAuth Request Error",t,t.stack),r.authedFalse()}finally{c.pendingFalse()}})()};export{w as L,r as a,B as c,T as f,F as g,c as p};
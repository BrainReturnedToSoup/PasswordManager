import{k as l,w as o}from"./singletons.ox6KDcWw.js";import{s as h,n as r}from"./scheduler.BbOnFq8D.js";import{S as i,i as d,g as f,h as p,x as g,a as m,f as S}from"./index.r4Y_ernq.js";const F=l("goto");function _(t){let e,a="Loading Page";return{c(){e=f("div"),e.textContent=a},l(s){e=p(s,"DIV",{"data-svelte-h":!0}),g(e)!=="svelte-9c5yrp"&&(e.textContent=a)},m(s,u){m(s,e,u)},p:r,i:r,o:r,d(s){s&&S(e)}}}class w extends i{constructor(e){super(),d(this,e,null,_,h,{})}}const k=()=>{const{subscribe:t,set:e}=o(!1);return{subscribe:t,checkTrue:()=>{e(!0)},checkFalse:()=>{e(!1)},reset:()=>{e(!1)}}},A=()=>{const{subscribe:t,set:e}=o(!1);return{subscribe:t,pendingTrue:()=>{e(!0)},pendingFalse:()=>{e(!1)},reset:()=>{e(!1)}}},C=()=>{const{subscribe:t,set:e}=o(!1);return{subscribe:t,authedTrue:()=>{e(!0)},authedFalse:()=>{e(!1)},reset:()=>{e(!1)}}},T=k(),c=A(),n=C(),b=async()=>(await(await fetch("/auth-state")).json()).auth,B=async()=>{c.pendingTrue(),(async()=>{try{await b()?n.authedTrue():n.authedFalse()}catch(t){console.log("checkAuth Request Error",t,t.stack),n.authedFalse()}finally{c.pendingFalse()}})()};export{w as L,n as a,B as c,T as f,F as g,c as p};
(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const n of e)if(n.type==="childList")for(const c of n.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function o(e){const n={};return e.integrity&&(n.integrity=e.integrity),e.referrerPolicy&&(n.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?n.credentials="include":e.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(e){if(e.ep)return;e.ep=!0;const n=o(e);fetch(e.href,n)}})();async function i(r,t,o,s,e="afterbegin",n=!0){n&&(t.innerHTML="");const c=await r(o);t.insertAdjacentHTML(e,c),s&&s(o)}window.onload=()=>{};function a(r){return async function(){const t=await fetch(r);if(t.ok)return await t.text()}}async function l(){return new Promise(async(r,t)=>{try{const o=await a("/partials/header.html"),s=await a("/partials/footer.html"),e=document.querySelector("#main-header"),n=document.querySelector("#main-footer");await i(o,e),await i(s,n),r()}catch(o){console.error("Error loading header or footer:",o),t(o)}})}function d(){const r=document.getElementById("hamburger-menu"),t=document.getElementById("close-icon");document.getElementById("nav-links").classList.remove("open"),r.style.display="block",t.style.display="none"}function u(){const r=document.getElementById("hamburger-menu"),t=document.getElementById("close-icon"),o=document.getElementById("nav-links");r.addEventListener("click",()=>{o.classList.add("open"),r.style.display="none",t.style.display="block"}),t.addEventListener("click",()=>{o.classList.remove("open"),r.style.display="block",t.style.display="none"})}export{l,d as r,u as s};

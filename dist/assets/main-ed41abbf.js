import{l as r,s,r as l}from"./utils-08be81ec.js";async function d(){await r(),s(),l()}d();window.addEventListener("load",function(){var e=document.getElementById("loading-div");e.style.display="none"});function c(){const e=document.querySelector(".skills"),t=e.querySelector("img:first-child");e.appendChild(t.cloneNode(!0)),t.remove();const i=e.querySelectorAll("img"),n=t.offsetWidth+20;i.forEach((a,o)=>{a.style.transform=`translateX(-${n*o}px)`})}setInterval(c,3e3);

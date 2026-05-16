import{g as a}from"./index.CzGW6FVa.js";function r(){document.querySelectorAll("[data-magnetic]").forEach(e=>{const t=e;t.addEventListener("mousemove",s=>{const n=t.getBoundingClientRect(),o=s.clientX-n.left-n.width/2,d=s.clientY-n.top-n.height/2,c=.15;a.to(t,{x:o*c,y:d*c,duration:.3,ease:"power2.out"})}),t.addEventListener("mouseleave",()=>{a.to(t,{x:0,y:0,duration:.5,ease:"elastic.out(1, 0.3)"})})})}function l(){document.addEventListener("click",i=>{const e=i.target.closest("[data-ripple]");if(!e)return;const t=e.getBoundingClientRect(),s=i.clientX-t.left,n=i.clientY-t.top,o=document.createElement("span");o.style.cssText=`
            position: absolute;
            left: ${s}px;
            top: ${n}px;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: translate(-50%, -50%);
            pointer-events: none;
          `,e.style.position="relative",e.style.overflow="hidden",e.appendChild(o),a.to(o,{width:200,height:200,opacity:0,duration:.6,ease:"power2.out",onComplete:()=>o.remove()})})}document.addEventListener("DOMContentLoaded",()=>{r(),l()});document.addEventListener("astro:after-swap",()=>{setTimeout(()=>{r()},100)});

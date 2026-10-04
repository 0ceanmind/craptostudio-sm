// Custom AI: a store assistant answers a customer live, fed by "your data".
// Gooey network blobs (echoing the logo) drift behind the chat window.
import { ico, gooFilter } from '../motion/ui.mjs';

const words = (s) => s.split(' ').map((w) => `<span class="wd">${w}</span>`).join(' ');

export default {
  duration: 8,

  copy: {
    en: {
      title: 'Store assistant',
      me: 'Do you have this jacket in size M?',
      ai: 'Yes, 3 left in size M. Want me to reserve one for you?',
      chips: ['Reserve size M', 'See photos'],
      data: 'Trained on your store data',
      online: 'Online 24/7',
    },
    ar: {
      title: 'مساعد المتجر',
      me: 'هل تتوفر هذه السترة بمقاس M؟',
      ai: 'نعم، بقيت 3 قطع بمقاس M. هل أحجز لك واحدة؟',
      chips: ['احجز مقاس M', 'عرض الصور'],
      data: 'مدرَّب على بيانات متجرك',
      online: 'متاح 24/7',
    },
  },

  css: (ctx) => `
.net{position:absolute;inset:0}
.net .n{position:absolute;border-radius:50%;background:var(--brand)}
.chat{position:absolute;left:96px;top:92px;width:712px}
.chat .tilt{transform:perspective(1600px) rotateY(${ctx.rtl ? 7 : -7}deg) rotateX(5deg)}
.chat .win-body{padding:32px 34px 38px;display:flex;flex-direction:column;gap:20px;min-height:452px}
.chat .bubble{font-size:${ctx.rtl ? 30 : 31}px}
.slot{position:relative;align-self:stretch;display:flex;flex-direction:column}
.chat .head{display:flex;align-items:center;gap:16px;margin-bottom:6px}
.chat .head b{font-size:26px;font-weight:800}
.chat .head small{display:flex;align-items:center;gap:8px;font:500 19px ${ctx.rtl ? 'Alexandria' : 'JetBrains Mono'};color:var(--ui-sub)}
.chat .head small i{width:10px;height:10px;border-radius:50%;background:#28C941}
.chips{display:flex;gap:12px;flex-wrap:wrap}
.typing{position:absolute;top:0;inset-inline-start:0;opacity:0}
.data{position:absolute;inset-inline-start:0;top:4px;display:flex;align-items:center;gap:14px;padding:16px 22px;border-radius:22px;font-weight:700;font-size:${ctx.rtl ? 22 : 21}px}
.data .ib{width:46px;height:46px;border-radius:14px;background:var(--brand);color:#fff;display:grid;place-items:center}
.wire{position:absolute;inset:0;overflow:visible}
.pulse{position:absolute;left:0;top:0;width:18px;height:18px;margin:-9px 0 0 -9px;border-radius:50%;background:var(--sparkg);box-shadow:0 0 24px rgba(242,141,25,.8);opacity:0}
.s1{left:700px;top:16px;transform:rotate(28deg)}
.s2{left:30px;top:600px;transform:rotate(-140deg)}
.s3{left:862px;top:380px;transform:rotate(80deg) scale(.8)}
`,

  html: ({ copy, rtl }) => `${gooFilter}
<div class="net goo">
  <div class="n" style="width:132px;height:132px;left:-6px;top:300px"></div>
  <div class="n" style="width:92px;height:92px;left:86px;top:388px"></div>
  <div class="n" style="width:74px;height:74px;left:40px;top:470px"></div>
  <div class="n" style="width:58px;height:58px;left:10px;top:214px"></div>
  <div class="n" style="width:156px;height:156px;left:742px;top:40px"></div>
  <div class="n" style="width:96px;height:96px;left:812px;top:178px"></div>
  <div class="n" style="width:70px;height:70px;left:742px;top:244px"></div>
  <div class="n" style="width:118px;height:118px;left:770px;top:520px"></div>
  <div class="n" style="width:66px;height:66px;left:846px;top:470px"></div>
</div>
<svg class="wire" viewBox="0 0 904 700"><path id="wire" d="${rtl ? 'M 760 60 C 860 120, 820 240, 700 260' : 'M 150 60 C 40 120, 90 240, 200 260'}" fill="none" stroke="var(--sky)" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round" opacity=".7"/></svg>
<div class="spark s1"></div><div class="spark s2"></div><div class="spark s3"></div>
<div class="chat"><div class="tilt win">
  <div class="win-bar"><span class="d"></span><span class="d"></span><span class="d"></span><span class="t">crapto.ai</span></div>
  <div class="win-body">
    <div class="head"><div class="avatar brand">${ico('sparkles', { size: 28 })}</div><div><b>${copy.title}</b><small><i></i>${copy.online}</small></div></div>
    <div class="bubble me">${copy.me}</div>
    <div class="slot"><div class="typing"><i></i><i></i><i></i></div>
    <div class="bubble ai">${words(copy.ai)}</div></div>
    <div class="chips">${copy.chips.map((c, i) => `<span class="chip ${i ? '' : 'ok'}">${i ? ico('image', { size: 22 }) : ico('check', { size: 22, stroke: 3 })}${c}</span>`).join('')}</div>
  </div>
</div></div>
<div class="data card"><span class="ib">${ico('database', { size: 24 })}</span>${copy.data}</div>
<div class="pulse"></div>`,

  animate(tl, gsap, ctx) {
    const D = 8;
    // Ambient loops (full cycles, so the end matches the start).
    gsap.utils.toArray('.net .n').forEach((n, i) => {
      tl.to(n, { x: (i % 2 ? 18 : -14), y: (i % 3 ? -16 : 20), scale: 1 + (i % 3) * 0.06, duration: D / 2, ease: 'sine.inOut', repeat: 1, yoyo: true }, 0);
    });
    tl.to('.chat', { y: -8, duration: D / 2, ease: 'sine.inOut', repeat: 1, yoyo: true }, 0);
    tl.to('.data', { y: 8, duration: D / 2, ease: 'sine.inOut', repeat: 1, yoyo: true }, 0);
    tl.to('.spark', { rotation: '+=360', duration: D, ease: 'none' }, 0);

    // Clear the finished conversation...
    tl.to(['.bubble.ai', '.chips', '.bubble.me'], { opacity: 0, y: -18, duration: 0.4, stagger: 0.06, ease: 'power2.in' }, 0.9);
    // ...the question arrives...
    tl.fromTo('.bubble.me', { opacity: 0, y: 26, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.6)' }, 1.45);
    // ...the assistant checks the store data (a spark runs down the wire)...
    tl.fromTo('.pulse', { opacity: 0 }, { opacity: 1, duration: 0.15 }, 1.95);
    tl.to('.pulse', { motionPath: { path: '#wire', align: '#wire', alignOrigin: [0.5, 0.5] }, duration: 0.8, ease: 'power1.inOut' }, 1.95);
    tl.to('.pulse', { opacity: 0, scale: 2.2, duration: 0.25 }, 2.75);
    tl.fromTo('.data', { boxShadow: '0 0 0 0 rgba(242,141,25,0)' }, { boxShadow: '0 0 0 8px rgba(242,141,25,.45)', duration: 0.25, yoyo: true, repeat: 1 }, 1.95);
    // ...typing dots...
    tl.fromTo('.typing', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.3 }, 2.2);
    gsap.utils.toArray('.typing i').forEach((dot, i) => {
      tl.fromTo(dot, { y: 0 }, { y: -10, duration: 0.22, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 2.3 + i * 0.1);
    });
    tl.to('.typing', { opacity: 0, scale: 0.8, duration: 0.2 }, 3.15);
    // ...and the answer streams in word by word.
    tl.fromTo('.bubble.ai', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.35 }, 3.2);
    tl.fromTo('.bubble.ai .wd', { opacity: 0 }, { opacity: 1, duration: 0.18, stagger: 0.085, ease: 'none' }, 3.25);
    tl.fromTo('.chips', { opacity: 0, y: 0 }, { opacity: 1, y: 0, duration: 0.01 }, 4.6);
    tl.fromTo('.chips .chip', { opacity: 0, y: 16, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.12, ease: 'back.out(1.8)' }, 4.6);
    tl.fromTo('.chips .chip.ok', { boxShadow: '0 0 0 0 rgba(90,180,217,.0)' }, { boxShadow: '0 0 0 10px rgba(90,180,217,.35)', duration: 0.35, yoyo: true, repeat: 1 }, 5.3);
  },
};

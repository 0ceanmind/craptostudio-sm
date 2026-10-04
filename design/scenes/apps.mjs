// Apps: a booking app comes alive on a floating, tilted phone. Tap a service, the photo grows
// into the detail page, pick a time, book, and a "Booking confirmed" banner pops out of the
// screen. On success, spark petals burst out of the phone and shock rings ripple behind it.
// Floating UI fragments (rating, payment, reminder) react to the same story, while brand blobs
// and spark petals drift behind.
import { ico } from '../motion/ui.mjs';

// Gooey filter for the blobs. Unlike the shared one, the melted bridges are filled with a flat
// brand blue instead of the blurred source colour, which left dark slivers where blobs meet.
const GOO = `<svg width="0" height="0" style="position:absolute"><defs><filter id="apgoo" color-interpolation-filters="sRGB">
<feGaussianBlur in="SourceGraphic" stdDeviation="12" result="b"/>
<feColorMatrix in="b" mode="matrix" values="0 0 0 0 0.26  0 0 0 0 0.59  0 0 0 0 0.82  0 0 0 22 -9" result="g"/>
<feComposite in="SourceGraphic" in2="g" operator="atop"/></filter></defs></svg>`;

// Success check centre inside the 302×652 screen; burst petals sit around it.
const CX = 151;
const CY = 296;
const PETALS = [[-160, 104], [-118, 112], [-72, 100], [-28, 110], [8, 98], [172, 100]];
// On success, spark petals fly out of the screen into the scene (angle, distance from the check).
// They fan out sideways only, so each one ends beside the phone (never over the banner or screen).
const BURST = [[-170, 300], [-148, 320], [-128, 330], [150, 290], [172, 310], [128, 300],
  [-10, 300], [-32, 320], [-52, 330], [30, 290], [8, 310], [52, 300]];
// The check's centre in scene coordinates (phone at 287,30 + 14px bezel).
const BX = 287 + 14 + CX;
const BY = 30 + 14 + CY;
// Wires from the phone to each floating fragment (LTR scene coordinates; mirrored for Arabic).
const WIRES = {
  rate: [[318, 384], [250, 388], [196, 344], [184, 252]],
  pay: [[588, 596], [684, 604], [764, 526], [758, 404]],
  tog: [[318, 470], [244, 470], [184, 506], [172, 574]],
};
const wirePath = ([a, b, c, d], rtl) => {
  const m = ([x, y]) => `${rtl ? 904 - x : x} ${y}`;
  return `M ${m(a)} C ${m(b)}, ${m(c)}, ${m(d)}`;
};

export default {
  duration: 8,

  copy: {
    en: {
      time: '9:41',
      hello: 'Good morning, Sara',
      title: 'Book a session',
      chips: ['Spa', 'Fitness', 'Barber'],
      services: [{ name: 'Spa ritual', mins: '60 min' }, { name: 'Personal training', mins: '45 min' }],
      rating: '4.9',
      day: 'Saturday 14',
      slots: ['10:00', '11:30', '13:00', '14:30', '16:00', '17:30'],
      book: 'Book now',
      done: 'You’re booked!',
      when: 'Sat 14 · 11:30',
      notif: 'Booking confirmed',
      now: 'now',
      reviews: '2,400 reviews',
      paid: 'Paid',
      paidSub: 'In one tap',
      remind: 'Remind me',
    },
    ar: {
      time: '9:41',
      hello: 'صباح الخير، سارة',
      title: 'احجز جلستك',
      chips: ['سبا', 'لياقة', 'حلاقة'],
      services: [{ name: 'جلسة سبا', mins: '60 دقيقة' }, { name: 'تدريب شخصي', mins: '45 دقيقة' }],
      rating: '4.9',
      day: 'السبت 14',
      slots: ['10:00', '11:30', '13:00', '14:30', '16:00', '17:30'],
      book: 'احجز الآن',
      done: 'تم الحجز!',
      when: 'السبت 14 · 11:30',
      notif: 'تم تأكيد حجزك',
      now: 'الآن',
      reviews: '2,400 تقييم',
      paid: 'تم الدفع',
      paidSub: 'بلمسة واحدة',
      remind: 'ذكّرني',
    },
  },

  css: (ctx) => {
    const r = ctx.rtl;
    const s = r ? -1 : 1;
    return `
.ap{position:absolute;inset:0}
.ap-halo{position:absolute;left:132px;top:40px;width:640px;height:640px;border-radius:50%;
  background:radial-gradient(circle,rgba(90,180,217,.40) 0%,rgba(66,150,209,.16) 40%,rgba(66,150,209,0) 68%)}
.ap-net{position:absolute;inset:0;filter:url(#apgoo)}
.ap-net i{position:absolute;border-radius:50%;background:var(--brand)}
.ap-wires{position:absolute;inset:0;overflow:visible}
.ap-wires path{fill:none;stroke:var(--sky);stroke-width:3;stroke-dasharray:2 12;stroke-linecap:round;opacity:.6}
.ap-pulse{position:absolute;left:0;top:0;width:20px;height:20px;margin:-10px 0 0 -10px;border-radius:50%;background:var(--sparkg);box-shadow:0 0 22px 4px rgba(242,141,25,.75);opacity:0}
.ap .spark{inset-inline-start:var(--x);top:var(--y);transform:rotate(var(--r)) scale(var(--k,1))}

/* phone */
.ap-wrap{position:absolute;left:287px;top:30px;width:330px;height:680px;perspective:1800px}
.ap-tilt{width:330px;height:680px;transform-style:preserve-3d;transform:rotateY(${-11 * s}deg) rotateX(4deg)}
.ap .phone{position:relative;transform-style:preserve-3d;
  box-shadow:0 60px 100px rgba(2,6,14,.65),0 0 0 3px #1F3456,0 0 0 4px rgba(147,169,198,.22),inset 0 0 0 2px rgba(255,255,255,.07)}
.ap .screen{background:var(--card)}
.ap .island{z-index:9}
.ap-sb{position:absolute;top:15px;inset-inline:28px;height:30px;display:flex;align-items:center;justify-content:space-between;z-index:8;color:#fff;font:700 20px 'Plus Jakarta Sans',sans-serif}
.ap-sb .ic{display:flex;gap:5px}

/* home */
.ap-home{position:absolute;inset:0;z-index:1}
.ap-home::after{content:'';position:absolute;inset-inline:0;bottom:0;height:120px;background:linear-gradient(rgba(19,35,61,0),var(--card) 62%)}
.ap-hd{position:absolute;top:58px;inset-inline:22px;height:84px}
.ap-hd small{display:block;height:46px;line-height:46px;font-size:20px;font-weight:500;color:var(--ui-sub)}
.ap-hd b{display:block;font-size:${r ? 26 : 28}px;line-height:36px;font-weight:800;white-space:nowrap}
.ap-av{position:absolute;top:0;inset-inline-end:0;width:46px;height:46px;border-radius:50%;background:var(--brand);color:#fff;display:grid;place-items:center;box-shadow:0 0 0 3px var(--card),0 0 0 5px rgba(90,180,217,.5)}
.ap-chips{position:absolute;top:152px;inset-inline-start:22px;inset-inline-end:0;height:46px;display:flex;gap:8px;overflow:hidden;
  -webkit-mask-image:linear-gradient(to ${r ? 'left' : 'right'},#000 78%,transparent)}
.ap-chip{display:inline-flex;align-items:center;gap:7px;height:46px;padding-inline:16px;border-radius:999px;background:var(--soft);font-size:20px;font-weight:700;white-space:nowrap;flex:none}
.ap-chip.on{background:var(--sparkg);color:#0E1A2B}
.ap-svc{position:absolute;inset-inline:22px;height:236px;border-radius:26px;background:var(--soft);padding:10px}
.ap-svc.c1{top:212px}
.ap-svc.c2{top:462px}
.ap-svc .ap-art{height:136px;border-radius:18px}
.ap-svc .gly{transform:scale(.64)}
.ap-svc b{display:block;margin:12px 6px 0;font-size:${r ? 22 : 23}px;line-height:30px;font-weight:800;white-space:nowrap}
.ap-meta{display:flex;align-items:center;gap:6px;margin:4px 6px 0;height:26px;font-size:20px;font-weight:500;color:var(--ui-sub)}
.ap-meta .st{color:var(--amber);fill:var(--amber)}
.ap-meta .dot{width:5px;height:5px;border-radius:50%;background:var(--ui-sub);margin-inline:4px}
.ap-tabs{position:absolute;bottom:24px;inset-inline:22px;height:66px;border-radius:24px;background:rgba(6,12,22,.82);border:2px solid rgba(147,169,198,.16);
  display:flex;align-items:center;justify-content:space-around;color:var(--ui-sub);box-shadow:0 16px 30px rgba(0,0,0,.35);z-index:2}
.ap-tabs .on{color:var(--spark);position:relative}
.ap-tabs .on::after{content:'';position:absolute;left:50%;bottom:-11px;width:6px;height:6px;margin-left:-3px;border-radius:50%;background:var(--spark)}

/* art placeholders: brand gradients, soft orbs, a spark petal and a glyph */
.ap-art{position:relative;overflow:hidden;background:linear-gradient(135deg,#2C5C9E 0%,#4296D1 55%,#5AB4D9 100%)}
.ap-art i{position:absolute;border-radius:50%;background:rgba(255,255,255,.16)}
.ap-art .o1{width:62%;aspect-ratio:1;inset-inline-start:-18%;top:-40%}
.ap-art .o2{width:44%;aspect-ratio:1;inset-inline-end:-10%;bottom:-38%;background:rgba(11,22,40,.18)}
.ap-art .o3{width:16%;aspect-ratio:1;inset-inline-end:18%;top:30%;background:rgba(255,255,255,.28)}
.ap-art .pt{position:absolute;width:9%;aspect-ratio:22/34;inset-inline-start:18%;bottom:16%;border-radius:50% 50% 50% 50%/62% 62% 38% 38%;background:var(--sparkg);transform:rotate(${-30 * s}deg)}
.ap-art .gly{position:absolute;left:50%;top:50%;width:88px;height:88px;margin:-44px 0 0 -44px;color:#fff;display:grid;place-items:center;filter:drop-shadow(0 8px 16px rgba(11,22,40,.35))}
.ap-art.warm{background:linear-gradient(135deg,#EC6C1C 0%,#F28D19 50%,#F4B310 100%)}
.ap-art.warm .gly{color:#0E1A2B;filter:none}
.ap-art.warm .pt{background:#fff;opacity:.6}

/* detail */
.ap-det{position:absolute;inset:0;z-index:3}
.ap-hero{position:absolute;left:0;top:0;width:302px;height:262px}
.ap-hbtn{position:absolute;top:56px;width:46px;height:46px;border-radius:50%;background:rgba(11,22,40,.38);color:#fff;display:grid;place-items:center;border:2px solid rgba(255,255,255,.22)}
.ap-hbtn.bk{inset-inline-start:18px}
.ap-hbtn.fv{inset-inline-end:18px}
.ap-hbtn.fv svg{fill:#fff}
.ap-sheet{position:absolute;top:236px;inset-inline:0;bottom:0;background:var(--card);border-radius:30px 30px 0 0;box-shadow:0 -14px 30px rgba(6,12,22,.35)}
.ap-sheet::before{content:'';position:absolute;top:10px;left:50%;width:40px;height:5px;margin-left:-20px;border-radius:3px;background:rgba(147,169,198,.35)}
.ap-ttl{position:absolute;top:26px;inset-inline:22px;height:40px;display:flex;align-items:center;justify-content:space-between}
.ap-ttl b{font-size:${r ? 26 : 28}px;font-weight:800;white-space:nowrap}
.ap-pill{display:inline-flex;align-items:center;gap:6px;height:36px;padding-inline:12px;border-radius:999px;background:var(--soft);font-size:20px;font-weight:600;color:var(--ui-sub);white-space:nowrap}
.ap-rate{position:absolute;top:76px;inset-inline:22px;height:28px;display:flex;align-items:center;gap:10px;font-size:20px;font-weight:700}
.ap-stars{display:inline-flex;gap:3px;color:var(--amber)}
.ap-stars svg{fill:var(--amber)}
.ap-day{position:absolute;top:120px;inset-inline:22px;height:28px;display:flex;align-items:center;gap:8px;font-size:20px;font-weight:600;color:var(--ui-sub)}
.ap-slots{position:absolute;top:158px;inset-inline:22px;display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.ap-slot{position:relative;height:50px;border-radius:16px;background:var(--soft);display:grid;place-items:center;font:700 21px 'Plus Jakarta Sans',sans-serif;direction:ltr}
.ap-slot span{position:relative}
.ap-slot.off{color:rgba(147,169,198,.45);background:rgba(26,45,76,.45);text-decoration:line-through;text-decoration-thickness:2px}
.ap-slot .fill{position:absolute;inset:0;border-radius:16px;background:var(--brand);box-shadow:0 10px 22px rgba(66,150,209,.45),inset 0 0 0 2px rgba(255,255,255,.25)}
.ap-book{position:absolute;bottom:28px;inset-inline:22px;height:64px;border-radius:22px;background:var(--sparkg);color:#0E1A2B;
  display:flex;align-items:center;justify-content:center;gap:10px;font-size:${r ? 22 : 23}px;font-weight:800;box-shadow:0 14px 30px rgba(236,108,28,.38)}
.ap-book .clip{position:absolute;inset:0;border-radius:22px;overflow:hidden}
.ap-book .rip{position:absolute;left:50%;top:50%;width:300px;height:300px;margin:-150px 0 0 -150px;border-radius:50%;background:#fff;opacity:0}
.ap-book .bt,.ap-book svg{position:relative}

/* the card photo that grows into the hero */
.ap-morph{position:absolute;left:0;top:0;width:302px;height:262px;z-index:2;opacity:0}

/* success */
.ap-ok{position:absolute;inset:0;z-index:4;clip-path:circle(140% at 50% 92%);border-radius:46px;box-shadow:0 -24px 48px rgba(2,6,14,.5);
  background:radial-gradient(120% 70% at 50% 36%,#5AB4D9 0%,#4296D1 34%,#376BB1 68%,#22457E 100%)}
.ap-ring{position:absolute;left:${CX}px;top:${CY}px;border-radius:50%;border:2px solid rgba(255,255,255,.3)}
.ap-ring.r1{width:170px;height:170px;margin:-85px 0 0 -85px;background:rgba(255,255,255,.08)}
.ap-ring.r2{width:236px;height:236px;margin:-118px 0 0 -118px;border-color:rgba(255,255,255,.18)}
.ap-ring.r3{width:300px;height:300px;margin:-150px 0 0 -150px;border-color:rgba(255,255,255,.1)}
.ap-wave{position:absolute;left:${CX - 60}px;top:${CY - 60}px;width:120px;height:120px;border-radius:50%;border:5px solid #fff;opacity:0}
.ap-ck{position:absolute;left:${CX - 58}px;top:${CY - 58}px;width:116px;height:116px;border-radius:50%;background:#fff;display:grid;place-items:center;box-shadow:0 18px 40px rgba(11,22,40,.35)}
.ap-ck svg{width:64px;height:64px;overflow:visible}
.ap-pet{position:absolute;width:18px;height:28px;margin:-14px 0 0 -9px;border-radius:50% 50% 50% 50%/62% 62% 38% 38%;background:var(--sparkg)}
.ap-okt{position:absolute;top:398px;inset-inline:0;text-align:center;color:#fff;font-size:${r ? 28 : 30}px;font-weight:800;line-height:40px}
.ap-oks{position:absolute;top:442px;inset-inline:0;text-align:center;color:rgba(255,255,255,.88);font-size:22px;font-weight:600;line-height:30px}
.ap-ticket{position:absolute;top:500px;inset-inline:22px;height:86px;border-radius:22px;background:rgba(255,255,255,.14);border:2px solid rgba(255,255,255,.26);
  display:flex;align-items:center;gap:14px;padding-inline:12px;color:#fff;box-shadow:0 16px 30px rgba(11,22,40,.25)}
.ap-ticket .ap-art{width:60px;height:60px;border-radius:16px;flex:none}
.ap-ticket .gly{transform:scale(.4)}
.ap-ticket b{display:block;font-size:22px;font-weight:800;line-height:28px}
.ap-ticket small{display:block;font-size:20px;font-weight:500;line-height:26px;opacity:.85}

.ap-glare{position:absolute;top:-30%;height:160%;left:0;width:110px;z-index:7;
  background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.22),rgba(255,255,255,0));transform:translateX(${r ? 480 : -200}px) rotate(18deg)}
.ap-hi{position:absolute;bottom:9px;left:50%;width:118px;height:5px;margin-left:-59px;border-radius:3px;background:rgba(255,255,255,.55);z-index:8}
.ap-sheen{position:absolute;inset:0;z-index:7;border-radius:46px;background:linear-gradient(${r ? 225 : 135}deg,rgba(255,255,255,.10) 0%,rgba(255,255,255,0) 32%)}

/* tap indicator */
.ap-tap{position:absolute;left:50%;top:50%;width:58px;height:58px;margin:-29px 0 0 -29px;border-radius:50%;z-index:6;opacity:0;
  background:rgba(255,255,255,.3);border:3px solid rgba(255,255,255,.9);box-shadow:0 6px 18px rgba(0,0,0,.3)}
.ap-tap i{position:absolute;inset:-3px;border-radius:50%;border:3px solid #fff;opacity:0}
.ap-svc .ap-tap{top:78px}

/* notification that pops out of the screen */
.ap-notif{position:absolute;top:72px;left:-12px;width:354px;height:90px;z-index:10;border-radius:26px;transform-origin:50% 0;
  background:rgba(255,255,255,.96);color:#0E1A2B;display:flex;align-items:center;gap:14px;padding-inline:16px;
  box-shadow:0 26px 50px rgba(2,6,14,.45),0 0 0 1px rgba(255,255,255,.6);transform:translateZ(50px)}
.ap-ni{width:54px;height:54px;border-radius:16px;background:var(--sparkg);color:#0E1A2B;display:grid;place-items:center;flex:none}
.ap-nt{flex:1;min-width:0}
.ap-nt .row{display:flex;align-items:baseline;justify-content:space-between;gap:8px}
.ap-nt b{font-size:${r ? 21 : 22}px;font-weight:800;line-height:30px;white-space:nowrap}
.ap-nt .nw2{font-size:20px;font-weight:500;color:#4A6080;white-space:nowrap}
.ap-nt .bd{display:block;font-size:20px;font-weight:600;line-height:28px;color:#3E5470}

/* success burst: a warm flare and shock rings behind the phone, petals flying out in front */
.ap-flare{position:absolute;left:${BX - 300}px;top:${BY - 300}px;width:600px;height:600px;border-radius:50%;opacity:0;
  background:radial-gradient(circle,rgba(244,179,16,.5) 0%,rgba(242,141,25,.22) 34%,rgba(242,141,25,0) 64%)}
.ap-shock{position:absolute;left:${BX - 200}px;top:${BY - 200}px;width:400px;height:400px;border-radius:50%;opacity:0;border:4px solid var(--sky);box-shadow:0 0 34px rgba(90,180,217,.55),inset 0 0 34px rgba(90,180,217,.3)}
.ap-shock.k2{border-color:var(--spark);box-shadow:0 0 30px rgba(242,141,25,.4)}
.ap-burst{position:absolute;left:${BX}px;top:${BY}px;width:0;height:0;z-index:2}
.ap-bp{position:absolute;left:-11px;top:-17px;width:22px;height:34px;border-radius:50% 50% 50% 50%/62% 62% 38% 38%;background:var(--sparkg);opacity:0;box-shadow:0 0 16px rgba(242,141,25,.55)}
.ap-bp.b{left:-9px;top:-9px;width:18px;height:18px;border-radius:50%;background:var(--brand);box-shadow:0 0 16px rgba(90,180,217,.6)}

/* floating fragments */
.ap-frag{position:absolute;z-index:3}
.ap-frag .fc{display:flex;align-items:center;gap:14px;padding:16px 20px;border-radius:26px;
  background:linear-gradient(160deg,rgba(255,255,255,.07),rgba(255,255,255,0) 55%),var(--card)}
.ap-frag .ib{width:52px;height:52px;border-radius:16px;display:grid;place-items:center;flex:none;background:var(--brand);color:#fff}
.ap-frag b{display:block;font-size:${r ? 24 : 25}px;font-weight:800;line-height:32px;white-space:nowrap}
.ap-frag small{display:block;font-size:20px;font-weight:500;line-height:28px;color:var(--ui-sub);white-space:nowrap}
.f-rate{inset-inline-start:14px;top:176px}
.f-rate .fc{transform:perspective(900px) rotateY(${14 * s}deg) rotate(${-3 * s}deg);outline:0 solid rgba(90,180,217,.4)}
.f-rate .big{font-size:48px;line-height:52px;font-weight:800;letter-spacing:-.02em;direction:ltr}
.f-rate .ap-stars{margin-bottom:2px}
.f-pay{inset-inline-end:12px;top:330px}
.f-pay .fc{transform:perspective(900px) rotateY(${-14 * s}deg) rotate(${3 * s}deg);outline:0 solid rgba(34,197,94,.4)}
.f-pay .okb{width:36px;height:36px;border-radius:50%;background:#22C55E;color:#fff;display:grid;place-items:center;flex:none;margin-inline-start:4px}
.f-tog{inset-inline-start:6px;top:552px}
.f-tog .fc{gap:12px;transform:perspective(900px) rotateY(${14 * s}deg) rotate(${2 * s}deg);outline:0 solid rgba(242,141,25,.4)}
.f-tog .ib{width:46px;height:46px;border-radius:14px;background:var(--sparkg);color:#0E1A2B}
.f-tog b{font-size:${r ? 23 : 22}px}
.ap-tg{position:relative;width:60px;height:36px;border-radius:999px;background:#4296D1;flex:none;margin-inline-start:4px}
.ap-tg i{position:absolute;top:4px;inset-inline-start:28px;width:28px;height:28px;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.3)}
`;
  },

  html: ({ copy, rtl }) => {
    const s = rtl ? -1 : 1;
    const stars = (size) => `<span class="ap-stars">${Array.from({ length: 5 }, () => ico('star', { size, stroke: 1.5 })).join('')}</span>`;
    const art = (cls, glyph) => `<div class="ap-art ${cls}"><i class="o1"></i><i class="o2"></i><i class="o3"></i><span class="pt"></span><span class="gly">${ico(glyph, { size: 88, stroke: 1.6 })}</span></div>`;
    const tap = '<div class="ap-tap"><i></i></div>';
    const svc = (i, glyph, warm) => `<div class="ap-svc c${i + 1}">${art(warm ? 'warm' : '', glyph)}<b>${copy.services[i].name}</b>
      <div class="ap-meta">${ico('clock', { size: 18 })}<span>${copy.services[i].mins}</span><span class="dot"></span>${ico('star', { size: 18, cls: 'st' })}<span>${copy.rating}</span></div>${i ? '' : tap}</div>`;
    const blobs = [
      [548, 6, 150], [664, 92, 96], [606, 152, 70], [726, 36, 58],
      [158, 588, 132], [110, 520, 70], [262, 642, 66],
      [690, 568, 112], [786, 636, 66], [626, 650, 58],
      [44, 36, 76], [116, 92, 44],
    ];
    const sparks = [[90, 112, 28, 1], [850, 248, 80, 1], [38, 452, -140, 0.9], [832, 556, 150, 0.85], [236, 26, -40, 0.7], [600, 688, 40, 0.75]];
    const pets = PETALS.map(([a, rad]) => {
      const dx = Math.cos((a * Math.PI) / 180) * rad;
      const dy = Math.sin((a * Math.PI) / 180) * rad;
      return `<span class="ap-pet" data-dx="${(-dx).toFixed(1)}" data-dy="${(-dy).toFixed(1)}" style="left:${(CX + dx).toFixed(1)}px;top:${(CY + dy).toFixed(1)}px;transform:rotate(${a + 90}deg)"></span>`;
    }).join('');
    return `${GOO}
<div class="ap">
  <div class="ap-halo"></div>
  <div class="ap-net">${blobs.map(([x, y, d]) => `<i style="inset-inline-start:${x}px;top:${y}px;width:${d}px;height:${d}px"></i>`).join('')}</div>
  <svg class="ap-wires" viewBox="0 0 904 740">${Object.entries(WIRES).map(([k, w]) => `<path id="apw-${k}" d="${wirePath(w, rtl)}"/>`).join('')}</svg>
  <div class="ap-pulse p-rate"></div><div class="ap-pulse p-pay"></div><div class="ap-pulse p-tog"></div>
  ${sparks.map(([x, y, rot, k]) => `<div class="spark" style="--x:${x}px;--y:${y}px;--r:${rot * s}deg;--k:${k}"></div>`).join('')}
  <div class="ap-flare"></div><div class="ap-shock k1"></div><div class="ap-shock k2"></div>
  <div class="ap-wrap"><div class="ap-tilt"><div class="phone"><div class="screen">
    <div class="ap-sb"><span>${copy.time}</span><span class="ic">${ico('signal', { size: 18, stroke: 2.6 })}${ico('wifi', { size: 18, stroke: 2.6 })}${ico('battery-full', { size: 22, stroke: 2.2 })}</span></div>
    <div class="island"></div>
    <div class="ap-home">
      <div class="ap-hd hx"><small>${copy.hello}</small><b>${copy.title}</b><span class="ap-av">${ico('user-round', { size: 24 })}</span></div>
      <div class="ap-chips">${copy.chips.map((c, i) => `<span class="ap-chip hx ${i ? '' : 'on'}">${ico(['flower-2', 'dumbbell', 'scissors'][i], { size: 20, stroke: 2.2 })}${c}</span>`).join('')}</div>
      ${svc(0, 'flower-2')}
      ${svc(1, 'dumbbell', true)}
      <div class="ap-tabs hx"><span class="on">${ico('house', { size: 26 })}</span>${ico('calendar-days', { size: 26 })}${ico('heart', { size: 26 })}${ico('user', { size: 26 })}</div>
    </div>
    <div class="ap-det">
      ${art('ap-hero', 'flower-2')}
      <span class="ap-hbtn bk">${ico(rtl ? 'chevron-right' : 'chevron-left', { size: 26, stroke: 2.6 })}</span>
      <span class="ap-hbtn fv">${ico('heart', { size: 22, stroke: 2.2 })}</span>
      <div class="ap-sheet">
        <div class="ap-ttl dx"><b>${copy.services[0].name}</b><span class="ap-pill">${ico('clock', { size: 18 })}${copy.services[0].mins}</span></div>
        <div class="ap-rate dx">${stars(20)}<span>${copy.rating}</span></div>
        <div class="ap-day dx">${ico('calendar', { size: 20 })}${copy.day}</div>
        <div class="ap-slots">${copy.slots.map((t, i) => `<span class="ap-slot ${i === 0 || i === 4 ? 'off' : ''} ${i === 1 ? 'pick' : ''}">${i === 1 ? '<i class="fill"></i>' : ''}<span>${t}</span>${i === 1 ? tap : ''}</span>`).join('')}</div>
        <div class="ap-book"><span class="clip"><span class="rip"></span></span><span class="bt">${copy.book}</span>${ico(rtl ? 'arrow-left' : 'arrow-right', { size: 24, stroke: 2.6 })}${tap}</div>
      </div>
    </div>
    ${art('ap-morph', 'flower-2')}
    <div class="ap-ok">
      <span class="ap-ring r3"></span><span class="ap-ring r2"></span><span class="ap-ring r1"></span>
      ${pets}
      <span class="ap-wave"></span>
      <div class="ap-ck"><svg viewBox="0 0 64 64"><path d="M17 33 L28 44 L48 22" fill="none" stroke="#376BB1" stroke-width="7.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      <div class="ap-okt">${copy.done}</div>
      <div class="ap-oks">${copy.when}</div>
      <div class="ap-ticket">${art('', 'flower-2')}<div><b>${copy.services[0].name}</b><small>${copy.services[0].mins}</small></div></div>
    </div>
    <div class="ap-glare"></div>
    <div class="ap-hi"></div>
    <div class="ap-sheen"></div>
  </div>
  <div class="ap-notif"><span class="ap-ni">${ico('calendar-check', { size: 28, stroke: 2.4 })}</span><div class="ap-nt"><div class="row"><b>${copy.notif}</b><span class="nw2">${copy.now}</span></div><span class="bd">${copy.when}</span></div></div>
  </div></div></div>
  <div class="ap-burst">${BURST.map(([a, d], i) => `<i class="ap-bp${i % 3 === 1 ? ' b' : ''}" data-a="${rtl ? 180 - a : a}" data-d="${d}"></i>`).join('')}</div>
  <div class="ap-frag f-rate"><div class="fc card"><span class="big">${copy.rating}</span><div>${stars(24)}<small>${copy.reviews}</small></div></div></div>
  <div class="ap-frag f-pay"><div class="fc card"><span class="ib">${ico('credit-card', { size: 28 })}</span><div><b>${copy.paid}</b><small>${copy.paidSub}</small></div><span class="okb">${ico('check', { size: 22, stroke: 3.4 })}</span></div></div>
  <div class="ap-frag f-tog"><div class="fc card"><span class="ib">${ico('bell-ring', { size: 24, stroke: 2.2 })}</span><b>${copy.remind}</b><span class="ap-tg"><i></i></span></div></div>
</div>`;
  },

  animate(tl, gsap, ctx) {
    const D = 8;
    const s = ctx.rtl ? -1 : 1;
    const amb = { duration: D / 2, ease: 'sine.inOut', repeat: 1, yoyo: true };
    // A spark travels a wire from the phone to a fragment (fades in behind the phone, out under the card).
    const pulse = (k, t) => {
      tl.fromTo(`.p-${k}`, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.15, ease: 'none' }, t);
      tl.fromTo(`.p-${k}`, { motionPath: { path: `#apw-${k}`, align: `#apw-${k}`, alignOrigin: [0.5, 0.5], start: 0, end: 0 } },
        { motionPath: { path: `#apw-${k}`, align: `#apw-${k}`, alignOrigin: [0.5, 0.5], start: 0, end: 1 }, duration: 0.5, ease: 'power1.inOut' }, t);
      tl.to(`.p-${k}`, { opacity: 0, scale: 1.8, duration: 0.2, ease: 'power2.out' }, t + 0.42);
    };
    // A soft ring flashes around a fragment card and fades back to nothing (outline, so the
    // card's own drop shadow is never tweened).
    const glow = (sel, t) => tl.fromTo(sel, { outlineWidth: 0 }, { outlineWidth: 7, duration: 0.3, yoyo: true, repeat: 1, ease: 'sine.inOut' }, t);
    // The Dynamic Island widens for a beat (notification in or out).
    const island = (t) => {
      tl.fromTo('.ap .island', { scaleX: 1, scaleY: 1 }, { scaleX: 1.4, scaleY: 1.12, duration: 0.24, yoyo: true, repeat: 1, ease: 'power2.inOut' }, t);
      tl.fromTo('.ap-sb', { opacity: 1 }, { opacity: 0, duration: 0.2, yoyo: true, repeat: 1, repeatDelay: 0.08, ease: 'power2.inOut' }, t);
    };

    // ---- Ambient loops (whole cycles, so the last frame matches the first) ----
    gsap.set('.ap-tilt', { rotationY: -11 * s, rotationX: 4 });
    gsap.set('.ap-notif', { z: 50 });
    tl.to('.ap-wrap', { y: -12, ...amb }, 0);
    tl.to('.ap-tilt', { rotationY: -5 * s, rotationX: 2, ...amb }, 0);
    tl.to('.ap-halo', { scale: 1.1, opacity: 0.8, ...amb }, 0);
    tl.to('.f-rate', { y: -14, x: 6 * s, ...amb }, 0);
    tl.to('.f-pay', { y: 12, x: -6 * s, ...amb }, 0);
    tl.to('.f-tog', { y: -10, ...amb }, 0);
    gsap.utils.toArray('.ap-net i').forEach((n, i) => {
      tl.to(n, { x: (i % 2 ? 16 : -12) * s, y: i % 3 ? -14 : 18, scale: 1 + (i % 3) * 0.07, ...amb }, 0);
    });
    tl.to('.ap-wires path', { strokeDashoffset: -56, duration: D, ease: 'none' }, 0);
    tl.to('.ap .spark', { rotation: '+=360', duration: D, ease: 'none' }, 0);
    tl.to('.ap .spark', { y: (i) => (i % 2 ? 14 : -14), ...amb }, 0);

    // A soft "heartbeat" ring leaves the check during both holds, so the finished screen feels
    // alive (it fades in from and out to nothing, so the seam stays invisible).
    const beat = (t, d) => {
      tl.fromTo('.ap-wave', { scale: 0.95 }, { scale: 2.3, duration: d, ease: 'power2.out' }, t);
      tl.fromTo('.ap-wave', { opacity: 0 }, { opacity: 0.5, duration: 0.18, ease: 'none' }, t);
      tl.to('.ap-wave', { opacity: 0, duration: d - 0.18, ease: 'power1.out' }, t + 0.18);
    };
    beat(0, 0.88);
    beat(7.1, 0.9);

    // ---- 0.9s: clear the finished booking ----
    // The banner retracts into the Dynamic Island...
    tl.to('.ap-notif', { y: -38, scale: 0.35, opacity: 0, duration: 0.5, ease: 'power3.in' }, 0.9);
    island(1.22);
    // ...the floating fragments reset...
    tl.to('.f-rate .ap-stars svg', { opacity: 0.22, scale: 0.8, duration: 0.3, stagger: 0.04, ease: 'power2.in' }, 1.0);
    tl.to('.f-pay .okb', { opacity: 0, scale: 0, duration: 0.3, ease: 'power2.in' }, 1.0);
    tl.to('.ap-tg i', { x: -24 * s, duration: 0.35, ease: 'power2.inOut' }, 1.05);
    tl.to('.ap-tg', { backgroundColor: '#3A5070', duration: 0.35 }, 1.05);
    // Underneath the success screen: park the home and detail views in their start states.
    tl.set(['.ap-home .hx', '.ap-svc', '.ap-hero', '.ap-hbtn', '.ap-sheet .dx', '.ap-slot', '.ap-book', '.ap-slot .fill'], { opacity: 0 }, 1.1);
    tl.set('.ap-sheet', { yPercent: 100 }, 1.1);
    tl.set('.ap-sheet .ap-stars svg', { scale: 0 }, 1.1);
    // ...and the success screen is dismissed like a modal card, the home screen zooming up behind it.
    tl.to('.ap-ok', { yPercent: 100, duration: 0.85, ease: 'power3.inOut' }, 1.15);
    tl.fromTo('.ap-home', { scale: 0.9 }, { scale: 1, duration: 1.1, ease: 'power3.out' }, 1.15);
    // Off-screen now: reset the success view so it can burst out of the button later.
    tl.set(['.ap-ck', '.ap-pet', '.ap-ring', '.ap-okt', '.ap-oks', '.ap-ticket'], { opacity: 0 }, 2.05);
    tl.set('.ap-ck path', { drawSVG: '0%' }, 2.05);
    tl.set('.ap-ok', { yPercent: 0, clipPath: 'circle(0% at 50% 92%)' }, 2.05);

    // ---- 1.3s: the home screen builds in ----
    tl.fromTo('.ap-hd', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6 }, 1.3);
    tl.fromTo('.ap-chip', { opacity: 0, x: 40 * s }, { opacity: 1, x: 0, duration: 0.55, stagger: 0.07 }, 1.4);
    tl.fromTo('.ap-svc', { opacity: 0, y: 46, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.12 }, 1.5);
    tl.fromTo('.ap-tabs', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, 1.72);

    // ---- 2.55s: tap the first service ----
    tl.fromTo('.c1 .ap-tap', { opacity: 0, scale: 1.5 }, { opacity: 1, scale: 1, duration: 0.28, ease: 'power2.out' }, 2.5);
    tl.to('.c1 .ap-tap', { scale: 0.8, duration: 0.12, ease: 'power2.in' }, 2.76);
    tl.fromTo('.c1', { scale: 1 }, { scale: 0.97, duration: 0.13, yoyo: true, repeat: 1, ease: 'power2.inOut' }, 2.76);
    tl.fromTo('.c1 .ap-tap i', { opacity: 0.9, scale: 0.6 }, { opacity: 0, scale: 2.8, duration: 0.6, ease: 'power2.out' }, 2.84);
    tl.to('.c1 .ap-tap', { opacity: 0, scale: 1, duration: 0.25 }, 2.96);

    // ---- 3.0s: the photo grows into the detail page (shared-element transition) ----
    tl.set('.ap-morph', { opacity: 1 }, 3.0);
    tl.fromTo('.ap-morph', { left: 32, top: 222, width: 238, height: 136, borderRadius: 18 },
      { left: 0, top: 0, width: 302, height: 262, borderRadius: 0, duration: 0.62, ease: 'power3.inOut' }, 3.0);
    tl.fromTo('.ap-morph .gly', { scale: 0.64 }, { scale: 1, duration: 0.62, ease: 'power3.inOut' }, 3.0);
    tl.to(['.ap-home .hx', '.ap-svc'], { opacity: 0, duration: 0.28, ease: 'power2.out' }, 3.02);
    // The sheet follows the photo up, so the screen never sits empty.
    tl.fromTo('.ap-sheet', { yPercent: 100 }, { yPercent: 0, duration: 0.68, ease: 'power3.out' }, 3.16);
    tl.set('.ap-hero', { opacity: 1 }, 3.62);
    tl.set('.ap-morph', { opacity: 0 }, 3.63);
    tl.fromTo('.ap-hbtn', { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.45, stagger: 0.08, ease: 'back.out(2)' }, 3.45);
    tl.fromTo('.ap-sheet .dx', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.07 }, 3.34);
    tl.fromTo('.ap-sheet .ap-stars svg', { scale: 0 }, { scale: 1, duration: 0.35, stagger: 0.06, ease: 'back.out(3)' }, 3.48);
    tl.fromTo('.ap-slot', { opacity: 0, y: 14, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.045, ease: 'back.out(1.8)' }, 3.54);
    tl.fromTo('.ap-book', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.55 }, 3.76);
    // A spark runs down the wire and the floating rating card fills its stars.
    pulse('rate', 3.5);
    tl.fromTo('.f-rate .ap-stars svg', { opacity: 0.22, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.07, ease: 'back.out(3)' }, 3.92);
    glow('.f-rate .fc', 3.92);

    // ---- 4.25s: pick 11:30 ----
    tl.fromTo('.pick .ap-tap', { opacity: 0, scale: 1.5 }, { opacity: 1, scale: 1, duration: 0.26, ease: 'power2.out' }, 4.25);
    tl.to('.pick .ap-tap', { scale: 0.8, duration: 0.12, ease: 'power2.in' }, 4.49);
    tl.fromTo('.pick', { scale: 1 }, { scale: 0.92, duration: 0.12, yoyo: true, repeat: 1, ease: 'power2.inOut' }, 4.49);
    tl.fromTo('.pick .ap-tap i', { opacity: 0.9, scale: 0.6 }, { opacity: 0, scale: 2.6, duration: 0.55, ease: 'power2.out' }, 4.55);
    tl.fromTo('.pick .fill', { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.7)' }, 4.55);
    tl.to('.pick .ap-tap', { opacity: 0, scale: 1, duration: 0.22 }, 4.71);

    // ---- 4.85s: press "Book" ----
    tl.fromTo('.ap-book .ap-tap', { opacity: 0, scale: 1.5 }, { opacity: 1, scale: 1, duration: 0.26, ease: 'power2.out' }, 4.85);
    tl.to('.ap-book .ap-tap', { scale: 0.8, duration: 0.12, ease: 'power2.in' }, 5.09);
    tl.fromTo('.ap-book', { scale: 1 }, { scale: 0.94, duration: 0.14, yoyo: true, repeat: 1, ease: 'power2.inOut' }, 5.09);
    tl.fromTo('.ap-book .rip', { opacity: 0.55, scale: 0 }, { opacity: 0, scale: 1, duration: 0.6, ease: 'power2.out' }, 5.15);
    tl.to('.ap-book .ap-tap', { opacity: 0, scale: 1, duration: 0.2 }, 5.29);
    // Payment goes through on the floating card.
    pulse('pay', 5.13);
    tl.fromTo('.f-pay .okb', { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2.2)' }, 5.55);
    glow('.f-pay .fc', 5.55);

    // ---- 5.35s: success bursts out of the button and out of the phone ----
    tl.fromTo('.ap-ok', { clipPath: 'circle(0% at 50% 92%)' }, { clipPath: 'circle(140% at 50% 92%)', duration: 0.8, ease: 'power3.out' }, 5.35);
    tl.fromTo('.ap-ring', { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.9, stagger: -0.08, ease: 'power3.out' }, 5.58);
    tl.fromTo('.ap-ck', { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.8)' }, 5.54);
    tl.fromTo('.ap-ck path', { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.45, ease: 'power2.out' }, 5.8);
    tl.fromTo('.ap-wave', { opacity: 0.85, scale: 0.9 }, { opacity: 0, scale: 2.6, duration: 0.9, ease: 'power2.out' }, 5.66);
    tl.fromTo('.ap-pet', { opacity: 0, scale: 0.2, x: (i, el) => +el.dataset.dx, y: (i, el) => +el.dataset.dy },
      { opacity: 1, scale: 1, x: 0, y: 0, duration: 0.8, stagger: 0.02, ease: 'power3.out' }, 5.72);
    tl.fromTo(['.ap-okt', '.ap-oks', '.ap-ticket'], { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.09 }, 5.88);
    tl.fromTo('.ap-glare', { x: ctx.rtl ? 480 : -200, rotation: 18 }, { x: ctx.rtl ? -200 : 480, rotation: 18, duration: 0.9, ease: 'power2.inOut' }, 5.9);
    // Behind the phone: a warm flare and two shock rings; in front: petals and nodes fly out.
    tl.fromTo('.ap-flare', { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }, 5.58);
    tl.to('.ap-flare', { opacity: 0, duration: 1.1, ease: 'sine.inOut' }, 6.1);
    tl.fromTo('.ap-shock', { opacity: 1, scale: 0.7 }, { opacity: 0, scale: 1.62, duration: 1.2, stagger: 0.18, ease: 'power2.out' }, 5.62);
    gsap.utils.toArray('.ap-bp').forEach((p, i) => {
      const a = (+p.dataset.a * Math.PI) / 180;
      const d = +p.dataset.d;
      const t = 5.7 + (i % 4) * 0.03;
      const r0 = +p.dataset.a + 90;
      // Start just outside the check, grow as they come "towards" the viewer.
      tl.fromTo(p, { x: Math.cos(a) * 72, y: Math.sin(a) * 72, scale: 0.5, rotation: r0 },
        { x: Math.cos(a) * d, y: Math.sin(a) * d, scale: 1.35, rotation: r0 + (i % 2 ? 150 : -150) * s, duration: 1.2, ease: 'power3.out' }, t);
      tl.fromTo(p, { opacity: 0 }, { opacity: 1, duration: 0.14, ease: 'none' }, t);
      tl.to(p, { opacity: 0, duration: 0.45, ease: 'power1.in' }, t + 0.72);
    });
    // Restore the hidden home view while it is covered (keeps the end state equal to frame 0).
    tl.set(['.ap-home .hx', '.ap-svc'], { opacity: 1 }, 6.3);

    // ---- 6.25s: the confirmation banner drops out of the Dynamic Island; reminder switches on ----
    island(6.25);
    tl.fromTo('.ap-notif', { y: -38, scale: 0.35 }, { y: 0, scale: 1, duration: 0.75, ease: 'back.out(1.5)' }, 6.4);
    tl.fromTo('.ap-notif', { opacity: 0 }, { opacity: 1, duration: 0.22, ease: 'none' }, 6.4);
    tl.fromTo('.ap-ni svg', { rotation: 0 }, { rotation: 14, duration: 0.09, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 6.8);
    pulse('tog', 6.35);
    tl.fromTo('.ap-tg i', { x: -24 * s }, { x: 0, duration: 0.45, ease: 'back.out(1.6)' }, 6.78);
    tl.fromTo('.ap-tg', { backgroundColor: '#3A5070' }, { backgroundColor: '#4296D1', duration: 0.4 }, 6.78);
    glow('.f-tog .fc', 6.78);
    tl.fromTo('.f-tog .ib svg', { rotation: 0 }, { rotation: -16, duration: 0.09, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 6.85);
  },
};

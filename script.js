/* ── LOADER ── */
const introStr = "TRADISCOUT";
const typewriter = document.getElementById('typewriter');
let charPos = 0;

function runTypewriter() {
    if (charPos < introStr.length) {
        typewriter.innerText += introStr.charAt(charPos++);
        setTimeout(runTypewriter, 120);
    } else {
        setTimeout(() => {
            typewriter.classList.add('zoom-in-out');
            setTimeout(() => {
                document.getElementById('loader').style.opacity = '0';
                document.getElementById('main-content').style.opacity = '1';
                setTimeout(() => { document.getElementById('loader').style.display = 'none'; }, 800);
            }, 800);
        }, 500);
    }
}
window.addEventListener('load', () => setTimeout(runTypewriter, 300));

/* ── NAVIGATION ── */
function show(id) {
    document.querySelectorAll('.tab').forEach(t => t.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    
    document.querySelectorAll('.main-nav a, .tab-bar-btn').forEach(el => el.classList.remove('active'));
    if (document.getElementById('nav-' + id)) document.getElementById('nav-' + id).classList.add('active');
    if (document.getElementById('tb-' + id)) document.getElementById('tb-' + id).classList.add('active');
    
    window.scrollTo(0, 0);
}

function showCodeTab(id, btn) {
    document.querySelectorAll('.code-tab').forEach(t => t.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    document.querySelectorAll('.code-nav button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

/* ── CODES ── */
const morseMap = {'A':'.-','B':'-...','C':'-.-.','D':'-..','E':'.','F':'..-.','G':'--.','H':'....','I':'..','J':'.---','K':'-.-','L':'.-..','M':'--','N':'-.','O':'---','P':'.--.','Q':'--.-','R':'.-.','S':'...','T':'-','U':'..-','V':'...-','W':'.--','X':'-..-','Y':'-.--','Z':'--..','0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.'};
const invMorse = Object.fromEntries(Object.entries(morseMap).map(([k,v]) => [v,k]));

const morseIn = document.getElementById('morse-input');
const morseOut = document.getElementById('morse-output');
if (morseIn) {
    morseIn.addEventListener('input', () => {
        const v = morseIn.value.toUpperCase();
        if (/^[.\-\/\s]+$/.test(v)) {
            morseOut.value = v.split('/').map(w => w.trim().split(' ').map(s => invMorse[s] || '').join('')).join(' ');
        } else {
            morseOut.value = v.split('').map(c => morseMap[c] || (c === ' ' ? '/' : '')).join(' ');
        }
    });
}

function caesar(s, k) {
    return s.replace(/[a-z]/ig, c => {
        const b = c < 'a' ? 65 : 97;
        return String.fromCharCode(((c.charCodeAt(0) - b + k + 26) % 26) + b);
    });
}
const caesarIn = document.getElementById('caesar-input');
const shiftIn = document.getElementById('shift');
if (caesarIn) {
    const upd = () => document.getElementById('caesar-output').value = caesar(caesarIn.value, parseInt(shiftIn.value||0));
    caesarIn.addEventListener('input', upd);
    shiftIn.addEventListener('input', upd);
}

/* ── SÉMAPHORE (CODE ORIGINAL PRÉSERVÉ) ── */
const semaphoreAlpha = {
    'A':[135,90],'B':[180,90],'C':[225,90],'D':[270,90],'E':[90,315],'F':[90,0],'G':[90,45],'H':[180,135],
    'I':[225,135],'J':[270,0],'K':[135,270],'L':[135,315],'M':[135,0],'N':[135,45],'O':[180,225],'P':[180,270],
    'Q':[180,315],'R':[180,0],'S':[180,45],'T':[225,270],'U':[225,315],'V':[270,45],'W':[315,0],'X':[315,45],
    'Y':[225,0],'Z':[0,45]
};
const semaMap = {};
Object.entries(semaphoreAlpha).forEach(([l,[left,right]]) => {
    semaMap[`${left}-${right}`] = l;
    semaMap[`${right}-${left}`] = l;
});
const canvas = document.getElementById('semaphore-canvas');
const letterBox = document.getElementById('semaphore-letter');
let arms = { left: 135, right: 90 }, targets = { ...arms }, lastTime = 0;

function drawSema(ctx, w, h, lA, rA) {
    const cx = w/2, cy = h/2+10;
    ctx.clearRect(0,0,w,h);
    ctx.strokeStyle = '#2C3776'; ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(cx,cy-25); ctx.lineTo(cx,cy+35); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx,cy-35,10,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx,cy+35); ctx.lineTo(cx-15,cy+60); ctx.moveTo(cx,cy+35); ctx.lineTo(cx+15,cy+60); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx-18,cy-10); ctx.lineTo(cx+18,cy-10); ctx.stroke();
    function drawArm(ang, isL) {
        const rad = ang*Math.PI/180;
        const sx = isL ? cx-18 : cx+18, sy = cy-10;
        const hx = sx+Math.cos(rad)*70, hy = sy+Math.sin(rad)*70;
        ctx.beginPath(); ctx.moveTo(sx,sy); ctx.lineTo(hx,hy); ctx.stroke();
        ctx.save(); ctx.translate(hx,hy); ctx.rotate(rad);
        ctx.fillStyle = '#ffdf40'; ctx.beginPath(); ctx.moveTo(-20,isL?-22:0); ctx.lineTo(2,isL?-22:0); ctx.lineTo(-20,isL?0:22); ctx.fill();
        ctx.fillStyle = '#c00000'; ctx.beginPath(); ctx.moveTo(2,isL?-22:0); ctx.lineTo(2,isL?0:22); ctx.lineTo(-20,isL?0:22); ctx.fill();
        ctx.restore();
    }
    drawArm(lA, true); drawArm(rA, false);
    const snap = a => (Math.round(a/45)*45+360)%360;
    letterBox.innerText = semaMap[`${snap(lA)}-${snap(rA)}`] || '?';
}

function loop(t) {
    if (!canvas) return;
    const dt = (t - lastTime) / 1000 || 0; lastTime = t;
    ['left','right'].forEach(s => {
        let diff = targets[s] - arms[s];
        if (Math.abs(diff) > 180) diff -= Math.sign(diff) * 360;
        arms[s] = (arms[s] + diff * Math.min(1, dt * 12) + 360) % 360;
    });
    drawSema(canvas.getContext('2d'), canvas.width, canvas.height, arms.left, arms.right);
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

let dragging = null;
canvas.addEventListener('mousedown', e => {
    const r = canvas.getBoundingClientRect();
    dragging = (e.clientX - r.left < canvas.width/2) ? 'left' : 'right';
});
window.addEventListener('mousemove', e => {
    if (!dragging) return;
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const ang = Math.atan2(y - (canvas.height/2), x - (dragging === 'left' ? 112 : 148)) * 180 / Math.PI;
    targets[dragging] = (Math.round(ang/45)*45+360)%360;
});
window.addEventListener('mouseup', () => dragging = null);

/* ── VIGENÈRE ── */
function vig(t, k, m) {
    k = k.toUpperCase().replace(/[^A-Z]/g,''); if (!k) return t;
    let i = 0;
    return t.replace(/[a-z]/ig, c => {
        const b = c < 'a' ? 65 : 97;
        const s = (k.charCodeAt(i++ % k.length) - 65) * (m === 'decode' ? -1 : 1);
        return String.fromCharCode(((c.charCodeAt(0)-b+s+26)%26)+b);
    });
}
const vigIn = document.getElementById('vig-input');
if (vigIn) {
    const upd = () => document.getElementById('vig-output').value = vig(vigIn.value, document.getElementById('vig-key').value, document.getElementById('vig-mode').value);
    vigIn.addEventListener('input', upd);
}

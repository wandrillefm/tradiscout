/* ── LOADER ZOOM & TYPE ── */
const introText = "TRADISCOUT";
const typewriter = document.getElementById('typewriter');
let charIdx = 0;

function typeEffect() {
    if (charIdx < introText.length) {
        typewriter.innerText += introText.charAt(charIdx++);
        setTimeout(typeEffect, 120);
    } else {
        // Fin de la frappe -> Lancement de l'effet
        setTimeout(() => {
            typewriter.classList.add('zoom-out-effect');
            setTimeout(() => {
                document.getElementById('loader').style.opacity = '0';
                document.getElementById('main-content').style.opacity = '1';
                setTimeout(() => { 
                    document.getElementById('loader').style.display = 'none'; 
                }, 800);
            }, 800); // Temps du zoom
        }, 500);
    }
}
window.addEventListener('load', () => { setTimeout(typeEffect, 300); });

/* ── NAVIGATION ── */
function show(id) {
    document.querySelectorAll('.tab').forEach(t => t.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    document.querySelectorAll('.main-nav a').forEach(a => a.classList.remove('active'));
    if (document.getElementById('nav-' + id)) document.getElementById('nav-' + id).classList.add('active');
    document.querySelectorAll('.tab-bar-btn').forEach(b => b.classList.remove('active'));
    if (document.getElementById('tb-' + id)) document.getElementById('tb-' + id).classList.add('active');
    window.scrollTo(0, 0);
}

function showCodeTab(id, btn) {
    document.querySelectorAll('.code-tab').forEach(t => t.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    document.querySelectorAll('.code-nav button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

/* ── MORSE ── */
const morseMap = {'A':'.-','B':'-...','C':'-.-.','D':'-..','E':'.','F':'..-.','G':'--.','H':'....','I':'..','J':'.---','K':'-.-','L':'.-..','M':'--','N':'-.','O':'---','P':'.--.','Q':'--.-','R':'.-.','S':'...','T':'-','U':'..-','V':'...-','W':'.--','X':'-..-','Y':'-.--','Z':'--..','0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.'};
const invMorse = Object.fromEntries(Object.entries(morseMap).map(([k,v]) => [v,k]));

const morseInput = document.getElementById('morse-input');
const morseOutput = document.getElementById('morse-output');
if (morseInput) {
    morseInput.addEventListener('input', () => {
        const v = morseInput.value.toUpperCase();
        if (/^[.\-\/\s]+$/.test(v)) {
            morseOutput.value = v.split('/').map(w => w.trim().split(' ').map(s => invMorse[s] || '').join('')).join(' ');
        } else {
            morseOutput.value = v.split('').map(c => morseMap[c] || (c === ' ' ? '/' : '')).join(' ');
        }
    });
}

/* ── CÉSAR ── */
function caesar(str, shift) {
    return str.split('').map(ch => {
        const code = ch.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCharCode(((code-65+shift+26)%26)+65);
        if (code >= 97 && code <= 122) return String.fromCharCode(((code-97+shift+26)%26)+97);
        return ch;
    }).join('');
}
const caesarIn = document.getElementById('caesar-input');
const shiftIn = document.getElementById('shift');
if (caesarIn) {
    const update = () => document.getElementById('caesar-output').value = caesar(caesarIn.value, parseInt(shiftIn.value||'0'));
    caesarIn.addEventListener('input', update);
    shiftIn.addEventListener('input', update);
}

/* ── SÉMAPHORE (TON CODE ORIGINAL) ── */
const semaphoreAlphabet = {
    'A':[135,90],'B':[180,90],'C':[225,90],'D':[270,90],'E':[90,315],'F':[90,0],'G':[90,45],'H':[180,135],
    'I':[225,135],'J':[270,0],'K':[135,270],'L':[135,315],'M':[135,0],'N':[135,45],'O':[180,225],'P':[180,270],
    'Q':[180,315],'R':[180,0],'S':[180,45],'T':[225,270],'U':[225,315],'V':[270,45],'W':[315,0],'X':[315,45],
    'Y':[225,0],'Z':[0,45]
};
const semaphoreMap = {};
Object.entries(semaphoreAlphabet).forEach(([l,[left,right]]) => {
    semaphoreMap[`${left}-${right}`] = l;
    semaphoreMap[`${right}-${left}`] = l;
});
const canvas = document.getElementById('semaphore-canvas');
const letterDisp = document.getElementById('semaphore-letter');
let armAngles = { left: 135, right: 90 };
let targetAngles = { ...armAngles };
let lastT = 0;

function drawSemaphore(ctx, w, h, lA, rA) {
    const cx = w/2, cy = h/2+10;
    ctx.clearRect(0,0,w,h);
    ctx.strokeStyle = '#2C3776'; ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(cx,cy-25); ctx.lineTo(cx,cy+35); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx,cy-35,10,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx,cy+35); ctx.lineTo(cx-15,cy+60); ctx.moveTo(cx,cy+35); ctx.lineTo(cx+15,cy+60); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx-18,cy-10); ctx.lineTo(cx+18,cy-10); ctx.stroke();
    function arm(ang, isL) {
        const rad = ang*Math.PI/180;
        const sx = isL ? cx-18 : cx+18, sy = cy-10;
        const hx = sx+Math.cos(rad)*70, hy = sy+Math.sin(rad)*70;
        ctx.beginPath(); ctx.moveTo(sx,sy); ctx.lineTo(hx,hy); ctx.stroke();
        ctx.save(); ctx.translate(hx,hy); ctx.rotate(rad);
        ctx.fillStyle = '#ffdf40'; ctx.beginPath(); ctx.moveTo(-20,isL?-22:0); ctx.lineTo(-20+22,isL?-22:0); ctx.lineTo(-20,isL?-22+22:22); ctx.fill();
        ctx.fillStyle = '#c00000'; ctx.beginPath(); ctx.moveTo(-20+22,isL?-22:0); ctx.lineTo(-20+22,isL?-22+22:22); ctx.lineTo(-20,isL?-22+22:22); ctx.fill();
        ctx.restore();
    }
    arm(lA, true); arm(rA, false);
    const snap = a => (Math.round(a/45)*45+360)%360;
    letterDisp.innerText = semaphoreMap[`${snap(lA)}-${snap(rA)}`] || '?';
}

function loop(t) {
    if (!canvas) return;
    const dt = (t-lastT)/1000 || 0; lastT = t;
    ['left','right'].forEach(s => {
        let diff = targetAngles[s]-armAngles[s];
        if (Math.abs(diff) > 180) diff -= Math.sign(diff)*360;
        armAngles[s] = (armAngles[s]+diff*Math.min(1,dt*12)+360)%360;
    });
    drawSemaphore(canvas.getContext('2d'), canvas.width, canvas.height, armAngles.left, armAngles.right);
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

let dragging = null;
canvas.addEventListener('mousedown', e => {
    const rect = canvas.getBoundingClientRect();
    dragging = (e.clientX - rect.left < canvas.width/2) ? 'left' : 'right';
});
window.addEventListener('mousemove', e => {
    if (!dragging) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX-rect.left, y = e.clientY-rect.top;
    const ang = Math.atan2(y-(canvas.height/2), x-(dragging==='left'?112:148))*180/Math.PI;
    targetAngles[dragging] = (Math.round(ang/45)*45+360)%360;
});
window.addEventListener('mouseup', () => dragging = null);

/* ── VIGENÈRE ── */
function vig(text, key, mode) {
    key = key.toUpperCase().replace(/[^A-Z]/g,'');
    if (!key) return text;
    let i = 0;
    return text.replace(/[a-zA-Z]/g, c => {
        const b = c < 'a' ? 65 : 97;
        const s = (key.charCodeAt(i++ % key.length) - 65) * (mode === 'decode' ? -1 : 1);
        return String.fromCharCode(((c.charCodeAt(0)-b+s+26)%26)+b);
    });
}
const vigIn = document.getElementById('vig-input');
if (vigIn) {
    const update = () => document.getElementById('vig-output').value = vig(vigIn.value, document.getElementById('vig-key').value, document.getElementById('vig-mode').value);
    vigIn.addEventListener('input', update);
}

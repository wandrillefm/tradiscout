/* ── LOADER ── */
const text = "TRADISCOUT";
const target = document.getElementById('typewriter');
let i = 0;
function type() {
    if (i < text.length) {
        target.innerText += text.charAt(i++);
        target.style.width = 'auto';
        setTimeout(type, 120);
    } else {
        setTimeout(() => {
            document.getElementById('loader').style.opacity = '0';
            document.getElementById('main-content').style.opacity = '1';
            setTimeout(() => { document.getElementById('loader').style.display = 'none'; }, 600);
        }, 800);
    }
}
window.addEventListener('load', () => { setTimeout(type, 500); });

/* ── NAVIGATION ── */
function show(id) {
    document.querySelectorAll('.tab').forEach(t => t.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    
    document.querySelectorAll('.main-nav a').forEach(a => a.classList.remove('active'));
    const navEl = document.getElementById('nav-' + id);
    if (navEl) navEl.classList.add('active');
    
    document.querySelectorAll('.tab-bar-btn').forEach(b => b.classList.remove('active'));
    const tbEl = document.getElementById('tb-' + id);
    if (tbEl) tbEl.classList.add('active');
    
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
const inverseMorse = Object.fromEntries(Object.entries(morseMap).map(([k,v]) => [v,k]));

function looksLikeMorse(str) { return /^[.\-\/\s]+$/.test(str.trim()); }
function textToMorseCustom(str) {
    return str.toUpperCase().replace(/[^A-Z0-9 ]/g,'').split(/\s+/).filter(Boolean)
    .map(w => w.split('').map(c => morseMap[c] ? morseMap[c]+' /' : '').filter(Boolean).join(' ').trim())
    .join('/ ');
}
function morseToTextCustom(str) {
    if (!str.trim()) return '';
    return str.split('//').map(w => w.trim()).filter(Boolean)
    .map(w => w.replace(/\/+/g,'/').split('/').map(s => s.trim()).filter(Boolean)
    .map(b => inverseMorse[b.split(/\s+/).join(' ')] || '').join('')).join(' ');
}

const morseInput = document.getElementById('morse-input');
const morseOutput = document.getElementById('morse-output');
if (morseInput) {
    morseInput.addEventListener('input', () => {
        const v = morseInput.value;
        morseOutput.value = !v.trim() ? '' : looksLikeMorse(v) ? morseToTextCustom(v) : textToMorseCustom(v);
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
const caesarInput = document.getElementById('caesar-input');
const caesarOutput = document.getElementById('caesar-output');
const shiftInput = document.getElementById('shift');
function updateCaesar() { if(caesarOutput) caesarOutput.value = caesar(caesarInput.value, parseInt(shiftInput.value||'0',10)); }
if (caesarInput) { caesarInput.addEventListener('input', updateCaesar); shiftInput.addEventListener('input', updateCaesar); }

/* ── SÉMAPHORE (TON CODE D'ORIGINE) ── */
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
const semaphoreLetterSpan = document.getElementById('semaphore-letter');
let armAngles = { left: 135, right: 90 };
let targetAngles = { ...armAngles };
let lastTimestamp = 0;

function drawSemaphoreFigure(ctx, w, h, leftAngle, rightAngle) {
    const cx = w/2, cy = h/2+10;
    ctx.clearRect(0,0,w,h);
    ctx.strokeStyle = '#2C3776'; ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(cx,cy-25); ctx.lineTo(cx,cy+35); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx,cy-35,10,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx,cy+35); ctx.lineTo(cx-15,cy+60); ctx.moveTo(cx,cy+35); ctx.lineTo(cx+15,cy+60); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx-18,cy-10); ctx.lineTo(cx+18,cy-10); ctx.stroke();
    function drawArm(angleDeg, isLeft) {
        const rad = angleDeg*Math.PI/180, armLen = 70;
        const sx = isLeft ? cx-18 : cx+18, sy = cy-10;
        const hx = sx+Math.cos(rad)*armLen, hy = sy+Math.sin(rad)*armLen;
        ctx.strokeStyle = '#2C3776'; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(sx,sy); ctx.lineTo(hx,hy); ctx.stroke();
        const size = 22;
        ctx.save(); ctx.translate(hx,hy); ctx.rotate(rad);
        const xo = -20, yo = isLeft ? -size : 0;
        ctx.fillStyle = '#ffdf40'; ctx.beginPath(); ctx.moveTo(xo,yo); ctx.lineTo(xo+size,yo); ctx.lineTo(xo,yo+size); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#c00000'; ctx.beginPath(); ctx.moveTo(xo+size,yo); ctx.lineTo(xo+size,yo+size); ctx.lineTo(xo,yo+size); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = '#7a0000'; ctx.lineWidth = 1.5; ctx.strokeRect(xo,yo,size,size);
        ctx.restore();
    }
    drawArm(leftAngle, true); drawArm(rightAngle, false);
}

function updateSemaphoreLetterFromAngles() {
    const snap = d => Math.round(d/45)*45;
    const aL = (snap(armAngles.left)+360)%360, aR = (snap(armAngles.right)+360)%360;
    semaphoreLetterSpan.textContent = semaphoreMap[`${aL}-${aR}`] || '?';
}

function animateSemaphore(timestamp) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d'), dt = (timestamp-lastTimestamp)/1000||0;
    lastTimestamp = timestamp;
    ['left','right'].forEach(side => {
        let diff = targetAngles[side]-armAngles[side];
        if (Math.abs(diff) > 180) diff -= Math.sign(diff)*360;
        armAngles[side] = (armAngles[side]+diff*Math.min(1,dt*12)+360)%360;
    });
    drawSemaphoreFigure(ctx,canvas.width,canvas.height,armAngles.left,armAngles.right);
    updateSemaphoreLetterFromAngles();
    requestAnimationFrame(animateSemaphore);
}
if (canvas) requestAnimationFrame(animateSemaphore);

let draggingArm = null;
function getPointerPos(e) {
    const rect = canvas.getBoundingClientRect();
    return { x: (e.touches?e.touches[0].clientX:e.clientX)-rect.left, y: (e.touches?e.touches[0].clientY:e.clientY)-rect.top };
}
function getHandPos(isLeft, angleDeg) {
    const rad = angleDeg*Math.PI/180, cx = canvas.width/2, cy = canvas.height/2+10;
    const sx = isLeft ? cx-18 : cx+18;
    return { x: sx+Math.cos(rad)*70, y: cy-10+Math.sin(rad)*70 };
}
function handlePointerDown(e) {
    const pos = getPointerPos(e);
    const lh = getHandPos(true,targetAngles.left), rh = getHandPos(false,targetAngles.right);
    const dL = Math.hypot(pos.x-lh.x,pos.y-lh.y), dR = Math.hypot(pos.x-rh.x,pos.y-rh.y);
    if (dL < 40 && dL <= dR) { draggingArm='left'; e.preventDefault(); }
    else if (dR < 40) { draggingArm='right'; e.preventDefault(); }
}
function handlePointerMove(e) {
    const pos = getPointerPos(e);
    if (!draggingArm && e.type==='mousemove') {
        const lh=getHandPos(true,targetAngles.left), rh=getHandPos(false,targetAngles.right);
        canvas.style.cursor = (Math.hypot(pos.x-lh.x,pos.y-lh.y)<40||Math.hypot(pos.x-rh.x,pos.y-rh.y)<40)?'grab':'default';
        return;
    }
    if (!draggingArm) return;
    e.preventDefault(); canvas.style.cursor = 'grabbing';
    const cx=canvas.width/2, cy=canvas.height/2+10, isLeft=draggingArm==='left';
    const sx=isLeft?cx-18:cx+18, sy=cy-10;
    let ang = Math.atan2(pos.y-sy,pos.x-sx)*180/Math.PI;
    if (ang<0) ang+=360;
    const norm = (Math.round(ang/45)*45+360)%360;
    armAngles[draggingArm] = targetAngles[draggingArm] = norm;
}
function handlePointerUp() { draggingArm=null; canvas.style.cursor='default'; }
if (canvas) {
    canvas.addEventListener('mousedown',handlePointerDown);
    canvas.addEventListener('mousemove',handlePointerMove);
    canvas.addEventListener('mouseup',handlePointerUp);
    canvas.addEventListener('touchstart',handlePointerDown,{passive:false});
    canvas.addEventListener('touchmove',handlePointerMove,{passive:false});
    canvas.addEventListener('touchend',handlePointerUp);
}

/* ── VIGENÈRE ── */
function vigenereLogic(text, key, mode) {
    if (!key) return text;
    key = key.toUpperCase().replace(/[^A-Z]/g,'');
    if (!key.length) return text;
    let result='', ki=0;
    for (let c of text) {
        if (/[a-zA-Z]/.test(c)) {
            const upper = c===c.toUpperCase(), base = upper?65:97;
            let shift = key.charCodeAt(ki%key.length)-65;
            if (mode==='decode') shift=-shift;
            result += String.fromCharCode(((c.charCodeAt(0)-base+shift%26+26)%26)+base);
            ki++;
        } else result += c;
    }
    return result;
}
const vigInput=document.getElementById('vig-input'), vigKey=document.getElementById('vig-key'),
      vigMode=document.getElementById('vig-mode'), vigOutput=document.getElementById('vig-output');
function updateVigenere() { if(vigOutput) vigOutput.value = vigenereLogic(vigInput.value,vigKey.value,vigMode.value); }
if (vigInput) { vigInput.addEventListener('input',updateVigenere); vigKey.addEventListener('input',updateVigenere); vigMode.addEventListener('change',updateVigenere); }

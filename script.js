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
const morseMap = {
    'A':'.-','B':'-...','C':'-.-.','D':'-..','E':'.','F':'..-.','G':'--.','H':'....','I':'..','J':'.---','K':'-.-','L':'.-..','M':'--','N':'-.','O':'---','P':'.--.','Q':'--.-','R':'.-.','S':'...','T':'-','U':'..-','V':'...-','W':'.--','X':'-..-','Y':'-.--','Z':'--..','0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.'
};
const invMorse = Object.fromEntries(Object.entries(morseMap).map(([k,v]) => [v,k]));

document.getElementById('morse-input').addEventListener('input', (e) => {
    const val = e.target.value.toUpperCase().trim();
    if (!val) { document.getElementById('morse-output').value = ''; return; }
    
    if (/[.\-]/.test(val)) {
        // Morse -> Texte
        const res = val.split('/').map(w => w.trim().split(' ').map(s => invMorse[s] || '?').join('')).join(' ');
        document.getElementById('morse-output').value = res;
    } else {
        // Texte -> Morse
        const res = val.split('').map(c => morseMap[c] || (c === ' ' ? '/' : '?')).join(' ');
        document.getElementById('morse-output').value = res;
    }
});

/* ── SÉMAPHORE (Logique Complète) ── */
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
const ctx = canvas.getContext('2d');
let armAngles = { left: 135, right: 90 };
let targetAngles = { ...armAngles };
let draggingArm = null;

function drawSemaphore() {
    const w = canvas.width, h = canvas.height;
    const cx = w/2, cy = h/2 + 10;
    ctx.clearRect(0, 0, w, h);
    
    // Corps
    ctx.strokeStyle = '#2C3776'; ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(cx, cy-25); ctx.lineTo(cx, cy+35); ctx.stroke(); // Tronc
    ctx.beginPath(); ctx.arc(cx, cy-35, 10, 0, Math.PI*2); ctx.stroke(); // Tête
    ctx.beginPath(); ctx.moveTo(cx, cy+35); ctx.lineTo(cx-15, cy+60); ctx.moveTo(cx, cy+35); ctx.lineTo(cx+15, cy+60); ctx.stroke(); // Jambes

    function drawArm(angleDeg, isLeft) {
        const rad = angleDeg * Math.PI / 180, armLen = 70;
        const sx = isLeft ? cx-18 : cx+18, sy = cy-10;
        const hx = sx + Math.cos(rad)*armLen, hy = sy + Math.sin(rad)*armLen;
        
        ctx.strokeStyle = '#2C3776'; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(hx, hy); ctx.stroke();
        
        // Drapeau
        const size = 22;
        ctx.save(); ctx.translate(hx, hy); ctx.rotate(rad);
        const xo = -20, yo = isLeft ? -size : 0;
        ctx.fillStyle = '#ffdf40'; ctx.beginPath(); ctx.moveTo(xo,yo); ctx.lineTo(xo+size,yo); ctx.lineTo(xo,yo+size); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#c00000'; ctx.beginPath(); ctx.moveTo(xo+size,yo); ctx.lineTo(xo+size,yo+size); ctx.lineTo(xo,yo+size); ctx.closePath(); ctx.fill();
        ctx.restore();
    }
    drawArm(armAngles.left, true);
    drawArm(armAngles.right, false);
    
    // Détection Lettre
    const snap = d => (Math.round(d/45)*45+360)%360;
    const L = snap(armAngles.left), R = snap(armAngles.right);
    document.getElementById('semaphore-letter').innerText = semaphoreMap[`${L}-${R}`] || '?';
}

function animate() {
    ['left','right'].forEach(side => {
        let diff = targetAngles[side] - armAngles[side];
        if (Math.abs(diff) > 180) diff -= Math.sign(diff)*360;
        armAngles[side] = (armAngles[side] + diff * 0.2 + 360) % 360;
    });
    drawSemaphore();
    requestAnimationFrame(animate);
}
animate();

// Drag Logic
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    draggingArm = (x < canvas.width/2) ? 'left' : 'right';
});
window.addEventListener('mousemove', (e) => {
    if (!draggingArm) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const cx = canvas.width/2, cy = canvas.height/2;
    const ang = Math.atan2(y - cy, x - (draggingArm==='left'?cx-18:cx+18)) * 180 / Math.PI;
    targetAngles[draggingArm] = (Math.round(ang/45)*45+360)%360;
});
window.addEventListener('mouseup', () => draggingArm = null);

/* ── CESAR & VIGENERE ── */
// (Logiques standards de chiffrement à ajouter ici pour compléter)

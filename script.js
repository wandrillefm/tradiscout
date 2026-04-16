/* LOADER */
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

/* NAVIGATION */
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

/* LOGIQUE CODES (MORSE, CESAR, VIGENERE) */
const morseMap = {'A':'.-','B':'-...','C':'-.-.','D':'-..','E':'.','F':'..-.','G':'--.','H':'....','I':'..','J':'.---','K':'-.-','L':'.-..','M':'--','N':'-.','O':'---','P':'.--.','Q':'--.-','R':'.-.','S':'...','T':'-','U':'..-','V':'...-','W':'.--','X':'-..-','Y':'-.--','Z':'--..','0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.'};
const invMorse = Object.fromEntries(Object.entries(morseMap).map(([k,v]) => [v,k]));

const morseInput = document.getElementById('morse-input');
if(morseInput) {
    morseInput.addEventListener('input', (e) => {
        const v = e.target.value.toUpperCase();
        if(/[.\-]/.test(v)) {
            document.getElementById('morse-output').value = v.split(' ').map(s => invMorse[s] || '').join('');
        } else {
            document.getElementById('morse-output').value = v.split('').map(c => morseMap[c] || c).join(' ');
        }
    });
}

/* SÉMAPHORE (Logique simplifiée pour le dessin) */
const canvas = document.getElementById('semaphore-canvas');
if(canvas) {
    const ctx = canvas.getContext('2d');
    function draw() {
        ctx.clearRect(0,0,260,260);
        ctx.strokeStyle = '#2C3776'; ctx.lineWidth = 4;
        // Tronc
        ctx.beginPath(); ctx.moveTo(130,130); ctx.lineTo(130,180); ctx.stroke();
        // Tête
        ctx.beginPath(); ctx.arc(130,115,10,0,Math.PI*2); ctx.stroke();
        // Bras (Exemple position A par défaut au chargement)
        ctx.beginPath(); ctx.moveTo(130,135); ctx.lineTo(100,170); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(130,135); ctx.lineTo(160,170); ctx.stroke();
    }
    draw();
}

/* VIGENERE */
function vigenere(text, key, encode = true) {
    key = key.toUpperCase().replace(/[^A-Z]/g, '');
    if(!key) return text;
    let out = '', ki = 0;
    for(let char of text.toUpperCase()) {
        if(/[A-Z]/.test(char)) {
            let shift = key.charCodeAt(ki % key.length) - 65;
            if(!encode) shift = -shift;
            out += String.fromCharCode(((char.charCodeAt(0) - 65 + shift + 26) % 26) + 65);
            ki++;
        } else out += char;
    }
    return out;
}
const vigIn = document.getElementById('vig-input');
if(vigIn) {
    vigIn.addEventListener('input', () => {
        const key = document.getElementById('vig-key').value;
        const mode = document.getElementById('vig-mode').value === 'encode';
        document.getElementById('vig-output').value = vigenere(vigIn.value, key, mode);
    });
}

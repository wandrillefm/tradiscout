/* ── LOADER ZOOM & TYPE ── */
const introText = "TRADISCOUT";
const typewriter = document.getElementById('typewriter');
let charIdx = 0;

function typeEffect() {
    if (charIdx < introText.length) {
        typewriter.innerText += introText.charAt(charIdx++);
        typewriter.style.width = 'auto';
        setTimeout(typeEffect, 120);
    } else {
        setTimeout(() => {
            typewriter.classList.add('zoom-out-effect');
            setTimeout(() => {
                document.getElementById('loader').style.opacity = '0';
                document.getElementById('main-content').style.opacity = '1';
                setTimeout(() => { document.getElementById('loader').style.display = 'none'; }, 800);
            }, 800);
        }, 500);
    }
}
window.addEventListener('load', () => { setTimeout(typeEffect, 300); });

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

/* ── MORSE ── */
const morseMap = {'A':'.-','B':'-...','C':'-.-.','D':'-..','E':'.','F':'..-.','G':'--.','H':'....','I':'..','J':'.---','K':'-.-','L':'.-..','M':'--','N':'-.','O':'---','P':'.--.','Q':'--.-','R':'.-.','S':'...','T':'-','U':'..-','V':'...-','W':'.--','X':'-..-','Y':'-.--','Z':'--..','0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.'};
const inverseMorse = Object.fromEntries(Object.entries(morseMap).map(([k,v]) => [v,k]));

const morseInput = document.getElementById('morse-input');
const morseOutput = document.getElementById('morse-output');
if (morseInput) {
    morseInput.addEventListener('input', () => {
        const v = morseInput.value.toUpperCase();
        if (/^[.\-\/\s]+$/.test(v)) {
            morseOutput.value = v.split('/').map(w => w.trim().split(' ').map(s => inverseMorse[s] || '').join('')).join(' ');
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
const semaphoreAlpha

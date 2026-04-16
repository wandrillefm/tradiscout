/* ── LOADER ZOOM & FADE ── */
const text = "TRADISCOUT";
const target = document.getElementById('typewriter');
let i = 0;

function type() {
    if (i < text.length) {
        target.innerText += text.charAt(i++);
        target.style.width = 'auto';
        setTimeout(type, 120);
    } else {
        // Une fois le texte fini, on lance l'effet de zoom
        setTimeout(() => {
            target.classList.add('zoom-out-effect');
            // On attend la fin de l'animation de zoom (1.2s) pour cacher le loader
            setTimeout(() => {
                document.getElementById('loader').style.opacity = '0';
                document.getElementById('main-content').style.opacity = '1';
                setTimeout(() => { 
                    document.getElementById('loader').style.display = 'none'; 
                }, 800);
            }, 800);
        }, 500);
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
function updateCaesar()

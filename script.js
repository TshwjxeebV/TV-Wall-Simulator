// --- WEB SPEECH API ENGINE (UDL ACCESSIBILITY) ---
const speechEngine = window.speechSynthesis;
let audioEnabled = false;
let associateVoice = { pitch: 0.85, type: 'male' }; 
let systemVoices = [];

speechEngine.onvoiceschanged = () => { systemVoices = speechEngine.getVoices(); };

function playSpeech(text, profile = { pitch: 1.0, type: 'neutral' }) {
    if (!audioEnabled || !text) return;
    speechEngine.cancel(); 
    
    const cleanText = text.replace(/<[^>]*>?/gm, ''); 
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.pitch = profile.pitch;
    utterance.rate = 1.05; 
    
    if (systemVoices.length > 0) {
        let voice = null;
        if (profile.type === 'male') {
            voice = systemVoices.find(v => v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('alex') || v.name.toLowerCase().includes('daniel'));
            if (!voice) utterance.pitch = 0.85;
        } else if (profile.type === 'female') {
            voice = systemVoices.find(v => v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('karen'));
            if (!voice) utterance.pitch = 1.15;
        }
        if (voice) utterance.voice = voice;
    }
    speechEngine.speak(utterance);
}

document.getElementById('btn-audio-toggle').addEventListener('click', (e) => {
    audioEnabled = !audioEnabled;
    if(!audioEnabled) speechEngine.cancel();
    
    e.currentTarget.innerText = audioEnabled ? "Audio Narration: ON" : "Audio Narration: OFF";
    
    if (audioEnabled) {
        e.currentTarget.classList.remove('pulse-anim');
        e.currentTarget.style.borderColor = "var(--accent)";
        e.currentTarget.style.backgroundColor = "rgba(102, 252, 241, 0.15)";
        e.currentTarget.style.color = "var(--accent)";
        document.getElementById('btn-mini-audio').style.display = 'block';
        document.getElementById('btn-mini-audio').innerText = "🔊 Audio: ON";
        document.getElementById('btn-mini-audio').style.borderColor = "var(--accent)";
        document.getElementById('btn-mini-audio').style.color = "var(--accent)";
        playSpeech("Audio Assist activated. I will guide you through the module.");
    } else {
        e.currentTarget.classList.add('pulse-anim');
        e.currentTarget.style.borderColor = "var(--accent)";
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.color = "var(--accent)";
        document.getElementById('btn-mini-audio').innerText = "🔊 Audio: OFF";
        document.getElementById('btn-mini-audio').style.borderColor = "#ff3b30";
        document.getElementById('btn-mini-audio').style.color = "#ff3b30";
    }
});

document.getElementById('btn-mini-audio').addEventListener('click', (e) => {
    audioEnabled = !audioEnabled;
    if(!audioEnabled) speechEngine.cancel();
    e.currentTarget.innerText = audioEnabled ? "🔊 Audio: ON" : "🔊 Audio: OFF";
    e.currentTarget.style.borderColor = audioEnabled ? "var(--accent)" : "#ff3b30";
    e.currentTarget.style.color = audioEnabled ? "var(--accent)" : "#ff3b30";
    
    const mainToggle = document.getElementById('btn-audio-toggle');
    mainToggle.innerText = audioEnabled ? "Audio Narration: ON" : "Audio Narration: OFF";
    if (audioEnabled) {
        mainToggle.classList.remove('pulse-anim');
        mainToggle.style.backgroundColor = "rgba(102, 252, 241, 0.15)";
        playSpeech("Audio reactivated.");
    } else {
        mainToggle.classList.add('pulse-anim');
        mainToggle.style.backgroundColor = "transparent";
    }
});

document.getElementById('btn-voice-male').addEventListener('click', (e) => {
    audioEnabled = true; 
    document.getElementById('btn-mini-audio').style.display = 'block';
    document.getElementById('btn-mini-audio').innerText = "🔊 Audio: ON";
    document.getElementById('btn-mini-audio').style.borderColor = "var(--accent)";
    document.getElementById('btn-mini-audio').style.color = "var(--accent)";
    document.getElementById('btn-audio-toggle').innerText = "Audio Narration: ON";
    document.getElementById('btn-audio-toggle').classList.remove('pulse-anim');
    document.getElementById('btn-audio-toggle').style.backgroundColor = "rgba(102, 252, 241, 0.15)";
    
    associateVoice = { pitch: 0.85, type: 'male' };
    e.currentTarget.classList.add('active');
    document.getElementById('btn-voice-female').classList.remove('active');
    playSpeech("You may like the sound of this voice.", associateVoice);
});

document.getElementById('btn-voice-female').addEventListener('click', (e) => {
    audioEnabled = true; 
    document.getElementById('btn-mini-audio').style.display = 'block';
    document.getElementById('btn-mini-audio').innerText = "🔊 Audio: ON";
    document.getElementById('btn-mini-audio').style.borderColor = "var(--accent)";
    document.getElementById('btn-mini-audio').style.color = "var(--accent)";
    document.getElementById('btn-audio-toggle').innerText = "Audio Narration: ON";
    document.getElementById('btn-audio-toggle').classList.remove('pulse-anim');
    document.getElementById('btn-audio-toggle').style.backgroundColor = "rgba(102, 252, 241, 0.15)";
    
    associateVoice = { pitch: 1.15, type: 'female' };
    e.currentTarget.classList.add('active');
    document.getElementById('btn-voice-male').classList.remove('active');
    playSpeech("But this voice sounds just as great. Which one do you prefer?", associateVoice);
});

// --- DIRECTIONAL WEB AUDIO API UI SOUND ENGINE ---
class UIChime {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.initialized = false;
        this.fireWindNode = null;
        this.brownFilter = null; 
        this.fireWindGainL = null;
        this.fireWindGainR = null;
        this.panL = null;
        this.panR = null;
        this.humActive = false;
        this.activeThemeNodes = [];
        this.themeMasterGain = null;
        this.spaceChargeOsc = null;
        this.spaceChargeGain = null;
        this.chargeFilter = null; 
        this.supernovaCompressor = null;
        this.supernovaFilter = null;
    }
    
    init() {
        if (!this.initialized) {
            this.ctx.resume();
            
            this.hoverOsc = this.ctx.createOscillator();
            this.hoverOsc.type = 'triangle';
            this.hoverOsc.frequency.value = 45; 
            this.hoverFilter = this.ctx.createBiquadFilter();
            this.hoverFilter.type = 'lowpass';
            this.hoverFilter.frequency.value = 100;
            this.hoverGain = this.ctx.createGain();
            this.hoverGain.gain.value = 0;
            this.hoverOsc.connect(this.hoverFilter);
            this.hoverFilter.connect(this.hoverGain);
            this.hoverGain.connect(this.ctx.destination);
            this.hoverOsc.start();
            
            const bufferSize = this.ctx.sampleRate * 2;
            this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = this.noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
            
            this.initialized = true;
        }
    }

    initSupernovaBus() {
        if (!this.supernovaCompressor) {
            this.supernovaCompressor = this.ctx.createDynamicsCompressor();
            this.supernovaCompressor.threshold.value = -24;
            this.supernovaCompressor.knee.value = 30;
            this.supernovaCompressor.ratio.value = 12;
            this.supernovaCompressor.attack.value = 0.01;
            this.supernovaCompressor.release.value = 0.25;
            
            this.supernovaFilter = this.ctx.createBiquadFilter();
            this.supernovaFilter.type = 'lowpass';
            this.supernovaFilter.frequency.value = 400; 
            
            this.supernovaFilter.connect(this.supernovaCompressor);
            this.supernovaCompressor.connect(this.ctx.destination);
        }
    }

    killCanvasAudio() {
        if (!this.initialized) return;
        const t = this.ctx.currentTime;
        this.humActive = false;
        if(this.hoverGain) {
            this.hoverGain.gain.cancelScheduledValues(t);
            this.hoverGain.gain.setValueAtTime(0, t);
        }
        if(this.fireWindGainL) {
            this.fireWindGainL.gain.cancelScheduledValues(t);
            this.fireWindGainL.gain.setValueAtTime(0, t);
        }
        if(this.fireWindGainR) {
            this.fireWindGainR.gain.cancelScheduledValues(t);
            this.fireWindGainR.gain.setValueAtTime(0, t);
        }
        if(this.fireWindNode) {
            try { this.fireWindNode.stop(); this.fireWindNode.disconnect(); } catch(e){}
            this.fireWindNode = null;
        }
        if(this.spaceChargeGain) {
            this.spaceChargeGain.gain.cancelScheduledValues(t);
            this.spaceChargeGain.gain.setValueAtTime(0, t);
        }
        if(this.spaceChargeOsc) {
            try { this.spaceChargeOsc.stop(); this.spaceChargeOsc.disconnect(); } catch(e){}
            this.spaceChargeOsc = null;
        }
    }

    startSuperSnap() {
        if (!this.initialized) return;
        const t = this.ctx.currentTime;
        if(this.spaceChargeGain) { this.spaceChargeGain.gain.cancelScheduledValues(t); this.spaceChargeGain.gain.setValueAtTime(0, t); }
        if(this.spaceChargeOsc) { try { this.spaceChargeOsc.stop(t); this.spaceChargeOsc.disconnect(); } catch(e){} this.spaceChargeOsc = null; }

        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;
        noise.loop = true;
        
        const vacFilter = this.ctx.createBiquadFilter();
        vacFilter.type = 'lowpass';
        vacFilter.frequency.setValueAtTime(1500, t);
        vacFilter.frequency.exponentialRampToValueAtTime(40, t + 0.25);
        
        const vacGain = this.ctx.createGain();
        vacGain.gain.setValueAtTime(0.5, t);
        vacGain.gain.linearRampToValueAtTime(0.01, t + 0.25);
        vacGain.gain.setValueAtTime(0, t + 0.29); 
        
        noise.connect(vacFilter);
        vacFilter.connect(vacGain);
        vacGain.connect(this.supernovaFilter);
        
        noise.start(t);
        noise.stop(t + 0.3);
    }

    playStarDrop() {
        if (this.ctx.state === 'suspended') return;
        this.initSupernovaBus();
        const t = this.ctx.currentTime;
        
        if (this.spaceChargeGain) {
            this.spaceChargeGain.gain.cancelScheduledValues(t);
            this.spaceChargeGain.gain.setValueAtTime(0, t);
        }
        if (this.spaceChargeOsc) {
            try { this.spaceChargeOsc.stop(t); this.spaceChargeOsc.disconnect(); } catch(e){}
            this.spaceChargeOsc = null;
        }
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800 + Math.random() * 400, t);
        osc.frequency.exponentialRampToValueAtTime(1200, t + 0.1);
        
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.05, t + 0.01);
        gain.gain.linearRampToValueAtTime(0, t + 0.25);
        
        osc.connect(gain); 
        gain.connect(this.supernovaFilter); 
        
        osc.start(t); 
        osc.stop(t + 0.25); 
        
        setTimeout(() => {
            try { osc.disconnect(); gain.disconnect(); } catch(e){}
        }, 300);
    }

    startSupernovaCharge() {
        if (!this.initialized || this.ctx.state === 'suspended') return;
        this.initSupernovaBus();
        const t = this.ctx.currentTime;
        if (this.spaceChargeOsc) {
            try { this.spaceChargeOsc.stop(); this.spaceChargeOsc.disconnect(); } catch(e){}
        }
        this.spaceChargeOsc = this.ctx.createOscillator();
        this.spaceChargeOsc.type = 'sine';
        this.spaceChargeOsc.frequency.setValueAtTime(40, t);
        
        this.spaceChargeGain = this.ctx.createGain();
        this.spaceChargeGain.gain.setValueAtTime(0, t);

        this.chargeFilter = this.ctx.createBiquadFilter();
        this.chargeFilter.type = 'lowpass';
        this.chargeFilter.frequency.setValueAtTime(20000, t);
        
        this.spaceChargeOsc.connect(this.spaceChargeGain);
        this.spaceChargeGain.connect(this.chargeFilter);
        this.chargeFilter.connect(this.supernovaFilter);
        this.spaceChargeOsc.start(t);
    }

    updateSupernovaCharge(chargeLevel) {
        if (!this.spaceChargeOsc || !this.spaceChargeGain || !this.chargeFilter) return;
        const t = this.ctx.currentTime;
        
        if (chargeLevel >= 3.0 && chargeLevel < 3.15) {
            this.chargeFilter.frequency.setTargetAtTime(150, t, 0.05);
        } else if (chargeLevel >= 3.3) {
            this.chargeFilter.frequency.setTargetAtTime(20000, t, 0.1);
            this.spaceChargeOsc.frequency.setTargetAtTime(30, t, 0.1);
            this.spaceChargeGain.gain.setTargetAtTime(0.1, t, 0.1);
        } else {
            this.chargeFilter.frequency.setTargetAtTime(20000, t, 0.1);
            let boundedCharge = Math.min(chargeLevel, 3.0) / 3.0;
            this.spaceChargeOsc.frequency.setTargetAtTime(40 + Math.pow(boundedCharge, 2) * 960, t, 0.1);
            this.spaceChargeGain.gain.setTargetAtTime(boundedCharge * 0.08, t, 0.1);
        }
    }

    releaseSupernova() {
        if (!this.initialized) return;
        this.initSupernovaBus();
        const t = this.ctx.currentTime;
        
        const burstOsc = this.ctx.createOscillator();
        const burstGain = this.ctx.createGain();
        burstOsc.type = 'triangle';
        burstOsc.frequency.setValueAtTime(80, t);
        burstOsc.frequency.exponentialRampToValueAtTime(30, t + 1.0);
        
        burstGain.gain.setValueAtTime(0, t);
        burstGain.gain.linearRampToValueAtTime(0.15, t + 0.1);
        burstGain.gain.exponentialRampToValueAtTime(0.001, t + 2.5);
        
        const dopFilter = this.ctx.createBiquadFilter();
        dopFilter.type = 'lowpass';
        dopFilter.frequency.setValueAtTime(500, t); 
        
        burstOsc.connect(burstGain); 
        burstGain.connect(dopFilter);
        dopFilter.connect(this.supernovaFilter);
        
        burstOsc.start(t); burstOsc.stop(t + 2.6);
    }

    releaseHypernova() {
        if (!this.initialized) return;
        this.initSupernovaBus();
        const t = this.ctx.currentTime;
        
        if(this.spaceChargeGain) {
            this.spaceChargeGain.gain.cancelScheduledValues(t);
            this.spaceChargeGain.gain.setValueAtTime(this.spaceChargeGain.gain.value, t);
            this.spaceChargeGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        }
        if(this.spaceChargeOsc) {
            try { this.spaceChargeOsc.stop(t + 0.2); } catch(e){}
        }
        
        const burstOsc = this.ctx.createOscillator();
        burstOsc.type = 'sine';
        burstOsc.frequency.setValueAtTime(45, t);
        burstOsc.frequency.exponentialRampToValueAtTime(15, t + 4.0); 

        const distOsc = this.ctx.createOscillator();
        distOsc.type = 'sawtooth';
        distOsc.frequency.setValueAtTime(45, t);
        distOsc.frequency.exponentialRampToValueAtTime(15, t + 4.0);

        const modGain = this.ctx.createGain();
        modGain.gain.value = 0.5;
        
        const modOsc = this.ctx.createOscillator();
        modOsc.type = 'sine';
        modOsc.frequency.setValueAtTime(18, t); 
        modOsc.frequency.exponentialRampToValueAtTime(3, t + 5.0); 
        
        const modScale = this.ctx.createGain();
        modScale.gain.value = 0.5;
        
        modOsc.connect(modScale);
        modScale.connect(modGain.gain);
        
        const burstGain = this.ctx.createGain();
        burstGain.gain.setValueAtTime(0, t);
        burstGain.gain.linearRampToValueAtTime(1.0, t + 0.05);
        burstGain.gain.exponentialRampToValueAtTime(0.001, t + 7.5);
        
        const subFilter = this.ctx.createBiquadFilter();
        subFilter.type = 'lowpass';
        subFilter.frequency.setValueAtTime(400, t);
        subFilter.frequency.exponentialRampToValueAtTime(30, t + 7.5);
        
        burstOsc.connect(modGain);
        distOsc.connect(modGain);
        modGain.connect(burstGain);
        burstGain.connect(subFilter);
        subFilter.connect(this.supernovaCompressor);
        
        burstOsc.start(t); burstOsc.stop(t + 7.6);
        distOsc.start(t); distOsc.stop(t + 7.6);
        modOsc.start(t); modOsc.stop(t + 7.6);
    }

    playWarpSound() {
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const t = this.ctx.currentTime;
        const masterGain = this.ctx.createGain();
        masterGain.connect(this.ctx.destination);
        masterGain.gain.setValueAtTime(0, t);
        masterGain.gain.linearRampToValueAtTime(0.7, t + 0.005);
        const delay = this.ctx.createDelay(); delay.delayTime.value = 0.3;
        const feedback = this.ctx.createGain(); feedback.gain.value = 0.4;
        const filter = this.ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.setValueAtTime(2000, t);
        masterGain.connect(delay); delay.connect(filter); filter.connect(feedback); feedback.connect(delay); filter.connect(this.ctx.destination);
        const clickOsc = this.ctx.createOscillator(); const clickGain = this.ctx.createGain();
        clickOsc.type = 'square'; clickOsc.frequency.setValueAtTime(150, t); clickOsc.frequency.exponentialRampToValueAtTime(40, t + 0.05);
        clickGain.gain.setValueAtTime(0.3, t); clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        clickOsc.connect(clickGain); clickGain.connect(this.ctx.destination); clickOsc.start(t); clickOsc.stop(t + 0.06);
        const freqs = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51];
        freqs.forEach((freq, i) => {
            const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain(); osc.type = 'sine'; osc.frequency.value = freq;
            const start = t + (i * 0.06); gain.gain.setValueAtTime(0, start); gain.gain.linearRampToValueAtTime(0.2, start + 0.05); gain.gain.exponentialRampToValueAtTime(0.001, start + 1.2);
            osc.connect(gain); gain.connect(masterGain); osc.start(start); osc.stop(start + 1.3);
        });
        const pullOsc = this.ctx.createOscillator(); const pullGain = this.ctx.createGain(); pullOsc.type = 'sawtooth';
        pullOsc.frequency.setValueAtTime(40, t); pullOsc.frequency.exponentialRampToValueAtTime(440, t + 1.0); 
        const pullFilter = this.ctx.createBiquadFilter(); pullFilter.type = 'lowpass'; pullFilter.frequency.setValueAtTime(200, t); pullFilter.frequency.exponentialRampToValueAtTime(1200, t + 1.0);
        pullGain.gain.setValueAtTime(0, t); pullGain.gain.linearRampToValueAtTime(0.5, t + 0.3); pullGain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
        pullOsc.connect(pullFilter); pullFilter.connect(pullGain); pullGain.connect(masterGain); pullOsc.start(t); pullOsc.stop(t + 1.3);
        const subOsc = this.ctx.createOscillator(); const subGain = this.ctx.createGain(); subOsc.type = 'sine'; subOsc.frequency.setValueAtTime(55, t); subGain.gain.setValueAtTime(0.6, t); subGain.gain.exponentialRampToValueAtTime(0.001, t + 1.0); subOsc.connect(subGain); subGain.connect(this.ctx.destination); subOsc.start(t); subOsc.stop(t + 1.1);
    }

    stopCompletionTheme() {
        if (this.activeThemeNodes.length > 0) {
            this.activeThemeNodes.forEach(node => { try { node.stop(); node.disconnect(); } catch (e) {} });
        }
        this.activeThemeNodes = [];
        if (this.themeMasterGain) { try { this.themeMasterGain.gain.cancelScheduledValues(this.ctx.currentTime); this.themeMasterGain.gain.setValueAtTime(0, this.ctx.currentTime); this.themeMasterGain.disconnect(); } catch(e) {} }
    }

    playCompletionTheme() {
        if (this.ctx.state === 'suspended') this.ctx.resume();
        this.stopCompletionTheme(); 
        const t = this.ctx.currentTime;
        
        this.themeMasterGain = this.ctx.createGain();

        const compressor = this.ctx.createDynamicsCompressor();
        compressor.threshold.setValueAtTime(-24, t);
        compressor.knee.setValueAtTime(30, t);
        compressor.ratio.setValueAtTime(12, t);
        compressor.attack.setValueAtTime(0.003, t);
        compressor.release.setValueAtTime(0.25, t);

        const breathFilter = this.ctx.createBiquadFilter(); 
        breathFilter.type = 'lowpass'; 
        breathFilter.frequency.setValueAtTime(600, t); 
        breathFilter.frequency.exponentialRampToValueAtTime(1800, t + 1.5); 
        breathFilter.frequency.exponentialRampToValueAtTime(300, t + 3.0); 
        
        this.themeMasterGain.connect(breathFilter); 
        breathFilter.connect(compressor); 
        compressor.connect(this.ctx.destination); 
        
        this.themeMasterGain.gain.setValueAtTime(0, t); 
        this.themeMasterGain.gain.linearRampToValueAtTime(0.20, t + 1.5);

        const playPianoKey = (freq, start, sustainDuration, peakVol) => {
            const osc1 = this.ctx.createOscillator(); osc1.type = 'triangle'; osc1.frequency.value = freq;
            const osc2 = this.ctx.createOscillator(); osc2.type = 'sine'; osc2.frequency.value = freq * 2;
            const overtoneGain = this.ctx.createGain(); overtoneGain.gain.value = 0.2; osc2.connect(overtoneGain);
            const keyGain = this.ctx.createGain();
            keyGain.gain.setValueAtTime(0, start); keyGain.gain.linearRampToValueAtTime(peakVol, start + 0.05); keyGain.gain.exponentialRampToValueAtTime(peakVol * 0.7, start + 0.6); keyGain.gain.exponentialRampToValueAtTime(0.001, start + sustainDuration);
            osc1.connect(keyGain); overtoneGain.connect(keyGain); keyGain.connect(this.themeMasterGain);
            osc1.start(start); osc2.start(start); osc1.stop(start + sustainDuration + 0.5); osc2.stop(start + sustainDuration + 0.5);
            this.activeThemeNodes.push(osc1, osc2, keyGain, overtoneGain);
        };

        let time = t; const beat = 0.95;
        playPianoKey(97.99,  time, beat * 1.5, 0.45); playPianoKey(196.00, time, beat * 1.5, 0.25); playPianoKey(246.94, time, beat * 1.5, 0.25); playPianoKey(493.88, time, beat * 0.7, 0.35); playPianoKey(554.37, time + (beat * 0.5), beat * 0.7, 0.38);
        time += beat; playPianoKey(110.00, time, beat * 1.5, 0.5); playPianoKey(220.00, time, beat * 1.5, 0.3); playPianoKey(277.18, time, beat * 1.5, 0.3); playPianoKey(587.33, time, beat * 0.7, 0.42); playPianoKey(659.25, time + (beat * 0.5), beat * 0.7, 0.45);
        time += beat; playPianoKey(92.50,  time, beat * 2.0, 0.4); playPianoKey(185.00, time, beat * 2.0, 0.25); playPianoKey(554.37, time, beat * 0.8, 0.35);
        let ritard = time + (beat * 0.5) + 0.18; playPianoKey(440.00, ritard, beat * 1.2, 0.3);
        
        time = ritard + (beat * 0.5) + 0.35; const releaseDuration = 5.5; 
        playPianoKey(73.42,  time,        releaseDuration, 0.55); 
        playPianoKey(146.83, time + 0.08, releaseDuration, 0.3); 
        playPianoKey(185.00, time + 0.16, releaseDuration, 0.25); 
        playPianoKey(220.00, time + 0.24, releaseDuration, 0.25); 
        playPianoKey(277.18, time + 0.32, releaseDuration, 0.3); 
        playPianoKey(329.63, time + 0.40, releaseDuration, 0.35);
        playPianoKey(587.33, time + 0.48, releaseDuration, 0.35); 
    }

    setHoverState(isMoving, activeSprite) {
        if (!this.initialized || this.ctx.state === 'suspended' || !this.hoverGain) return;
        const t = this.ctx.currentTime;
        if (isMoving && activeSprite === 'cursor') {
            if (!this.humActive) { 
                this.humActive = true; 
                this.hoverGain.gain.cancelScheduledValues(t);
                this.hoverGain.gain.setValueAtTime(this.hoverGain.gain.value || 0, t);
                this.hoverGain.gain.linearRampToValueAtTime(0.12, t + 0.05); 
                this.hoverFilter.frequency.setTargetAtTime(400, t, 0.05); 
            }
        } else {
            if (this.humActive) { 
                this.humActive = false; 
                this.hoverGain.gain.cancelScheduledValues(t);
                this.hoverGain.gain.setValueAtTime(this.hoverGain.gain.value || 0, t);
                this.hoverGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.1); 
                this.hoverGain.gain.setValueAtTime(0, t + 0.15);
                this.hoverFilter.frequency.setTargetAtTime(100, t, 0.1); 
                this.hoverOsc.frequency.setTargetAtTime(45, t, 0.1); 
            }
        }
    }

    setHoverVelocity(vel) {
        if (!this.hoverOsc || !this.humActive) return;
        const t = this.ctx.currentTime;
        if (vel === 0) { this.hoverOsc.frequency.setTargetAtTime(45, t, 0.1); this.hoverFilter.frequency.setTargetAtTime(400, t, 0.1); return; }
        const targetPitch = 45 + Math.min(vel * 1.5, 80); const targetFilter = 400 + Math.min(vel * 15, 1200);
        this.hoverOsc.frequency.setTargetAtTime(targetPitch, t, 0.1); this.hoverFilter.frequency.setTargetAtTime(targetFilter, t, 0.1);
    }

    setFireMode(isActive) {
        if (!this.initialized) return;
        if (isActive && !this.fireWindNode) {
            this.fireWindNode = this.ctx.createBufferSource(); 
            this.fireWindNode.buffer = this.noiseBuffer; 
            this.fireWindNode.loop = true;

            this.brownFilter = this.ctx.createBiquadFilter();
            this.brownFilter.type = 'lowpass';
            this.brownFilter.frequency.value = 150; 
            
            this.panL = this.ctx.createStereoPanner();
            this.panR = this.ctx.createStereoPanner();
            const haasDelay = this.ctx.createDelay();
            haasDelay.delayTime.value = 0.015; 

            this.fireWindGainL = this.ctx.createGain();
            this.fireWindGainR = this.ctx.createGain();
            this.fireWindGainL.gain.value = 0;
            this.fireWindGainR.gain.value = 0;

            this.fireWindNode.connect(this.brownFilter);
            this.brownFilter.connect(this.fireWindGainL);
            this.brownFilter.connect(this.fireWindGainR);

            this.fireWindGainL.connect(this.panL);
            this.fireWindGainR.connect(haasDelay).connect(this.panR);

            this.panL.connect(this.ctx.destination);
            this.panR.connect(this.ctx.destination);
            
            this.fireWindNode.start();
        } else if (!isActive && this.fireWindNode) { 
            this.fireWindNode.stop(); this.fireWindNode.disconnect(); this.fireWindNode = null; 
            if (this.brownFilter) { this.brownFilter.disconnect(); this.brownFilter = null; }
            if (this.fireWindGainL) { this.fireWindGainL.disconnect(); this.fireWindGainL = null; }
            if (this.fireWindGainR) { this.fireWindGainR.disconnect(); this.fireWindGainR = null; }
        }
    }

    setFireVelocity(vel, intensity = 50, isHovering = true) {
        if (!this.fireWindGainL || !this.fireWindGainR) return;
        const t = this.ctx.currentTime;
        if (!isHovering && vel === 0) { 
            this.fireWindGainL.gain.cancelScheduledValues(t);
            this.fireWindGainL.gain.setValueAtTime(this.fireWindGainL.gain.value || 0, t);
            this.fireWindGainL.gain.exponentialRampToValueAtTime(0.0001, t + 0.05); 
            this.fireWindGainL.gain.setValueAtTime(0, t + 0.05);
            
            this.fireWindGainR.gain.cancelScheduledValues(t);
            this.fireWindGainR.gain.setValueAtTime(this.fireWindGainR.gain.value || 0, t);
            this.fireWindGainR.gain.exponentialRampToValueAtTime(0.0001, t + 0.05); 
            this.fireWindGainR.gain.setValueAtTime(0, t + 0.05);
            return; 
        }
        
        let iFactor = intensity / 100;
        
        let spread = iFactor; 
        if(this.panL && this.panR) {
            this.panL.pan.setTargetAtTime(-spread, t, 0.1);
            this.panR.pan.setTargetAtTime(spread, t, 0.1);
        }

        const targetFreq = 100 + (iFactor * 300) + Math.min(vel * 5, 100); 
        const targetGain = (iFactor * 0.16) + Math.min(vel * 0.004, 0.08);
        
        if(this.brownFilter) this.brownFilter.frequency.setTargetAtTime(targetFreq, t, 0.1); 
        
        this.fireWindGainL.gain.setTargetAtTime(targetGain, t, 0.1);
        this.fireWindGainR.gain.setTargetAtTime(targetGain, t, 0.1);
    }

    playCrackle(intensity = 50) {
        if (this.ctx.state === 'suspended') return;
        const t = this.ctx.currentTime; const dur = 0.06 + Math.random() * 0.15; const bufferSize = this.ctx.sampleRate * dur;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate); const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        
        let iFactor = intensity / 100;
        
        const noise = this.ctx.createBufferSource(); noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter(); filter.type = 'bandpass'; 
        filter.frequency.value = 300 + Math.random() * 400; 
        filter.Q.value = 0.8 + (1 - iFactor);
        
        const gain = this.ctx.createGain(); gain.gain.setValueAtTime(0, t); 
        gain.gain.linearRampToValueAtTime((0.02 + iFactor * 0.05) + Math.random() * 0.02, t + 0.02); 
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur * 1.5);
        
        noise.connect(filter); filter.connect(gain); gain.connect(this.ctx.destination); noise.start(t);
    }
    
    playForward() {
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const t = this.ctx.currentTime; const masterGain = this.ctx.createGain(); masterGain.connect(this.ctx.destination); masterGain.gain.setValueAtTime(0, t); masterGain.gain.linearRampToValueAtTime(0.6, t + 0.01); 
        const clickOsc = this.ctx.createOscillator(); const clickGain = this.ctx.createGain(); clickOsc.type = 'sine'; clickOsc.frequency.setValueAtTime(600, t); clickOsc.frequency.exponentialRampToValueAtTime(50, t + 0.02); clickGain.gain.setValueAtTime(0.5, t); clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.03); clickOsc.connect(clickGain); clickGain.connect(masterGain); clickOsc.start(t); clickOsc.stop(t + 0.04);
        const freqs = [92.50, 146.83, 220.00, 293.66];
        freqs.forEach((freq, index) => {
            const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain(); const startTime = t + (index * 0.03); 
            osc.type = index === 0 ? 'triangle' : 'sine'; osc.frequency.setValueAtTime(freq, startTime); osc.frequency.setValueAtTime(freq + 5, startTime); osc.frequency.exponentialRampToValueAtTime(freq, startTime + 0.15);
            gain.gain.setValueAtTime(0, startTime); gain.gain.linearRampToValueAtTime(index === 0 ? 0.6 : 0.3, startTime + 0.03); gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);
            osc.connect(gain); gain.connect(masterGain); osc.start(startTime); osc.stop(startTime + 0.9);
        });
        const filter = this.ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.setValueAtTime(600, t); filter.frequency.exponentialRampToValueAtTime(100, t + 0.8); 
        const delay = this.ctx.createDelay(); delay.delayTime.value = 0.08; const feedback = this.ctx.createGain(); feedback.gain.value = 0.15;
        masterGain.connect(delay); delay.connect(filter); filter.connect(feedback); feedback.connect(delay); filter.connect(this.ctx.destination);
    }

    playBackward() {
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const t = this.ctx.currentTime; const masterGain = this.ctx.createGain(); masterGain.connect(this.ctx.destination); masterGain.gain.setValueAtTime(0, t); masterGain.gain.linearRampToValueAtTime(0.5, t + 0.01);
        const clickOsc = this.ctx.createOscillator(); const clickGain = this.ctx.createGain(); clickOsc.type = 'sine'; clickOsc.frequency.setValueAtTime(320, t); clickOsc.frequency.exponentialRampToValueAtTime(40, t + 0.03); clickGain.gain.setValueAtTime(0.35, t); clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04); clickOsc.connect(clickGain); clickGain.connect(masterGain); clickOsc.start(t); clickOsc.stop(t + 0.05);
        const freqs = [293.66, 220.00, 185.00, 73.41];
        freqs.forEach((freq, index) => {
            const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain(); const startTime = t + (index * 0.035);
            osc.type = index === 3 ? 'triangle' : 'sine'; osc.frequency.setValueAtTime(freq, startTime); osc.frequency.exponentialRampToValueAtTime(freq * 0.96, startTime + 0.12);
            gain.gain.setValueAtTime(0, startTime); gain.gain.linearRampToValueAtTime(index === 3 ? 0.5 : 0.25, startTime + 0.02); gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.7);
            osc.connect(gain); gain.connect(masterGain); osc.start(startTime); osc.stop(startTime + 0.8);
        });
        const filter = this.ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.setValueAtTime(450, t); filter.frequency.exponentialRampToValueAtTime(70, t + 0.6);
        const delay = this.ctx.createDelay(); delay.delayTime.value = 0.06; const feedback = this.ctx.createGain(); feedback.gain.value = 0.12;
        masterGain.connect(delay); delay.connect(filter); filter.connect(feedback); feedback.connect(delay); filter.connect(this.ctx.destination);
    }

    playStepForward() {
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const t = this.ctx.currentTime; const masterGain = this.ctx.createGain(); masterGain.connect(this.ctx.destination); masterGain.gain.setValueAtTime(0, t); masterGain.gain.linearRampToValueAtTime(0.2, t + 0.005); 
        const osc1 = this.ctx.createOscillator(); const osc2 = this.ctx.createOscillator(); const gain1 = this.ctx.createGain(); const gain2 = this.ctx.createGain();
        osc1.type = 'sine'; osc1.frequency.setValueAtTime(220.00, t); osc2.type = 'sine'; osc2.frequency.setValueAtTime(293.66, t + 0.02); 
        gain1.gain.setValueAtTime(0, t); gain1.gain.linearRampToValueAtTime(0.5, t + 0.01); gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        gain2.gain.setValueAtTime(0, t + 0.02); gain2.gain.linearRampToValueAtTime(0.5, t + 0.03); gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        const filter = this.ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.setValueAtTime(1500, t); filter.frequency.exponentialRampToValueAtTime(400, t + 0.15);
        osc1.connect(gain1); osc2.connect(gain2); gain1.connect(filter); gain2.connect(filter); filter.connect(masterGain);
        osc1.start(t); osc2.start(t); osc1.stop(t + 0.2); osc2.stop(t + 0.2);
    }

    playStepBackward() {
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const t = this.ctx.currentTime; const masterGain = this.ctx.createGain(); masterGain.connect(this.ctx.destination); masterGain.gain.setValueAtTime(0, t); masterGain.gain.linearRampToValueAtTime(0.2, t + 0.005);
        const osc1 = this.ctx.createOscillator(); const osc2 = this.ctx.createOscillator(); const gain1 = this.ctx.createGain(); const gain2 = this.ctx.createGain();
        osc1.type = 'sine'; osc1.frequency.setValueAtTime(293.66, t); osc2.type = 'sine'; osc2.frequency.setValueAtTime(220.00, t + 0.02); 
        gain1.gain.setValueAtTime(0, t); gain1.gain.linearRampToValueAtTime(0.4, t + 0.01); gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        gain2.gain.setValueAtTime(0, t + 0.02); gain2.gain.linearRampToValueAtTime(0.4, t + 0.03); gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        const filter = this.ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.setValueAtTime(800, t); filter.frequency.exponentialRampToValueAtTime(200, t + 0.15);
        osc1.connect(gain1); osc2.connect(gain2); gain1.connect(filter); gain2.connect(filter); filter.connect(masterGain);
        osc1.start(t); osc2.start(t); osc1.stop(t + 0.2); osc2.stop(t + 0.2);
    }

    playToggleState(isOn) {
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const t = this.ctx.currentTime; const masterGain = this.ctx.createGain(); masterGain.connect(this.ctx.destination); masterGain.gain.setValueAtTime(0, t); masterGain.gain.linearRampToValueAtTime(0.4, t + 0.005);
        const clickOsc = this.ctx.createOscillator(); const clickGain = this.ctx.createGain(); clickOsc.type = 'sine'; clickOsc.frequency.setValueAtTime(isOn ? 400 : 200, t); clickOsc.frequency.exponentialRampToValueAtTime(50, t + 0.02); clickGain.gain.setValueAtTime(0.4, t); clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.03); clickOsc.connect(clickGain); clickGain.connect(masterGain); clickOsc.start(t); clickOsc.stop(t + 0.04);
        const osc = this.ctx.createOscillator(); const osc2 = this.ctx.createOscillator(); const gain = this.ctx.createGain(); osc.type = 'triangle'; osc2.type = 'sine'; const baseFreq = 73.42; 
        if (isOn) {
            osc.frequency.setValueAtTime(baseFreq - 5, t); osc.frequency.exponentialRampToValueAtTime(baseFreq, t + 0.2); osc2.frequency.setValueAtTime((baseFreq * 2) - 5, t); osc2.frequency.exponentialRampToValueAtTime(baseFreq * 2, t + 0.2);
            gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(0.6, t + 0.05); gain.gain.exponentialRampToValueAtTime(0.001, t + 1.5);
        } else {
            osc.frequency.setValueAtTime(baseFreq, t); osc.frequency.exponentialRampToValueAtTime(baseFreq - 15, t + 0.3); osc2.frequency.setValueAtTime(baseFreq * 2, t); osc2.frequency.exponentialRampToValueAtTime((baseFreq * 2) - 15, t + 0.3);
            gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(0.5, t + 0.02); gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4); 
        }
        const filter = this.ctx.createBiquadFilter(); filter.type = 'lowpass';
        if (isOn) { filter.frequency.setValueAtTime(200, t); filter.frequency.exponentialRampToValueAtTime(1000, t + 0.1); filter.frequency.exponentialRampToValueAtTime(150, t + 1.5); } 
        else { filter.frequency.setValueAtTime(800, t); filter.frequency.exponentialRampToValueAtTime(80, t + 0.3); }
        const delay = this.ctx.createDelay(); delay.delayTime.value = 0.05; const feedback = this.ctx.createGain(); feedback.gain.value = 0.1;
        osc.connect(gain); osc2.connect(gain); gain.connect(filter); filter.connect(masterGain); filter.connect(delay); delay.connect(feedback); feedback.connect(delay); filter.connect(masterGain);
        osc.start(t); osc2.start(t); osc.stop(t + 2.0); osc.stop(t + 2.0);
    }
}

const uiSound = new UIChime();

document.addEventListener("DOMContentLoaded", () => {
    
    // --- MASTER MODE (ADMIN) ARCHITECTURE ---
    let isAdminMode = false;
    const btnAdminLogin = document.getElementById('btn-admin-login');
    const btnAdminExit = document.getElementById('btn-admin-exit');
    const btnAdminSkipRpg = document.getElementById('btn-admin-skip-rpg');

    btnAdminLogin.addEventListener('click', () => {
        const code = prompt("Enter Administrator Passcode:");
        if (code === "070121") {
            isAdminMode = true;
            btnAdminLogin.style.display = 'none';
            btnAdminExit.style.display = 'block';
            btnAdminSkipRpg.style.display = 'block';
            document.body.classList.add('toc-active'); 
            updateNextButton(); 
            alert("Master Mode Unlocked. You have full autonomous navigation.");
        } else if (code !== null) {
            alert("Access Denied: Incorrect Passcode.");
        }
    });

    btnAdminExit.addEventListener('click', () => {
        isAdminMode = false;
        btnAdminLogin.style.display = 'block';
        btnAdminExit.style.display = 'none';
        btnAdminSkipRpg.style.display = 'none';
        document.getElementById('btn-restart').click(); 
        alert("Master Mode Exited. Module reset to Associate view.");
    });

    btnAdminSkipRpg.addEventListener('click', (e) => {
        if (!isAdminMode || !currentScenario) return;
        e.stopPropagation();
        uiSound.playForward();
        askedSummaries = [currentScenario.discover.D1.summary, currentScenario.discover.D2.summary];
        rpgState = "WAIT";
        typeText("[ADMIN OVERRIDE] Fast-forwarding directly to the closing phase to test aftermath logic. Please select a TV to recommend.", "System", "CLOSE_CHOICE");
    });

    document.body.addEventListener('click', () => uiSound.init(), { once: true });
    
    let currentGlobalSlide = 0;
    const totalSlides = 9; 
    const sliderWrapper = document.getElementById('slider-wrapper');
    const navPrev = document.getElementById('nav-prev');
    const navNext = document.getElementById('nav-next');
    let slideCompletion = [true, false, false, false, false, false, true, false, true]; 
    window.slideControllers = {};
    let moduleCompleted = false;

    function goToSlide(index) {
        if(index < 0 || index >= totalSlides) return;
        
        speechEngine.cancel(); 
        
        if (currentGlobalSlide === 8 && index !== 8) uiSound.stopCompletionTheme();
        if (index === 8 && currentGlobalSlide !== 8) uiSound.playCompletionTheme(); 
        else if (index < currentGlobalSlide) uiSound.playBackward(); 
        else if (index > currentGlobalSlide) uiSound.playForward();
        
        if(window.slideControllers[currentGlobalSlide]) window.slideControllers[currentGlobalSlide].onLeave();

        currentGlobalSlide = index;
        sliderWrapper.style.transform = `translateY(-${currentGlobalSlide * 100}vh)`;

        if(currentGlobalSlide === 0) { navPrev.classList.remove('visible'); navNext.innerText = "Start Module ❯"; navNext.style.display = 'block'; } 
        else if (currentGlobalSlide === 6 || currentGlobalSlide === 7 || currentGlobalSlide === 8) { navPrev.classList.add('visible'); navNext.style.display = 'none'; } 
        else { navPrev.classList.add('visible'); navNext.style.display = 'block'; navNext.innerText = "Continue ❯"; }
        updateNextButton();

        document.querySelectorAll('.slide-container').forEach((el, i) => {
            const fades = el.querySelectorAll('.fade-element');
            if(i === currentGlobalSlide) fades.forEach(f => f.classList.add('visible'));
            else fades.forEach(f => f.classList.remove('visible'));
        });

        document.querySelectorAll('.toc-link').forEach(btn => btn.classList.remove('current'));
        const activeLink = document.querySelector(`.toc-link[data-target="${currentGlobalSlide}"]`);
        if(activeLink) activeLink.classList.add('current');

        if (currentGlobalSlide === 8 && !moduleCompleted) {
            moduleCompleted = true;
            setTimeout(() => { document.body.classList.add('toc-active'); }, 4500); 
        }

        if(window.slideControllers[currentGlobalSlide]) window.slideControllers[currentGlobalSlide].onEnter();
    }

    function updateNextButton() {
        if(currentGlobalSlide === 6 || currentGlobalSlide === 7 || currentGlobalSlide === 8) return; 
        if(isAdminMode || slideCompletion[currentGlobalSlide]) navNext.classList.add('visible');
        else navNext.classList.remove('visible');
    }

    navPrev.addEventListener('click', () => {
        const controller = window.slideControllers[currentGlobalSlide];
        if (controller && controller.prevStep && controller.prevStep()) { uiSound.playStepBackward(); return; }
        goToSlide(currentGlobalSlide - 1);
    });

    navNext.addEventListener('click', () => {
        const controller = window.slideControllers[currentGlobalSlide];
        if (controller && controller.nextStep && controller.nextStep()) { uiSound.playStepForward(); return; }
        if (currentGlobalSlide < totalSlides - 1) goToSlide(currentGlobalSlide + 1);
    });

    document.getElementById('btn-start-virtual-exp').addEventListener('click', () => { 
        uiSound.playWarpSound();
        goToSlide(7); 
    });

    document.addEventListener('keydown', (e) => {
        if (e.target.tagName.toLowerCase() === 'input') return;
        if (e.key === 'ArrowRight') {
            const controller = window.slideControllers[currentGlobalSlide];
            if (controller && controller.nextStep && controller.nextStep()) { uiSound.playStepForward(); return; }
            if (currentGlobalSlide < totalSlides - 1 && slideCompletion[currentGlobalSlide] && currentGlobalSlide !== 6 && currentGlobalSlide !== 7 && currentGlobalSlide !== 8) goToSlide(currentGlobalSlide + 1);
        } else if (e.key === 'ArrowLeft') {
            const controller = window.slideControllers[currentGlobalSlide];
            if (controller && controller.prevStep && controller.prevStep()) { uiSound.playStepBackward(); return; }
            if (currentGlobalSlide > 0) goToSlide(currentGlobalSlide - 1);
        }
    });

    document.querySelectorAll('.toc-link').forEach(btn => {
        btn.addEventListener('click', (e) => { 
            let targetIndex = parseInt(e.currentTarget.getAttribute('data-target'));
            if(window.slideControllers[targetIndex]) window.slideControllers[targetIndex].reset();
            goToSlide(targetIndex); 
        });
    });

    document.getElementById('btn-restart').addEventListener('click', () => {
        speechEngine.cancel(); uiSound.stopCompletionTheme(); uiSound.playBackward();
        document.body.classList.remove('toc-active'); moduleCompleted = false;
        slideCompletion = [true, false, false, false, false, false, true, false, true];
        hasCompletedOneScenario = false; document.getElementById('btn-persistent-finish').style.display = 'none';
        for(let key in window.slideControllers) { if (window.slideControllers[key].hardReset) window.slideControllers[key].hardReset(); window.slideControllers[key].reset(); }
        activeScenarioPool = [...masterScenarioBank]; scoreKept = 0; scoreReturned = 0;
        document.getElementById('score-kept').innerText = "0"; document.getElementById('score-returned').innerText = "0";
        initRPG(); goToSlide(0);
    });

    function initSequenceController(slideIndex, textIds, svgIds, btnPrevId, btnNextId, stepCountId, mode) {
        let currentStep = 0; const texts = textIds.map(id => document.getElementById(id)); const svgs = svgIds.map(id => document.getElementById(id)); const totalSteps = texts.length; 
        let lockTimer = null; let hasWaited = false; let isActive = false;  
        const btnPrev = document.getElementById(btnPrevId); const btnNext = document.getElementById(btnNextId); const stepCount = document.getElementById(stepCountId); const anchor = svgs[0].parentElement;

        const updateStep = () => {
            if (lockTimer) { clearInterval(lockTimer); lockTimer = null; }
            for (let i = 0; i < texts.length; i++) {
                if (currentStep === totalSteps || currentStep === i) { texts[i].style.opacity = '1'; svgs[i].style.opacity = '1'; svgs[i].style.pointerEvents = 'auto'; } 
                else { texts[i].style.opacity = '0.2'; svgs[i].style.opacity = '0'; svgs[i].style.pointerEvents = 'none'; }
            }
            if (mode === 'stack') {
                if (currentStep === totalSteps) anchor.classList.add('stack-active');
                else anchor.classList.remove('stack-active');
            }
            stepCount.innerText = `${currentStep + 1} / ${totalSteps + 1}`;
            
            if (audioEnabled && isActive) {
                let slideText = currentStep === totalSteps ? texts[0].innerText : (texts[currentStep] ? texts[currentStep].innerText : "");
                if (slideText) playSpeech(slideText);
            }

            const qledGraphic = document.getElementById('qled-layer-graphic');
            if (slideIndex === 3 && qledGraphic) {
                if (currentStep === 0 && isActive) { if (!qledGraphic.classList.contains('play-anim')) { void qledGraphic.offsetWidth; qledGraphic.classList.add('play-anim'); } } 
                else { qledGraphic.classList.remove('play-anim'); }
            }
            if (slideIndex === 3 && currentStep === 0 && !hasWaited && isActive) {
                if (isAdminMode) {
                    btnNext.disabled = false; btnPrev.disabled = true; btnNext.innerText = "Examine ❯"; btnNext.classList.remove('replay-mode'); hasWaited = true; updateNextButton();
                } else {
                    btnNext.disabled = true; btnPrev.disabled = true; btnNext.classList.remove('replay-mode'); let timeLeft = 10; btnNext.innerText = `Animating (${timeLeft}s)`;
                    lockTimer = setInterval(() => {
                        timeLeft--;
                        if (timeLeft > 0) { btnNext.innerText = `Animating (${timeLeft}s)`; } 
                        else { clearInterval(lockTimer); lockTimer = null; hasWaited = true; if (currentStep === 0) { btnNext.disabled = false; btnNext.innerText = "Examine ❯"; btnNext.classList.remove('replay-mode'); } updateNextButton(); }
                    }, 1000);
                }
            } else { 
                btnPrev.disabled = currentStep === 0; 
                btnPrev.innerText = "❮ Review";
                if (currentStep === totalSteps) {
                    btnNext.disabled = false;
                    btnNext.innerText = "Replay ↺";
                    btnNext.classList.add('replay-mode');
                } else {
                    btnNext.disabled = false;
                    btnNext.innerText = "Examine ❯";
                    btnNext.classList.remove('replay-mode');
                }
            }
            if(currentStep === totalSteps) { slideCompletion[slideIndex] = true; updateNextButton(); }
        };

        const triggerNext = () => { if (!btnNext.disabled && currentStep < totalSteps) { currentStep++; updateStep(); return true; } return false; };
        const triggerPrev = () => { if (!btnPrev.disabled && currentStep > 0) { currentStep--; updateStep(); return true; } return false; };
        const replaySequence = () => { currentStep = 0; updateStep(); };

        btnPrev.addEventListener('click', () => { if (triggerPrev()) uiSound.playStepBackward(); });
        btnNext.addEventListener('click', () => { 
            if (currentStep === totalSteps) {
                replaySequence();
                uiSound.playBackward();
            } else {
                if (triggerNext()) uiSound.playStepForward(); 
            }
        });
        
        window.slideControllers[slideIndex] = {
            onEnter: () => { isActive = true; updateStep(); },
            onLeave: () => { 
                isActive = false; 
                if (lockTimer) { clearInterval(lockTimer); lockTimer = null; } 
                const qledGraphic = document.getElementById('qled-layer-graphic'); 
                if (slideIndex === 3 && qledGraphic) qledGraphic.classList.remove('play-anim'); 
                if (slideIndex === 4 && uiSound.killCanvasAudio) uiSound.killCanvasAudio();
            },
            reset: () => { 
                if (lockTimer) clearInterval(lockTimer); currentStep = 0; 
                if (slideIndex === 5) { 
                    const ghostGroup = document.getElementById('burn-in-ghost'); const scanLine = document.getElementById('oled-scanner'); const btnProtect = document.getElementById('btn-protect'); 
                    if (ghostGroup && btnProtect) { ghostGroup.style.opacity = '0.6'; btnProtect.innerText = "Run Pixel Refresher"; btnProtect.disabled = false; isCleaned = false; } 
                    if (scanLine) scanLine.classList.remove('run-scan'); 
                } 
            },
            hardReset: () => { hasWaited = false; },
            nextStep: triggerNext,
            prevStep: triggerPrev
        };
    }

    initSequenceController(1, ['text-led-1', 'text-lcd-1', 'text-color-1'], ['svg-led-1', 'svg-lcd-1', 'svg-color-1'], 'btn-prev-1', 'btn-next-1', 'step-count-1', 'overlay');
    initSequenceController(2, ['text-base-2', 'text-limit-2', 'text-best-2'], ['svg-base-2', 'svg-limit-2', 'svg-best-2'], 'btn-prev-2', 'btn-next-2', 'step-count-2', 'stack');
    initSequenceController(3, ['text-base-3', 'text-limit-3', 'text-best-3'], ['svg-base-3', 'svg-limit-3', 'svg-best-3'], 'btn-prev-3', 'btn-next-3', 'step-count-3', 'stack');
    initSequenceController(4, ['text-base-4', 'text-limit-4', 'text-color-4', 'text-best-4'], ['svg-base-4', 'svg-limit-4', 'svg-color-4', 'svg-best-4'], 'btn-prev-4', 'btn-next-4', 'step-count-4', 'stack');
    initSequenceController(5, ['text-base-5', 'text-limit-5', 'text-burn-5', 'text-best-5'], ['svg-base-5', 'svg-limit-5', 'svg-burn-5', 'svg-best-5'], 'btn-prev-5', 'btn-next-5', 'step-count-5', 'stack');

    const raySvg = document.getElementById('interactive-qd-ray'); const qdContainer = document.getElementById('qd-array-container'); const userBeam = document.getElementById('user-beam'); const userLedGroup = document.getElementById('user-led-group'); const userLed = document.getElementById('user-led'); const userLedBack = document.getElementById('user-led-back'); const ledLabelText = document.getElementById('led-label-text'); const toggleLedBtn = document.getElementById('toggle-led-btn');
    let ledIsOn = false; let currentMouseX = 40; let currentMouseY = 120; const qd_dots = []; const dotYPositions = [35, 50, 65, 80, 95, 110, 125, 140, 155, 170, 185, 200];
    dotYPositions.forEach(y => { 
        const dotGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        const dotHalo = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); dotHalo.setAttribute('cx', '120'); dotHalo.setAttribute('cy', y); dotHalo.setAttribute('r', '8'); dotHalo.setAttribute('fill', 'var(--qd-color)'); dotHalo.setAttribute('opacity', '0'); dotHalo.setAttribute('filter', 'url(#premium-bloom)');
        const dotCore = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); dotCore.setAttribute('cx', '120'); dotCore.setAttribute('cy', y); dotCore.setAttribute('r', '4'); dotCore.setAttribute('fill', '#333'); dotCore.setAttribute('stroke', '#222'); dotCore.setAttribute('stroke-width', '1'); 
        dotGroup.appendChild(dotHalo); dotGroup.appendChild(dotCore);
        const rayR = document.createElementNS('http://www.w3.org/2000/svg', 'polygon'); rayR.setAttribute('points', `125,${y} 240,${y - 25} 240,${y - 5}`); rayR.setAttribute('fill', 'url(#fade-R)'); rayR.setAttribute('opacity', '0'); rayR.style.mixBlendMode = 'screen';
        const rayG = document.createElementNS('http://www.w3.org/2000/svg', 'polygon'); rayG.setAttribute('points', `125,${y} 240,${y - 10} 240,${y + 10}`); rayG.setAttribute('fill', 'url(#fade-G)'); rayG.setAttribute('opacity', '0'); rayG.style.mixBlendMode = 'screen';
        const rayB = document.createElementNS('http://www.w3.org/2000/svg', 'polygon'); rayB.setAttribute('points', `125,${y} 240,${y + 5} 240,${y + 25}`); rayB.setAttribute('fill', 'url(#fade-B)'); rayB.setAttribute('opacity', '0'); rayB.style.mixBlendMode = 'screen';
        qdContainer.appendChild(rayR); qdContainer.appendChild(rayG); qdContainer.appendChild(rayB); qdContainer.appendChild(dotGroup); qd_dots.push({ y, dotCore, dotHalo, rays: [rayR, rayG, rayB] }); 
    });

    function updateBeamPhysics() { 
        if (!ledIsOn) { 
            userBeam.setAttribute('opacity', '0'); userLedGroup.setAttribute('opacity', '0.3'); userLed.setAttribute('fill', '#555'); 
            qd_dots.forEach(d => { d.dotCore.setAttribute('fill', '#333'); d.dotHalo.setAttribute('opacity', '0'); d.rays.forEach(r => r.setAttribute('opacity', '0')); }); 
            return; 
        } 
        userLedGroup.setAttribute('opacity', '1'); userLed.setAttribute('fill', '#fff'); userBeam.setAttribute('opacity', '1'); 
        let distance = 120 - currentMouseX; let spreadRadius = 5 + (distance * 0.45); 
        userBeam.setAttribute('points', `${currentMouseX},${currentMouseY} 120,${currentMouseY - spreadRadius} 120,${currentMouseY + spreadRadius}`); 
        qd_dots.forEach(d => { 
            let distToCenter = Math.abs(d.y - currentMouseY);
            if (distToCenter <= spreadRadius) { 
                let intensity = Math.pow(1 - (distToCenter / spreadRadius), 0.5);
                d.dotCore.setAttribute('fill', '#ffffff'); d.dotHalo.setAttribute('opacity', intensity.toString()); d.rays.forEach(r => r.setAttribute('opacity', (intensity * 0.9).toString())); 
            } else { 
                d.dotCore.setAttribute('fill', '#333'); d.dotHalo.setAttribute('opacity', '0'); d.rays.forEach(r => r.setAttribute('opacity', '0')); 
            } 
        }); 
    }
    if (toggleLedBtn) { toggleLedBtn.addEventListener('click', () => { ledIsOn = !ledIsOn; uiSound.playToggleState(ledIsOn); toggleLedBtn.classList.toggle('active', ledIsOn); toggleLedBtn.innerText = ledIsOn ? "Turn OFF LED" : "Turn ON LED"; updateBeamPhysics(); }); }
    if (raySvg) { raySvg.addEventListener('mousemove', (e) => { const rect = e.currentTarget.getBoundingClientRect(); const mouseX = (e.clientX - rect.left) * (240 / rect.width); const mouseY = (e.clientY - rect.top) * (240 / rect.height); if (mouseX > 115) return; currentMouseX = Math.max(5, Math.min(mouseX, 110)); currentMouseY = Math.max(15, Math.min(mouseY, 225)); userLedBack.setAttribute('x', currentMouseX - 5); userLedBack.setAttribute('y', currentMouseY - 5); userLed.setAttribute('cx', currentMouseX); userLed.setAttribute('cy', currentMouseY); ledLabelText.setAttribute('x', currentMouseX < 35 ? 35 : currentMouseX); ledLabelText.setAttribute('y', currentMouseY - 15); updateBeamPhysics(); }); }
    
    const revealCanvas = document.getElementById('reveal-canvas'); const lensClip = document.getElementById('lens-circle-clip'); const lensRing = document.getElementById('lens-ring');
    if(revealCanvas){ revealCanvas.addEventListener('mousemove', (e) => { const rect = revealCanvas.getBoundingClientRect(); const mouseX = (e.clientX - rect.left) * (240 / rect.width); const mouseY = (e.clientY - rect.top) * (240 / rect.height); lensClip.setAttribute('cx', mouseX); lensClip.setAttribute('cy', mouseY); lensRing.setAttribute('cx', mouseX); lensRing.setAttribute('cy', mouseY); }); revealCanvas.addEventListener('mouseleave', () => { lensClip.setAttribute('cx', 120); lensClip.setAttribute('cy', 120); lensRing.setAttribute('cx', 120); lensRing.setAttribute('cy', 120); }); }
    
    const zoneSlider = document.getElementById('zone-slider'); const canvas = document.getElementById('mini-led-canvas'); const ctx = canvas ? canvas.getContext('2d', { alpha: false }) : null; 
    const modeCursorBtn = document.getElementById('mode-cursor'); const modeFireBtn = document.getElementById('mode-fire');
    const modeSpaceBtn = document.getElementById('mode-space');
    const fireIntensityWrapper = document.getElementById('fire-intensity-wrapper');
    const fireIntensitySlider = document.getElementById('fire-intensity-slider');
    const udlCaption = document.getElementById('udl-fire-caption');
    
    let m_gridSize = 20; let m_lightRadius = 150; let m_mouseX = -1000; let m_mouseY = -1000; let m_isHovering = false; let activeSprite = 'cursor'; let hoverTimeout; let lastMouseX = -1000; let lastMouseY = -1000; let smoothedVel = 0; let particles = []; let fireParticles = []; let spaceParticles = []; let shockwaves = []; let pulsars = []; let trail = [];
    let m_fireIntensity = 50; let m_isCharging = false; let m_chargeLevel = 0; let m_hypernovaFlash = 0;
    let m_implosionStage = 0; 
    let m_implosionFrames = 0; let m_implosionX = 0; let m_implosionY = 0;

    if(fireIntensitySlider) {
        fireIntensitySlider.addEventListener('input', (e) => {
            m_fireIntensity = parseInt(e.target.value);
            if(m_fireIntensity < 30) fireIntensitySlider.style.accentColor = '#007aff';
            else if(m_fireIntensity < 70) fireIntensitySlider.style.accentColor = '#FFD60A';
            else fireIntensitySlider.style.accentColor = '#ff3b30';
        });
    }

    if (modeCursorBtn && modeFireBtn && modeSpaceBtn) {
        modeCursorBtn.addEventListener('click', () => { 
            uiSound.killCanvasAudio();
            uiSound.playStepBackward(); activeSprite = 'cursor'; 
            modeCursorBtn.classList.add('active'); modeFireBtn.classList.remove('active'); modeSpaceBtn.classList.remove('active');
            uiSound.setFireMode(false); fireParticles = []; spaceParticles = []; shockwaves = []; pulsars = []; m_isCharging = false; m_hypernovaFlash = 0; m_implosionStage = 0;
            if(fireIntensityWrapper) fireIntensityWrapper.style.display = 'none';
            if(udlCaption) {
                udlCaption.style.color = '#666';
                udlCaption.innerHTML = "<strong>Light Beam:</strong> Hover over the grid to observe standard backlight tracking.";
            }
        });
        modeFireBtn.addEventListener('click', () => { 
            uiSound.killCanvasAudio();
            uiSound.playStepForward(); activeSprite = 'fire'; 
            modeFireBtn.classList.add('active'); modeCursorBtn.classList.remove('active'); modeSpaceBtn.classList.remove('active');
            uiSound.setFireMode(true); trail = []; spaceParticles = []; shockwaves = []; pulsars = []; m_isCharging = false; m_hypernovaFlash = 0; m_implosionStage = 0;
            if(fireIntensityWrapper) fireIntensityWrapper.style.display = 'flex';
            if(udlCaption) {
                udlCaption.style.color = '#666';
                udlCaption.innerHTML = "<strong>Grid Fire:</strong> Hover over the grid to observe local dimming physics.";
            }
        });
        modeSpaceBtn.addEventListener('click', () => {
            uiSound.killCanvasAudio();
            uiSound.playStepForward(); activeSprite = 'space'; 
            modeSpaceBtn.classList.add('active'); modeCursorBtn.classList.remove('active'); modeFireBtn.classList.remove('active');
            uiSound.setFireMode(false); fireParticles = []; trail = []; shockwaves = []; pulsars = []; m_isCharging = false; m_chargeLevel = 0; m_hypernovaFlash = 0; m_implosionStage = 0;
            if(fireIntensityWrapper) fireIntensityWrapper.style.display = 'none';
            if(udlCaption) {
                udlCaption.style.color = '#666';
                udlCaption.innerHTML = "<strong>Deep Space:</strong> CLICK: Star &nbsp;•&nbsp; HOLD 1s: Supernova &nbsp;•&nbsp; HOLD 3s: Hypernova. Watch how dimming zones isolate absolute black.";
            }
        });
    }

    function createStarburst(x, y, power, type = 0) {
        let numStars = 10 + Math.floor(power * 60);
        for (let i = 0; i < numStars; i++) {
            let angle = Math.random() * Math.PI * 2;
            let speed = (Math.random() * 12 + 2) * (0.5 + power);
            spaceParticles.push({
                x: x, y: y,
                vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
                life: 1.0, maxLife: 1.0, 
                decay: type === 2 ? (0.01 + Math.random() * 0.02) * 0.5 : (0.01 + Math.random() * 0.02),
                size: Math.random() * 3 + 1,
                type: type
            });
        }
        
        if (type === 1) { 
            shockwaves.push({
                x: x, y: y, z: -200, r: 0,
                speed: 18, 
                zSpeed: 15,
                power: 1.0,
                type: 1
            });
            pulsars.push({ x: x, y: y, life: 1.0 }); 
        } else if (type === 2) { 
            shockwaves.push({
                x: x, y: y, z: -300, r: 0,
                speed: 8, 
                zSpeed: 8,
                power: 2.0,
                type: 2
            });
        }
    }

    function drawGrid() { 
        if (!ctx) return; 
        const w = canvas.width; const h = canvas.height; ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = '#000000'; ctx.fillRect(0, 0, w, h); 
        smoothedVel *= 0.9;
        
        if (activeSprite === 'fire') uiSound.setFireVelocity(m_isHovering ? smoothedVel : 0, m_fireIntensity, m_isHovering);
        else if (activeSprite === 'cursor') uiSound.setHoverVelocity(m_isHovering ? smoothedVel : 0);
        
        const cw = w / m_gridSize; const ch = h / m_gridSize; const gap = 2; 
        let gridIntensity = Array(m_gridSize).fill().map(() => Array(m_gridSize).fill(0)); let gridColors = Array(m_gridSize).fill().map(() => Array(m_gridSize).fill('#ffffff'));

        if (activeSprite === 'cursor' && m_isHovering) {
            if (trail.length !== 40) { trail = []; for (let i = 0; i < 40; i++) trail.push({x: m_mouseX, y: m_mouseY}); }
            trail[0].x = m_mouseX; trail[0].y = m_mouseY;
            for (let i = 1; i < trail.length; i++) { trail[i].x += (trail[i-1].x - trail[i].x) * 0.4; trail[i].y += (trail[i-1].y - trail[i].y) * 0.4; }
            for (let row = 0; row < m_gridSize; row++) { 
                for (let col = 0; col < m_gridSize; col++) { 
                    const cx = (col * cw) + (cw / 2); const cy = (row * ch) + (ch / 2); let distToHead = Math.hypot(m_mouseX - cx, m_mouseY - cy); let bloomRadius = m_lightRadius * 1.4;
                    if (distToHead <= m_lightRadius) { gridIntensity[row][col] = 1; gridColors[row][col] = '#66fcf1'; } 
                    else if (distToHead <= bloomRadius) { let bloomIntensity = Math.pow(1 - ((distToHead - m_lightRadius) / (bloomRadius - m_lightRadius)), 2) * 0.4; gridIntensity[row][col] = bloomIntensity; gridColors[row][col] = `rgba(102, 252, 241, ${bloomIntensity})`; }
                    let maxTrailIntensity = 0;
                    for (let i = 0; i < trail.length; i += 2) { let td = Math.hypot(trail[i].x - cx, trail[i].y - cy); let ratio = 1 - (i / trail.length); let trailRad = m_lightRadius * Math.pow(ratio, 0.7); if (td <= trailRad && ratio > maxTrailIntensity) maxTrailIntensity = ratio; }
                    if (maxTrailIntensity > gridIntensity[row][col]) { gridIntensity[row][col] = maxTrailIntensity; gridColors[row][col] = `rgba(220, 255, 255, ${maxTrailIntensity})`; }
                } 
            }
        }

        if (activeSprite === 'fire') {
            let iFactor = m_fireIntensity / 100;

            if (udlCaption) {
                if (m_isHovering) {
                    udlCaption.style.color = 'var(--accent)';
                    if (m_fireIntensity < 30) {
                        udlCaption.innerHTML = "<strong>Low Intensity:</strong> Notice how the Mini-LED zones easily isolate small flames, preserving perfect black levels around them.";
                    } else if (m_fireIntensity < 70) {
                        udlCaption.innerHTML = "<strong>Medium Intensity:</strong> The localized dimming zones track the thermal column, wrapping light tightly around the vertical movement.";
                    } else {
                        udlCaption.innerHTML = "<strong>High Intensity:</strong> As the heat hits the top bezel and spreads, watch the upper dimming zones independently activate to contain the massive light bloom.";
                    }
                } else {
                    udlCaption.style.color = '#666';
                    udlCaption.innerHTML = "<strong>Grid Fire:</strong> Hover over the grid to observe local dimming physics.";
                }
            }

            if (m_isHovering) { 
                let spawnCount = 2 + Math.floor(iFactor * 6);
                let spreadBase = m_lightRadius * 0.4;
                let spreadAdd = m_lightRadius * iFactor * 1.5;
                let finalSpread = Math.min(spreadBase + spreadAdd, 250); 

                for (let i = 0; i < spawnCount; i++) { 
                    let p_vx = (Math.random() - 0.5) * (4 + iFactor * 10);
                    let p_vy = -(Math.random() * (8 + iFactor * 15) + 3 + (iFactor * 5)); 
                    let startLife = 0.6 + (iFactor * 0.8); 
                    
                    fireParticles.push({ 
                        x: m_mouseX + (Math.random() - 0.5) * finalSpread, 
                        y: m_mouseY + (Math.random() - 0.5) * (m_lightRadius * 0.4), 
                        vx: p_vx, 
                         vy: p_vy, 
                        life: startLife,
                        maxLife: startLife,
                        intens: iFactor
                    }); 
                } 
                
                while (fireParticles.length > 300) { fireParticles.shift(); }
            }
            for (let i = fireParticles.length - 1; i >= 0; i--) {
                let p = fireParticles[i]; 
                
                let nextY = p.y + p.vy;
                if (nextY <= 0) { 
                    p.y = 0; 
                    p.vy = -p.vy * 0.1; 
                    p.vx *= 2.5; 
                } else {
                    p.y += p.vy;
                }
                
                p.x += p.vx; 
                
                if (p.x < 0) { p.x = 0; p.vx *= -0.5; }
                if (p.x > w) { p.x = w; p.vx *= -0.5; }

                p.life -= 0.035;

                if (p.life <= 0) { fireParticles.splice(i, 1); } 
                else {
                    const col = Math.floor(p.x / cw); const row = Math.floor(p.y / ch);
                    if (col >= 0 && col < m_gridSize && row >= 0 && row < m_gridSize) { 
                        gridIntensity[row][col] = 1; 
                        let pRatio = p.life / p.maxLife;
                        let colorStr = '#ffffff';
                        if (p.intens < 0.3) {
                            colorStr = pRatio > 0.6 ? '#e0ffff' : (pRatio > 0.3 ? '#66fcf1' : '#007aff');
                        } else if (p.intens < 0.7) {
                            colorStr = pRatio > 0.7 ? '#FFD60A' : (pRatio > 0.4 ? '#FF9F0A' : (pRatio > 0.15 ? '#FF3B30' : '#441111'));
                        } else {
                            colorStr = pRatio > 0.8 ? '#ffffff' : (pRatio > 0.5 ? '#FFD60A' : (pRatio > 0.2 ? '#FF3B30' : '#880000'));
                        }
                        gridColors[row][col] = colorStr; 
                    }
                    
                    let bloomIntensity = p.life * 0.4 * (0.5 + p.intens * 0.5); 
                    if (bloomIntensity > 0.05) { 
                        const neighbors = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]; 
                        neighbors.forEach(n => { 
                            let c = col + n[0]; let r = row + n[1]; 
                            if (c >= 0 && c < m_gridSize && r >= 0 && r < m_gridSize && gridIntensity[r][c] < 1 && bloomIntensity > gridIntensity[r][c]) { 
                                gridIntensity[r][c] = bloomIntensity; 
                                let haloColor = 'rgba(255, 59, 48, ';
                                if (p.intens < 0.3) haloColor = 'rgba(0, 122, 255, ';
                                else if (p.intens > 0.7) haloColor = 'rgba(255, 214, 10, ';
                                gridColors[r][c] = `${haloColor}${bloomIntensity})`; 
                            } 
                        }); 
                    }
                }
            }
        }

        if (activeSprite === 'space') {
            for (let i = pulsars.length - 1; i >= 0; i--) {
                let p = pulsars[i];
                p.life -= 0.005; 
                if (p.life <= 0) { pulsars.splice(i, 1); continue; }
                
                const col = Math.floor(p.x / cw); const row = Math.floor(p.y / ch);
                if (col >= 0 && col < m_gridSize && row >= 0 && row < m_gridSize) {
                    gridIntensity[row][col] = p.life;
                    gridColors[row][col] = Math.random() > 0.5 ? '#ffffff' : '#e879f9';
                }
            }

            if (m_implosionStage > 0) {
                m_implosionFrames--;
                
                if (m_implosionStage === 2) {
                    m_chargeLevel *= 0.4; 
                    ctx.beginPath(); ctx.arc(m_implosionX, m_implosionY, m_chargeLevel * 150, 0, Math.PI * 2); 
                    ctx.fillStyle = `rgba(0, 0, 0, 1.0)`; 
                    ctx.fill();
                    
                    if (m_implosionFrames <= 0) {
                        m_implosionStage = 0; m_chargeLevel = 0;
                        m_hypernovaFlash = 1.2;
                        createStarburst(m_implosionX, m_implosionY, 2.0, 2); 
                    }
                } else if (m_implosionStage === 1) {
                    m_chargeLevel *= 0.75; 
                    ctx.beginPath(); ctx.arc(m_implosionX, m_implosionY, m_chargeLevel * 150, 0, Math.PI * 2); 
                    ctx.fillStyle = `rgba(0, 0, 0, 1.0)`; 
                    ctx.fill();

                    if (m_implosionFrames <= 0) {
                        m_implosionStage = 0; m_chargeLevel = 0;
                        uiSound.releaseSupernova();
                        createStarburst(m_implosionX, m_implosionY, 1.0, 1); 
                    }
                }
            }

            for (let i = shockwaves.length - 1; i >= 0; i--) {
                let sw = shockwaves[i];
                sw.r += sw.speed;
                sw.z += sw.zSpeed;
                sw.speed *= 0.95; 
                sw.power -= 0.02; 
                if (sw.power <= 0) { shockwaves.splice(i, 1); continue; }

                for (let row = 0; row < m_gridSize; row++) {
                    for (let col = 0; col < m_gridSize; col++) {
                        const cx = (col * cw) + (cw / 2); const cy = (row * ch) + (ch / 2);
                        let dist2D = Math.hypot(sw.x - cx, sw.y - cy);
                        
                        let sphereR2 = sw.r * sw.r;
                        let currentZ2 = sw.z * sw.z;
                        
                        if (sphereR2 > currentZ2) {
                            let sliceRadius = Math.sqrt(sphereR2 - currentZ2);
                            let shellThickness = sw.type === 2 ? 60 + (sw.power * 80) : 30 + (sw.power * 40); 
                            
                            if (dist2D < sliceRadius) {
                                let intensity = 0;
                                if (dist2D > sliceRadius - shellThickness) {
                                    intensity = Math.pow((dist2D - (sliceRadius - shellThickness)) / shellThickness, 2) * sw.power * 1.5;
                                } else if (sw.z < 0 && dist2D < sliceRadius) {
                                    intensity = sw.power * 1.5;
                                }
                                
                                intensity = Math.min(1.0, Math.max(0, intensity));
                                
                                if (intensity > gridIntensity[row][col]) {
                                    gridIntensity[row][col] = intensity;
                                    let swColor;
                                    if (sw.type === 2) {
                                        swColor = intensity > 0.85 ? '#ffffff' : (intensity > 0.6 ? '#4facfe' : '#0055ff'); 
                                    } else {
                                        swColor = intensity > 0.8 ? '#ffffff' : (intensity > 0.5 ? '#e879f9' : '#a855f7'); 
                                    }
                                    gridColors[row][col] = swColor;
                                }
                            }
                        }
                    }
                }
            }

            let jx = m_mouseX; let jy = m_mouseY;
            if (m_isCharging && m_implosionStage === 0) {
                m_chargeLevel = Math.min(m_chargeLevel + 0.015, 3.5); 
                uiSound.updateSupernovaCharge(m_chargeLevel);

                if (m_chargeLevel >= 3.3) {
                    let coreRadius = 150 * 0.3; 
                    let pulse = Math.abs(Math.sin(performance.now() * 0.02));
                    let armedRadius = coreRadius + (pulse * 15);
                    
                    jx += (Math.random() - 0.5) * 30;
                    jy += (Math.random() - 0.5) * 30;

                    for (let row = 0; row < m_gridSize; row++) { 
                        for (let col = 0; col < m_gridSize; col++) {
                            const cx = (col * cw) + (cw / 2); const cy = (row * ch) + (ch / 2); 
                            let dist = Math.hypot(jx - cx, jy - cy);
                            if (dist <= armedRadius) {
                                gridIntensity[row][col] = 1.0;
                                gridColors[row][col] = Math.random() > 0.5 ? '#ffffff' : (Math.random() > 0.5 ? '#4facfe' : '#0055ff');
                            }
                        }
                    }
                } else if (m_chargeLevel >= 3.15) {
                    let collapseProgress = (m_chargeLevel - 3.15) / 0.15; 
                    let coreRadius = 150 - (collapseProgress * 105); 
                    
                    let jitterAmount = collapseProgress * 30;
                    jx += (Math.random() - 0.5) * jitterAmount;
                    jy += (Math.random() - 0.5) * jitterAmount;

                    for (let row = 0; row < m_gridSize; row++) { 
                        for (let col = 0; col < m_gridSize; col++) {
                            const cx = (col * cw) + (cw / 2); const cy = (row * ch) + (ch / 2); 
                            let dist = Math.hypot(jx - cx, jy - cy);
                            if (dist <= coreRadius) {
                                gridIntensity[row][col] = 1.0;
                                if (Math.random() < collapseProgress) {
                                    gridColors[row][col] = Math.random() > 0.5 ? '#4facfe' : '#0055ff';
                                } else {
                                    gridColors[row][col] = '#ffffff';
                                }
                            } else if (dist <= coreRadius * 1.5) {
                                let falloff = Math.pow(1 - ((dist - coreRadius) / (coreRadius * 0.5)), 2);
                                if (falloff > gridIntensity[row][col]) {
                                    gridIntensity[row][col] = falloff;
                                    gridColors[row][col] = `rgba(168, 85, 247, ${falloff})`; 
                                }
                            }
                        }
                    }
                } else if (m_chargeLevel >= 3.0) {
                    // ABSOLUTE DARKNESS VOID
                } else {
                    let visualCharge = Math.min(m_chargeLevel, 1.0); 
                    let coreRadius = visualCharge * 150;

                    if (m_chargeLevel > 1.0) {
                        let jitterAmount = (m_chargeLevel - 1.0) * 2;
                        jx += (Math.random() - 0.5) * jitterAmount;
                        jy += (Math.random() - 0.5) * jitterAmount;
                    }

                    for (let row = 0; row < m_gridSize; row++) { 
                        for (let col = 0; col < m_gridSize; col++) {
                            const cx = (col * cw) + (cw / 2); const cy = (row * ch) + (ch / 2); 
                            let dist = Math.hypot(jx - cx, jy - cy);
                            if (dist <= coreRadius) {
                                gridIntensity[row][col] = 1.0;
                                gridColors[row][col] = '#ffffff';
                            } else if (dist <= coreRadius * 1.5) {
                                let falloff = Math.pow(1 - ((dist - coreRadius) / (coreRadius * 0.5)), 2);
                                if (falloff > gridIntensity[row][col]) {
                                    gridIntensity[row][col] = falloff;
                                    gridColors[row][col] = `rgba(168, 85, 247, ${falloff})`; 
                                }
                            }
                        }
                    }
                }
            }

            if (m_hypernovaFlash > 0) {
                m_hypernovaFlash -= 0.02;
                for (let row = 0; row < m_gridSize; row++) { 
                    for (let col = 0; col < m_gridSize; col++) {
                        if (m_hypernovaFlash > gridIntensity[row][col]) {
                            gridIntensity[row][col] = m_hypernovaFlash;
                            gridColors[row][col] = m_hypernovaFlash > 0.8 ? '#ffffff' : (m_hypernovaFlash > 0.5 ? '#4facfe' : `rgba(0, 85, 255, ${m_hypernovaFlash})`);
                        }
                    }
                }
            }

            for (let i = spaceParticles.length - 1; i >= 0; i--) {
                let p = spaceParticles[i]; 
                
                if (p.type === 2 && p.life < p.maxLife * 0.5) {
                    p.vx *= 0.92;
                    p.vy *= 0.92;
                }
                
                p.x += p.vx; p.y += p.vy; p.life -= p.decay;
                
                if (p.life <= 0) { spaceParticles.splice(i, 1); } 
                else {
                    const col = Math.floor(p.x / cw); const row = Math.floor(p.y / ch);
                    if (col >= 0 && col < m_gridSize && row >= 0 && row < m_gridSize) {
                        let pRatio = p.life / p.maxLife;
                        let sColor;
                        
                        if (p.type === 2) { 
                            if (pRatio > 0.85) sColor = '#ffffff'; 
                            else if (pRatio > 0.7) sColor = '#4facfe'; 
                            else if (pRatio > 0.5) sColor = '#0055ff'; 
                            else if (pRatio > 0.25) sColor = Math.random() > 0.5 ? '#a855f7' : '#e879f9'; 
                            else sColor = '#ff2a6d'; 
                        } else { 
                            if (pRatio > 0.8) sColor = '#ffffff'; 
                            else if (pRatio > 0.5) sColor = '#e879f9'; 
                            else if (pRatio > 0.2) sColor = '#c084fc'; 
                            else if (pRatio > 0.1) sColor = '#ff2a6d'; 
                            else sColor = '#ff3b30'; 
                        }
                        
                        gridIntensity[row][col] = Math.max(gridIntensity[row][col], p.life);
                        gridColors[row][col] = sColor;
                        
                        let bloomIntensity = p.life * 0.5;
                        if (bloomIntensity > 0.1) {
                            const neighbors = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]; 
                            neighbors.forEach(n => { 
                                let c = col + n[0]; let r = row + n[1]; 
                                if (c >= 0 && c < m_gridSize && r >= 0 && r < m_gridSize && gridIntensity[r][c] < 1) { 
                                    gridIntensity[r][c] = Math.max(gridIntensity[r][c], bloomIntensity); 
                                    gridColors[r][c] = `rgba(255, 255, 255, ${bloomIntensity * 0.5})`; 
                                } 
                            });
                        }
                    }
                }
            }
        }

        ctx.globalCompositeOperation = 'source-over'; ctx.lineWidth = 2; 
        for (let row = 0; row < m_gridSize; row++) { 
            for (let col = 0; col < m_gridSize; col++) { 
                const x = col * cw; const y = row * ch; 
                if (gridIntensity[row][col] > 0) { 
                    ctx.fillStyle = gridColors[row][col]; ctx.fillRect(x + gap, y + gap, cw - gap * 2, ch - gap * 2); 
                } 
                else { ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'; ctx.strokeRect(x + gap, y + gap, cw - gap * 2, ch - gap * 2); } 
            } 
        } 

        if (m_implosionStage === 1) {
            ctx.globalCompositeOperation = 'source-over';
            ctx.beginPath(); 
            ctx.arc(m_implosionX, m_implosionY, m_chargeLevel * 150, 0, Math.PI * 2); 
            ctx.fillStyle = `rgba(0, 0, 0, 1.0)`; 
            ctx.fill();
        }

        if (activeSprite === 'cursor') {
            if (m_isHovering) { const gradient = ctx.createRadialGradient(m_mouseX, m_mouseY, 0, m_mouseX, m_mouseY, m_lightRadius * 1.5); gradient.addColorStop(0, 'rgba(102, 252, 241, 0.1)'); gradient.addColorStop(1, 'rgba(102, 252, 241, 0)'); ctx.fillStyle = gradient; ctx.fillRect(0, 0, w, h); }
            for (let i = particles.length - 1; i >= 0; i--) { let p = particles[i]; p.x += p.vx; p.y += p.vy; p.life -= 0.015; if (p.life <= 0) { particles.splice(i, 1); } else { ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fillStyle = `rgba(102, 252, 241, ${p.life})`; ctx.fill(); } }
        }
        
        if (activeSprite === 'fire' && m_isHovering) { 
            let iFactor = m_fireIntensity / 100;
            if (Math.random() < 0.005 + (iFactor * 0.04) + (smoothedVel * 0.002)) uiSound.playCrackle(m_fireIntensity); 
        }
        
        requestAnimationFrame(drawGrid); 
    }

    if(zoneSlider){ zoneSlider.addEventListener('input', (e) => { const val = parseInt(e.target.value); if (val === 1) { m_gridSize = 10; m_lightRadius = 250; } else if (val === 2) { m_gridSize = 20; m_lightRadius = 150; } else if (val === 3) { m_gridSize = 40; m_lightRadius = 80; } }); }
    if(canvas){ 
        
        function handleTouchMove(e) {
            if(e.touches.length > 0) {
                e.preventDefault(); 
                m_isHovering = true; 
                uiSound.setHoverState(true, activeSprite); 
                clearTimeout(hoverTimeout); 
                hoverTimeout = setTimeout(() => { uiSound.setHoverState(false, activeSprite); smoothedVel = 0; }, 100);
                
                const rect = canvas.getBoundingClientRect();
                m_mouseX = ((e.touches[0].clientX - rect.left) / rect.width) * 1000;
                m_mouseY = ((e.touches[0].clientY - rect.top) / rect.height) * 1000;
                
                let dx = m_mouseX - lastMouseX; let dy = m_mouseY - lastMouseY; 
                let currentVel = Math.sqrt(dx*dx + dy*dy); 
                smoothedVel = smoothedVel * 0.8 + currentVel * 0.2; 
                lastMouseX = m_mouseX; lastMouseY = m_mouseY;

                if (activeSprite === 'cursor') { 
                    for (let i = 0; i < 4; i++) { 
                        particles.push({ x: m_mouseX + (Math.random() - 0.5) * 40, y: m_mouseY + (Math.random() - 0.5) * 40, vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4 - 2, life: 1.0, size: Math.random() * 5 + 2 }); 
                    } 
                }
            }
        }

        canvas.addEventListener('touchstart', (e) => {
            if (activeSprite === 'space' && m_implosionStage === 0) {
                m_isCharging = true;
                uiSound.startSupernovaCharge();
            }
            handleTouchMove(e);
        }, {passive: false});

        canvas.addEventListener('touchmove', handleTouchMove, {passive: false});

        canvas.addEventListener('touchend', (e) => {
            m_isHovering = false; trail = []; uiSound.setHoverState(false, activeSprite); smoothedVel = 0; uiSound.setFireVelocity(0); uiSound.setHoverVelocity(0); 
            
            if (activeSprite === 'space' && m_isCharging) {
                m_isCharging = false;
                if (m_chargeLevel >= 3.3) {
                    m_implosionStage = 2; 
                    m_implosionFrames = 8; 
                    m_implosionX = m_mouseX; m_implosionY = m_mouseY;
                    m_chargeLevel = 4.0; 
                    uiSound.releaseHypernova(); 
                } else if (m_chargeLevel > 0.45) {
                    m_implosionStage = 1; 
                    m_implosionFrames = 18; 
                    m_implosionX = m_mouseX; m_implosionY = m_mouseY;
                    uiSound.startSuperSnap(); 
                } else {
                    uiSound.playStarDrop();
                    createStarburst(m_mouseX, m_mouseY, 0.1, 0);
                    m_chargeLevel = 0;
                }
            } else {
                m_isCharging = false;
                if(m_chargeLevel > 0 && m_implosionStage === 0) { 
                    uiSound.releaseSupernova(); 
                    m_chargeLevel = 0; 
                }
            }
        });

        canvas.addEventListener('mousemove', (e) => { 
            m_isHovering = true; uiSound.setHoverState(true, activeSprite); clearTimeout(hoverTimeout); hoverTimeout = setTimeout(() => { uiSound.setHoverState(false, activeSprite); smoothedVel = 0; }, 100);
            const rect = canvas.getBoundingClientRect(); m_mouseX = ((e.clientX - rect.left) / rect.width) * 1000; m_mouseY = ((e.clientY - rect.top) / rect.height) * 1000; 
            let dx = m_mouseX - lastMouseX; let dy = m_mouseY - lastMouseY; let currentVel = Math.sqrt(dx*dx + dy*dy); smoothedVel = smoothedVel * 0.8 + currentVel * 0.2; lastMouseX = m_mouseX; lastMouseY = m_mouseY;
            if (activeSprite === 'cursor') { for (let i = 0; i < 4; i++) { particles.push({ x: m_mouseX + (Math.random() - 0.5) * 40, y: m_mouseY + (Math.random() - 0.5) * 40, vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4 - 2, life: 1.0, size: Math.random() * 5 + 2 }); } }
        }); 
        canvas.addEventListener('mouseleave', () => { m_isHovering = false; trail = []; uiSound.setHoverState(false, activeSprite); smoothedVel = 0; uiSound.setFireVelocity(0); uiSound.setHoverVelocity(0); m_isCharging = false; if(m_chargeLevel > 0 && m_implosionStage === 0) { uiSound.releaseSupernova(); m_chargeLevel = 0; } }); 
        
        canvas.addEventListener('wheel', (e) => {
            if (activeSprite === 'fire') {
                e.preventDefault();
                m_fireIntensity -= Math.sign(e.deltaY) * 5; 
                m_fireIntensity = Math.max(0, Math.min(100, m_fireIntensity));
                
                if(fireIntensitySlider) {
                    fireIntensitySlider.value = m_fireIntensity;
                    if(m_fireIntensity < 30) fireIntensitySlider.style.accentColor = '#007aff';
                    else if(m_fireIntensity < 70) fireIntensitySlider.style.accentColor = '#FFD60A';
                    else fireIntensitySlider.style.accentColor = '#ff3b30';
                }
            }
        }, { passive: false });

        canvas.addEventListener('mousedown', (e) => {
            if (activeSprite === 'space' && m_implosionStage === 0) {
                m_isCharging = true;
                uiSound.startSupernovaCharge();
            }
        });

        canvas.addEventListener('mouseup', (e) => {
            if (activeSprite === 'space' && m_implosionStage === 0) {
                m_isCharging = false;
                if (m_chargeLevel >= 3.3) {
                    m_implosionStage = 2; 
                    m_implosionFrames = 8; 
                    m_implosionX = m_mouseX; m_implosionY = m_mouseY;
                    m_chargeLevel = 4.0; 
                    uiSound.releaseHypernova(); 
                } else if (m_chargeLevel > 0.45) {
                    m_implosionStage = 1; 
                    m_implosionFrames = 18; 
                    m_implosionX = m_mouseX; m_implosionY = m_mouseY;
                    uiSound.startSuperSnap(); 
                } else {
                    uiSound.playStarDrop();
                    createStarburst(m_mouseX, m_mouseY, 0.1, 0);
                    m_chargeLevel = 0;
                }
            }
        });
        
        requestAnimationFrame(drawGrid); 
    }
    
    const togglePixelsBtn = document.getElementById('toggle-oled-pixels'); let pixelsOn = true;
    if(togglePixelsBtn){ togglePixelsBtn.addEventListener('click', () => { pixelsOn = !pixelsOn; uiSound.playToggleState(pixelsOn); document.querySelectorAll('.oled-subpixel').forEach(el => { if (pixelsOn) el.classList.remove('off'); else el.classList.add('off'); }); togglePixelsBtn.innerText = pixelsOn ? "Turn Power OFF" : "Turn Power ON"; }); }
    
    const toggleEnvBtn = document.getElementById('toggle-env-btn'); const glareOverlay = document.getElementById('glare-overlay'); const oledScreenBg = document.getElementById('oled-screen-bg'); let isDay = false;
    if(toggleEnvBtn){ toggleEnvBtn.addEventListener('click', () => { isDay = !isDay; uiSound.playToggleState(isDay); if(isDay) { glareOverlay.style.opacity = '1'; oledScreenBg.setAttribute('fill', '#333'); toggleEnvBtn.innerText = 'Switch to Night Room'; } else { glareOverlay.style.opacity = '0'; oledScreenBg.setAttribute('fill', '#03030a'); toggleEnvBtn.innerText = 'Turn ON Room Lights'; } }); }
    
    const btnProtect = document.getElementById('btn-protect'); const ghostGroup = document.getElementById('burn-in-ghost'); const scanLine = document.getElementById('oled-scanner'); let isCleaned = false; 
    if(btnProtect){ btnProtect.addEventListener('click', () => { if (!isCleaned) { uiSound.playToggleState(true); btnProtect.disabled = true; btnProtect.innerText = "Running Laser Scan..."; scanLine.classList.add('run-scan'); setTimeout(() => { ghostGroup.style.opacity = '0'; }, 1000); setTimeout(() => { scanLine.classList.remove('run-scan'); btnProtect.innerText = "Reset Panel (Show Burn-in)"; btnProtect.disabled = false; isCleaned = true; }, 2500); } else { uiSound.playToggleState(false); ghostGroup.style.opacity = '0.6'; btnProtect.innerText = "Run Pixel Refresher"; isCleaned = false; } }); }

    // ==========================================
    // CAPSTONE: ADVANCED POOLED D.I.S.C ENGINE
    // ==========================================
    const masterScenarioBank = [
        {
            id: "student", avatar: "💻", name: "Marcus (PC Builder)", desc: "Hardware Enthusiast • Dark Room • Custom Rig", voiceProfile: { pitch: 0.85, type: 'male' },
            discover: { D1: { response: "It's a total blackout cave. I keep the curtains drawn 24/7 so there's zero glare on my screens.", summary: "you game in a completely dark room" }, D2: { response: "I'm hooked up to my custom rig, pushing high frames on an NVIDIA GPU playing massive open-world RPGs.", summary: "you are playing high-end RPGs on a custom PC" }, D3: { response: "I'm sitting dead center in my gaming chair, about four feet from the wall.", summary: "you sit dead center in front of the screen" }, D4: { response: "Visual response time is all I care about. Audio goes through my external DAC.", summary: "you need top-tier visual response times" } },
            inspire: "Exactly. When I'm in a dungeon, I want the shadows to be pitch black, not glowing grey.", solve: "That sounds like exactly what my rig needs to push those graphics.", aftermath: { "oled": "KEPT. Marcus is mind-blown by the absolute black levels and instant response time. Perfect recommendation.", "mini-led": "RETURNED. Marcus complained the blooming around his crosshairs in the dark room drove him crazy.", "led": "RETURNED. The standard LED was a massive bottleneck for his expensive graphics card. He lost trust in your advice." }
        },
        {
            id: "mom", avatar: "👩‍👧", name: "Elena (Stressed Parent)", desc: "Work-From-Home • Bright Sunroom • Chaos", voiceProfile: { pitch: 1.15, type: 'female' },
            discover: { D1: { response: "South-facing windows. The sunlight bounces off absolutely everything in the room.", summary: "you deal with extreme sunlight and window glare" }, D2: { response: "Cartoons for the kids during the day, maybe some Netflix at night if I'm still awake.", summary: "you mostly watch bright daytime content and cartoons" }, D3: { response: "We have a huge sectional, and the kids are usually sprawled on the floor at weird angles.", summary: "your family watches from very wide angles" }, D4: { response: "Whatever is easiest to use. One remote, please.", summary: "you just need simple audio integration" } },
            inspire: "Yes! The glare on Sunday afternoons is awful right now. We want to actually see the screen without fighting the sun.", solve: "That sounds perfect. I just need it to work and be bright enough for the kids.", aftermath: { "mini-led": "KEPT. Elena loves that they can finally see the screen clearly on sunny afternoons without closing the blinds.", "oled": "RETURNED. The TV was too dim to fight the window glare, and she panicked about the cartoon logo causing burn-in.", "led": "KEPT. She didn't return it, but complains the picture looks washed out. You missed out on premium margin." }
        },
        {
            id: "senior", avatar: "👴", name: "Walter (Budget Senior)", desc: "Retiree • Static News • Fixed Seating", voiceProfile: { pitch: 0.75, type: 'male' },
            discover: { D1: { response: "I keep the blinds drawn. Just a nice reading lamp in the corner.", summary: "your room has moderate, controlled lighting" }, D2: { response: "Just the local news, maybe some classic movies on cable when nothing else is on.", summary: "you leave the news running constantly" }, D3: { response: "My recliner is right in front of the TV. Nowhere else.", summary: "you sit directly in front of the TV" }, D4: { response: "No gaming. Just need the TV speakers to be loud enough to hear the dialogue.", summary: "you rely purely on the TV's internal speakers" } },
            inspire: "Oh, that sounds lovely. My eyes aren't what they used to be, so clear and simple is best.", solve: "Perfect. I just want something reliable that I don't have to worry about maintaining or overpaying for.", aftermath: { "led": "KEPT. The TV runs reliably all day. Walter is thrilled with your honest, practical recommendation.", "mini-led": "KEPT. He likes it, but the extra brightness actually hurts his eyes at night. An unnecessary upsell.", "oled": "RETURNED (ANGRY). The news channel ticker permanently burned into the screen after 3 weeks." }
        },
        {
            id: "designer", avatar: "📐", name: "Sofia (Interior Designer)", desc: "Luxury Loft • Dim Lighting • High Budget", voiceProfile: { pitch: 1.05, type: 'female' },
            discover: { D1: { response: "Motorized blackout shades, highly controlled smart lighting. Very moody.", summary: "you are outfitting a dark, premium viewing room" }, D2: { response: "4K architectural documentaries and atmospheric cinema. Aesthetics are everything.", summary: "you watch high-end cinematic content" }, D3: { response: "A low-profile designer sofa, perfectly centered in the space.", summary: "you sit perfectly centered in the room" }, D4: { response: "Hidden surround sound system, already wired into the walls.", summary: "you use high-end professional audio" } },
            inspire: "That's exactly what I'm looking for. The picture quality needs to look like art.", solve: "If it delivers the absolute best picture quality possible, I'll take it.", aftermath: { "oled": "KEPT. Sofia is blown away by the picture quality. It perfectly matches her luxury loft aesthetic.", "mini-led": "RETURNED. She felt the slight blooming in the dark room ruined the cinematic mood of her space.", "led": "RETURNED. The cheap panel made the luxury room feel incredibly cheap. She was highly disappointed." }
        },
        {
            id: "bar", avatar: "🏟️", name: "Coach Carter (Bar Owner)", desc: "Sports Bar • 14hr Days • Neon Lights", voiceProfile: { pitch: 0.8, type: 'male' },
            discover: { D1: { response: "Track lighting, neon signs, huge windows. It's an incredibly bright venue.", summary: "your business has incredibly bright, harsh lighting" }, D2: { response: "Sports, 14 hours a day. And static digital menus on the side screens.", summary: "you run sports and static menus 14 hours a day" }, D3: { response: "Patrons are standing, sitting, and cheering from every corner of the room.", summary: "your customers watch from every angle imaginable" }, D4: { response: "We route everything through a commercial AV receiver matrix.", summary: "you use professional AV routing hardware" } },
            inspire: "Absolutely, my fans need to see the score from the back of the room through all the glare.", solve: "I need durability and punch. If it cuts through the glare and lasts 14 hours a day, I'm sold.", aftermath: { "mini-led": "KEPT. The fans can clearly see the games from the street, driving massive foot traffic into the bar.", "oled": "RETURNED (LAWSUIT). The static scoreboards caused severe burn-in in just two weeks.", "led": "RETURNED. The TV washed out completely under the bar's neon lights." }
        }
    ];

    const associateBank = {
        discover: [
            { id: "D1", text: "What is the primary lighting like in the room? Lots of windows or mostly dark?" }, { id: "D2", text: "What type of content is playing the majority of the time?" }, { id: "D3", text: "How is the seating arranged? Will anyone be watching from a wide angle?" }, { id: "D4", text: "Are you planning to connect a next-gen gaming console or home theater audio?" }
        ],
        inspire: [
            { id: "I1", text: "...doesn't force you to pull the curtains closed just to see the screen." }, { id: "I2", text: "...delivers a true cinematic feel with perfectly rich colors and infinite shadows." }, { id: "I3", text: "...provides a highly reliable, clear picture without over-complicating your daily routine." }, { id: "I4", text: "...easily cuts through the harsh overhead glare to give your patrons a perfect view." }
        ],
        solve: [
            { id: "S1", text: "Instead of a standard panel that washes out, a Mini-LED uses tiny lights to actively overpower the sun while keeping the contrast sharp." }, { id: "S2", text: "Since you want a cinema experience, an OLED turns off its own pixels to give you absolute perfect black levels without any glowing." }, { id: "S3", text: "Since you just need reliable, everyday viewing, a standard LED display will give you great colors without making you pay for features you don't need." }
        ]
    };

    let activeScenarioPool = []; let currentScenario = null; let currentNPC = null; let scoreKept = 0; let scoreReturned = 0; let rpgState = "INIT"; let typingTimeout = null; let discoverQuestionsLeft = []; let askedSummaries = []; let discoverCount = 0; let hasCompletedOneScenario = false;

    const dialogueTextSpan = document.getElementById('dialogue-text-span'); const speakerTag = document.getElementById('speaker-tag'); const choicesBox = document.getElementById('choices-box'); const continuePrompt = document.getElementById('continue-prompt'); const dialogueBox = document.getElementById('dialogue-box'); const overlay = document.getElementById('rpg-overlay'); const aftermathTitle = document.getElementById('aftermath-title'); const aftermathText = document.getElementById('aftermath-text'); const btnNextCustomer = document.getElementById('btn-next-customer'); const btnPersistentFinish = document.getElementById('btn-persistent-finish'); const progressText = document.getElementById('rpg-progress');

    function updateProgress(phase, ratio) { progressText.innerText = `Phase: ${phase} ${ratio}`; }

    function typeText(text, speaker, nextState, showContinue = true, onCompleteCallback = null) {
        if(typingTimeout) clearTimeout(typingTimeout);
        speakerTag.innerText = speaker; speakerTag.style.background = (speaker === "You") ? "var(--accent)" : "var(--text-primary)";
        dialogueTextSpan.innerHTML = ""; continuePrompt.style.display = "none"; choicesBox.innerHTML = "";
        
        if (audioEnabled) {
            let activeProfile = { pitch: 1.0, type: 'neutral' };
            if (speaker === "You") activeProfile = associateVoice;
            else if (currentNPC && speaker === currentNPC.name) activeProfile = currentNPC.voiceProfile;
            playSpeech(text, activeProfile);
        }

        let i = 0;
        function typeChar() {
            if (i < text.length) { dialogueTextSpan.innerHTML += text.charAt(i); i++; typingTimeout = setTimeout(typeChar, 20); } 
            else { if(showContinue) continuePrompt.style.display = "block"; rpgState = nextState; if(onCompleteCallback) onCompleteCallback(); }
        }
        typeChar();
    }

    function renderChoices(options, callback, prefix = "") {
        continuePrompt.style.display = "none"; choicesBox.innerHTML = "";
        options.forEach(opt => {
            const btn = document.createElement('button'); btn.className = "choice-btn" + (opt.phase === "TRANSITION" ? " transition-btn" : "");
            const displayText = prefix ? `<em>"${prefix}"</em> ${opt.text}` : opt.text;
            btn.innerHTML = `<span class="choice-tag">${opt.tag}</span> ${displayText}`;
            btn.addEventListener('click', (e) => { e.stopPropagation(); uiSound.playStepForward(); callback(opt.id, opt); });
            choicesBox.appendChild(btn);
        });
    }

    function advanceRPG() {
        if (rpgState === "INIT" || rpgState === "WAIT" || rpgState === "WAIT_CLICK") return; 
        if (rpgState === "INTRO_2") { rpgState = "WAIT"; typeText("Yes of course, what can I help you with today?", "You", "INTRO_3"); } 
        else if (rpgState === "INTRO_3") { rpgState = "WAIT"; typeText("I'm looking for a new TV and need some guidance on what technology makes sense for me.", currentNPC.name, "DISCOVER_CHOICE"); }
        else if (rpgState === "DISCOVER_CHOICE") {
            rpgState = "WAIT"; updateProgress("DISCOVER", `(${discoverCount}/4)`);
            const opts = discoverQuestionsLeft.map(q => ({ id: q.id, tag: "ASK", text: q.text, phase: "DISCOVER" })); renderChoices(opts, handleChoice);
        }
        else if (rpgState === "DISCOVER_OR_TRANSITION") {
            rpgState = "WAIT"; updateProgress("DISCOVER", `(${discoverCount}/4)`);
            const opts = discoverQuestionsLeft.map(q => ({ id: q.id, tag: "ASK", text: q.text, phase: "DISCOVER" })); opts.push({ id: "TRANS", tag: "SUMMARIZE", text: "Summarize findings and move to Inspire phase", phase: "TRANSITION" }); renderChoices(opts, handleChoice);
        }
        else if (rpgState === "FORCE_TRANSITION") {
            rpgState = "WAIT"; updateProgress("DISCOVER", `(4/4)`);
            renderChoices([{ id: "TRANS", tag: "SUMMARIZE", text: "Summarize findings and move to Inspire phase", phase: "TRANSITION" }], handleChoice);
        }
        else if (rpgState === "INSPIRE_CHOICE") {
            rpgState = "WAIT"; updateProgress("INSPIRE", "");
            const opts = associateBank.inspire.map(q => ({ id: q.id, tag: "INSPIRE", text: q.text, phase: "INSPIRE" })); renderChoices(opts, handleChoice, "Awesome, based on your environment, I want to recommend a viewing experience that...");
        }
        else if (rpgState === "SOLVE_CHOICE") {
            rpgState = "WAIT"; updateProgress("SOLVE", "");
            const opts = associateBank.solve.map(q => ({ id: q.id, tag: "SOLVE", text: q.text, phase: "SOLVE" })); renderChoices(opts, handleChoice);
        }
        else if (rpgState === "CLOSE_CHOICE") {
            rpgState = "WAIT"; updateProgress("CLOSE", "");
            renderChoices([{ id: "led", tag: "RECOMMEND", text: "Standard LED TV", phase: "CLOSE" }, { id: "mini-led", tag: "RECOMMEND", text: "Premium Mini-LED TV", phase: "CLOSE" }, { id: "oled", tag: "RECOMMEND", text: "Premium OLED TV", phase: "CLOSE" }], handleChoice);
        }
        else if (rpgState === "END_SALE") { 
            rpgState = "WAIT"; overlay.classList.add('active'); hasCompletedOneScenario = true; btnPersistentFinish.style.display = 'block';
            if (activeScenarioPool.length === 0) { 
                btnNextCustomer.style.display = 'none'; 
                aftermathTitle.innerText = "SHIFT COMPLETE"; 
                aftermathText.innerText += "\n\nShift Complete. You have successfully helped all customers on the floor today. Excellent work applying the D.I.S.C. framework."; 
            }
        }
    }

    function handleChoice(id, opt) {
        choicesBox.innerHTML = ""; rpgState = "WAIT";
        if (opt.phase === "TRANSITION") {
            let summaryText = "";
            if (askedSummaries.length > 1) summaryText = askedSummaries.slice(0, -1).join(", ") + ", and " + askedSummaries[askedSummaries.length - 1];
            else summaryText = askedSummaries[0]; 
            typeText(`Okay, so I understand that ${summaryText}. Is that correct?`, "You", "WAIT_CLICK", true);
        } else if (opt.phase === "INSPIRE") {
            const fullText = "Awesome, based on your environment, I want to recommend a viewing experience that " + opt.text.replace("...", "");
            typeText(fullText, "You", "NPC_REPLY", false, () => { setTimeout(() => { typeText(currentScenario.inspire, currentNPC.name, "SOLVE_CHOICE"); }, 2000); });
        } else if (opt.phase === "CLOSE") {
            let factors = askedSummaries.slice(0, 2).join(" and "); if (!factors) factors = "what we've discussed"; 
            let techReason = ""; let tvName = "";
            if (id === "led") { tvName = "Standard LED TV"; techReason = "it provides a versatile, highly reliable display without overspending"; }
            if (id === "mini-led") { tvName = "Premium Mini-LED TV"; techReason = "its thousands of dimming zones will effortlessly cut through the glare while keeping the contrast sharp"; }
            if (id === "oled") { tvName = "Premium OLED TV"; techReason = "its self-illuminating pixels will deliver the absolute perfect black levels and contrast you need"; }
            const closePitch = `Since ${factors}, I highly recommend the ${tvName} because ${techReason}. Shall we go ahead and get this boxed up for you?`;
            typeText(closePitch, "You", "NPC_REPLY", false, () => {
                setTimeout(() => {
                    aftermathTitle.innerText = "30 DAYS LATER..."; aftermathText.innerText = currentScenario.aftermath[id];
                    if (currentScenario.aftermath[id].startsWith("KEPT")) { scoreKept++; document.getElementById('score-kept').innerText = scoreKept; } 
                    else { scoreReturned++; document.getElementById('score-returned').innerText = scoreReturned; }
                    typeText("Sounds great, I trust your recommendation! Let's get it set up.", currentNPC.name, "END_SALE");
                }, 3000);
            });
        } else {
            typeText(opt.text, "You", "NPC_REPLY", false, () => {
                rpgState = "WAIT_NPC_REPLY_DELAY";
                setTimeout(() => {
                    if(opt.phase === "DISCOVER") {
                        discoverCount++; discoverQuestionsLeft = discoverQuestionsLeft.filter(q => q.id !== id); askedSummaries.push(currentScenario.discover[id].summary);
                        let nextState = "DISCOVER_CHOICE"; if (discoverCount === 4) nextState = "FORCE_TRANSITION"; else if (discoverCount >= 3) nextState = "DISCOVER_OR_TRANSITION";
                        typeText(currentScenario.discover[id].response, currentNPC.name, nextState);
                    } else if (opt.phase === "SOLVE") { typeText(currentScenario.solve, currentNPC.name, "CLOSE_CHOICE"); }
                }, 2000);
            });
        }
    }

    dialogueBox.addEventListener('click', () => {
        if (rpgState === "WAIT_CLICK") { rpgState = "WAIT"; uiSound.playStepForward(); typeText("Yes, exactly! That's exactly what I'm dealing with.", currentNPC.name, "INSPIRE_CHOICE"); } 
        else if (rpgState !== "WAIT" && rpgState !== "WAIT_NPC_REPLY_DELAY") { uiSound.playStepForward(); advanceRPG(); }
    });

    function initRPG() {
        overlay.classList.remove('active');
        if (activeScenarioPool.length === 0) activeScenarioPool = [...masterScenarioBank];
        if (hasCompletedOneScenario) btnPersistentFinish.style.display = 'block';
        const randIndex = Math.floor(Math.random() * activeScenarioPool.length); currentScenario = activeScenarioPool[randIndex]; currentNPC = currentScenario; 
        activeScenarioPool.splice(randIndex, 1);
        discoverQuestionsLeft = [...associateBank.discover]; askedSummaries = []; discoverCount = 0; btnNextCustomer.style.display = 'block'; 
        updateProgress("GREET", ""); document.getElementById('npc-avatar').innerText = currentNPC.avatar; document.getElementById('npc-name').innerText = currentNPC.name; document.getElementById('npc-desc').innerText = currentScenario.desc;
        speakerTag.innerText = "System"; speakerTag.style.background = "var(--text-primary)"; dialogueTextSpan.innerText = "Click below to start your shift."; continuePrompt.style.display = "none"; choicesBox.innerHTML = "";
        const startBtn = document.createElement('button'); startBtn.className = "choice-btn"; startBtn.id = "btn-start-rpg"; startBtn.innerHTML = `<span class="choice-tag">SYS</span> Greet Approaching Customer`;
        startBtn.addEventListener('click', (e) => { e.stopPropagation(); uiSound.playStepForward(); choicesBox.innerHTML = ""; rpgState = "WAIT"; typeText("Hi, I need some help deciding what TV I should buy.", currentNPC.name, "INTRO_2"); });
        choicesBox.appendChild(startBtn);
    }

    btnNextCustomer.addEventListener('click', () => { uiSound.playStepForward(); initRPG(); });
    btnPersistentFinish.addEventListener('click', () => { uiSound.playForward(); slideCompletion[7] = true; goToSlide(8); });

    initRPG(); goToSlide(0);
});
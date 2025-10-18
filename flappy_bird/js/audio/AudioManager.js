import { CONFIG } from '../config/constants.js';

export class AudioManager {
    constructor() {
        this.sounds = {};
        this.enabled = true;
        this.audioContext = null;
        this.init();
    }

    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.createSounds();
        } catch (error) {
            console.log('AudioContext не поддерживается, звуки отключены');
            this.enabled = false;
        }
    }

    createSounds() {
        this.sounds.flap = this.createBeepSound(523.25, 0.1, 'sine');      // До
        this.sounds.point = this.createBeepSound(659.25, 0.2, 'square');   // Ми
        this.sounds.hit = this.createBeepSound(392, 0.3, 'sawtooth');      // Соль
        this.sounds.die = this.createBeepSound(349.23, 0.5, 'triangle');   // Фа
    }

    createBeepSound(frequency, duration, type) {
        return {
            play: () => {
                if (!this.enabled || !this.audioContext) return;

                try {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();

                    oscillator.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);

                    oscillator.frequency.value = frequency;
                    oscillator.type = type;

                    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(CONFIG.AUDIO.VOLUME, this.audioContext.currentTime + 0.01);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

                    oscillator.start();
                    oscillator.stop(this.audioContext.currentTime + duration);
                } catch (error) {
                    console.log('Ошибка воспроизведения звука:', error);
                }
            }
        };
    }

    play(soundName) {
        if (this.sounds[soundName] && this.enabled) {
            this.sounds[soundName].play();
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    setEnabled(enabled) {
        this.enabled = enabled;
    }
}
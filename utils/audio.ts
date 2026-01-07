export class SoundManager {
    private audioContext: AudioContext | null = null;

    private getContext(): AudioContext | null {
        if (typeof window === 'undefined') return null; // Server-side safety

        if (!this.audioContext) {
            // @ts-ignore - Handle Safari prefix if needed, though modern browsers are standard
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        // Resume if suspended (browser policy)
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        return this.audioContext;
    }

    playPop() {
        try {
            const ctx = this.getContext();
            if (!ctx) return;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            // Pop Sound: High to Low frequency very fast
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);

            // Quick Attack and Decay envelope
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

            osc.start();
            osc.stop(ctx.currentTime + 0.2);
        } catch (e) {
            console.error('Audio play failed', e);
        }
    }
}

export const soundManager = new SoundManager();

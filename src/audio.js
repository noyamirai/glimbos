export const pitchShifter = new Tone.PitchShift(0).toDestination();
pitchShifter.windowSize = 0.01;

export const recorder = new Tone.Recorder();

export const instrument = new Tone.Sampler({
    urls: {
        A1: 'A1.mp3',
        A2: 'A2.mp3'
    },
    baseUrl: 'https://tonejs.github.io/audio/casio/'
})
    .connect(pitchShifter)
    .connect(recorder)
    .toDestination();

// //attach a click listener to a play button
document.querySelector('button')?.addEventListener('click', async () => {
    await Tone.start()
    console.log('audio is ready')
    // freq in note or pitch-octave, duration, when to play
    instrument.triggerAttackRelease("C1", '3');
    synth.triggerAttackRelease("C4", "8n");
})
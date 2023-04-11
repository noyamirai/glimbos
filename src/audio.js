// export const pitchShifter = new Tone.PitchShift(0).toDestination();
// pitchShifter.windowSize = 0.01;

// export const recorder = new Tone.Recorder();

// export const instrument = new Tone.Sampler({
//     urls: {
//         A1: 'A1.mp3',
//         A2: 'A2.mp3'
//     },
//     baseUrl: 'https://tonejs.github.io/audio/casio/'
// })
//     .connect(pitchShifter)
//     .connect(recorder)
//     .toDestination();

// document.querySelector("#tone-play-toggle").addEventListener("click", async () => {
//     await Tone.start()
//     console.log('start?');

//     Tone.Transport.start();
//     keys.player(1).start(1, 0, "16t");
    
// });

// document.querySelector("#tone-play-toggle").addEventListener("click", () => Tone.Transport.stop());
// document.querySelector("#tone-step-sequencer").addEventListener("click", (e) => {
//     console.log(e)
//     // keys.player(detail.row).start(detail.time, 0, "16t");
// });


// document.querySelector('button')?.addEventListener('click', async () => {
//     await Tone.start()
//     console.log('audio is ready')
    // freq in note or pitch-octave, duration, when to play

//     instrument.triggerAttackRelease("C1", '3');
//     synth.triggerAttackRelease("C4", "8n");
// })

// Set up the sound players
const keys = new Tone.Players({
  urls: {
    0: "A1.mp3",
    1: "Cs2.mp3",
    2: "E2.mp3",
    3: "Fs2.mp3",
  },
  fadeOut: "64n",
  baseUrl: "https://tonejs.github.io/audio/casio/",
}).toDestination();

// Set up the step sequence
const numSteps = 6;
let GLOBAL_STEPS = initializeSteps();

// Set up the current step counter
let currentStep = 0;

// Add event listeners to the step buttons
const stepButtons = document.querySelectorAll(".cell");
stepButtons.forEach((button) => {
  const col = button.dataset.col;
  const row = button.dataset.row;

  button.addEventListener("click", () => {
    GLOBAL_STEPS[col][row] = !GLOBAL_STEPS[col][row];
    console.log(GLOBAL_STEPS);
    button.classList.toggle("active", GLOBAL_STEPS[col][row]);
  });
});

// Start the step sequencer
const playButton = document.querySelector("#tone-play-toggle");
playButton.addEventListener("click", async () => {
    console.log(GLOBAL_STEPS);
    console.log(currentStep);
    
  await Tone.start();
    Tone.Transport.stop();
  Tone.Transport.cancel();
  Tone.Transport.scheduleRepeat((time) => {
    // Update the current step counter
    // currentStep = (currentStep + 1) % numSteps;
    currentStep = (currentStep % numSteps) + 1;

    const activeColumn = document.querySelectorAll(`.cell[data-row="${currentStep-1}"]`);
    activeColumn.forEach((button) => {
        const col = button.dataset.col;
        if (GLOBAL_STEPS[col][currentStep-1]) {
            keys.player(col).start(time);
        }
    });
    // // Indicate which column is active
    const columns = document.querySelectorAll(".column");
    columns.forEach((column, i) => {
        column.classList.toggle("sequence", i == (currentStep-1));
    });
  }, "6n");

  Tone.Transport.start();
});

// Stop the step sequencer
const stopButton = document.querySelector("#tone-play-stop");
stopButton.addEventListener("click", async () => {

    Tone.Transport.stop();
    currentStep = 0;
    GLOBAL_STEPS = initializeSteps();

    const columns = document.querySelectorAll(".column");

    columns.forEach((column) => {
        column.classList.remove("sequence");
    });
    stepButtons.forEach((button) => {
        button.classList.remove("active");
    });
});

function initializeSteps() {
    const steps = [];
    for (let i = 0; i < 4; i++) {
        steps.push(new Array(numSteps).fill(false));
    }

    return steps;
}
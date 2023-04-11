export const pitchShifter = new Tone.PitchShift(0).toDestination();
pitchShifter.windowSize = 0.01;

const octaves = ['a','b','c','d','e','f','g'];

// export const instrument = new Tone.Sampler({
// 	urls: {
//     // 0: "hihat.mp3",
//     // 1: "kick.mp3",
//     // 2: "snare.mp3",
//     // 3: "tom1.mp3",
//     // "C4": "hihat.mp3",
//     // "D#4": "kick.mp3",
//     // "F#4": "snare.mp3",
//     // "A4": "tom1.mp3",
//     "C4": "C4.mp3",
// 		"D#4": "Ds4.mp3",
// 		"F#4": "Fs4.mp3",
// 		"A4": "A4.mp3",
//   },
// 	baseUrl: 'https://tonejs.github.io/audio/salamander/'
// })
// 	.connect(pitchShifter)
// 	.toDestination();

// export const instrument = new Tone.Players({
//   urls: {
//     0: "hihat.mp3",
//     1: "kick.mp3",
//     2: "snare.mp3",
//     3: "tom1.mp3",
//   },
//   baseUrl: 'https://tonejs.github.io/audio/drum-samples/Techno/'
// })
//   .connect(pitchShifter)
//   .toDestination();

let synth;
let notes = [];
// let notesFromApi = [];
// const instrument = new Tone.Synth().toDestination();

fetch("https://api-hitloop.responsible-it.nl/test_json?seed=120")
  .then(response => response.json())
  .then(midi => {

    midi.tracks.forEach(track => {

      // TODO: get categories
      console.log(track);
      const trackNotes = track.notes

      trackNotes.forEach(note => {
        notes.push({
          pitch: note.name,
          velocity: note.velocity,
          time: note.time,
          duration: note.duration,
        });
      });
    });

    synth = new Tone.Synth().toDestination();
    console.log(notes);

  });

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
  await Tone.start();
  Tone.Transport.stop();
  Tone.Transport.cancel();

  Tone.Transport.scheduleRepeat((time) => {

      // Update the current step counter
      currentStep = (currentStep % numSteps) + 1;

      const activeColumn = document.querySelectorAll(`.cell[data-row="${currentStep-1}"]`);
      activeColumn.forEach((button) => {
          const col = button.dataset.col;

          if (GLOBAL_STEPS[col][currentStep-1]) {
            const selectedOctave = octaves[currentStep-1];
            const pitch = `${selectedOctave.toUpperCase()}${col}`;

            const event = notes[currentStep-1];
            console.log(event);

            // synth.triggerAttackRelease(event.pitch, event.duration, event.time);
            // synth.triggerAttackRelease(event.pitch, '8n', time);
            synth.triggerAttackRelease('C4', '8n', time);
            // instrument.triggerAttackRelease(pitch, '8n', time);
            // instrument.player(col).start(time);
          }
      });

      // Indicate which column is active
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
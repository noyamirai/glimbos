export const pitchShifter = new Tone.PitchShift(0).toDestination();
pitchShifter.windowSize = 0.01;

const octaves = ['a','b','c','d','e','f','g'];

const vocalTones = new Tone.Sampler({
	urls: {
    "C4": "12_Beats24-7_AhhAhh (D).wav",
  },
	baseUrl: '/static/samples/vocals/'
})
	.connect(pitchShifter)
	.toDestination();

// let synth;
// let notes = {};
// const instrument = new Tone.Synth().toDestination();

// fetch("https://api-hitloop.responsible-it.nl/test_json?seed=120")
//   .then(response => response.json())
//   .then(midi => {

//     midi.tracks.forEach(track => {

//       notes[track.name] = [];

//       // TODO: get categories
//       console.log(track);
//       const trackNotes = track.notes

//       trackNotes.forEach(note => {
//         notes[track.name].push({
//           pitch: note.name,
//           velocity: note.velocity,
//           time: note.time,
//           duration: note.duration,
//         });
//       });
//     });

//     synth = new Tone.Synth().toDestination();

//   });

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
    console.log('hi');
      // Update the current step counter
      currentStep = (currentStep % numSteps) + 1;
      const activeColumn = document.querySelectorAll(`.cell[data-row="${currentStep-1}"]`);
      activeColumn.forEach((button) => {
          const col = button.dataset.col;

          if (GLOBAL_STEPS[col][currentStep-1]) {
            const selectedOctave = octaves[currentStep-1];
            const pitch = `${selectedOctave.toUpperCase()}${col}`;
            let duration;
            const buffer = new Tone.Buffer("/static/samples/vocals/12_Beats24-7_AhhAhh (D).wav", () => {
              // get the duration of the WAV file in seconds
              duration = buffer.duration;

              vocalTones.triggerAttackRelease('C4', duration, time);
            });
            
            // const event = notes[Object.keys(notes)[col]][currentStep-1];
            // console.log(event);

            // synth.triggerAttackRelease(event.pitch, event.duration, event.time);
            // synth.triggerAttackRelease(event.pitch, '8n', time);
            // vocalTones.triggerAttackRelease('C4', '8n', time);

            // OLD:
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

function randomVelocity () {
		return (Math.random() * 0.5 + 0.5) * 0.8;
	};
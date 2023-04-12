let rules = {};

// const files = {
//   "0": "/static/samples/snare.wav",
//   "2": "/static/samples/kick.wav",
//   "5": "/static/samples/choir.wav", 
// }

// async function createFileObject() {
//   let newFilesObj = {};

//   const fileKeys = Object.keys(files);

//   for (const i of fileKeys) {
//     const file = files[i];

//     console.log(`Loading file: ${file}`);

//     newFilesObj[i] = {};
//     newFilesObj[i].name = file;

//     await new Promise((resolve) =>
//       new Tone.Buffer(
//         file,
//         (buffer) => {
//           const duration = buffer.duration;
//           newFilesObj[i].duration = duration;
//           console.log(`Got duration for file: ${file}`);
//           resolve();
//         },
//         (error) => {
//           console.error(`Error loading file: ${file}`, error);
//           resolve();
//         }
//       )
//     );
//   }

//   return newFilesObj;
// }

// const instruments = new Tone.Sampler({
//   urls: files, 
//   onload: async () => {
//     console.log('loaded instruments');
    
//     const newFiles = await createFileObject();

//     rules = {
//       player: instruments,
//       files: newFiles
//     }
//   }
// });

async function getDuration(file) {
  let newFilesObj = {};

    console.log(`Loading file: ${file}`);

    newFilesObj.name = file;

    await new Promise((resolve) =>
      new Tone.Buffer(
        file,
        (buffer) => {
          const duration = buffer.duration;
          newFilesObj.duration = duration;
          console.log(`Got duration for file: ${file}`);
          resolve();
        },
        (error) => {
          console.error(`Error loading file: ${file}`, error);
          resolve();
        }
      )
    );

  return newFilesObj;
}

const snare = new Tone.Player({
    url: '/static/samples/snare.wav',
    onload: async () => {

      const newFileObj = await getDuration('/static/samples/snare.wav');

      rules[0] = {
        player: snare,
        file: newFileObj
      }
      console.log('loaded snare');
    }
}).toDestination();

const vis = new Tone.Player({
    url: '/static/samples/vis.wav',
    onload: async () => {

      const newFileObj = await getDuration('/static/samples/vis.wav');

      rules[1] = {
        player: vis,
        file: newFileObj
      }
      console.log('loaded vis');
    }
}).toDestination();

const kick = new Tone.Player({
    url: '/static/samples/kick.wav',
    onload: async () => {

      const newFileObj = await getDuration('/static/samples/kick.wav');

      rules[2] = {
        player: kick,
        file: newFileObj
      }
      console.log('loaded kick');
    }
}).toDestination();

const choir = new Tone.Player({
    url: '/static/samples/choir.wav',
    onload: async () => {

      const newFileObj = await getDuration('/static/samples/choir.wav');

      rules[3] = {
        player: choir,
        file: newFileObj
      }
      console.log('loaded choir');
    }
}).toDestination();

const cat = new Tone.Player({
    url: '/static/samples/cat.wav',
    onload: async () => {

      const newFileObj = await getDuration('/static/samples/cat.wav');

      rules[4] = {
        player: cat,
        file: newFileObj
      }
      console.log('loaded cat');
    }
}).toDestination();

const melody = new Tone.Player({
    url: '/static/samples/melody.wav',
    onload: async () => {

      const newFileObj = await getDuration('/static/samples/melody.wav');

      rules[5] = {
        player: melody,
        file: newFileObj
      }
      console.log('loaded melody');
    }
}).toDestination();

// Set up the step sequence
const numSteps = 16;
let GLOBAL_STEPS = initializeSteps();

// Set up the current step counter
let currentStep = 0;

// Add event listeners to the step buttons
const stepButtons = document.querySelectorAll(".cell");
stepButtons.forEach((button) => {
  const col = button.dataset.col;
  const row = button.dataset.row;

  button.addEventListener("click", () => {
    GLOBAL_STEPS[row][col] = !GLOBAL_STEPS[row][col];
    console.log(GLOBAL_STEPS);
    button.classList.toggle("active", GLOBAL_STEPS[row][col]);
  });
});

// Start the step sequencer
const playButton = document.querySelector("#tone-play-toggle");
playButton.addEventListener("click", async () => {

  const longTrackContainer = document.querySelector('.column:last-of-type');
  
  if (!longTrackContainer.className.includes('hide')) {
    activateMelody();
  }

  await Tone.start();
  Tone.Transport.stop();
  Tone.Transport.cancel();

  Tone.Transport.scheduleRepeat((time) => {
      // Update the current step counter
      currentStep = (currentStep % numSteps) + 1;

      const allColumns = document.querySelectorAll('.column:not(.hide)');

      allColumns.forEach(async (column, i) => {
        
        if (column.className.includes('column-full')) {
          const longTrack = column.querySelector('.track');

          if (!longTrack.className.includes('active')) {
            activateMelody();
          }
        }

        const button = column.querySelector('.cell.sequence');

        if (button) {
          
          const col = parseInt(button.getAttribute('data-col'));
          const row = parseInt(button.getAttribute('data-row'));
    
          if (row != 5 && GLOBAL_STEPS[row][col]) {
            console.log('active');
            // const selectedOctave = octaves[currentStep-1];
            // const pitch = `${selectedOctave.toUpperCase()}${col}`;

            // const event = notes[Object.keys(notes)[0]][0];
            // console.log(event);
            // synth.triggerAttackRelease(event.pitch, '8n', time);
  
            // let duration;
            // console.log(rules);
            // console.log(rules.files[row]);
            // console.log(rules[row]);
            // console.log(rules.player);


            // rules.player.triggerAttackRelease(row, rules.files[row].duration, time);
  
            // new Tone.Buffer(rules.files[row].name, () => {
              // get the duration of the WAV file in seconds
              // duration = buffer.duration;
              rules[row].player.start();
              // rules.player.triggerAttackRelease('row', rules.files[row].duration, time);
            // });
          }
        }

      })

      const allBtns = document.querySelectorAll(`.cell`);
      allBtns.forEach((btn, i) => {
        const col = btn.dataset.col;

        if (col == currentStep-1) {
          btn.classList.add("sequence")
        } else {
          btn.classList.remove("sequence")

        }
      });

    }, "10n");

    Tone.Transport.start();
});

let melodyPlayer;

// Stop the step sequencer
const stopButton = document.querySelector("#tone-play-stop");
stopButton.addEventListener("click", async () => {

  Tone.Transport.stop();
  Tone.Transport.cancel();

  if (melodyPlayer && melodyPlayer.state === "started") {
    console.log("The player is active.");
    melodyPlayer.stop();
  } 

  // TODO: remove styling
  currentStep = 0;
  GLOBAL_STEPS = initializeSteps();


  stepButtons.forEach((button) => {
      button.classList.remove("active");
      button.classList.remove("sequence");
  });
});

function initializeSteps() {
    const steps = [];
    for (let i = 0; i < 6; i++) {
        steps.push(new Array(numSteps).fill(false));
    }

    return steps;
}

function activateMelody () {
  console.log('true');
  const longTrack = document.querySelector('.track');
  
    longTrack.classList.add('active');
    melodyPlayer = new Tone.Player({
        url: '/static/samples/melody.wav',
        loop: true,
        onload: () => {
            console.log('start melody');
            melodyPlayer.start();
        }
    }).toDestination();
}

const characterBtns = document.querySelectorAll('.character');

characterBtns.forEach((character, i) => {

  character.addEventListener('click', () => {
  
    character.classList.toggle("selected");
  
    const allColumns = document.querySelectorAll('.column');
    allColumns[i].classList.toggle('hide');
  
    return;

  })

  
});
import getRules from "/src/players.js";
const rules = await getRules();

const script = document.querySelector('script[data-app-locals]');
const bodyEl = document.querySelector('body');

const characterBtns = document.querySelectorAll('[data-character]');
const stopButton = document.querySelector("[data-stop-btn]");
const playButton = document.querySelector("[data-play-btn]");
const trackControlBtns = document.querySelectorAll('[data-track-control-btns]');

// Get the value of the data attribute as a string
const characterAmount = script.getAttribute('data-character-amount');
const trackCellAmount = script.getAttribute('data-cell-amount');

const activeStateClass = 'active';
const sequenceStartedClass = 'sequence';

const GLOBAL_NUMSTEPS = trackCellAmount;
const GLOBAL_SPEED = '10n';

// Set up the step sequence
let GLOBAL_STEPS = initializeSteps();

// Set up the current step counter
let currentStep = 0;
let melodyPlayer;

// const currentSteps = new Array(parseInt(GLOBAL_NUMSTEPS)).fill(0)
// console.log(currentSteps);

// Add event listeners to the step buttons
const stepButtons = document.querySelectorAll("[data-track-cell]");
stepButtons.forEach((button) => {
  const col = button.dataset.col;
  const row = button.dataset.row;

  button.addEventListener("click", () => {
    GLOBAL_STEPS[row][col] = !GLOBAL_STEPS[row][col];
    console.log(GLOBAL_STEPS);
    button.classList.toggle(activeStateClass, GLOBAL_STEPS[row][col]);
  });
});

// const trackPlayBtns = document.querySelectorAll('[data-play-btn]');

// trackPlayBtns.forEach((trackControlBtn) => {
//   trackControlBtn.addEventListener('click', async () => {
//     const buttonForRowIndex = trackControlBtn.getAttribute('data-track-control-for');
//     const targetPlayer = rules[buttonForRowIndex];

//     console.log(buttonForRowIndex);

//     Tone.Transport.clear(`${buttonForRowIndex}:0`);

//     //  if (Tone.Transport.state === "started") {
//     //   console.log("The sequencer is already active.");
//     //   return;
//     // } 

//     // bodyEl.classList.add('playing');
//     // const longTrackContainer = document.querySelector('[data-track-wide]');
    
//     // if (!longTrackContainer.className.includes('hide')) {
//     //   activateMelody();
//     // }

//     await Tone.start();
//     // Tone.Transport.stop();
//     // Tone.Transport.cancel();
    
//     Tone.Transport.scheduleRepeat(() => {

//       // Update the current step counter
//       // currentStep = (currentStep % GLOBAL_NUMSTEPS) + 1;
//       currentSteps[buttonForRowIndex] = (currentSteps[buttonForRowIndex] % GLOBAL_NUMSTEPS) + 1;

//       const allRows = document.querySelectorAll('[data-track]');
//       const currentRow = allRows[buttonForRowIndex];
      
//       if (currentRow.getAttribute('data-track-wide')) {
//         const longTrack = currentRow.querySelector('[data-track-block]');

//         if (!longTrack.className.includes(activeStateClass)) {
//           activateMelody();
//         }
//       }

//       const button = currentRow.querySelector(`[data-track-cell].${sequenceStartedClass}`);

//       if (button) {
        
//         const col = parseInt(button.getAttribute('data-col'));
//         const row = parseInt(button.getAttribute('data-row'));

//         if (row != 5 && GLOBAL_STEPS[buttonForRowIndex][col]) {
//           console.log('play sound');
//           // targetPlayer.player.start();
//         }
//       }

//       const allBtns = document.querySelectorAll(`[data-track-cell][data-row="${buttonForRowIndex}"]`);
      
//       allBtns.forEach((btn, i) => {
//         const col = btn.dataset.col;

//         if (buttonForRowIndex==0) {
//           console.log(currentSteps);
//         }

//         if (col == currentSteps[buttonForRowIndex]) {
//           btn.classList.add(sequenceStartedClass)
//         } else {
//           btn.classList.remove(sequenceStartedClass)
//         }
//       });

//     }, GLOBAL_SPEED, `${buttonForRowIndex}:0`);

//     Tone.Transport.start();

//   });
// });


// Start the step sequencer
playButton.addEventListener("click", async () => {

  if (Tone.Transport.state === "started") {
    console.log("The sequencer is already active.");
    return;
  } 

  bodyEl.classList.add('playing');
  const longTrackContainer = document.querySelector('[data-track-wide]');
  
  if (!longTrackContainer.className.includes('hide')) {
    activateMelody();
  }

  await Tone.start();
  Tone.Transport.stop();
  Tone.Transport.cancel();

  Tone.Transport.scheduleRepeat((time) => {
      // Update the current step counter
      currentStep = (currentStep % GLOBAL_NUMSTEPS) + 1;

      const allColumns = document.querySelectorAll('[data-track]:not(.hide)');

      allColumns.forEach(async (column, i) => {
        
        if (column.getAttribute('data-track-wide')) {
          const longTrack = column.querySelector('[data-track-block]');

          if (!longTrack.className.includes(activeStateClass)) {
            activateMelody();
          }
        }

        const button = column.querySelector(`[data-track-cell].${sequenceStartedClass}`);

        if (button) {
          
          const col = parseInt(button.getAttribute('data-col'));
          const row = parseInt(button.getAttribute('data-row'));
    
          if (row != 5 && GLOBAL_STEPS[row][col]) {
            console.log('play sound');
            rules[row].player.start();
          }
        }

      })

      const allBtns = document.querySelectorAll(`[data-track-cell]`);
      allBtns.forEach((btn, i) => {
        const col = btn.dataset.col;

        if (col == currentStep-1) {
          btn.classList.add(sequenceStartedClass)
        } else {
          btn.classList.remove(sequenceStartedClass)

        }
      });

    }, GLOBAL_SPEED);

    Tone.Transport.start();
});

characterBtns.forEach((character, i) => {

  character.addEventListener('click', () => {
  
    character.classList.toggle("selected");

    const trackControlBtns = document.querySelectorAll('[data-track-control-btns]');
    trackControlBtns.forEach(btn => {
      const selectedCharacters = document.querySelectorAll('[data-character].selected');

      if (selectedCharacters.length > 0) {
        // if (btn.getAttribute('data-track-control-for') == i) {
        //   btn.classList.toggle('hide');
        // }
        
          btn.classList.remove('hide');
      } else {
        btn.classList.add('hide');
        stopPlayer();
      }
    });
  
    const allColumns = document.querySelectorAll('[data-track]');
    allColumns[i].classList.toggle('hide');

    // melody
    if (i == 5 && bodyEl.className.includes('playing')) {
      activateMelody();
    }
  
    return;

  })

  
});

// Stop the step sequencer
stopButton.addEventListener("click", async () => {
  stopPlayer();
});

function stopPlayer() {

  bodyEl.classList.remove('playing');

  Tone.Transport.stop();
  Tone.Transport.cancel();

  if (melodyPlayer && melodyPlayer.state === "started") {
    console.log("The player is active.");
    const longTrack = document.querySelector('[data-track-block]');
    longTrack.classList.remove(activeStateClass);
    melodyPlayer.stop();
  } 

  currentStep = 0;
  GLOBAL_STEPS = initializeSteps();

  stepButtons.forEach((button) => {
      button.classList.remove(activeStateClass);
      button.classList.remove(sequenceStartedClass);
  });
}

function activateMelody () {
  console.log('ACTIVATE MELODY');
  const longTrack = document.querySelector('[data-track-block]');
  
    longTrack.classList.add(activeStateClass);
    melodyPlayer = new Tone.Player({
        url: '/static/samples/melody.wav',
        loop: true,
        onload: () => {
            console.log('play melody');
            melodyPlayer.start();
        }
    }).toDestination();
}


function initializeSteps() {
    const steps = [];
    for (let i = 0; i < characterAmount; i++) {
        steps.push(new Array(GLOBAL_NUMSTEPS).fill(false));
    }

    return steps;
}
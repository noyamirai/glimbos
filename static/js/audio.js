import getRules from "/src/players.js";
const rules = await getRules();

const script = document.querySelector('script[data-app-locals]');
const bodyEl = document.querySelector('body');

const characterBtns = document.querySelectorAll('[data-character]');
const stopButton = document.querySelector("[data-stop-btn]");
const playButton = document.querySelector("[data-play-btn]");

// Get the value of the data attribute as a string
const characterAmount = script.getAttribute('data-character-amount');
const trackCellAmount = script.getAttribute('data-cell-amount');

const activeStateClass = 'active';
const sequenceStartedClass = 'sequence';

const GLOBAL_NUMSTEPS = trackCellAmount;
const GLOBAL_SPEED = '8n';

// Set up the step sequence
let GLOBAL_STEPS = initializeSteps();

// Set up the current step counter
let currentStep = 0;
let melodyPlayer;

// Add event listeners to the step buttons
const stepButtons = document.querySelectorAll("[data-track-cell]");

stepButtons.forEach((button) => {
  const col = button.dataset.col;
  const row = button.dataset.row;


  button.addEventListener("click", () => {
    GLOBAL_STEPS[row][col] = !GLOBAL_STEPS[row][col];
    console.log(GLOBAL_STEPS);

    characterBtns[row].classList.toggle(activeStateClass);

    button.classList.toggle(activeStateClass, GLOBAL_STEPS[row][col]);
  });
});

let activeSeq;

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
      console.log('START SEQ');
      console.log(currentStep);
      const allColumns = document.querySelectorAll('[data-track]:not(.hide)');

      // console.log('LOOP THRU COLS -> set sound');
      allColumns.forEach((column, i) => {
        
        if (column.getAttribute('data-track-wide')) {
          const longTrack = column.querySelector('[data-track-block]');

          if (!longTrack.className.includes(activeStateClass)) {
            activateMelody();
          }
        }

        const buttons = column.querySelectorAll(`[data-track-cell].${activeStateClass}`);
    
        buttons.forEach(button => {
          
          if (button) {
            const buttonCol = button.getAttribute('data-col');
            const buttonRow = button.getAttribute('data-row');
  
            if (buttonCol == currentStep-1 && buttonRow != 5 && GLOBAL_STEPS[buttonRow][buttonCol]) {
              console.log('play sound!');
              rules[buttonRow].player.start();
            }
            
            //   const col = parseInt(button.getAttribute('data-col'));
            //   const row = parseInt(button.getAttribute('data-row'));
    
            //   console.log('current col?');
            //   console.log(col);
              
        
            //   if (row != 5 && GLOBAL_STEPS[row][col]) {
            //     console.log(GLOBAL_STEPS);
            //     console.log('play sound');
            //     rules[row].player.start();
            //   }
            }
    
          })
        });


      // console.log('BTN STYLES');

      const seqBtns = document.querySelectorAll(`[data-track-cell][data-col="${currentStep-1}"]`)
      const allOtherBtns = document.querySelectorAll(`[data-track-cell]:not([data-col="${currentStep-1}"])`);

      seqBtns.forEach(seqBtn => {
        
        seqBtn.classList.add(sequenceStartedClass);
        const row = seqBtn.getAttribute('data-row');
  
        if (seqBtn.className.includes(activeStateClass)) {
          activeSeq = currentStep-1
          console.log('start cat animation');
          characterBtns[row].classList.add(sequenceStartedClass);
  
        } else if (!seqBtn.className.includes(activeStateClass) && (currentStep-1) > activeSeq) {
          characterBtns[row].classList.remove(sequenceStartedClass);
        }
      });

      allOtherBtns.forEach(btn => {
        btn.classList.remove(sequenceStartedClass);
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
        steps.push(new Array(parseInt(GLOBAL_NUMSTEPS)).fill(false));
    }

    return steps;
}
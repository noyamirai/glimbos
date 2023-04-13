const players = {};

// define a function to handle button clicks
function handleButtonClick(buttonId, filePath) {

    // check if the player and loop instances for this button already exist
  if (players[buttonId]) {
    console.log('hhh');
  } else {

    console.log('creating new player');

    const player = new Tone.Player({
        url: filePath,
        loop: true,
        onload: () => {
            console.log('start');
            player.start();
            players[buttonId] = {
                player: player,
                loop: true
            };
        }
    }).toDestination();

    // const player = new Tone.Player({
    //     url: filePath,
    //     loop: true
    // }).toDestination()

    // if they don't exist, create new player and loop instances for this button's audio file

  }
}

const instrumentalBtns = document.querySelectorAll('[data-instrumental-btn]');

instrumentalBtns.forEach((button) => {
    button.addEventListener("click", async (event) => {
        const buttonId = event.target.id;

        let filePath;

        if (event.target.getAttribute('data-row') == 1) {
            
            // kick.start(0);
             filePath = `/static/samples/instrumentals/24_Mac & Cheese_Clap.wav`;

        } else {
            // snare.start(0);
            filePath = `/static/samples/melodies/47.wav`;
            // filePath = `/static/samples/melodies/5_DrumsFull_136BPM.wav`;
        }

        handleButtonClick(buttonId, filePath);
    });
})
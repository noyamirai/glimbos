// async function getRules() {

//     let rules = {};

//     const snare = new Tone.Player({
//         url: '/static/samples/snare.wav',
//         onload: async () => {

//         const newFileObj = await getDuration('/static/samples/snare.wav');

//         rules[0] = {
//             player: snare,
//             file: newFileObj
//         }
//         console.log('loaded snare');
//         }
//     }).toDestination();

//     const vis = new Tone.Player({
//         url: '/static/samples/vis.wav',
//         onload: async () => {

//         const newFileObj = await getDuration('/static/samples/vis.wav');

//         rules[1] = {
//             player: vis,
//             file: newFileObj
//         }
//         console.log('loaded vis');
//         }
//     }).toDestination();

//     const kick = new Tone.Player({
//         url: '/static/samples/kick.wav',
//         onload: async () => {

//         const newFileObj = await getDuration('/static/samples/kick.wav');

//         rules[2] = {
//             player: kick,
//             file: newFileObj
//         }
//         console.log('loaded kick');
//         }
//     }).toDestination();

//     const choir = new Tone.Player({
//         url: '/static/samples/choir.wav',
//         onload: async () => {

//         const newFileObj = await getDuration('/static/samples/choir.wav');

//         rules[3] = {
//             player: choir,
//             file: newFileObj
//         }
//         console.log('loaded choir');
//         }
//     }).toDestination();

//     const cat = new Tone.Player({
//         url: '/static/samples/cat.wav',
//         onload: async () => {

//         const newFileObj = await getDuration('/static/samples/cat.wav');

//         rules[4] = {
//             player: cat,
//             file: newFileObj
//         }
//         console.log('loaded cat');
//         }
//     }).toDestination();

//     const melody = new Tone.Player({
//         url: '/static/samples/melody.wav',
//         onload: async () => {

//         const newFileObj = await getDuration('/static/samples/melody.wav');

//         rules[5] = {
//             player: melody,
//             file: newFileObj
//         }
//         console.log('loaded melody');
//         }
//     }).toDestination();


//     return rules;
// }

const samples = [
  '/static/samples/snare.wav',
  '/static/samples/cat.wav',
  '/static/samples/vis.wav',
  '/static/samples/choir.wav',
  '/static/samples/kick.wav',
  '/static/samples/melody.wav',
];


  const rules = {};
  const players = [];

async function getRules() {

  for (let i = 0; i < samples.length; i++) {
    const player = new Tone.Player({
      url: samples[i],
      onload: async () => {
        const newFileObj = await getDuration(samples[i]);

        rules[i] = {
          player,
          file: newFileObj,
        };
        console.log(`loaded ${samples[i]}`);

        // check if all players have been loaded
        if (Object.keys(rules).length === samples.length) {
          // resolve promise with rules object
        //   resolve(rules);
            return;
        }
      },
    }).toDestination();

    players.push(player);
  }

  // create a promise that resolves when all players have loaded
  return new Promise((resolve) => {
    if (players.length === 0) {
      // if there are no players, resolve immediately
      resolve(rules);
    } else {
      // otherwise, wait for all players to load
      Tone.loaded().then(() => {
        resolve(rules);
      });
    }
  });
}

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

export default getRules;
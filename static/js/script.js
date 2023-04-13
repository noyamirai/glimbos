const kittyCanvas = document.querySelector('#kitty-canvas');
const visCanvas = document.querySelector('#vis-canvas');

function kittyRive(canvas) {
  const canvasKittyRive = new rive.Rive({
    src: '../src/glimbos.riv',
    canvas: canvas,
    autoplay: true,
    stateMachines: 'kitty-states',
    artboard: 'kitty',
    fit: rive.Fit.cover,
    onLoad: (_) => {
      // canvasKittyRive.resizeDrawingSurfaceToCanvas();

      const inputs = canvasKittyRive.stateMachineInputs("kitty-states");
      const triggerClicked = inputs.find((i) => i.name === "anticipate");
      const triggerSing = inputs.find((i) => i.name === "sing");

      const canvasEl = document.querySelector('#kitty-canvas');
      const targetNode = canvasEl.parentNode;

      // create a new MutationObserver object
      const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            console.log(`'class' attribute changed to '${mutation.target.className}'`);

            if (mutation.target.className.includes('selected')) {
              triggerClicked.value = true;

              const bodyEl = document.querySelector('body');

              if (mutation.target.className.includes('sequence')) {
                triggerSing.value = true;
              } else {
                triggerSing.value = false;
              }
              
            } else {
              triggerClicked.value = false;
              triggerSing.value = false;
            }
          }
        }
      });

      // define what to observe and start observing
      const config = { attributes: true, attributeFilter: ['class'] };
      observer.observe(targetNode, config);
    },
  });

}
function visRive(canvas) {
  const canvasVisRive = new rive.Rive({
    src: '../src/glimbos.riv',
    canvas: canvas,
    autoplay: true,
    stateMachines: 'bips-states',
    artboard: 'fish',
    fit: rive.Fit.cover,
    onLoad: (_) => {
      // canvasVisRive.resizeDrawingSurfaceToCanvas();

      const inputs = canvasVisRive.stateMachineInputs("bips-states");
      const triggerClicked = inputs.find((i) => i.name === "anticipate");
      const triggerSing = inputs.find((i) => i.name === "sing");

      const canvasEl = document.querySelector('#vis-canvas');
      const targetNode = canvasEl.parentNode;

      // create a new MutationObserver object
      const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            console.log(`'class' attribute changed to '${mutation.target.className}'`);

            if (mutation.target.className.includes('selected')) {
              triggerClicked.value = true;

              const bodyEl = document.querySelector('body');

              if (mutation.target.className.includes('sequence')) {
                triggerSing.value = true;
              } else {
                triggerSing.value = false;
              }
              
            } else {
              triggerClicked.value = false;
              triggerSing.value = false;
            }
          }
        }
      });

      // define what to observe and start observing
      const config = { attributes: true, attributeFilter: ['class'] };
      observer.observe(targetNode, config);
    },
  });
}

kittyRive(kittyCanvas);
visRive(visCanvas);
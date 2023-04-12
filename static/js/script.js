const kittyCanvas = document.querySelector('#kitty-canvas');

function kittyRive(canvas) {
  const canvasKittyRive = new rive.Rive({
    src: '../src/kitty.riv',
    canvas: canvas,
    autoplay: true,
    stateMachines: 'kitty-states',
    artboard: 'kitty',
    fit: rive.Fit.cover,
    onLoad: (_) => {
      canvasKittyRive.resizeDrawingSurfaceToCanvas();

      const inputs = canvasKittyRive.stateMachineInputs("kitty-states");
      const triggerClicked = inputs.find((i) => i.name === "clicked");

      const canvasEl = document.querySelector('#kitty-canvas');
      const targetNode = canvasEl.parentNode.parentNode;
      console.log(targetNode);

      // create a new MutationObserver object
      const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            console.log(`'class' attribute changed to '${mutation.target.className}'`);

            if (mutation.target.className.includes('sequence') && canvasEl.parentNode.className.includes('active')) {
              triggerClicked.value = true;
            } else {
              triggerClicked.value = false;
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
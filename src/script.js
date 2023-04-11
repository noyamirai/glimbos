
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
      },
    });
}

kittyRive(kittyCanvas);
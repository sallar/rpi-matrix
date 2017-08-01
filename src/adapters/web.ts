import { StyleSheet, css } from 'aphrodite';
import { LedMatrix, IMatrix } from 'led-matrix';
import { setRenderer, start, nextView } from '../runner';

// Styles
const styles = StyleSheet.create({
  canvas: {
    position: 'fixed',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  },
  button: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    border: 'none',
    backgroundColor: '#f00000',
    color: '#fff',
    cursor: 'pointer',
    textAlign: 'center',
    padding: 0,
    outline: 'none'
  }
});

// Create the canvas
const canvas = document.createElement('canvas');
canvas.className = css(styles.canvas);

// MODE button
const button = document.createElement('button');
button.className = css(styles.button);
button.innerHTML = 'MODE';
button.addEventListener('click', () => nextView());

// Attach
document.body.appendChild(canvas);
document.body.appendChild(button);
document.body.style.backgroundColor = '#222';

// Create the simulator
const led = new LedMatrix(canvas, {
  x: 32,
  y: 16,
  pixelWidth: 20,
  pixelHeight: 20
});

// Render
function render(data: IMatrix) {
  led.setData(data);
  led.render();
}

// Run
setRenderer(render);
start();

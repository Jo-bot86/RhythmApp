import * as Tone from './tone';

// Create a synth for the metronome click sound
const drum = new T

// Define the metronome function
function startMetronome(bpm = 60) {
  // Set the BPM (beats per minute)
  Tone.getTransport.bpm.value = bpm;

  // Create a repeating event every quarter note
  Tone.getTransport.scheduleRepeat((time) => {
    // Play a click sound on each beat
    drum.triggerAttackRelease("C4", "8n", time);
  }, "4n");
}

// Add event listener to the "Start Metronome" button
document.getElementById('startMetronome').addEventListener('click', async () => {
  // Start the AudioContext on a user gesture
  await Tone.start();
  setTimeout(() => startMetronome(), 100);
  console.log('Audio is ready');

  // Start the metronome
  startMetronome(60); // You can pass a different BPM if desired
  Tone.getTransport.start();
});
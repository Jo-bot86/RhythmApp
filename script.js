let beats = 4; // number of beats shown on the canvas
let unit = 300;
let offset = 1/10; //shifts each impulse to the right by an amount of the beat (unit)
let activePulses = [];
let activeGrids = [];

const checkboxes = document.querySelectorAll('input[type="checkbox"]'); //select all checkboxes

//set up canvas
const canvas = document.querySelector("#myCanvas");
const context= canvas.getContext("2d");

window.addEventListener('DOMContentLoaded', adjustCanvasHeight, drawBeatGrid);
window.addEventListener('resize', adjustCanvasHeight);

function adjustCanvasHeight() {
    const headerFooterHeight = 70; // Adjust based on your actual header/footer height
    const availableHeight = window.innerHeight - headerFooterHeight;
    const canvasContainer = document.getElementById('canvasContainer');
    canvasContainer.style.height = `${availableHeight}px`; // Adjust container height for vertical visibility
    canvasContainer.style.overflowX = 'auto'; // Enable horizontal scrolling

    // Adjust canvas height to fit vertically without scrolling
    const canvas = document.getElementById('myCanvas');
    canvas.height = availableHeight;
    redrawCanvas();
}

function adjustCanvasWidth() {
    const contentWidth = ((beats) * unit);
    canvasContainer.width = contentWidth;
    canvas.width = contentWidth;
}

//add event listeners to all checkboxes
for(let i = 0; i < checkboxes.length; i++){
    checkboxes[i].addEventListener('click', function(event) {
        pulseClicked(this.id.split('/')[0], this.id.split('/')[1]);
    });
}

function chooseColor(denominator) {
    let color = "grey";
    switch (denominator) {
        case 1:
            color = "black";
            break;
        case 2:
        case 4:
        case 8:
            color = "blue";
            break;
        case 3:
        case 9:
            color = "orange";
            break;
        case 6:
        case 12:
            color = "green";
            break;
        case 5:
        case 10:
            color = "red";
            break;
        case 7:
            color = "purple";
            break;
        case 11:
            color = "brown";
            break;
        case 13:
            color = "pink";
            break;
    }
    return color;
}

function drawBeatGrid() {
    adjustCanvasWidth();
    let grid = [];
    let j = 0;

    while(j < beats) {
        grid.push(j);
        j = j + 1;
    }

    context.strokeStyle = "lightgrey";
    context.lineWidth = 4;

    //draw vertical lines
    for(k = 0; k < grid.length; k++){
        context.beginPath();
        context.moveTo(((grid[k] + offset) * unit), 0);  
        context.lineTo(((grid[k] + offset) * unit), canvas.height);
        context.stroke(); 
    }
}

function drawPulse(numerator, denominator) {
    let radius;
    if (denominator == 1){
        radius = (unit/100)+3;
    } else {
        radius = (unit/100)+1.5;
    }

    context.fillStyle = chooseColor(denominator);
    context.strokeStyle = chooseColor(denominator);

    //regular or irregular pulse?
    if (typeof numerator == "number"){ //regular pulse
        let pointsAmount = (denominator / numerator) * beats;
        let pulse = [];
        let j = 0;

        //fill pulse array
        while(j < pointsAmount) {
            pulse.push((numerator/denominator) * j);
            j++;
        }

        if (denominator == 1){
            context.lineWidth = 3;
        } else {
            context.lineWidth = 1;
        }

        //draw horizontal line
        if (!(numerator == 1)){
            context.beginPath();
            context.moveTo(((pulse[0] + offset) * unit), (canvas.height - (numerator/denominator * unit)));
            context.lineTo(((pulse[pulse.length - 1] + offset) * unit), (canvas.height - (numerator/denominator * unit)));
            context.stroke();
        }

        for(k = 0; k < pulse.length; k++){
             //draw vertical lines
            context.beginPath();
            context.moveTo(((pulse[k] + offset) * unit), (canvas.height - (numerator/denominator * unit)));
            context.lineTo(((pulse[k] + offset) * unit), (canvas.height -  (1/denominator * unit)));
            context.stroke();

            //draw circles
            context.beginPath();
            context.arc( ((pulse[k] + offset) * unit), (canvas.height - (numerator/denominator * unit)), radius, 0, 2*Math.PI, true);  // arc(x, y, radius, startAngle, endAngle, counterclockwise)
            context.fill();
        }
        
    } else { //irregular pulse
        let pointsAmount = ((denominator / sumArray(numerator)) * numerator.length * beats) - 1;
        let pulse = [0];
        let j = 0;

        //fill pulse array
        while(j < pointsAmount) { 
            pulse.push(numerator[j % numerator.length] + pulse[j]);
            j++;
        }

        if (denominator == 1){
            context.lineWidth = 2;
        } else {
            context.lineWidth = 1;
        }

        for(let k = 0; k < pulse.length; k++){
            //draw vertical lines
            context.beginPath();
            context.moveTo((((pulse[k]/denominator) + offset) * unit), (canvas.height - (numerator[k % numerator.length]/denominator * unit)));
            context.lineTo((((pulse[k]/denominator) + offset) * unit), (canvas.height -  (1/denominator * unit)));
            context.stroke();
            //draw dashed vertical line if the impulse is smaller than the previous one
            if (numerator[(k - 1) % numerator.length] > numerator[k % numerator.length]){
                context.beginPath();
                context.setLineDash([5, 5]);
                context.moveTo((((pulse[k]/denominator) + offset) * unit), (canvas.height - (numerator[k % numerator.length]/denominator * unit)));
                context.lineTo((((pulse[k]/denominator) + offset) * unit), (canvas.height - (numerator[(k - 1) % numerator.length]/denominator * unit)));
                context.stroke();
                context.setLineDash([]);
            }

            //draw horizontal lines
            context.beginPath();
            context.moveTo((((pulse[k] / denominator) + offset) * unit), (canvas.height - (numerator[k % numerator.length]/denominator * unit)));
            context.lineTo((((pulse[k + 1] / denominator) + offset) * unit), (canvas.height - (numerator[k % numerator.length]/denominator * unit)));
            context.stroke();
            
            //draw circles
            context.beginPath();
            context.arc( (((pulse[k] / denominator) + offset) * unit), (canvas.height - (numerator[k % numerator.length]/denominator * unit)), radius, 0, 2*Math.PI, true);  // arc(x, y, radius, startAngle, endAngle, counterclockwise)
            context.fill();
        }
    }
}    

function activatePulse(numerator,denominator){
    //add pulse to array "activePulses"
    if (!(activePulses.includes(`${numerator}/${denominator}`))) {
        activePulses.push(`${numerator}/${denominator}`);
    }
    redrawCanvas();
}

function deactivatePulse(numerator, denominator){
     //remove pulse from array "activePulses"
     let removePulse = activePulses.indexOf(`${numerator}/${denominator}`);
     activePulses.splice(removePulse,1);
     redrawCanvas();

     console.log("Active pulses: " + activePulses); // take out later.
}

//activate or deactive clicked pulse
function pulseClicked(numerator, denominator){
    let state = document.getElementById(`${numerator}/${denominator}`).checked;

    if (state) {
        activatePulse(numerator, denominator);
    } else {
        deactivatePulse(numerator, denominator);
    };
}

function processIrregularPulseInput() {
    var input = document.getElementById("irregularPulseInput").value;
    var irregularPulse = input.split(",").map(Number);
    var irregularDenominator = Number(document.getElementById("irregularDenominator").value);
    activePulses.push(`[${irregularPulse}]/${irregularDenominator}`);
    drawPulse(irregularPulse, irregularDenominator);
}

function redrawCanvas() {
    beats = document.querySelector("#input_beats").value
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawBeatGrid();

    //draw pulses
    for(let i = 0; i < activePulses.length; i++){
        const recentPulse = activePulses[i];
        const numeratorDenominator = recentPulse.split("/");
        if (numeratorDenominator[0].length === 1){
            let numerator = +numeratorDenominator[0];   //numerator of pulse
            let denominator = +numeratorDenominator[1];   //denominator of pulse
            drawPulse(numerator, denominator);   
        } else {
            let numerator = numeratorDenominator[0].slice(1, -1).split(',').map(Number); // Removes brackets and converts strings to numbers
            let denominator = +numeratorDenominator[1];   //denominator of pulse
            console.log("numerator: " + numerator);
            drawPulse(numerator, denominator);
        
        }
    }
    console.log("Active pulses: " + activePulses); // take out later.
}

//clear the canvas, all checkboxes and the array "activePulses"
const resetButton = document.getElementById("resetButton");
resetButton.addEventListener('click', reset);

function reset() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
    });
    activePulses = [];
    drawBeatGrid();
}

//zoom in and out
let zoomSlider = document.getElementById("zoomSlider");
zoomSlider.addEventListener('input', function() {
    let zoomRatio = this.value;
    unit = 6 * zoomRatio;
    redrawCanvas();
})

//redraw Canvas whenever the number of beats is changed
const inputBeats = document.getElementById("input_beats");
inputBeats.addEventListener('input', redrawCanvas);

//calculate the sum of the irregularPulse array
function sumArray(array) {
    var sum = 0; // initialize the sum to zero
    for (var i = 0; i < array.length; i++) {
      sum += array[i]; // add each element to the sum
    }
    return sum; // return the total sum
}

// Make the floating UI element draggable:
var floatingUI = document.getElementById("floatingUI");
var header = document.getElementById("header");

var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

header.addEventListener('mousedown', dragMouseDown);
header.addEventListener('touchstart', dragMouseDown);

function dragMouseDown(event) {
    event.preventDefault();
    if (event.type === 'mousedown') {
        pos3 = event.clientX;
        pos4 = event.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    } else if (event.type === 'touchstart') {
        pos3 = event.touches[0].clientX;
        pos4 = event.touches[0].clientY;
        document.ontouchend = closeDragElement;
        document.ontouchmove = elementDrag;
    }
}

function elementDrag(event) {
    event.preventDefault();
    if (event.type === 'mousemove') {
        pos1 = pos3 - event.clientX;
        pos2 = pos4 - event.clientY;
        pos3 = event.clientX;
        pos4 = event.clientY;
    } else if (event.type === 'touchmove') {
        pos1 = pos3 - event.touches[0].clientX;
        pos2 = pos4 - event.touches[0].clientY;
        pos3 = event.touches[0].clientX;
        pos4 = event.touches[0].clientY;
    }
    floatingUI.style.top = (floatingUI.offsetTop - pos2) + "px";
    floatingUI.style.left = (floatingUI.offsetLeft - pos1) + "px";
}

function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
    document.ontouchend = null;
    document.ontouchmove = null;
}

function resetPosition() {
    var floatingUI = document.getElementById("floatingUI");
    floatingUI.style.top = "";
    floatingUI.style.left = "";
}
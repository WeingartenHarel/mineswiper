


function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerHTML = value;
}



function getRandomInteger(min, max) {
    var randNum = Math.floor(Math.random() * (max - min + 1)) + min;
    return randNum;
}


function formatTimestamp(secs) {
    var hours = Math.floor(secs / (60 * 60));
    var minutes = Math.floor(secs / 60);
    var seconds = Math.floor(secs % 60);
    //get the portion of the decimal from the seconds
    // console.log('HOURS:', hours);
    // console.log('Minutes:', minutes);
    // console.log('Seconds:', seconds);

    //padd zeros 
    var padHours = hours < 10 ? `0${hours}` : hours;
    var padMin = minutes < 10 ? `0${minutes}` : minutes;
    var padSec = seconds < 10 ? `0${seconds}` : seconds;

    return `${padHours}:${padMin}:${padSec}`;
}



function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
    // if (reveal) elCell.classList.add('show');
    console.log('cell elem:', elCell)
    elCell.innerHTML = value;
}



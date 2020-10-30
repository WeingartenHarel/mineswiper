function printMat(mat, selector, color) {
    console.log('print');
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
      strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {    
            var className = 'cell outerBevel cell' + i + '-' + j; 
            elemId = String(`cell-${i}${j}`)
            var cell ='';
           //if (gBoard[i][j].isMine) { //check display values
           //    strHTML += `<td onclick="cellClicked(event,this,this.dataset.i,this.dataset.j)" data-i=${i} data-j=${j} id="${elemId}" class="${className}"> &#x1f4a3; </td>`;
           //} else {
           //    strHTML += `<td onclick="cellClicked(event,this,this.dataset.i,this.dataset.j)" data-i=${i} data-j=${j} id="${elemId}" class="${className}"> ${gBoard[i][j].minesAroundCount} </td>`;
           //
           //}
           strHTML += `<td onclick="cellClicked(event,this,this.dataset.i,this.dataset.j)" data-i=${i} data-j=${j} id="${elemId}" class="${className}"> ${cell} </td>`;
        }
      strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';

    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML; //
    rightClickSetEvent('.cell');  // add event listener for right click
}

function findEmpty(length) {
    console.log('find empty');
    for (var i = 1; i < length; i++) {
        for (var j = 1; j < length; j++) {
            var cell = gBoard[i][j].innerHTML;
            if (gBoard[i][j] === ' ') {
                return true
            }
        } 
    }
}


function toggleShowHideClasses(elCell, classes) {
    var selector;
    for (var i = 0; i < classes.length; i++) {
        selector = classes[i];
        elCell.classList.toggle(selector);
    }

}

function randomColor() {
    var color = "";
    for (var i = 0; i < 3; i++) {
        color += getRandomIntInclusive(0, 255) + ',';
    }
    color = color.slice(1, -1);
    return color;
}

var gTimer = {
    functionTimer: function(selector)  {
        clearInterval(gGameTimer);
        console.log('start timer')
        var t0;
        var t1;
        var millis;
        var secondElapsed = 0;
        var elem = document.querySelector(selector);
        t0 = performance.now();
        gGameTimer = setInterval(function () { t1 = performance.now(), update() }, 1000);
       
        function update() {
            millis = t1 - t0;
            secondElapsed = Math.floor(millis / 1000);
            elem.innerHTML = secondElapsed;
        }
    }

}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
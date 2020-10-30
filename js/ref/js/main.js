
'use strict';

const MINE = '💣';
const EMPTY = '';
const FLAG = '<img class="gun" src="imgs/gun.png"/>';


var gLifeCount;
var gMinePoses;
var gGame;
var gBoard;
var gStartTimer;
var gTimerInterval;
var gIsHintClicked;
var gEmptyCells;
var gSafeClickLeft;
var gLevel = {};




function init() {
    var elSafeClickLeft = document.querySelector('.click-left');
    var elSadfeClickModal = document.querySelector('.safe');
    var elLifeCount = document.querySelector('.life');
    var elSmiley = document.querySelector('.smile-img');
    elSmiley.src = 'imgs/normal-rick.png';
    gMinePoses = [];
    gLifeCount = 3;
    gSafeClickLeft = 3;
    gBoard = createBoard();
    gStartTimer = null;
    gIsHintClicked = false;
    gEmptyCells = [];

    gGame = {
        isOn: false,
        showCount: 0,
        markedCount: 0,
        secsPassed: 0,
        isWon: false
    }

    if (!gGame.isOn) {
        var elTimerSpan = document.querySelector('.time');
        elTimerSpan.innerText = 'Click to start';
        removeBubble();
    }
    clearInterval(gTimerInterval)
    elSadfeClickModal.style.display = 'none';
    elLifeCount.innerText = gLifeCount;
    elSafeClickLeft.innerText = gSafeClickLeft + ' safe clicks available ';

    gGame.isOn = true;
    renderBoard(gBoard);



}


function pickMode(size) {
    switch (size) {
        case 4:
            gLevel.size = 4;
            gLevel.mines = 2;
            init();
            break;
        case 8:
            gLevel.size = 8;
            gLevel.mines = 12;
            init();
            break;
        case 12:
            gLevel.size = 12;
            gLevel.mines = 30;
            init();
            break;

    }
}




function createBoard() {
    var board = [];
    var boardSize = gLevel.size;
    for (var i = 0; i < boardSize; i++) {
        board[i] = [];
        for (var j = 0; j < boardSize; j++) {
            board[i][j] = createCell();

        }
    }
    return board;
}




function getEmptyCells(board, elCell) {
    console.log('PLACING MINES....')
    var emptyCells = [];
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];
            var elCellCoord = getCellCoord(elCell.className)
            if (!currCell.isMine && elCellCoord.i !== i && elCellCoord.j !== j) {
                emptyCells.push({ i, j });
            }
        }
    }
    return emptyCells;
}



function revealSafeCell() {
    var elSafeClickLeft = document.querySelector('.click-left')
    if (gSafeClickLeft > 0) {
        --gSafeClickLeft
        elSafeClickLeft.innerText = `${gSafeClickLeft} safe clicks available`;
    } else {
        alert('You Wasted all your safe clicks')
        elSafeClickLeft.innerText = `${gSafeClickLeft} safe clicks available`;
        return;
    }

    console.log(gEmptyCells)
    var randIdx = getRandomInteger(0, gBoard.length - 1);
    var spliced = gEmptyCells.splice(randIdx, 1)[0];

    var className = getClassName(spliced);
    var elCell = document.querySelector(`.${className}`);
    elCell.classList.add('show');
    setTimeout(function () {
        elCell.classList.remove('show');
    }, 3000)
    console.log('el cel', elCell)
    console.log(spliced)

}


function revealMines(elCell) {
    for (var i = 0; i < gMinePoses.length; i++) {
        var currMineCoords = gMinePoses[i];
        console.log('curr mine coords', currMineCoords)
        var elCell = document.querySelector(`.cell-${currMineCoords.i}-${currMineCoords.j}`);
        elCell.innerHTML = MINE;
        elCell.classList.add('show');
    }
}




function hintClicked(elImg) {
    gIsHintClicked = true;
    elImg.style.transform = 'scale(1.2)';
    elImg.style.display = 'none';
    console.log('clicked!')

    // setTimeout(fucntion() {

    // }, 3000)
}






function expandShown(board, rowIdx, colIdx) {
    if (board[rowIdx][colIdx].minesAroundCell) {
        renderCell({ i: rowIdx, j: colIdx }, board[rowIdx][colIdx].minesAroundCell);
        return;
    }
    console.log('function iniated!!!')
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board.length) continue;
            if (i === rowIdx && colIdx === j) continue;
            var cell = board[i][j]
            console.log('CELL LINE 186:', cell)
            if (cell.isMine || cell.isMarked || cell.isShowen) continue;
            cell.isShowen = true;
            gGame.showCount += 1;
            if (cell.minesAroundCell === 0) {
                console.log('GOT TO LINE 190')
                expandShown(board, i, j);
                renderCell({ i, j }, EMPTY);

            } else {
                console.log('GOT TO LINE 195')
                renderCell({ i, j }, cell.minesAroundCell);

            }
            console.log('CELL:', cell)
        }
    }
}





function getMinesNegsCount(board, rowIdx, colIdx) {
    // console.log(rowIdx, colIdx)
    var minesCount = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board.length) continue;
            if (i === rowIdx && colIdx === j) continue;
            var cell = board[i][j]
            if (cell.isMine) {
                minesCount += 1;
            }
        }
    }
    return minesCount;
}




function renderBoard(board) {
    var elBoard = document.querySelector('.board');
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>`;
        for (var j = 0; j < board.length; j++) {
            var cellClass = getClassName({ i, j });
            var cellContent = board[i][j];
            cellContent = EMPTY;
            strHTML += `<td td onclick="cellClicked(this)" oncontextmenu ="cellClickedFlag(this)" class="${cellClass}"> ${cellContent}</td > `;
        }
        strHTML += `</tr > `
    }
    elBoard.innerHTML = strHTML;
}


function cellClickedFlag(elCell) {
    event.preventDefault();
    var cellCoords = getCellCoord(elCell.className);
    var cellSelected = gBoard[cellCoords.i][cellCoords.j]
    if (!gTimerInterval) {
        startTimer();
    }
    if (!gGame.isOn || cellSelected.isShowen) return;

    if (cellSelected.isMarked) {
        cellSelected.isMarked = false;
        gGame.markedCount--;
        checkVictory();
        elCell.innerHTML = EMPTY;
    } else {
        cellSelected.isMarked = true;
        gGame.markedCount++;
        checkVictory();
        elCell.innerHTML = FLAG;
    }

}

function placeMines(elCell) {
    var emptyCells = getEmptyCells(gBoard, elCell);
    gEmptyCells = emptyCells
    for (var i = 0; i < gLevel.mines; i++) {
        var randIdx = getRandomInteger(0, emptyCells.length - 1);
        var mineCoord = emptyCells.splice(randIdx, 1)[0];
        gBoard[mineCoord.i][mineCoord.j].isMine = true;
        gMinePoses.push(mineCoord);
    }
}


function setMinesNegsCount() {
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[0].length; j++) {
            var negsNum = getMinesNegsCount(gBoard, i, j);
            gBoard[i][j].minesAroundCell = negsNum;
        }

    }
}

function cellClicked(elCell) {
    var elSmiley = document.querySelector('.smile-img');
    var elSafeBtn = document.querySelector('.safe');
    var elLifeCount = document.querySelector('.life');
    var cellCoords = getCellCoord(elCell.className);
    var selectedCell = gBoard[cellCoords.i][cellCoords.j];
    startTimer();
    if (!gGame.isOn) return;

    if (gGame.showCount < 1) {
        elSafeBtn.style.display = 'block';
        placeMines(elCell);
        setMinesNegsCount();
    }
    expandShown(gBoard, cellCoords.i, cellCoords.j);

    var cellNegs = getMinesNegsCount(gBoard, cellCoords.i, cellCoords.j);
    if (selectedCell.isShowen || selectedCell.isMarked) return
    gBoard[cellCoords.i][cellCoords.j].isShowen = true;
    gGame.showCount += 1;
    checkVictory();
    elCell.classList.add('show');
    if (selectedCell.isMine) {
        --gLifeCount;
        elCell.innerHTML = MINE;
        if (gLifeCount === 0) {
            elLifeCount.innerText = gLifeCount;
            revealMines();
            gameOver();
            elSmiley.src = `imgs/dead-rick.png`;
        } else {
            elCell.style.backgroundColor = 'red';
            elLifeCount.innerText = gLifeCount;

        }

    } else if (cellNegs && gGame.showCount > 1) {
        gBoard[cellCoords.i][cellCoords.j].minesAroundCell = cellNegs;
        elCell.innerHTML = cellNegs;
    }
}




function checkVictory() {
    var elSmiley = document.querySelector('.smile-img');
    console.log('show count', gGame.showCount)
    console.log(gGame.markedCount)
    if (gGame.showCount + gGame.markedCount === gBoard.length ** 2) {
        elSmiley.src = 'imgs/rick-win.png';
        gGame.isWon = true;
        gameOver();
    }
}


function gameOver() {
    gGame.isOn = false;
    var elBubbleSpan = document.querySelector('.bubble-span');
    showBubble()
    console.log('GAME OVER!')
    if (gGame.isWon) {
        elBubbleSpan.innerHTML = 'YOU WON!';
    } else {
        elBubbleSpan.innerHTML = 'GAME OVER!';
    }
    clearInterval(gTimerInterval);
    console.log('cleared interval')


}


function calcTime() {
    var elSpanTimer = document.querySelector('.time')
    var now = Date.now();
    var diff = Math.floor((now - gStartTimer) / 1000);
    gGame.secsPassed = Math.floor(diff);
    var time = formatTimestamp(diff);
    elSpanTimer.innerText = time;

}

function startTimer() {
    if (gGame.showCount <= 0) {
        gStartTimer = Date.now();
        gTimerInterval = setInterval(calcTime, 10);
    }
}


function showBubble() {
    var elBubble = document.querySelector('.bubble');
    elBubble.style.display = 'block';
}

function removeBubble() {
    var elBubble = document.querySelector('.bubble');
    elBubble.style.display = 'none';
}





function createCell() {
    var cell = {
        minesAroundCell: 0,
        isShowen: false,
        isMine: false,
        isMarked: false
    }
    return cell;
}



function getClassName(location) {
    console.log('clas:', location)
    var cellClass = `cell-${location.i}-${location.j}`
    return cellClass;
}

function renderCell(location, value) {
    console.log('location:', location)
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
    console.log('EL CELL:', elCell)
    elCell.classList.add('show');
    elCell.innerHTML = value;
}
function getCellCoord(strClassName) {
    var sliced = strClassName;

    if (strClassName.includes('show')) {
        sliced = strClassName.slice(0, 9)
    }
    var parts = sliced.split('-');
    var coord = {
        i: +parts[1],
        j: +parts[2],
    };
    return coord;
}
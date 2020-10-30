'use strict';
console.log('mines sweeper');
//debugger;

// game var
var gBoard;
var gTotalCells = 0
var gGameTimer; // set global var timer for reset
var gIsFirstClick = true;

var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    isWIn:'normal',
}

var gLevel = {
    SIZE: 4,
    MINES: 2,
    LIVES: 3,

}

var gLevelPrevious = {
    SIZE: 4,
    MINES: 2,
    LIVES: 3,

}

// UI var
var gMessegeLoose = 'You loose, play again?';
var gMessegeWin = 'You win,play again? ';
var gClassesBevel = ['outerBevel', 'innerBevel'];
var gClassesDisplay = ['display', 'displayNone'];


function initGame(size, mines ,lives) {
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        isWIn: 'normal',
    } 

    gLevel.SIZE = size;
    gLevel.MINES = mines;
    gLevel.LIVES = lives;

    gLevelPrevious.SIZE = size;
    gLevelPrevious.MINES = mines;
    gLevelPrevious.LIVES = lives;

    console.log('init game', gLevel, size, mines, lives);
    gBoard = buildBoard();
    printMat(gBoard, '.board-container');
    

    createLives(false);
    updateSmiley();

    // check Board
    //console.table(gBoard); // print board
    console.table(printTable(gBoard)); // print board

}
function setTimer() {
    //console.log('gFirstClick =', gFirstClick)   
    gTimer.functionTimer('#timer'); //timer('#timer');
}

function buildBoard() {
    console.log('buildBoard');
    var SIZE = gLevel.SIZE;
    //console.log('gLevel.SIZE', gLevel.SIZE)
    var board = [];

    for (var i = 0; i < SIZE; i++) {
        board.push([]);
        for (var j = 0; j < SIZE; j++) {
            //board[i][j] = cell;
            var id = i + '-' + j;
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                isEmpty: true,
                id: id,
                isFirstClick:false,
            }
            board[i][j] = cell;
        }
    }
    gTotalCells = Math.pow(board.length, 2); // gBoard total cells number , after gBoard created
    return board;
}


function setMinesMenualy() { // for dev, not in use
    console.log('setMinesMenualy', gBoard[0][1]);
    console.log('setMinesMenualy', gBoard[0][1].isMine);
}

function randomizeMines(board, mines) {
    console.log(' randomizeMines', mines);
    for (var i = 0; i < mines; i++) {
        //console.log('randomiz', i);
        var locationI = getRandomIntInclusive(0, gBoard.length - 1);
        var locationJ = getRandomIntInclusive(0, gBoard.length - 1);
        var location = {
            i: locationI,
            j: locationJ,
        }
        //console.log('location',location)
        if (board[location.i][location.j].isMine || board[location.i][location.j].isFirstClick || board[location.i][location.j].isShown) {
            //console.log('location if',location);
           i-- ;
           continue;
        } 

        board[location.i][location.j].isMine = true;
    }
}

function setMinesNegsCount(board) { //count mines neighboreds
    //console.log('setMinesNegsCount', board);
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {

            var pieceCoord = {
                cellI: i,
                cellJ: j,
            }
            board[i][j].minesAroundCount = findNegs(pieceCoord, gBoard);
        }
    }
    console.log('f c')
}


function findNegs(pieceCoord,mat) {
    var countNegs = 0;

   //console.log(pieceCoord)
   var rowIdx = pieceCoord.cellI - 1;
   var colIdx = pieceCoord.cellJ - 1;
   var rowIdxLength = rowIdx + 3;
   var colIdxLength = colIdx + 3;
   //console.log('countNeighbors mines by',typeof rowIdx, colIdx, cellI, cellJ)

   for (var i = rowIdx; i < rowIdxLength  ; i++) {
       if (i < 0 || i >= mat.length) continue;
       for (var j = colIdx; j < colIdxLength; j++) {         
           if (j < 0 || j >= mat.length) continue;
           if (i === pieceCoord.cellI && j === pieceCoord.cellJ) continue; // skip curr cell  
           var cell = mat[i][j]; 
            if (cell.isMine) {
                countNegs ++;
            }
       }
   }
    return countNegs;
}

// left click
function cellClicked(event, elCell, i, j) {
    
    //playSound()
    //console.log(elCell, elCell.dataset.i, elCell.dataset.j) //console.log(elCell.attributes)  //console.log(elCell.dataset.i, elCell.dataset.j)
    var location = { i: +i, j: +j }  //console.log('location', location)

    if(gIsFirstClick ){ //fist click check
        console.log('first click');
        
        gIsFirstClick = false;
        gBoard[i][j].isShown =  true;

        setTimer();
        randomizeMines(gBoard, gLevel.MINES)
        setMinesNegsCount(gBoard);
        printMat(gBoard, '.board-container');
        checkCell(location)
        checkGameOver();

    } else if (gBoard[i][j].isShown === false && gBoard[i][j].isMarked === false) {
        gBoard[i][j].isShown =  true;
        console.log('not first click');
        checkCell(location)
        checkGameOver();
    }
}

// right click addEventListener
function rightClickSetEvent(selector) { // addEventListener to all cell (selector value)
    var matches = document.querySelectorAll(selector);

    for (var i = 0; i < matches.length; i++) {
        matches[i].addEventListener('contextmenu', e => { // add event listener window.oncontextmenu
            e.preventDefault();
            console.log(e.target.id);
            rightClick(e); // call cellMarked
            checkGameOver();
        });
    }
}

// right click cellMarked
function rightClick(e) {
    setTimer(); //set timer
    console.log('right click', e, '\n', e.target, '\n', e.target.id);
    var location = {
        i: e.target.dataset.i,
        j: e.target.dataset.j,
    }
    if (!gBoard[location.i][location.j].isMarked && !gBoard[location.i][location.j].isShown) {
        gBoard[location.i][location.j].isMarked = true;
        e.target.innerHTML = '&#9873;';
        gGame.markedCount++
    } else if (gBoard[location.i][location.j].isMarked) {
        gBoard[location.i][location.j].isMarked = false;
        e.target.innerHTML = '';
        gGame.markedCount--
    }
}



function checkCell(location) { // check game on click
    var elCell = document.querySelector(`#cell-${location.i}${location.j}`);
   // console.log('click on elCell', elCell, 'location', location);
    var i = location.i;
    var j = location.j;
    toggleShowHideClasses(elCell, gClassesBevel); // show clicked cell
    console.log('click on elCell', i , j, 'location', location);
    
    if (gBoard[i][j].isMine) { // check if mine
        console.log('mine')
        elCell.innerHTML = '&#x1f4a3;';
        gBoard[i][j].isEmpty = false;
        gBoard[i][j].isShown =true
        createLives(true);
        console.log('gLevel.LIVES', gLevel.LIVES)

    } else if (gBoard[i][j].minesAroundCount > 0) {  // check if count > 0
        elCell.innerHTML = gBoard[i][j].minesAroundCount;
        gBoard[i][j].isEmpty = false;
        gBoard[i][j].isShown = true
    }  else {  // check if empty
        elCell.innerHTML = '';
        countNeighbors(i,j, gBoard);      
    }
}

/**/
function renderCell(i,j) {   // location such as: {i: 2, j: 7}  
        var elCell = document.querySelector(`#cell-${i}${j}`);  
        elCell.classList.add('innerBevel');
        gBoard[i][j].isShown = true;
}



function countNeighbors(cellI, cellJ, mat) {
    console.log('countNeighbors')
    //debugger
    var rowIdx = cellI - 1;
    var colIdx = cellJ - 1;
    var rowIdxLength = rowIdx + 3;
    var colIdxLength = colIdx + 3;
    console.log('countNeighbors by',typeof rowIdx, colIdx, cellI, cellJ)
    //console.log('countNeighbors by', typeof rowIdx, typeof colIdx, typeof cellI, typeof cellJ)

    for (var i = rowIdx; i < rowIdxLength  ; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = colIdx; j < colIdxLength; j++) {         
            if (j < 0 || j >= mat.length) continue;
            if (i === cellI && j === cellJ) continue; // skip curr cell
            if (mat[i][j].isMine || mat[i][j].isShown || mat[i][j].isMarked) continue

            var elCell = document.querySelector(`#cell-${i}${j}`);  
            renderCell(i,j);
            
            if (mat[i][j].minesAroundCount === 0) {
                console.log('rec', i, j);
                //gBoard[i][j].isEmpty = true;
                countNeighbors(i, j, mat) 
            }
            if (mat[i][j].minesAroundCount > 0) {            
                elCell.innerHTML =  mat[i][j].minesAroundCount
            }
        }
    }


}

function showNbrs(item, index, arr) {
    //console.log('gBoard.length- 1', gTotalCells )
    var i = item.dataset.i;
    var j = item.dataset.j;

    gBoard[i][j].isShown = true;
    if (!item.classList.contains('innerBevel')) {
        toggleShowHideClasses(item, gClassesBevel);
        gGame.shownCount++
    }

    if (gBoard[i][j].minesAroundCount > 0) {
        item.innerHTML = gBoard[i][j].minesAroundCount;
    }
}

function getCellCoord(strCellId) {
    var parts = strCellId.split('-');
    var coord = {
        i: +parts[1], // coord.i = +parts[1];
        j: +parts[2], // coord.j = +parts[2];
    };  
    return coord;    
}

function printTable(board) { // print board for dev
    var res=[]
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {        
            var cell = board[i][j];
            res.push(cell);
            
        }
    }
    return res // console.table('res ', res)
    
}

function checkGameOver() {
    //console.log('check game over , countCells', gGame.shownCount, gGame.markedCount)
    var win = (gGame.shownCount + gGame.markedCount === gTotalCells) ? true : false
    if (win) {
        gameOver(gMessegeWin);
        gGame.isWIn = true;
        updateSmiley();
    }
    return //console.log('win =', win);  //return win
}

function gameOver(messege) {
    console.log('gameOver');
    var elCell = document.querySelector('.modal-container');
    console.log('elCell', elCell)
    toggleShowHideClasses(elCell, gClassesDisplay);
    elCell.innerHTML
    var elMessege = elCell.querySelector('.messege');
    elMessege.innerHTML = messege;
}

function playAgainYes() {
    var elCell = document.querySelector('.modal-container');
    toggleShowHideClasses(elCell, gClassesDisplay);
    initGame(gLevelPrevious.SIZE, gLevelPrevious.MINES, gLevelPrevious.LIVES);

}

function playAgainNo() {
    console.log('playAgain No');
    var elCell = document.querySelector('.modal-container');
    toggleShowHideClasses(elCell, gClassesDisplay);
}

function createLives(ifClickMine) {
    var elem = document.querySelector('.lives')
    elem.innerHTML = '';
    //console.log('lives', gLevel.LIVES, elem);
    if (!ifClickMine) {
        for (var i = 0; i < gLevel.LIVES; i++) {
            elem.innerHTML += '&#x2764 ';
        }
    } else {
        gLevel.LIVES--
        console.log('lives minus', gLevel.LIVES);
        for (var i = 0; i < gLevel.LIVES; i++) {
            elem.innerHTML += '&#x2764 ';
        }
        if (gLevel.LIVES === 0) {
            elem.innerHTML = '0';
            gameOver(gMessegeLoose);
            gGame.isWIn = false;
            updateSmiley();
        }
    }
}

function updateSmiley() {
    //update smiley button
    var elemSmiley = document.querySelector('#button-smiley')
    elemSmiley.dataset.size = gLevel.SIZE;
    elemSmiley.dataset.mines = gLevel.MINES;
    elemSmiley.dataset.lives = gLevel.LIVES;

    if (gGame.isWIn === 'normal') {
        elemSmiley.innerHTML = '&#128578';
    } else if (gGame.isWIn) {
        elemSmiley.innerHTML = '&#128526';
    } else {
        elemSmiley.innerHTML = ' &#128542';
    }

}

function playSound() {
    if (gFirstClick) {
        console.log('play music');
            document.getElementById("gameSound").play();
    }  
}
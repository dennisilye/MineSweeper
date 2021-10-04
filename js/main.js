'use strict';

var gnumCellsWithoutMines = 0;
var gBoard;
var gCellsClicked;
var gMines;
var gLives;
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function init(size = 4) {
    gCellsClicked = 0;
    gMines = determineMinesCount(size);
    gLives = 3;
    gBoard = buildBoard(size);
    renderBoard();
    gnumCellsWithoutMines = (size ** 2) - gMines;
    console.log(gBoard);
    console.log(gnumCellsWithoutMines);

}

function determineMinesCount(size) {
    if (size === 8) gMines = 12;
    else if (size === 12) gMines = 24;
    else gMines = 2;
    return gMines;

}

function buildBoard(size = 4) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board.push([]);
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0, isShown: false, isMine: false,
                isMarked: false
            };


        }
    }
    return board;
}

function renderBoard() {
    var strHTML = '';
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += `<tr>\n`
        for (var j = 0; j < gBoard[0].length; j++) {
            var className = `cell cell${i}-${j}`;
            strHTML += `\t<td class="${className}"
                            onclick="cellClicked(this, ${i}, ${j})" >
                         </td>\n`
        }
        strHTML += `</tr>\n`
    }
    var elboard = document.querySelector('.board');
    elboard.innerHTML = strHTML;
}

function cellClicked(elCell, i, j) {
    if (!gGame.isOn) {
        gameOver();
        return;
    }
    // var totalShown = checkShown(gBoard);
    var elSmiley = document.querySelector('h1 span');
    if (gCellsClicked === 0) {
        putBombs(i, j);
        gCellsClicked++;
    }
    // if (gGame.shownCount === totalShown) {
    //     gGame.isOn = false;
    //     elSmiley.innerText = 'You win!!!!!!!!';
    // }
    if (gBoard[i][j].isMine) {
        gLives--;
        var elLives = document.querySelector('h2 span');
        elSmiley.innerText = '🤯';
        elLives.innerText = gLives;
        return;
    }
    reveal(i, j, elCell);
    elSmiley.innerText = '😀';
    console.log(checkShown(gBoard));

}

function reveal(i, j, elSelectedCell) {
    gBoard[i][j].isShown = true;
    if (elSelectedCell) elSelectedCell.classList.add('shown');
    else {
        var elSelectedCell = document.querySelector(`.cell${i}-${j}`);
        elSelectedCell.classList.add('shown');
    }
    gBoard[i][j].minesAroundCount = setMinesNegsCount(i, j);
    if (gBoard[i][j].minesAroundCount === 0) {
        fullExpand(i, j)
    }
    elSelectedCell.innerText = setMinesNegsCount(i, j);

}

// puts the bombs on the board
function putBombs(i, j) {
    while (gMines > 0) {
        var randI = getRandomInt(0, gBoard.length);
        var randj = getRandomInt(0, gBoard.length);
        // prevents from being at start location
        if (randI === i && randj === j) continue;
        else if (gBoard[randI][randj].isMine) continue
        else {
            gBoard[randI][randj].isMine = true;
            gMines--;
        }

    }

}

function gameOver() {
    gGame.isOn = false;
    var elSmiley = document.querySelector('h1 span');
    elSmiley.innerText = ' You lost 😭';

}


function fullExpand(posI, posJ) {
    for (let i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue;
        for (let j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue;
            if (i === posI && j === posJ) continue;
            if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) {
                reveal(i, j);
            }

        }

    }
}

function checkShown(gBoard) {
    var count = 0;
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isShown) count++;
            
        }
        
    }   
    return count; 
}
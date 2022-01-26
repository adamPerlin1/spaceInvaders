'use strict';

const ALIEN_SPEED = 500;

var gAliens = [];

var gAliensTopRowIdx;
var gAliensBottomRowIdx;

var gIntervalAliens;
var gIsAlienFreeze = true;

function createAliens(board) {

    for (var rowIdx = 0; rowIdx < 3; rowIdx++) {
        for (var colIdx = 3; colIdx < 11; colIdx++) {
            var pos = {i: rowIdx, j: colIdx}
            gAliens.push(pos);
            board[pos.i][pos.j].gameObject = ALIEN;
        }
    }
    // console.log(gAliens);
}

function handleAlienHit(pos) {
    // console.log(pos);
    if (gBoard[pos.i][pos.j].gameObject === ALIEN) {
        gGame.aliensCount++;
        updateScore(10);
        gBoard[pos.i][pos.j].gameObject = null;
        var deadPos = { i: pos.i, j: pos.j };
        var deadIdx = getAlienByLocation(deadPos);
        gAliens.splice(deadIdx, 1);
        CheckWin();
        updateCell(pos);
    }
}

function shiftBoardRight(board, fromIdx, toIdx) {
    for (var i = 0; i < gAliens.length; i++){
        var alien = gAliens[i]
        if (alien.j === fromIdx) {
            //model
            board[alien.i][alien.j].gameObject = null;
            // dom
            updateCell(alien)
        }

        alien.j = toIdx

        board[alien.i][alien.j].gameObject = ALIEN;
        updateCell(alien, ALIEN)
    }

}

function shiftBoardLeft(board, fromIdx, toIdx) {
    for (var i = 0; i < gAliens.length; i++){
        var alien = gAliens[i]
        if (alien.j === fromIdx) {
            //model
            board[alien.i][alien.j].gameObject = null;
            // dom
            updateCell(alien)
        }

        alien.j = toIdx

        board[alien.i][alien.j].gameObject = ALIEN;
        updateCell(alien, ALIEN)
    }
}

function shiftBoardDown(board, fromIdx, toIdx) {
    for (var i = 0; i < gAliens.length; i++){
        var alien = gAliens[i]
        if (alien.i === fromIdx) {
            //model
            board[alien.i][alien.j].gameObject = null;
            // dom
            updateCell(alien)
        }

        alien.i = toIdx

        board[alien.i][alien.j].gameObject = ALIEN;
        updateCell(alien, ALIEN)
    }
}

// Code the function moveAliens that runs the interval for moving aliens 
// side to side and down, it re-renders the board every time, when the 
// aliens are reaching the hero row - interval stops

function moveAliens() {
    // if (gIsAlienFreeze) return;
    gAliensTopRowIdx = gAliens[0].i;
    gAliensBottomRowIdx = gAliens[gAliens.length - 1];
    var func;
    // if ()

    // gIntervalAliens = setInterval()

}






















function getAlienByLocation(location) {
    for (var i = 0; i < gAliens.length; i++) {
        // console.log(gAliens[i]);
        if (gAliens[i].i === location.i
            && gAliens[i].j === location.j) {
            return i;
        }
    }
    return null
}



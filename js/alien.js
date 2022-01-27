'use strict';

const ALIEN_SPEED = 500;

var gAliens = [];

var gAliensTopRowIdx;
var gAliensBottomRowIdx;
var gAliensLeftColIdx;
var gAliensRightColIdx;

var gIntervalAliens;
var gIsAlienFreeze = true;

function createAliens(board) {
    for (var i = 0; i <= 2; i++) {
        for (var j = 3; j <= 10; j++) {
            var pos = { i: i, j: j }
            gAliens.push(pos);
            board[pos.i][pos.j].gameObject = ALIEN;
        }
    }
}

function handleAlienHit(pos, isMeta) {
    if (gBoard[pos.i][pos.j].gameObject === ALIEN) {
        gGame.aliensCount++;
        updateScore(10);
        if (isMeta) killAliensAround(pos.i, pos.j)
        gBoard[pos.i][pos.j].gameObject = null;
        var deadPos = { i: pos.i, j: pos.j };
        var deadIdx = getAlienByLocation(deadPos);
        gAliens.splice(deadIdx, 1);
        CheckWin();
        updateCell(pos);
    }
}

function killAliensAround(rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue;
            if (i === rowIdx && j === colIdx) continue;
            //Model
            updateScore(10)
            gBoard[i][j].gameObject = null;
            //Dom
            updateCell({i: i, j: j});
        }
    }
}

function shiftBoardRight(board, rowIdxStart, rowIdxEnd, colIdxStart, colIdxEnd) {
    var deadPoses = [];
    for (var i = rowIdxStart; i <= rowIdxEnd; i++) {
        for (var j = colIdxStart; j <= colIdxEnd; j++) {
            if (board[i][j].gameObject === ALIEN) {
                board[i][j].gameObject = null;
            } else {
                deadPoses.push({ i: i, j: j });
            }
        }
    }

    for (var i = rowIdxStart; i <= rowIdxEnd; i++) {
        for (var j = colIdxStart; j <= colIdxEnd; j++) {
            if (checkIfDeadPos(deadPoses, i, j)) continue;
            board[i][j + 1].gameObject = ALIEN;
        }
    }
}

function shiftBoardLeft(board, rowIdxStart, rowIdxEnd, colIdxStart, colIdxEnd) {
    var deadPoses = [];
    for (var i = rowIdxStart; i <= rowIdxEnd; i++) {
        for (var j = colIdxStart; j <= colIdxEnd; j++) {
            if (board[i][j].gameObject === ALIEN) {
                //model removal
                board[i][j].gameObject = null;
            } else {
                deadPoses.push({ i: i, j: j });
            }
        }
    }

    for (var i = rowIdxStart; i <= rowIdxEnd; i++) {
        for (var j = colIdxStart; j <= colIdxEnd; j++) {
            if (checkIfDeadPos(deadPoses, i, j)) continue;
            board[i][j - 1].gameObject = ALIEN;
        }
    }
}

function checkIfDeadPos(poses, i, j) {
    for (var idx = 0; idx < poses.length; idx++) {
        if (poses[idx] && i === poses[idx].i && j === poses[idx].j) return true;
    }
    return false;
}

function shiftBoardDown(board, fromIdx, toIdx) {}

// I HAVE A BUG IF  ALL THE ALIENS IN
// THE OUTER LEFT/RIGHT COL ARE KILLED
function moveAliens() {
    // if (gIsAlienFreeze) return;
    var funcOfDir = shiftBoardRight;
    var funcOfEdges = isVeryRight;
    gIntervalAliens = setInterval(function () {
        if (funcOfEdges()) {
            funcOfEdges = (isVeryLeft === funcOfEdges) ? isVeryRight : isVeryLeft
            funcOfDir = (shiftBoardLeft === funcOfDir) ? shiftBoardRight : shiftBoardLeft
        }

        funcOfDir(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx, gAliensLeftColIdx, gAliensRightColIdx);

        gAliensLeftColIdx += funcOfDir === shiftBoardRight ? 1 : -1
        gAliensRightColIdx += funcOfDir === shiftBoardRight ? 1 : -1

        renderBoard(gBoard)
    }, ALIEN_SPEED)
}

//NOT WORKING YET
function updateAliensGrid() {
    for (var i = 0; i < gAliens.length - 1; i++) {
        if (gAliens[i].j === gAliensLeftColIdx) return;
    }
    gAliensLeftColIdx += 1;
}

function isVeryRight() {
    for (var i = 0; i < gBoard.length; i++) {
        if (gBoard[i][gBoard[0].length - 1].gameObject === ALIEN) return true;
    }
    return false;
}

function isVeryLeft() {
    for (var i = 0; i < gBoard.length; i++) {
        if (gBoard[i][0].gameObject === ALIEN) return true;
    }
    return false;
}

function getAlienByLocation(location) {
    for (var i = 0; i < gAliens.length; i++) {
        if (gAliens[i].i === location.i
            && gAliens[i].j === location.j) {
            return i;
        }
    }
    return null;
}

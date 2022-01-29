'use strict';

const ALIENS_ROW_LENGTH = 8;
const ALIENS_ROW_COUNT = 3;

const ALIEN_SPEED = 500;
var gIntervalAliens;

var gAliensTopRowIdx;
var gAliensBottomRowIdx;
var gAliensRightColIdx;
var gAliensLeftColIdx;

var gIsAlienFreeze = false;
var gFuncOfDirection;

function createAliens(board) {
    for (var i = 0; i < ALIENS_ROW_COUNT; i++) {
        for (var j = 3; j <11; j++) {
            board[i][j].gameObject = ALIEN;
        }
    }
}

function handleAlienHit(pos, isPoweful) {
    updateScore(10);
    //blow up negs
    if (isPoweful) killAliensAround(pos.i, pos.j);
    //model
    gBoard[pos.i][pos.j].gameObject = null;
    //dom
    updateCell(pos);
    if (pos.j === gAliensRightColIdx) checkIfLastInCol(gBoard, pos, true);
    else if (pos.j === gAliensLeftColIdx) checkIfLastInCol(gBoard, pos, false);
    checkWin();
}

function killAliensAround(rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue;
            if (i === rowIdx && j === colIdx) continue;

            if (gBoard[i][j].gameObject === ALIEN){
                //Model
                updateScore(10);
                gBoard[i][j].gameObject = null;
                //Dom
                updateCell({i: i, j: j});
            }
        }
    }
}

function shiftBoardRight(board, fromIdx, toIdx, fromJdx, toJdx) {
    for (var i = toIdx; i >= fromIdx; i--) {
        for (var j = toJdx; j >= fromJdx; j--) {
            var nextCellConts = (board[i][j].gameObject) ? ALIEN : null;
            if (board[i][j].gameObject) board[i][j].gameObject = null;

            board[i][j + 1].gameObject = nextCellConts;
        }
    }
    gAliensRightColIdx++;
    gAliensLeftColIdx++;
    if (gAliensBottomRowIdx === gBoard.length - 2) gameOver(false)
}

function shiftBoardLeft(board, fromIdx, toIdx, fromJdx, toJdx) {
    for (var i = toIdx; i >= fromIdx; i--) {
        for (var j = fromJdx; j <= toJdx; j++) {
            var nextCellConts = (board[i][j].gameObject) ? ALIEN : null;
            if (board[i][j].gameObject) board[i][j].gameObject = null;
            board[i][j - 1].gameObject = nextCellConts;
        }
    }
    gAliensRightColIdx--;
    gAliensLeftColIdx--;
}

function shiftBoardDown(board, fromIdx, toIdx, fromJdx, toJdx) {
    for (var i = toIdx; i >= fromIdx; i--){
        for (var j = toJdx; j >= fromJdx; j--){
            var nextCellConts = (board[i][j].gameObject) ? ALIEN : null;
            if (board[i][j].gameObject) board[i][j].gameObject = null;
            board[i+1][j].gameObject = nextCellConts;
        }
    }
    gAliensTopRowIdx++;
    gAliensBottomRowIdx++;
}

function moveAliens() {
    if (gIsAlienFreeze) return;
    
    if (gAliensLeftColIdx === 0) {
        gFuncOfDirection = shiftBoardRight;
        shiftBoardDown(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx, gAliensLeftColIdx, gAliensRightColIdx);
        
    } else if (gAliensRightColIdx === gBoard[0].length - 1){
        gFuncOfDirection = shiftBoardLeft;
        shiftBoardDown(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx, gAliensLeftColIdx, gAliensRightColIdx);
    } 
    gFuncOfDirection(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx, gAliensLeftColIdx, gAliensRightColIdx);
    renderBoard(gBoard);
}

function checkIfLastInCol(board, pos, isRight) {
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        if (pos.i === i) continue;
        if (board[i][pos.j].gameObject === ALIEN) return;
    }
    if (isRight) gAliensRightColIdx = pos.j - 1;
    else gAliensLeftColIdx = pos.j + 1;
}


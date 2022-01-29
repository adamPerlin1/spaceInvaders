'use strict';

const BOARD_SIZE = 14;

const SKY = 'SKY';
const GROUND = 'GROUND';

const HERO = '👾';
const ALIEN = '👽';
const LASER = '🔥';
const SPACE_CANDY = '🧁';

var gBoard;
var gCandyInterval;

var gGame = {
    isOn: false,
    aliensCount: 0,
    score: 0
};

function initGame() {
    console.log('Take cover!');
    clearInterval(gCandyInterval);
    clearInterval(gIntervalAliens);
    gGame.score = 0;
    gGame.isOn = false;
    gSuperModeCounter = 0;
    gAliensTopRowIdx = 0;
    gAliensBottomRowIdx = 2;
    gAliensRightColIdx = 10;
    gAliensLeftColIdx = 3;
    gBoard = createBoard();
    createHero(gBoard);
    createAliens(gBoard);
    renderBoard(gBoard);
    gCandyInterval = setInterval(addCandy, 10000);
    gFuncOfDirection = shiftBoardRight;
    document.querySelector('.modal').style.display = 'none';
    document.querySelector('h2 span').innerText = gGame.score;
}

function createBoard() {
    var board = [];
    for (var i = 0; i < 14; i++) {
        board[i] = [];
        for (var j = 0; j < 14; j++) {
            // put SKY in regular cell
            var cell = createCell();
            // place GROUND
            if (i === 13) {
                cell.type = GROUND;
            }
            board[i][j] = cell;
        }
    }
    return board;
}

function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];

            var cellClass = (currCell.type === SKY) ? 'sky' : 'ground';

            strHTML += `\t<td class="${cellClass}" data-i="${i}" data-j="${j}">\n`;

            if (currCell.gameObject === HERO) {
                strHTML += HERO;
            } else if (currCell.gameObject === ALIEN) {
                strHTML += ALIEN;
            } else if (currCell.gameObject === SPACE_CANDY){
                strHTML += SPACE_CANDY;
            }

            strHTML += `\t</td>\n`;
        }
        strHTML += '</tr>\n';
    }
    document.querySelector('.board').innerHTML = strHTML;
}

function updateCell(pos, gameObject = null) {
    gBoard[pos.i][pos.j].gameObject = gameObject;
    var elCell = getElCell(pos);
    elCell.innerHTML = gameObject || '';
}

function updateScore(diff) {
    gGame.score += diff;
    document.querySelector('h2 span').innerText = gGame.score;
}

function addCandy() {
    var emptySpaces = getEmptySpaces();
    var emptySpace = emptySpaces[getRandomIntInc(0, emptySpaces.length - 1)];
    gBoard[emptySpace.i][emptySpace.j].gameObject = SPACE_CANDY;
    updateCell(emptySpace, SPACE_CANDY);

    setTimeout(function () {
        if (gBoard[emptySpace.i][emptySpace.j].gameObject !== ALIEN) {
            gBoard[emptySpace.i][emptySpace.j].gameObject = null;
            updateCell(emptySpace);
        }
    }, 5000);
}

function getEmptySpaces() {
    var emptySpaces = [];
    for (var j = 0; j < gBoard[0].length; j++) {
        if (!gBoard[0][j].gameObject) {
            emptySpaces.push({ i: 0, j: j });
        }
    }
    return emptySpaces;
}

function checkWin() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].gameObject === ALIEN) return;
        }
    }
    gameOver(true);
}

function gameOver(isWin) {
    var txt = isWin ? 'You Won!' : 'You Lose!';
    var color = isWin ? 'rgba(51, 173, 51, 0.829)' : 'red';
    document.querySelector('.modal h3').innerText = txt;
    document.querySelector('.modal').style.backgroundColor = color;
    document.querySelector('.modal').style.display = 'block';
    clearInterval(gIntervalAliens);
    clearInterval(gCandyInterval);
}
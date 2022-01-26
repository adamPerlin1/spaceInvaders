'use strict';

const BOARD_SIZE = 14;
const ALIENS_ROW_LENGTH = 8
const ALIENS_ROW_COUNT = 3

//type
const SKY = 'SKY';
const GROUND = 'GROUND';
//game element
const HERO = '👾';
const ALIEN = '👽';
const LASER = '🔥';

var gBoard;
var gGame = {
    isOn: false,
    aliensCount: 0,
    score: 0
};

function initGame() {
    console.log('take cover!');

    gBoard = createBoard(BOARD_SIZE);
    createHero(gBoard);
    createAliens(gBoard);
    renderBoard(gBoard)
    document.querySelector('.modal').style.display = 'none';

    // gIntervalAliens = setInterval(shiftBoardRight, 1000, gBoard)
}

function createBoard(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board[i] = [];
        for (var j = 0; j < size; j++) {
            // put sky in regular cell
            var cell = createCell()
            // place GROUND
            if (i === size - 1) {
                cell.type = GROUND;
            }
            board[i][j] = cell
        }
    }
    console.log(board)
    return board
}

function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];
            var cellClass = getClassName({ i: i, j: j });

            if (currCell.type === GROUND) cellClass += ' ground';
            else if (currCell.type === SKY) cellClass += ' sky';

            strHTML += `\t<td class="cell ${cellClass}">\n`;

            if (currCell.gameObject === HERO) {
                strHTML += HERO;
            } else if (currCell.gameObject === ALIEN) {
                strHTML += ALIEN;
            }

            strHTML += `\t</td>\n`
        }
        strHTML += '</tr>\n';
    }
    document.querySelector('.board').innerHTML = strHTML;
}


function updateScore(diff) {
    gGame.score += diff;
    document.querySelector('h2 span').innerText = gGame.score;
}

function getClassName(position) {
    var cellClass = 'cell-' + position.i + '-' + position.j;
    return cellClass;
}

function CheckWin() {
    if (gGame.aliensCount === 24) gameOver(true)
}

// function checkLoos(){
//     if ()
// }

function gameOver(isWin) {
    var txt = isWin ? 'You Won!' : 'You Lose!';
    var color = isWin ? 'rgba(51, 173, 51, 0.829)' : 'red';
    document.querySelector('.modal h3').innerText = txt;
    document.querySelector('.modal').style.backgroundColor = color;
    document.querySelector('.modal').style.display = 'block';
    
}

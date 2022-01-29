'use strict';

const LASER_SPEED = 80;

var gHero;
var gSuperModeCounter = 0;

function createHero(board) {
    gHero = {
        pos: {
            i: 12,
            j: 6
        },
        isShoot: false
    };
    board[gHero.pos.i][gHero.pos.j].gameObject = HERO;
}

// Handle game keys
function handleKey(ev) {
    switch (ev.key) {
        case 'ArrowRight':
            moveHero(1);
            break;
        case 'ArrowLeft':
            moveHero(-1);
            break;
        case ' ':
            shoot();
            break;
        case 'n':
        case 'N':
        case 'מ':
            shoot(true);
            break;
        case 'x':
        case 'X':
        case 'ס':
            superShoot('🔪');
            break;
    }
}

// Move the hero right (1) or left (-1)
function moveHero(dir) {
    if (gHero.pos.j + dir >= gBoard[0].length || gHero.pos.j + dir < 0) return;
    //removing
    gBoard[gHero.pos.i][gHero.pos.j].gameObject = null;
    updateCell(gHero.pos);

    gHero.pos.j += dir;
    //adding
    gBoard[gHero.pos.i][gHero.pos.j].gameObject = HERO;
    updateCell(gHero.pos, HERO);
}


// Sets an interval for shutting (blinking) the laser up towards aliens
function shoot(isPoweful) {
    if (!gGame.isOn) {
        gIntervalAliens = setInterval(moveAliens, 1000);
        gGame.isOn = true;
    }
    if (gHero.isShoot) return;
    var pos = { i: gHero.pos.i - 1, j: gHero.pos.j };
    gHero.isShoot = true;
    blinkLaser(pos, isPoweful);
}

function superShoot(symbol){
    if (!gGame.isOn) {
        gIntervalAliens = setInterval(moveAliens, 1000);
        gGame.isOn = true;
    }
    gSuperModeCounter++;
    if (gSuperModeCounter > 3) return;
    if (gHero.isShoot) return;
    var pos = { i: gHero.pos.i - 1, j: gHero.pos.j };
    gHero.isShoot = true;
    blinkLaser(pos, false, symbol);
} 

// renders a LASER at specific cell for short time and removes it
function blinkLaser(pos, isPoweful, symbol) {
    if (pos.i < 0) return gHero.isShoot = false;

    if (gBoard[pos.i][pos.j].gameObject === ALIEN) {
        handleAlienHit(pos, isPoweful);
        gHero.isShoot = false;
        return;
    } else if (gBoard[pos.i][pos.j].gameObject === SPACE_CANDY){
        gIsAlienFreeze = true;
        setTimeout(function(){ gIsAlienFreeze = false}, 5000);
    }
    
    var laser = (symbol) ? symbol : LASER;
    var speed = (symbol) ? LASER_SPEED - 40 : LASER_SPEED;

    //Model
    gBoard[pos.i][pos.j].gameObject = laser;
    //Dom
    updateCell(pos, laser);
    //Model
    setTimeout(function () {
        gBoard[pos.i][pos.j].gameObject = null;
        //Dom
        updateCell(pos);
        pos.i--
        blinkLaser(pos, isPoweful, symbol);
    }, speed);
}

'use strict';

const LASER_SPEED = 80;
var gHero = { pos: { i: 12, j: 5 }, isShoot: false };

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

function onKeyDown(event) {
    var nextPosition = {
        i: gHero.pos.i,
        j: gHero.pos.j
    };

    switch (event.key) {
        case 'ArrowRight':
            nextPosition.j++;
            break;
        case 'ArrowLeft':
            nextPosition.j--;
            break;
        case ' ':
            shoot();
            break;
    }
    return nextPosition;
}

function moveHero(ev) {
    var nextPosition = onKeyDown(ev);

    if (nextPosition.j >= gBoard[0].length || nextPosition.j < 0) return;

    ////Removing
    //Model
    gBoard[gHero.pos.i][gHero.pos.j].gameObject = null;
    //Dom
    updateCell(gHero.pos);

    ////Updating hero location
    gHero.pos = nextPosition;

    ////Adding
    //Model
    gBoard[gHero.pos.i][gHero.pos.j].gameObject = HERO;
    //DOM
    updateCell(gHero.pos, HERO)
}


function updateCell(pos, gameObject = null) {
    gBoard[pos.i][pos.j].gameObject = gameObject;
    var elCell = getElCell(pos);
    elCell.innerHTML = gameObject || '';
}


function shoot() {
    if (gHero.isShoot) return;
    var pos = { i: gHero.pos.i - 1, j: gHero.pos.j }
    gHero.isShoot = true;
    blinkLaser(pos)
}

function blinkLaser(pos) {
    // console.log('-------');
    if (pos.i < 0) return gHero.isShoot = false;

    if (gBoard[pos.i][pos.j].gameObject) {
        gHero.isShoot = false;
        handleAlienHit(pos)
        return
    }

    // console.log('-------');
    //Model
    gBoard[pos.i][pos.j].gameObject = LASER;
    //Dom
    updateCell(pos, LASER);
    //Model
    setTimeout(function () {
        gBoard[pos.i][pos.j].gameObject = null;
        //Dom
        updateCell(pos);
        pos.i--
        blinkLaser(pos);
    }, LASER_SPEED);

}
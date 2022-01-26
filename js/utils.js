'use strict';


function createCell(gameObject = null) {
    return {
        type: SKY,
        gameObject: gameObject
    }
}

function getElCell(pos) {
    return document.querySelector(`.cell-${pos.i}-${pos.j}`);
}
//chenarul jocului
let tileSize = 32;
let rows = 16;
let columns = 16;

let board;
let boardWidth = tileSize * columns; // 32 * 16
let boardHeight = tileSize * rows; // 32 * 16
let context;

//nava spatiala
let shipWidth = tileSize*2;
let shipHeight = tileSize;
let shipX = tileSize * columns/2 - tileSize;
let shipY = tileSize * rows - tileSize*2;

let ship = {
    x : shipX,
    y : shipY,
    width : shipWidth,
    height : shipHeight
}

let shipImg;
let shipVelocityX = tileSize //viteza navei spatiale

//extraterestrii
let alienArray = [];
let alienWidth = tileSize*2;
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienImg;

let alienRows = 2;
let alienColumns = 3;
let alienCount = 0; //numarul de extraterestrii ce trebuie omorati
let alienVelocityX = 1; //viteza extraterestrilor

window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d"); //pentru desenare in chenar

    //incarcare imagini
    shipImg = new Image();
    shipImg.src = "./ship.png";
    shipImg.onload = function() {
        context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
    }

    alienImg = new Image();
    alienImg.src = "./alien.png";
     createAliens();

    requestAnimationFrame(update);
    document.addEventListener("keydown", moveShip);
}

function update() {
    requestAnimationFrame(update);

    context.clearRect(0, 0, board.width, board.height);

    //nava spatiala
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

    //extraterestrii
    for (let i = 0; i < alienArray.length; i++){
        let alien = alienArray[i];
        if (alien.alive) {
            alien.x += alienVelocityX;

            if(alien.x + alien.width >= board.width || alien.x <= 0) {
                alienVelocityX *= -1;
            }
            
            context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);
        }
    }

}

function moveShip(e) {
    if (e.code == "ArrowLeft" && ship.x - shipVelocityX >= 0) {
        ship.x -= shipVelocityX; //mutare in stanga o data
    }
    else if (e.code == "ArrowRight" && ship.x + shipVelocityX + ship.width <= board.width) {
        ship.x += shipVelocityX; //mutare in dreapta o data
    }
}

function createAliens() {
    for (let c = 0; c < alienColumns; c++) {
        for (let r = 0; r < alienRows; r++) {
            let alien = {
                img : alienImg,
                x : alienX + c*alienWidth,
                y : alienY + r*alienHeight,
                width : alienWidth,
                height : alienHeight,
                alive : true
            }

             alienArray.push(alien);
        }
    }
    alienCount = alienArray.length;
}
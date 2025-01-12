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

//gloante
let bulletArray = [];
let bulletVelocityY = -10; //viteza

let score = 0;
let gameOver = false;
let isPaused= false;

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
    document.addEventListener("keyup", shoot);

    // Apăsați „P” pentru pauză/continuare
    document.addEventListener("keydown", function(e) {
        if (e.code === "KeyP") { 
            pauseGame();
        }
    });
}

function goBackToMenu() {
    window.location.href = "menu.html"; //Redirecționare către pagina menu.html la apăsarea butonului "Back to Menu".
}

// Comutarea stării de pauză
function pauseGame() {
    isPaused = !isPaused; 
const pauseMessage = document.getElementById('pauseMessage'); // Afișarea sau ascunderea mesajului „Game Paused”
pauseMessage.style.display = isPaused ? 'block' : 'none'; // Comutarea vizibilității mesajului "Game Paused"
 }

function update() {
    requestAnimationFrame(update); // Asigură actualizarea continuă a jocului; cu pauză activată, această funcție se oprește pentru a întrerupe jocul.
   
    if (gameOver) {
        return;
    }

    if (isPaused) {
        return; // Nu se întâmplă nimic dacă jocul este întrerupt.
    }


    context.clearRect(0, 0, board.width, board.height); //Elimină conținutul întregii zone de desen pentru a permite reîmprospătarea graficii fără suprapuneri.
    


    //nava spatiala
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

    //extraterestrii
    for (let i = 0; i < alienArray.length; i++){
        let alien = alienArray[i];
        if (alien.alive) {
            alien.x += alienVelocityX;

            if(alien.x + alien.width >= board.width || alien.x <= 0) {
                alienVelocityX *= -1;
                alien.x += alienVelocityX*2;

                //coborare extraterestri
                for (let j = 0; j < alienArray.length; j++) {
                    alienArray[j].y += alienHeight;
                }
            }
              context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);
              if (alien.y >= ship.y) {
                gameOver = true;
              }

         }

     }
  //gloante
     for (let i = 0; i < bulletArray.length; i++) {
            let bullet = bulletArray[i];
            bullet.y += bulletVelocityY;
            context.fillStyle="blue";
            context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
           
            //ciocnire glont-extratrestru
        for (let j = 0; j < alienArray.length; j++) {
            let alien = alienArray[j];
            if (!bullet.used && alien.alive && detectCollision(bullet, alien)) {
                bullet.used = true;
                alien.alive = false;
                alienCount--;
                score += 100;
            }
        }
    }
        
        //stergere gloante
        while (bulletArray.length>0 && (bulletArray[0].used || bulletArray[0].y<0)) {
            bulletArray.shift(); 
        }

        //nivelul urmator
        if (alienCount == 0) {
            //creste numarul de extraterestri in coloane si randuri cu 1
            alienColumns = Math.min(alienColumns + 1, columns/2 -2); //capac la 16/2
            alienRows = Math.min(alienRows + 1, rows-4); //capac la 16-4 =12
            alienVelocityX += 0.2; // creste viteza de miscare a extraterestrilor
            alienArray = [];
            bulletArray = [];
            createAliens();
        }
        //scor
    context.fillStyle="darkslateblue";
    context.font="16px fantasy";
    context.fillText(score, 5, 20);
    }

function moveShip(e) {
    if (gameOver) {return;

    }
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
function shoot(e) {
    if (gameOver){return;

    }
    if (e.code == "Space") {
        //trage
        let bullet = {
            x : ship.x + shipWidth*15/32,
            y : ship.y,
            width : tileSize/8,
            height : tileSize/2,
            used : false
        }
        bulletArray.push(bullet);
    }
}
function detectCollision(a, b) {
    return a.x < b.x + b.width &&  
           a.x + a.width > b.x &&  
           a.y < b.y + b.height &&  
           a.y + a.height > b.y;    
}



/*
Først laver vi et nogle variable til at lave en appelsin
 - en kugle som vi vil skyde afsted og fange i en turban
*/

// Movement
let goingRight;
let goingLeft;
let goingUp;
let goingDown;

// Objekter
let turban;
let otherTurban;
let appelsiner = [];

// Øvrige
let score = 0;
let missed = 0;

let tid = 100;
let tidTæller = 40 + tid + Math.random() * tid;

let state = "start";
let role = "none";
let readyToStart = false;
let startDate;
let startCountdown = 3000;
let realStartCountdown = 2000;

let welcomeMessage;

let socket;

function setup() {
    //Her laver vi vores canvas med størrelserne 'windowWidth' og 'windowHeight' for at få det til at fylde hele browseren
    createCanvas(1000, 562.5);
    //Her laver vi vores turban
    turban = new Player(width / 2, height / 2, 90, 70, 10);
    otherTurban = new OtherPlayer();
    

    //welcomeMessage = createElement('h1', 'Welcome to our game');
    //document.getElementById("welcome").appendChild(welcomeMessage);
    //welcomeMessage.position(width / 2, height / 2);
    //let col = color(255, 255, 255);
    //welcomeMessage.style('color', col);
    //welcomeMessage.class('welcome-message');
}

function draw() {
    switch (state) {
        case "start":
            StartLoop();
            break;
        case "lobby":
            LobbyLoop();
            break;
        case "game":
            GameLoop();
            break;
        case "end":
            EndLoop();
            break;
    }
}

function StartLoop() {
    //I StartLoop skal vi kun vise vores 'welcome' div
    background(30);
    fill(255);
    textAlign(CENTER);
    textSize(72);
    //text("Welcome to our game", width / 2, height / 4);
    //Tager nogle elementer fra vores html og ser på hvilke af dem der skal vises og hvilke der skal skjules, ud fra hvilken state spillet er i
    document.getElementById('tryAgain').hidden = true;
    document.getElementById('scoring').hidden = true;
    document.getElementById('welcome').hidden = false;
    document.getElementById('end').hidden = true;
    document.getElementById('lobbyDiv').hidden = true;
    document.getElementById('readyToStart').hidden = true;
}

function LobbyLoop() {
    //I StartLoop skal vi kun vise vores 'welcome' div
    background(30);
    fill(255);
    textAlign(CENTER);
    textSize(72);
    //text("Welcome to our game", width / 2, height / 4);
    //Tager nogle elementer fra vores html og ser på hvilke af dem der skal vises og hvilke der skal skjules, ud fra hvilken state spillet er i
    document.getElementById('welcome').hidden = true;
    document.getElementById('lobbyDiv').hidden = false;

    if (readyToStart) {
        document.getElementById('readyToStart').hidden = false;
        // Tæl ned
        let now = new Date();
        let timePassed = now - startDate;
        let startingIn = startCountdown - timePassed;
        if (startingIn < 0) {
            document.getElementById("countdown").innerHTML = `Starting...`;
            state = "game";
        } else {
            // Show countdown
            document.getElementById("countdown").innerHTML = `Starting in ${int(startingIn/1000)}`;
        }
    }
}

function GameLoop() {
    background(30);
    Move();
    CheckScore();
    Update();
    document.getElementById('tryAgain').hidden = true;
    document.getElementById('scoring').hidden = false;
    document.getElementById('welcome').hidden = true;
    document.getElementById('end').hidden = true;
    document.getElementById('lobbyDiv').hidden = true;
    document.getElementById('readyToStart').hidden = true;

    // Send min lokation til den anden spiller
    socket.sendMessage({
        type: 'playerPos',
        x: turban.x,
        y: turban.y
    });
}

let countdownUntilRestart = 60;

function EndLoop() {
    document.getElementById('end').hidden = false;

    if (countdownUntilRestart <= 0) {
        document.getElementById('tryAgain').hidden = false;
    }

    if (countdownUntilRestart >= 0) {
        countdownUntilRestart -= 1;
    }
}

function Update() {

    //Her skal vi sørge for at appelsinen bliver vist, hvis den skal vises
    for (let i = 0; i < appelsiner.length; i++) {
        appelsiner[i].Update();
    }

    // Her vises turbanerne
    turban.Tegn();
    otherTurban.Tegn();

    if (role == "host") {
        if (tidTæller <= 0) {
            ShootNew();
            tidTæller = 20 + tid + Math.random() * tid;
        }
        tidTæller -= 1;
    }

    //Den finder den div med Id'et 'scoring'.      Viser ens score og hvor mange man har misset
    document.getElementById("scoring").innerHTML = `Score: ${score}<br/>Missed: ${missed}/10`;
}

function Move() {
    //Gør at turbanen bevæger sig, hvis en eller flere knapper bliver holdt nede
    if (goingRight) {
        turban.Move("right");
    }
    if (goingLeft) {
        turban.Move("left");
    }
    if (goingUp) {
        turban.Move("up");
    }
    if (goingDown) {
        turban.Move("down");
    }
}

function CheckScore() {

    /*Den løber alle appelsinerne igennem og hvis der er nogle der ryger ud af banen i stedet for ned i turbanen,
    så tilføjer den et point til ens missed counter*/
    for (let i = appelsiner.length - 1; i >= 0; i--) {
        if (appelsiner[i].x > width || appelsiner[i].y > height) {
            appelsiner.splice(i, 1);
            if (role == "host") {
                missed += 1;
            }
        }
    }

    /*Den løber igennem alle appelsinerne og hvis den ser at der er en appelsin der ryger ned i turbanen
    så plusser den 1 point til ens score*/
    for (let i = appelsiner.length - 1; i >= 0; i--) {
        if (appelsiner[i].yspeed > 0) {
            if (turban.Grebet(appelsiner[i].x, appelsiner[i].y, appelsiner[i].rad)) {
                if (role == "host") {
                    score++;
                } else if (role == "player") {
                    socket.sendMessage({
                        type: 'add to score'
                    });
                }
                // Fjern den andens appelsin
                socket.sendMessage({
                    type: 'destroy orange',
                    ID: appelsiner[i].id
                });
                // Fjern min egen appelsin
                appelsiner.splice(i, 1);
            }
        }
    }

    if (role == "host") {
        if (missed >= 10) {
            state = "end";
            socket.sendMessage({
                type: 'game over'
            });
        }

        socket.sendMessage({
            type: 'share scoring',
            theScore: score,
            theMissed: missed
        });
    }
}

function ShootNew() {
    if (role == "host") {
        //Laver/skyder en ny appelsin af sted og ganger derefter tid med 0.98 sådan at det tager mindre tid mellem hver appelsin
        let nyAppelsin = new Appelsin();
        // Giv appelsinen et id
        nyAppelsin.GiveID();
        // Send appelsinen til den anden spiller
        socket.sendMessage({
            type: 'send orange',
            xPos: nyAppelsin.x,
            yPos: nyAppelsin.y,
            xSpeed: nyAppelsin.xspeed,
            ySpeed: nyAppelsin.yspeed,
            radius: nyAppelsin.rad,
            ID: nyAppelsin.id
        });
        appelsiner.push(nyAppelsin);
        // Gør intervallet mindre mellem hver appelsin der bliver skudt afsted
        tid *= 0.98;
    }
}

function keyPressed() {
    //Sætter de forskellige statements til at være true når der bliver trykket på knapperne
    if (key == "d" || key == "D") {
        goingRight = true;
    }
    if (key == "a" || key == "A") {
        goingLeft = true;
    }
    if (key == "w" || key == "W") {
        goingUp = true;
    }
    if (key == "s" || key == "S") {
        goingDown = true;
    }
}

function keyReleased() {
    //Sætter de forskellige statements til at være false når man slipper knapperne igen
    if (key == "d" || key == "D") {
        goingRight = false;
    }
    if (key == "a" || key == "A") {
        goingLeft = false;
    }
    if (key == "w" || key == "W") {
        goingUp = false;
    }
    if (key == "s" || key == "S") {
        goingDown = false;
    }
}

function TryAgain() {
    // restart game
    missed = 0;
    score = 0;
    countdownUntilRestart = 60;

    socket = null;
    role = null;
    readyToStart = false;
    startCountdown = 3000;
    tid = 100;
    tidTæller = 40 + tid + Math.random() * tid;
    appelsiner = [];

    state = "start";
}

function CreateLobby() {
    socket = ElineSocket.create();
    socket.onMessage(handleMessage);
    role = "host";
    document.getElementById("gameId").innerHTML = `ID: ${socket.id}`;
    console.log(socket.id);

    state = "lobby";
}

function ConnectToLobby() {
    const pin = prompt("Pin: ");
    socket = ElineSocket.connect(pin);
    console.log("entered " + pin);
    socket.onMessage(handleMessage);

    role = "player";
    socket.sendMessage({
        type: 'connected'
    });

}

function handleMessage(sendedObject) {
    switch (sendedObject.type) {

        case 'connected':
            if (role == "host") {
                socket.sendMessage({
                    type: 'ready'
                });
                readyToStart = true;
                startDate = new Date();
            }
            break;

        case 'ready':
            if (role == "player") {
                readyToStart = true;
                state = "lobby";
                startDate = new Date();
            }
            break;

        case 'playerPos':
            otherTurban.UpdatePos(sendedObject.x, sendedObject.y);
            break;

        case 'send orange':
            if (role == "player") {
                let nyAppelsin = new Appelsin();
                nyAppelsin.NewValues(sendedObject.xPos, sendedObject.yPos, sendedObject.xSpeed, sendedObject.ySpeed, sendedObject.radius, sendedObject.ID);
                appelsiner.push(nyAppelsin);
            }
            break;
            
        case 'add to score':
            if (role == "host") {
                // Tilføj til scoren
                score++;
            }
            break;

        case 'destroy orange':
            // Slet den korrekte appelsin
            for (let i = appelsiner.length - 1; i >= 0; i--) {
                if (appelsiner[i].id == sendedObject.ID) {
                    appelsiner.splice(i, 1);
                }
            }
            break;

        case 'share scoring':
            if (role == "player") {
                score = sendedObject.theScore;
                missed = sendedObject.theMissed;
            }
            break;

        case 'game over':
            if (role == "player") {
                state = "end";
            }
            break;
    }
}

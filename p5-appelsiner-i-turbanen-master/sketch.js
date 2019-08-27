/*
Først laver vi et nogle variable til at lave en appelsin
 - en kugle som vi vil skyde afsted og fange i en turban
*/

// Movement variabler, til at afgøre om spilleren skal (blive ved med at) bevæge sig.
let goingRight;
let goingLeft;
let goingUp;
let goingDown;

// Egen spiller variabel
let turban;
// Anden spiller variabel
let otherTurban;
// Appelsin array
let appelsiner = [];

// Score variabel
let score = 0;
// Forbier variabel
let missed = 0;

// Tids variabel til indstilling af appelsin spawn-interval
let tid = 100;
// Nedtælleren til spawn-interval
let tidTæller = 40 + tid + Math.random() * tid;

// Gamestate
let state = "start";
// Egen rolle i spillet (spiller/host)
let role = "none";
// Variabeler til lobbyen
let readyToStart = false;
let startDate;
let startCountdown = 3000;

// Variabel til håndtering af sockets
let socket;

function setup() {
    // Her laver vi vores canvas med størrelserne - 1000 i bredden, og 562.5 i højden
    createCanvas(1000, 562.5);
    // Her laver vi vores spiller objekt
    turban = new Player(90, 70, 10);
    // Her laver vi den andens spiller objekt
    otherTurban = new OtherPlayer();
}

function draw() {
    // Kør de forskellige funktioner afhængigt af, hvilken gamestate spillet er i
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
    // Tegn først baggrunden, så den bliver tegnet bagerst (selvom der ikke bliver tegnet mere i js i denne funktion)
    background(30);
    // Tager nogle elementer fra vores html og ser på hvilke af dem der skal vises og hvilke der skal skjules, ud fra hvilken state spillet er i
    document.getElementById('tryAgain').hidden = true;
    document.getElementById('scoring').hidden = true;
    document.getElementById('welcome').hidden = false;
    document.getElementById('end').hidden = true;
    document.getElementById('lobbyDiv').hidden = true;
    document.getElementById('readyToStart').hidden = true;
}

function LobbyLoop() {
    // Tegn først baggrunden, så den bliver tegnet bagerst
    background(30);
    // Tager nogle elementer fra vores html og ser på hvilke af dem der skal ændres, i forhold til hvad der blev angivet i 'StartLoop'
    document.getElementById('welcome').hidden = true;
    document.getElementById('lobbyDiv').hidden = false;

    // Start spillet når det er klar ( forklaring om klargørelse, bliver "gjort klart" længere nede i koden ;) )
    if (readyToStart) {
        // Vi viser diven der holder vores besked om at spillet er klart.
        document.getElementById('readyToStart').hidden = false;
        // Tæl ned til start, og vis det for spillerene
        let now = new Date();
        let timePassed = now - startDate;
        let startingIn = startCountdown - timePassed;
        if (startingIn < 0) {
            document.getElementById("countdown").innerHTML = `Starting...`;
            // Når nedtællingen er nået 0, så set gamestate til 'game'.
            state = "game";
        } else {
            // Vis nedtællingen
            document.getElementById("countdown").innerHTML = `Starting in ${int(startingIn/1000)}`;
        }
    }
}

function GameLoop() {
    // Tegn først baggrunden, så den bliver tegnet bagerst
    background(30);
    // Kald funktionen 'Move' som gør det muligt at bevæge spilleren
    Move();
    // Kald funktionen 'CheckScore' som holer styr på om appelsiner er grebet, og om man skal have point.
    CheckScore();
    // Kald funktionen 'Update' som håndterer at opdatere spillerene, og opdatere scoren.
    Update();
    // Gem alle div, undtagen 'scoring'.
    document.getElementById('tryAgain').hidden = true;
    document.getElementById('scoring').hidden = false;
    document.getElementById('welcome').hidden = true;
    document.getElementById('end').hidden = true;
    document.getElementById('lobbyDiv').hidden = true;
    document.getElementById('readyToStart').hidden = true;

    // Send min lokation til den anden spiller.
    socket.sendMessage({
        type: 'playerPos',
        x: turban.x,
        y: turban.y
    });
}

// Nedtællingsvariabel til at vise 'try again' knappen.
let countdownUntilRestart = 60;

// Funktionen 'EndLoop' er til at håndtere slutningen af spillet, hvilket bare viser en besked om 'Game Over' og at man kan prøve igen.
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
    //Her skal vi sørge for at appelsinerne i arrayet bliver vist
    for (let i = 0; i < appelsiner.length; i++) {
        appelsiner[i].Update();
    }

    // Her vises turbanerne
    turban.Tegn();
    otherTurban.Tegn();

    /*
    -----   Nogle til skal kun gøre for hosten, da han skal håndtere mange ting.
    */

    // Hvis spilleren er host, så skal han skyde appelsiner i det givne interval.
    if (role == "host") {
        if (tidTæller <= 0) {
            // Kald funktionen, der skyder en ny appelsin
            ShootNew();
            // Sæt ny tid
            tidTæller = 20 + tid + Math.random() * tid;
        }
        // Tæl ned for at appelsinerne skal skydes
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
    så tilføjer den et point til hostens missed counter og fjerner appelsinen*/
    for (let i = appelsiner.length - 1; i >= 0; i--) {
        if (appelsiner[i].x > width || appelsiner[i].y > height) {
            appelsiner.splice(i, 1);
            if (role == "host") {
                missed += 1;
            }
        }
    }

    /*Den løber igennem alle appelsinerne og hvis den ser at der er en appelsin der ryger ned i turbanen
    så plusser den 1 point til hostens score, og hvis man er den anden spiller, så skal den fortælle hosten
    at der skal tilføjes et point*/
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
                // Hvis jeg har grebet en appelsin, så skal jeg sige til den anden spiller, at den samme appelsin skal fjernes.
                socket.sendMessage({
                    type: 'destroy orange',
                    ID: appelsiner[i].id
                });
                // Fjern min egen appelsin
                appelsiner.splice(i, 1);
            }
        }
    }
    // Hvis man misser 10 appelsiner så taber man og spillet viser 'game over'. Dette håndterer hosten, hvilket han sender til klienten her.
    if (role == "host") {
        if (missed >= 10) {
            state = "end";
            socket.sendMessage({
                type: 'game over'
            });
        }
    // Hosten bliver ved med at sende scoren til den anden spiller, så de er syncroniseret.
        socket.sendMessage({
            type: 'share scoring',
            theScore: score,
            theMissed: missed
        });
    }
}

// I denne funktion skyder vi nye appelsiner
function ShootNew() {
    if (role == "host") {
        //Laver en ny appelsin
        let nyAppelsin = new Appelsin();
        // Giv den nye appelsin et id
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
        // Tilføj appelsinen til mit eget array
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
    // Genstart spillet, så nulstil alle variable, som burde blive nulstillet.
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
    // Hvis man laver en lobby, så skal den lave en ny socket, som en anden kan connecte til.
    socket = ElineSocket.create();
    // Sæt op så man kan modtage beskeder fra den anden.
    socket.onMessage(handleMessage);
    // Sæt spillerens rolle til 'host'.
    role = "host";
    // Vis og sæt socket'ens ID, så en anden kan connecte.
    document.getElementById("gameId").innerHTML = `ID: ${socket.id}`;

    // Sæt hosten i lobbyen
    state = "lobby";
}

function ConnectToLobby() {
    // Giv et felt som spilleren kan indtase spillets ID i.
    const pin = prompt("Pin: ");
    // Connect til den socket som spilleren har indtastet.
    socket = ElineSocket.connect(pin);
    // Sæt op så man kan modtage beskeder fra den anden.
    socket.onMessage(handleMessage);
    // Sæt spillerens rolle til 'player'.
    role = "player";
    // Send til hosten at der er nogen der har connectet.
    socket.sendMessage({
        type: 'connected'
    });
}

// I denne funktion håndterer vi de beskeder som bliver sendt 
function handleMessage(sendedObject) {
    // Lav en switch, når vi kan håndtere beskedobjekterne, og gøre noget, alt efter hvilken 'type' objektet har.
    /*
        Man kan godt undre sig over hvorfor vi laver 'if rolle==', fordi det er ikke som sådan nødvendigt, men grunden
        er bare at sikre at det ikke er den forkerte der får besked, selvom vi "burde" kun sende de specifikke beskeder
        til den specifikke rolle. Så det er bare for en sikkerheds skyld, hvis vores kode ikke lige er perfekt.
    */
    switch (sendedObject.type) {
        // Hvis beskedns type er 'connected'.
        case 'connected':
            if (role == "host") {
                /*
                    Da der her er joinet en spiller til hosten, er spillet klart til at spille. Derfor skal hosten sende
                    til den anden, at spillet er klar.

                */
                socket.sendMessage({
                    type: 'ready'
                });
                // Sæt mit eget spil til at være klar
                readyToStart = true;
                // Sæt ny date, som skal bruges til nedtælling til start af spil.
                startDate = new Date();
            }
            break;
        // Hvis beskedns type er 'ready'.
        case 'ready':
            if (role == "player") {
                // Når den anden spiller har modtaget at spillet er klar, så skal den persons spil være 'ready to start'.
                readyToStart = true;
                // Placér mig til lobbyen
                state = "lobby";
                // Sæt ny date, som skal bruges til nedtælling til start af spil.
                startDate = new Date();
            }
            break;
        // Hvis beskedns type er 'playerPos'.
        case 'playerPos':
            // Uanset hvem jeg er, så skal jeg modtage den andens position, og opdatere min version af den anden spiller.
            otherTurban.UpdatePos(sendedObject.x, sendedObject.y);
            break;
        // Hvis beskedns type er 'send orange'.
        case 'send orange':
            if (role == "player") {
                // Som spiller modtager jeg appelsinernes variabler til at starte med. Så først laver jeg en ny appelsin
                let nyAppelsin = new Appelsin();
                // Derefter opdaterer jeg dens variabler, så de stemmer overens med hostens.
                nyAppelsin.NewValues(sendedObject.xPos, sendedObject.yPos, sendedObject.xSpeed, sendedObject.ySpeed, sendedObject.radius, sendedObject.ID);
                // Til sidst pusher jeg den til mit appelsin array.
                appelsiner.push(nyAppelsin);
            }
            break;
        // Hvis beskedns type er 'add to score'.
        case 'add to score':
            if (role == "host") {
                // Tilføj til hostens score
                score++;
            }
            break;
        // Hvis beskedns type er 'destroy orange'.
        case 'destroy orange':
            // Slet den korrekte appelsin, når den anden griber én.
            for (let i = appelsiner.length - 1; i >= 0; i--) {
                if (appelsiner[i].id == sendedObject.ID) {
                    appelsiner.splice(i, 1);
                }
            }
            break;
        // Hvis beskedns type er 'share scoring'.
        case 'share scoring':
            if (role == "player") {
                // Da jeg er spiller, skal jeg modtage hostens score. Derfor sætter jeg min score og missed her.
                score = sendedObject.theScore;
                missed = sendedObject.theMissed;
            }
            break;
        // Hvis beskedns type er 'game over'.
        case 'game over':
            if (role == "player") {
                // Hvis hostens spil er slut, skal mit også slutte.
                state = "end";
            }
            break;
    }
}

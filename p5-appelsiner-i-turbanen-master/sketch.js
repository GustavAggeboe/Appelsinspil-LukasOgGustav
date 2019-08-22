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
let appelsiner = [];

// Øvrige
let score = 0;
let missed = 0;

let tid = 100;
let tidTæller = 40 + tid + Math.random() * tid;

let state = "start";

let welcomeMessage;

function setup() {
    //Her laver vi vores canvas med størrelserne 'windowWidth' og 'windowHeight' for at få det til at fylde hele browseren
    createCanvas(windowWidth, windowHeight);
    //Her laver vi vores turban
    turban = new Kurv(width / 2, height / 2, 90, 70, 10);

    //welcomeMessage = createElement('h1', 'Welcome to our game');
    //document.getElementById("welcome").appendChild(welcomeMessage);
    //welcomeMessage.position(width / 2, height / 2);
    //let col = color(255, 255, 255);
    //welcomeMessage.style('color', col);
    //welcomeMessage.class('welcome-message');
}

function draw() {
    switch(state) {
        case "start":
            StartLoop();
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
}

function GameLoop() {
    background(30);
    Move();
    CheckScore();
    Update();
    document.getElementById('welcome').hidden = true;
    document.getElementById('scoring').hidden = false;
}

let countdownUntilRestart = 60;

function EndLoop() {
    document.getElementById('scoring').hidden = true;
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
    
    // Her vises turbanen - foreløbig blot en firkant
    turban.Tegn();

    if (tidTæller <= 0) {
        ShootNew();
        tidTæller = 40 + tid + Math.random() * tid;
    }
    tidTæller -= 1;
    //Den finder den div med Id'en scoring.         Hviser ens score og hvor mange man har misset
    document.getElementById("scoring").innerHTML = `Score: ${score}<br/>Missed: ${missed}/10`;
}

function Move() {
//Gør at turbanen bevæger sig mens knappen er holdt nede
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
            missed += 1;
        }
    }

    /*Den løber igennem alle appelsinerne og hvis den ser at der er en appelsin der ryger ned i turbanen
    så plusser den 1 point til ens score*/
    for (let i = appelsiner.length - 1; i >= 0; i--) {
        if (appelsiner[i].yspeed > 0) {
            if (turban.Grebet(appelsiner[i].x, appelsiner[i].y, appelsiner[i].rad)) {
                score += 1;
                appelsiner.splice(i, 1);
            }
        }
    }

    if (missed >= 10) {
        state = "end";
    }
}

function ShootNew() {
    //Laver/skyder en ny appelsin af sted og ganger derefter tid med 0.98 sådan at det tager mindre tid mellem hver appelsin
    appelsiner.push(new Appelsin());

    tid *= 0.98;
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

    //Gør at spillet starter når det har "staten" 'start'
    if (state == "start") {
        state = "game";
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

function TryAgain(){
    // restart game
    missed = 0;
    score = 0;
    countdownUntilRestart = 60;
    state = "start";
}

/*
OPGAVER

 Opgave 1 - undersøg hvad variablerne  grav  og  tid  bruges til.
            Skriv det i kommentarer, prøv at se hvad der sker, når
            I laver dem om.

 Opgave 2 - lav programmet om så det er tilfældigt hvor højt oppe 
            på venstre kan appelsinerne starter. Overvej om man kan 
            sikre, at appelsinen ikke ryger ud af skærmens top men 
            stadig har en "pæn" bane

 Opgave 3 - lav programmet om så man også kan bevæge turbanen mod
            højre og venstre med A- og D-tasterne. Prøv jer frem med
            forskellige løsninger for hvor hurtigt turbanen skal rykke

 Opgave 4 - ret programmet til, så det også angives hvor mange 
            appelsiner man IKKE greb med turbanen

 Opgave 5 - Undersøg hvad scriptet  kurv.js  er og gør, samt hvad de 
            funktioner, scriptet indeholder, skal bruges til. Skriv 
            det som kommentarer oven over hver funktion. Forklar tillige,
            hvad sammenhængen mellem dette script og turbanen i hoved-
            programmet er, og forklar det med kommentarer i toppen af 
            kurv.js

 Opgave 6 - find et billede af en turban og sæt det ind i stedet 
            for firkanten. Find eventuelt også en lyd, der kan afspilles, 
            når appelsinen gribes. Se gerne i "p5 Reference" hvordan, 
            hvis ikke I kan huske det:   https://p5js.org/reference/
            Lav programmet om, så man kan flytte turbanen med musen

 Opgave 7 - lav en Appelsin-klasse, lige som der er en Kurv-klasse. 
            Flyt koden til appelsinen ud i et selvstændigt script.
            Overvej hvad det skal hedde, oghvilke variabler og funktioner, 
            der skal lægges over i det nye script, herunder hvordan det 
            kommer til at berøre turbanen. Skriv jeres overvejelser i 
            kommentarerne

 Opgave 8 - ret programmet til, så der kan være flere appelsiner i 
            luften på en gang, dvs. at der kan skydes en ny appelsin
            afsted før den foregående er forsvundet. Overvej hvordan 
            og hvor hurtigt de skal skydes af, og forklar jeres tanker
            i kommentarerne

 Opgave 9 - ret programmet til, så det kan vindes og/eller tabes ved
            at man griber eller misser et antal appelsiner. Sørg for 
            at der vises en "Game Over"-skærm, som fortæller om man 
            vandt eller tabte, og som giver mulighed for at starte et
            nyt spil.

*/


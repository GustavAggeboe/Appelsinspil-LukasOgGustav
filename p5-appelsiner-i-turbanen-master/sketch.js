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

function setup() {
    createCanvas(1365, 700);
    turban = new Kurv(width / 2, height / 2, 90, 30, 10);
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
    background(0);
    fill(255);
    textAlign(CENTER);
    textSize(35);
    text("Press any key to start!", width / 2, height / 2);
}

function GameLoop() {
    background(0);
    move();
    checkScore();
    display();
}

var hasShowedMessage = false;
function EndLoop() {
    if (!hasShowedMessage) {
        fill(255);
        textAlign(CENTER);
        textSize(35);
        text("Game Over", width / 2, height / 2);
        textSize(20);
        text("Press any key to try again", width / 2, height / 2 + 25);
        hasShowedMessage = true;
    }
}

function display() {
    // Her vises turbanen - foreløbig blot en firkant
    turban.tegn();

    //Her skal vi sørge for at appelsinen bliver vist, hvis den skal vises
    for (let i = 0; i < appelsiner.length; i++) {
        appelsiner[i].update();
    }

    if (tidTæller <= 0) {
        shootNew();
        tidTæller = 40 + tid + Math.random() * tid;
    }
    tidTæller -= 1;


    textAlign(LEFT);
    fill(255);
    text("Score: " + score, 10, 40);
    fill(255);
    text("Missed: " + missed, 10, 80);
}

function move() {

    if (goingRight) {
        turban.move("right");
    }
    if (goingLeft) {
        turban.move("left");
    }
    if (goingUp) {
        turban.move("up");
    }
    if (goingDown) {
        turban.move("down");
    }
}

function checkScore() {
    for (let i = appelsiner.length - 1; i >= 0; i--) {
        if (appelsiner[i].x > width || appelsiner[i].y > height) {
            appelsiner.splice(i, 1);
            missed += 1;
        }
    }

    for (let i = appelsiner.length - 1; i >= 0; i--) {
        if (appelsiner[i].yspeed > 0) {
            if (turban.grebet(appelsiner[i].x, appelsiner[i].y, appelsiner[i].rad)) {
                score += 1;
                appelsiner.splice(i, 1);
            }
        }
    }

    if (missed >= 1) {
        state = "end";
    }
}

function shootNew() {
    appelsiner.push(new Appelsin());

    tid *= 0.98;
}

function keyPressed() {
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

    if (state == "start") {
        state = "game";
    }

    if (state == "end") {
        // restart game
        missed = 0;
        score = 0;
        hasShowedMessage = false;
        state = "start";
    }
}
function keyReleased() {
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

function mousePressed(){

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


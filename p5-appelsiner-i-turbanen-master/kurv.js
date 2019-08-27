/*
 * Dette script definerer klassen Kurv
*/

function Player(x, y, bredde, dybde, speed) {
    this.turbanImage = loadImage("/p5-appelsiner-i-turbanen-master/art/turban.png");
    this.guyImage = loadImage("/p5-appelsiner-i-turbanen-master/art/Neger2.png");
    this.girlImage = loadImage("/p5-appelsiner-i-turbanen-master/art/Neger_dame2.png");
    this.bred = bredde;
    this.dyb = dybde;
    this.x = width / 2 - bredde / 2;
    this.y = height / 1.3 - dybde / 2;
    this.speed = speed;
    this.col = [250,230,150];

    this.Tegn = function() {
        if (role == "player") {
            // Hvis jeg er den anden spiller, så skal jeg være:
            image(this.girlImage, this.x - 134, this.y - 40, 360, 240);
            image(this.turbanImage, this.x, this.y, this.bred, this.dyb);
        }
        if (role == "host") {
            // Hvis jeg er host, så skal jeg være:
            image(this.guyImage, this.x - 65, this.y - 10, 220, 220);
            image(this.turbanImage, this.x, this.y, this.bred, this.dyb);
        }
    }

    this.Move = function(dir) { /*Denne funktion gør det muligt at flytte turbanen smoothly
                                i stedet for at man skal trykke på knapperne hver gang man vil rykke den en lille smule*/
        if (dir == "up") {
            this.y -= this.speed;
            if (this.y < 0) {
                this.y = 0;
            }
        }
        if (dir == "down") {
            this.y += this.speed;
            if (this.y > height-this.dyb) {
                this.y = height - this.dyb;
            }
        }
        if (dir == "left") {
            this.x -= this.speed;
            if (this.x < 0) {
                this.x = 0;
            }
        }
        if (dir == "right") {
            this.x += this.speed;
            if (this.x > width-this.bred) {
                this.x = width - this.bred;
            }
        }
    }
    //Tag appelsinernes koordinater og hvis de passer med min turbans positions, så bliver grebet=true
    this.Grebet = function(xa, ya, ra) {
        let yTolerence = 15;
        let yOffset = 10;
        let xTolerence = 10;
        if ((ya < this.y + yTolerence + yOffset && ya > this.y - yTolerence + yOffset) && xa > this.x - xTolerence && xa < this.x + this.bred - ra + xTolerence) {
            return true;
        }
        else {
            return false;
        }
    }

}


function OtherPlayer() {
    //Finder de tre billeder vi bruger
    this.turbanImage = loadImage("/p5-appelsiner-i-turbanen-master/art/turban.png");
    this.guyImage = loadImage("/p5-appelsiner-i-turbanen-master/art/Neger2.png");
    this.girlImage = loadImage("/p5-appelsiner-i-turbanen-master/art/Neger_dame2.png");
    this.bred = 90;
    this.dyb = 70;
    this.x = width / 2;
    this.y = height / 2;

    this.Tegn = function() {
        if (role == "host") {
            // Hvis man er host, så skal den anden være:
            image(this.girlImage, this.x - 134, this.y - 40, 360, 240);
            image(this.turbanImage, this.x, this.y, this.bred, this.dyb);
        }
        if (role == "player") {
            // Hvis man er den anden spiller, så skal den anden være:
            image(this.guyImage, this.x - 65, this.y - 10, 220, 220);
            image(this.turbanImage, this.x, this.y, this.bred, this.dyb);
        }
    }

    this.UpdatePos = function(xPos, yPos) {
        this.x = xPos;
        this.y = yPos;
    }
}

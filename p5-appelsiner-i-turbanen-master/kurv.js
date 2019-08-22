/*
 * Dette script definerer klassen Kurv
*/

function Kurv(x, y, bredde, dybde, speed) {
    /* Den første del af funktionen er en "konstruktør".
     * Den tager parametrene og konstruerer et nyt objekt 
     * ud fra dem. Værdierne huskes som hørende til netop 
     * dette objekt ved hjælp af nøgleordet this
     */
    
    this.image = loadImage("/p5-appelsiner-i-turbanen-master/art/turban.png");
    this.kidImage = loadImage("/p5-appelsiner-i-turbanen-master/art/Neger2.png");
    this.bred = bredde;
    this.dyb = dybde;
    this.x = width / 2 - bredde / 2;
    this.y = height / 1.3 - dybde / 2;
    this.speed = speed;
    this.col = [250,230,150];

    this.Tegn = function() {
        /* fill(this.col);
        rect(this.x, this.y, this.bred, this.dyb); */
        image(this.kidImage, this.x - 65, this.y - 10, 220, 220);
        image(this.image, this.x, this.y, this.bred, this.dyb);
        
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

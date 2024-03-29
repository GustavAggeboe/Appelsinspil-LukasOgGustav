
class Appelsin {
    constructor () {
        //Giver vores appelsiner et billede
        this.image = loadImage("/p5-appelsiner-i-turbanen-master/art/orange.png");
        this.rad = 20 + Math.random() * 40;
        this.x = this.rad;
        this.spawnMin = 200;
        this.y = this.spawnMin + Math.random() * (height - this.spawnMin);
        this.xspeed = 2 + 10 * Math.random();
        this.yspeed = -10;
        this.gravity = .1;
        this.col = [200,100,0];

        this.id;
    }

    Update () {
        // Set appelsinens placering
        this.x += this.xspeed;
        this.y += this.yspeed;

        // Hold appelsinen væk fra toppen
        this.yspeed += this.gravity * (height - this.y) / 150;

        // bounce i toppen
        if (this.y < 0) {
            let bounceSpeed = 10;
            this.yspeed += bounceSpeed;
        }
        // Tegn appelsinbilledet ved de rigtige koordinater.
        image(this.image, this.x, this.y, this.rad, this.rad);
    }

    GiveID() {
        // Giver appelsinerne id'er så de kan blive synkroniseret med den anden spiller
        if (role == "host") {
            this.id = Math.random() * 999999;
        }
    }

    NewValues (xPos, yPos, xSpeed, ySpeed, radius, ID) {
        this.x = xPos;
        this.y = yPos;
        this.xspeed = xSpeed;
        this.yspeed = ySpeed;
        this.rad = radius;
        this.id = ID;
    }
}


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
        if (role == "player") {
            //console.log(this.x + ", " + this.y);
        }
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
        //fill(this.col);
        //ellipse(this.x, this.y, this.rad * 2, this.rad * 2);
        image(this.image, this.x, this.y, this.rad, this.rad);
    }

    GiveID() {
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

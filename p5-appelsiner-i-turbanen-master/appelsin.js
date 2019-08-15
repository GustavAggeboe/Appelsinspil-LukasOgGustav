
class Appelsin {

    constructor() {
        this.rad = 20;
        this.x = this.rad;
        this.y = 200 + Math.random() * 350;
        this.xspeed = 2 + 6 * Math.random();
        this.yspeed = -10;
        this.gravity = .1;
        this.col = [200,100,0];
    }

    update() {
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
        fill(this.col);
        ellipse(this.x, this.y, this.rad * 2, this.rad * 2);
    }
}

/// <reference path="../node_modules/@types/p5/global.d.ts" />
/// <reference path="../node_modules/@types/p5/constants.d.ts" />
/// <reference path="../node_modules/@types/p5/literals.d.ts" />


let animals = [];

class Animal{
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;

        this.eye_size = r/1.5;
        this.eye_size = max(this.eye_size, 8);
        this.eye1_x = this.x - this.r/2.5;
        this.eye2_x = this.x + this.r/2.5;
        this.eye1_y = this.y - this.r/2.5;
        this.eye2_y = this.y - this.r/2.5;
    }
    draw_eyes() {
        // draw eye frame
        noFill();
        circle(this.eye1_x, this.eye1_y, this.eye_size);
        circle(this.eye2_x, this.eye2_y, this.eye_size);

        // draw eye pupil
        let mouse_vec = createVector(mouseX, mouseY);
        let vec_from_eye1 = mouse_vec.copy().sub(createVector(this.eye1_x, this.eye1_y));
        vec_from_eye1.setMag(this.eye_size/4)
        let vec_from_eye2 = mouse_vec.copy().sub(createVector(this.eye2_x, this.eye2_y));
        vec_from_eye2.setMag(this.eye_size/4)

        fill(200);
        circle(this.eye1_x + vec_from_eye1.x, this.eye1_y + vec_from_eye1.y, this.eye_size/2);
        circle(this.eye2_x + vec_from_eye2.x, this.eye2_y + vec_from_eye2.y, this.eye_size/2);
    }

    draw_mouth() {

    }

    update() {
        stroke(100);
        fill(75);
        circle(this.x, this.y, this.r*2);

        this.draw_eyes();
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(70);
    let x_padding = 2;
    let y_padding = 25;
    let x_frame_padding = 20;
    let y_frame_padding = 20;
    let radius_min = 10;
    let radius_max = 30;
    let x = x_frame_padding;
    let y = y_frame_padding + radius_max;

    for (let i = 0; i < 300; i++) {
        r = random(radius_min, radius_max);
        if (x + 2 * radius_max > windowWidth - x_frame_padding) {
            r = random(radius_min, radius_max);
        }
        if (x + 2 * r > windowWidth - x_frame_padding) {
            x = x_frame_padding + random(radius_max);
            y += y_padding;
        }
        if (y + 0 * radius_max > windowHeight - y_frame_padding) {
            break;
        }
        animals.push(new Animal(x + r, y, r));
        x += r * 2 + x_padding;
    }
}

function draw() {
    background(70)
    animals.forEach(x => x.update());
    stroke(200);
    fill(70);



    let x_frame_padding = 20;
    let y_frame_padding = 20;

    let x = x_frame_padding;
    let y = y_frame_padding;
    noFill();
    rect(x_frame_padding, y_frame_padding, windowWidth - 2 * x_frame_padding, windowHeight - 2 * y_frame_padding)
}


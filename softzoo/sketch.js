/// <reference path="../node_modules/@types/p5/global.d.ts" />
/// <reference path="../node_modules/@types/p5/constants.d.ts" />
/// <reference path="../node_modules/@types/p5/literals.d.ts" />
/// <reference path="./p5.scribble.js" />

let frame_rate = 60;
let animals = [];
let scribble = new Scribble();

class Animal{
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;

        this.eye_size = r / 3;
        this.eye_size = max(this.eye_size, 4); // eye size should be at least 8
        this.max_watch_dist = 400;
        this.max_eye_move_dist = this.eye_size/2;

        this.eye1_x = this.x - this.r/2.5;
        this.eye2_x = this.x + this.r/2.5;
        this.eye1_y = this.y - this.r/2.5;
        this.eye2_y = this.y - this.r/2.5;

        this.mouth_x = this.x;
        this.mouth_y = this.y + this.r/5;
        this.mouth_max_watch_dist = 100;
        this.mouth_state = 0;
        this.mouth_width = this.r/3;
        this.mouth_height_max = this.r/2;
        this.mouth_height_min = this.r/10;
        this.mouth_height_joggle_factor_min = 1;
        this.mouth_height_joggle_factor_max = 2;
        this.mouth_joggle_freq = 25;
        this.mouth_joggle_per_frame = frame_rate / this.mouth_joggle_freq;

        this.ear1_x = this.x - this.r/1.5;
        this.ear2_x = this.x + this.r/1.5;
        this.ear1_y = this.y - this.r/1.3;
        this.ear2_y = this.y - this.r/1.3;
        this.ear_size = this.r/2;

        this.random_seed_face = random(10000);
        this.random_seed_eye1 = random(10000);
        this.random_seed_eye2 = random(10000);
        this.random_seed_mouse = random(10000);

    }

    draw_eyes() {
        // draw eye frame
        // noFill();
        // stroke(80);
        // circle(this.eye1_x, this.eye1_y, this.eye_size);
        // circle(this.eye2_x, this.eye2_y, this.eye_size);

        // draw eye pupil
        let mouse_vec = createVector(mouseX, mouseY);

        let v1 = createVector(this.eye1_x, this.eye1_y)
        let eye1_to_mouse = mouse_vec.copy().sub(v1);
        let eye1_to_mouse_dist = eye1_to_mouse.mag();
        let eye1_move_dist = map(eye1_to_mouse_dist, this.max_watch_dist, 0, 0, this.max_eye_move_dist, true);
        let eye1_move_vec = eye1_to_mouse.copy().setMag(eye1_move_dist);
        let eye1_pupil_pos = v1.copy().add(eye1_move_vec);

        let v2 = createVector(this.eye2_x, this.eye2_y)
        let eye2_to_mouse = mouse_vec.copy().sub(v2);
        let eye2_to_mouse_dist = eye2_to_mouse.mag();
        let eye2_move_dist = map(eye2_to_mouse_dist, this.max_watch_dist, 0, 0, this.max_eye_move_dist, true);
        let eye2_move_vec = eye2_to_mouse.copy().setMag(eye2_move_dist);
        let eye2_pupil_pos = v2.copy().add(eye2_move_vec);

        noFill();
        stroke(100);
        fill(90);
        // circle(eye1_pupil_pos.x, eye1_pupil_pos.y, this.eye_size/2);
        // circle(eye2_pupil_pos.x, eye2_pupil_pos.y, this.eye_size/2);

        let eye_size = map(eye1_to_mouse_dist, 0, this.mouth_max_watch_dist, this.eye_size*1.5, this.eye_size, true);


        randomSeed(this.random_seed_eye1)
        scribble.scribbleEllipse(eye1_pupil_pos.x, eye1_pupil_pos.y, eye_size/2, eye_size/2)

        randomSeed(this.random_seed_eye2)
        scribble.scribbleEllipse(eye2_pupil_pos.x, eye2_pupil_pos.y, eye_size/2, eye_size/2)
    }

    draw_mouth() {
        noFill();
        stroke(100);
        let mouse_vec = createVector(mouseX, mouseY);
        let mouth_to_mouse = mouse_vec.copy().sub(createVector(this.mouth_x, this.mouth_y));
        let mouth_to_mouse_dist = mouth_to_mouse.mag();

        let mouth_height = map(mouth_to_mouse_dist, this.mouth_max_watch_dist, 0, this.mouth_height_min, this.mouth_height_max, true);
        let joggle_factor = map(mouth_to_mouse_dist, this.mouth_max_watch_dist, 0, this.mouth_height_joggle_factor_min, this.mouth_height_joggle_factor_max, true);

        if (this.mouth_state == 1) {
            this.mouth_state = (ceil(frameCount / this.mouth_joggle_per_frame)) % 2;
            // ellipse(this.mouth_x, this.mouth_y, this.mouth_width, mouth_height);
            randomSeed(this.random_seed_mouse)
            scribble.scribbleEllipse(this.mouth_x, this.mouth_y, this.mouth_width, mouth_height)
        } else {
            this.mouth_state = (ceil(frameCount / this.mouth_joggle_per_frame)) % 2;
            // ellipse(this.mouth_x, this.mouth_y, this.mouth_width, mouth_height * joggle_factor);
            randomSeed(this.random_seed_mouse)
            scribble.scribbleEllipse(this.mouth_x, this.mouth_y, this.mouth_width, mouth_height * joggle_factor)
        }
    }
    draw_body() {
        stroke(100);
        fill(75);
        // circle(this.x, this.y, this.r*2);
        randomSeed(this.random_seed_face)
        scribble.scribbleEllipse(this.x, this.y, this.r*2, this.r*2)
    }

    draw_ears() {
        stroke(100);
        fill(75);
        randomSeed(this.random_seed_face)
        scribble.scribbleEllipse(this.ear1_x, this.ear1_y, this.ear_size, this.ear_size)
        scribble.scribbleEllipse(this.ear2_x, this.ear2_y, this.ear_size, this.ear_size)

    }

    update() {
        this.draw_ears();
        this.draw_body();
        this.draw_eyes();
        this.draw_mouth();
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(frame_rate);
    background(70);
    // let x_padding = 2;
    // let y_padding = 25;
    // let x_frame_padding = 50;
    // let y_frame_padding = 50;
    // let radius_min = 10;
    // let radius_max = 30;

    let radius_min = windowWidth / 80;
    let radius_max = windowWidth / 30;
    let x_padding = map(windowWidth, 0, 1920, 2, 5, true);
    let y_padding = radius_max/0.8;
    let x_frame_padding = windowWidth / 8;
    let y_frame_padding = (windowHeight - y_padding*10)/2

    let x = x_frame_padding;
    let y = y_frame_padding + radius_max;

    for (let i = 0; i < 100; i++) {
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

    // print frame rate
    textSize(10);
    fill(0);
    noStroke();
    text("Frame Rate: " + frameRate().toFixed(2), 10,10);
}


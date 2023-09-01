//// <reference path="../node_modules/@types/p5/global.d.ts" />
//// <reference path="../node_modules/@types/p5/constants.d.ts" />
//// <reference path="../node_modules/@types/p5/literals.d.ts" />

/// <reference path="./p5.js" />
/// <reference path="./p5.scribble.js" />

let frame_rate = 60;
let animals = [];
let t;
let scribble = new Scribble();
let bg_color = 200;
let canvasWidth = 800;
let canvasHeight = 800;

class Animal{
    constructor(x, y, r, like_letter) {
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

        this.like_letter = like_letter;
        colorMode(HSL, 360, 100, 100)
        // this.main_color = color(random(50, 100), 40, 40);
        this.main_color = color(random(50, 100), 0, 40);
        colorMode(RGB)
        this.palette = {
            ears: lerpColor(color("#646464FF"), color("#64646400"), this.like_letter),
            eyes: lerpColor(this.main_color, color("#64646400"), this.like_letter),
            mouse: lerpColor(color("#646464FF"), color("#64646400"), this.like_letter),
        }
        this.stroke_weight = map(this.like_letter, 0, 1, 2, 3, true);
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

        stroke(this.palette.eyes);
        strokeWeight(this.stroke_weight*0.6);
        noFill()
        let eye_size = map(eye1_to_mouse_dist, 0, this.mouth_max_watch_dist, this.eye_size*2, this.eye_size, true);

        // circle(eye1_pupil_pos.x, eye1_pupil_pos.y, eye_size/2);
        // circle(eye2_pupil_pos.x, eye2_pupil_pos.y, eye_size/2);

        randomSeed(this.random_seed_eye1)
        scribble.scribbleEllipse(eye1_pupil_pos.x, eye1_pupil_pos.y, eye_size/2, eye_size/2)

        randomSeed(this.random_seed_eye2)
        scribble.scribbleEllipse(eye2_pupil_pos.x, eye2_pupil_pos.y, eye_size/2, eye_size/2)
    }

    draw_mouth() {
        noFill();
        strokeWeight(this.stroke_weight);
        // stroke(100);
        stroke(this.palette.mouse);
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
        strokeWeight(this.stroke_weight);
        stroke(100);
        fill(bg_color);
        // circle(this.x, this.y, this.r*2);
        randomSeed(this.random_seed_face);
        scribble.scribbleEllipse(this.x, this.y, this.r*2, this.r*2);
        noStroke();
        // circle(this.x, this.y+40, this.r*2)
    }

    draw_ears() {
        strokeWeight(this.stroke_weight);
        stroke(this.palette.ears);
        fill(bg_color);
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


class Text {
    constructor(x, y, text, font_size) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.font_size = font_size;
    }

    update() {
        textLeading(this.font_size/1.5);
        textSize(this.font_size);
        fill(100);
        noStroke();
        text(this.text, this.x, this.y);
        
    }
}


function setup() {
    // var canvas = createCanvas();
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent("cont");

    frameRate(frame_rate);
    background(bg_color);
    // let x_padding = 2;
    // let y_padding = 25;
    // let x_frame_padding = 50;
    // let y_frame_padding = 50;
    // let radius_min = 10;
    // let radius_max = 30;

    let radius_min = canvasWidth / 100;
    let radius_max = canvasWidth / 15;
    let x_padding = map(canvasWidth, 0, 1920, 2, 5, true);
    let y_padding = radius_max/0.8;
    let x_frame_padding = canvasWidth / 20;
    let y_frame_padding = (canvasHeight - y_padding*6)/2

    let x = x_frame_padding + radius_max + 20;
    let y = y_frame_padding + radius_max;

    let font_size = 45;

    for (let i = 0; i < 200; i++) {
        r = random(radius_min, radius_max);
        if (x + 2 * radius_max > canvasWidth - x_frame_padding) {
            r = random(radius_min, radius_max);
        }
        if (x + 2 * r > canvasWidth - x_frame_padding) {
            x = x_frame_padding + random(radius_max);
            y += y_padding;
        }
        if (y + 0 * radius_max > canvasHeight - y_frame_padding) {
            break;
        }
        let like_letter = map(i-5, 0, 15, 1, 0, true);
        r = map(like_letter, 0.3, 1, r, font_size/2.8, true);
        animals.push(new Animal(x + r, y, r, like_letter));

        let x_padding_tmp = map(like_letter, 0, 1, x_padding, 13, true);
        x += r * 2 + x_padding_tmp;
    }

    t = new Text(
        x_frame_padding + 35,
        y_frame_padding + 40 , "S O F T\nZ", font_size = font_size
    );
}

function draw() {
    background(bg_color)
    t.update();
    animals.forEach(x => x.update());
    stroke(200);
    fill(bg_color);

    // print frame rate
    // textSize(10);
    // fill(0);
    // noStroke();
    // text("Frame Rate: " + frameRate().toFixed(2), 10,10);
}


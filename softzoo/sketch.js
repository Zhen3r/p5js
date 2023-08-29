/// <reference path="../node_modules/@types/p5/global.d.ts" />
/// <reference path="../node_modules/@types/p5/constants.d.ts" />
/// <reference path="../node_modules/@types/p5/literals.d.ts" />

let X_PT_NUM = 15;
let FRAME_HEIGHT = 300;
let FRAME_WIDTH = 400;
let UPPER_LIM = 0.3;
let FADE_DIST = 300;

let points = [];

class myPoint{
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vec = createVector(x, y);
        // this.heading = random(UPPER_LIM, 1) * (random() > 0.5 ? 1 : -1);
        // this.heading = random(0, UPPER_LIM) * (random() > 0.5 ? 1 : -1);
        this.heading = random(UPPER_LIM, 1) * 1;
    }
    drawPoint() {
        fill(200);
        strokeWeight(0);
        circle(this.x, this.y, 4);
    }
    drawCircleToMouse() {
        let mouse_vec = createVector(mouseX, mouseY);
        let vec_from_this = mouse_vec.sub(this.vec);
        let mid_pt = this.vec.copy().add(vec_from_this.copy().mult(0.5));
        let distance = vec_from_this.mag();
        let start_angle = vec_from_this.heading();
        let end_angle = start_angle+PI;

        // noFill(); stroke(200, 100); strokeWeight(1);
        noFill(); stroke(200, map(distance,0,FADE_DIST,255,0)); strokeWeight(1);
        arc(mid_pt.x, mid_pt.y, distance, distance, start_angle, end_angle)
    }
    
    drawPerpendicularToMouse() {
        let mouse_vec = createVector(mouseX, mouseY);
        let vec_from_this = mouse_vec.copy().sub(this.vec);
        let distance = vec_from_this.mag();
        let start_angle = vec_from_this.heading();

        let ver_pt = vec_from_this.copy().mult(0.5).setHeading(start_angle+PI*this.heading)
        ver_pt.add(this.vec).add(vec_from_this.copy().mult(0.5));

        noFill(); stroke(200, map(distance,0,FADE_DIST,255,0)); strokeWeight(1);
        line(this.x, this.y, ver_pt.x, ver_pt.y)
        line(mouse_vec.x, mouse_vec.y, ver_pt.x, ver_pt.y)
    }

    update() {
        this.drawPoint();
        this.drawPerpendicularToMouse();
        // this.drawCircleToMouse()
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(70);
    w_offset = (width-FRAME_WIDTH)/2
    h_offset = (height-FRAME_HEIGHT)/2
    for (x = 0; x < FRAME_WIDTH; x += FRAME_WIDTH/X_PT_NUM){
        for (y = 0; y < FRAME_HEIGHT; y += FRAME_WIDTH/X_PT_NUM) {
            points.push(new myPoint(x+w_offset, y+h_offset));
            // points.push(new myPoint(random(w_offset, w_offset+FRAME_WIDTH), random(h_offset, h_offset+FRAME_HEIGHT)))
            // points.push(new myPoint(randomGaussian(w_offset+0.5*FRAME_WIDTH, 0.5*FRAME_WIDTH), randomGaussian(h_offset+0.5*FRAME_HEIGHT, 0.5*FRAME_HEIGHT)))
        }
    }
}

function draw() {
    background(70)
    points.forEach(x => x.update());
}


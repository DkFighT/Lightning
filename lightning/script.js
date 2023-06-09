let ball = document.getElementById('ball');
let field = document.getElementById('field');
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
context.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--fg1');
context.lineWidth = '0.1'
context.lineCap = "round";
context.shadowColor = getComputedStyle(document.documentElement).getPropertyValue('--fg1');
context.shadowBlur = 5;
context.shadowOffsetX = 0;
context.shadowOffsetY = 0;

let points = document.getElementById('points');
let legs_count = document.getElementById('legs');
let dist = document.getElementById('distance');
let radios = document.querySelectorAll('.radio');

let count_of_points = 300;
let field_points = [];

let count_of_legs = 20;
let distance = 200;
let ball_pos = [];
let type;

points.oninput = () => {
    points.nextSibling.textContent = points.value;
    count_of_points = points.value;
    reload_field();
}
legs_count.oninput = () => {
    legs_count.nextSibling.textContent = legs_count.value;
    count_of_legs = legs_count.value;
}
dist.oninput = () => {
    dist.nextSibling.textContent = dist.value;
    // distance = dist.value;
}
radios.forEach((el) => {
    if (el.checked) {
        type = el.value;
    }
    el.onchange = () => {
        type = el.value;
    }
})

function reload_field(){
    let all_points = document.querySelectorAll('.point');
    for (let i = 0; i < all_points.length; i++){
        all_points[i].remove();
    }
    field_points = [];
    field_fill();
}

function field_fill() {
    for (let i = 0; i < count_of_points; i++) {
        field.insertAdjacentHTML('beforeend', `<div class='point' id='${i}'></div>`)
        let point = document.getElementById(i)
        let x_point = get_random(0, document.documentElement.clientWidth);
        let y_point = get_random(0, document.documentElement.clientHeight);
        point.style.top = `${y_point}px`;
        point.style.left = `${x_point}px`;
        let point_size = get_random(1, 6);
        point.style.height = `${point_size}px`;
        point.style.width = `${point_size}px`;
        let point_obj = {
            id: i,
            x: x_point,
            y: y_point,
            size: point_size,
            used: 0,
            rand_x: get_random(-100, 100),
            rand_y: get_random(-100, 100)
        }
        field_points.push(point_obj);
    }
}
field_fill()

function ball_position(x, y) {
    ball.style.top = `${y}px`;
    ball.style.left = `${x}px`;
    ball_pos[0] = {
        x: x,
        y: y,
        legs: 0
    }
}

function get_random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function draw_legs(ball_x, ball_y) {
    context.beginPath();
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < field_points.length; i++) {
        context.moveTo(Math.floor(ball_x + 30 / 2), Math.floor(ball_y + 30 / 2));
        if (ball_pos[0].x + distance >= field_points[i].x && ball_pos[0].x - distance <= field_points[i].x && ball_pos[0].y + distance >= field_points[i].y && ball_pos[0].y - distance <= field_points[i].y) {
            if (ball_pos[0].legs < count_of_legs) {
                ball_pos[0].legs += 1;
                switch (type) {
                    case '1':
                        context.quadraticCurveTo(field_points[i].x + field_points[i].rand_x, field_points[i].y + field_points[i].rand_y, field_points[i].x + Math.round(field_points[i].size / 2), field_points[i].y + Math.round(field_points[i].size / 2));
                        break;
                    case '2':
                        context.bezierCurveTo(field_points[i].x + field_points[i].rand_x, field_points[i].y + field_points[i].rand_y, ball_pos[0].x + field_points[i].rand_x, ball_pos[0].y + field_points[i].rand_y, field_points[i].x + Math.round(field_points[i].size / 2), field_points[i].y + Math.round(field_points[i].size / 2))
                        break;
                    case '3':
                        context.bezierCurveTo(ball_pos[0].x + field_points[i].rand_x * -1, ball_pos[0].y + field_points[i].rand_y * -1, field_points[i].x + field_points[i].rand_x, field_points[i].y + field_points[i].rand_y, field_points[i].x + Math.round(field_points[i].size / 2), field_points[i].y + Math.round(field_points[i].size / 2))
                        break;
                }
                // context.quadraticCurveTo(field_points[i].x + field_points[i].rand_x, field_points[i].y + field_points[i].rand_y, field_points[i].x + Math.round(field_points[i].size / 2), field_points[i].y + Math.round(field_points[i].size / 2));
                // context.bezierCurveTo(field_points[i].x + field_points[i].rand_x, field_points[i].y + field_points[i].rand_y, ball_pos[0].x + field_points[i].rand_x, ball_pos[0].y + field_points[i].rand_y, field_points[i].x + Math.round(field_points[i].size / 2), field_points[i].y + Math.round(field_points[i].size / 2))
                // context.bezierCurveTo(ball_pos[0].x + field_points[i].rand_x * -1, ball_pos[0].y + field_points[i].rand_y * -1, field_points[i].x + field_points[i].rand_x, field_points[i].y + field_points[i].rand_y, field_points[i].x + Math.round(field_points[i].size / 2), field_points[i].y + Math.round(field_points[i].size / 2))
                context.stroke();
                document.getElementById(i).style.opacity = '1';
            }
        }
        else {
            document.getElementById(i).style.opacity = '0.1';
        }
    }
    ball_pos[0].legs = 0;
}

field.addEventListener('mousemove', e => {
    let x = e.clientX;
    let y = e.clientY;
    ball_position(x, y);
    draw_legs(x, y);
})
field.addEventListener('touchmove', e => {
    e.preventDefault()
    let x = e.clientX;
    let y = e.clientY;
    ball_position(x, y);
    draw_legs(x, y);
})
field.addEventListener('mouseup', e => {
    let x = e.clientX;
    let y = e.clientY;
    for (let k = 0; k < field_points.length; k++) {
        document.getElementById(k).style.opacity = '1';
    }
})
field.addEventListener('touchend', e => {
    e.preventDefault()
    let x = e.clientX;
    let y = e.clientY;
    for (let k = 0; k < field_points.length; k++) {
        document.getElementById(k).style.opacity = '1';
    }
})
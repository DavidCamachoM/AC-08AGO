const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const shapeSelect = document.getElementById('shape');
const colorInput = document.getElementById('color');
const clearButton = document.getElementById('clear');
const backgroundCanvas = document.getElementById('background-animation');
const bgCtx = backgroundCanvas.getContext('2d');

backgroundCanvas.width = window.innerWidth;
backgroundCanvas.height = window.innerHeight;

let currentShape = 'rectangle';
let currentColor = '#ff0000';
let shapes = [];

shapeSelect.addEventListener('change', (e) => {
    currentShape = e.target.value;
});

colorInput.addEventListener('input', (e) => {
    currentColor = e.target.value;
});

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const shape = createShape(currentShape, x, y, currentColor);
    shapes.push(shape);
    drawShapes();
});

function createShape(type, x, y, color) {
    return {
        type,
        x,
        y,
        color,
        opacity: Math.random() * 0.5 + 0.5, // Opacidad aleatoria entre 0.5 y 1
        fadeSpeed: Math.random() * 0.02 + 0.01 // Velocidad de desvanecimiento
    };
}

function drawShapes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach((shape) => {
        ctx.beginPath();
        ctx.globalAlpha = shape.opacity;
        ctx.fillStyle = shape.color;
        ctx.strokeStyle = shape.color;
        ctx.lineWidth = 3;
        
        if (shape.type === 'rectangle') {
            ctx.roundRect(shape.x, shape.y, 120, 60, 10);
        } else if (shape.type === 'circle') {
            ctx.arc(shape.x, shape.y, 50, 0, Math.PI * 2);
        } else if (shape.type === 'triangle') {
            ctx.moveTo(shape.x, shape.y);
            ctx.lineTo(shape.x + 80 / 2, shape.y + 80);
            ctx.lineTo(shape.x - 80 / 2, shape.y + 80);
            ctx.closePath();
        } else if (shape.type === 'star') {
            drawStar(ctx, shape.x, shape.y, 60);
        }
        
        ctx.fill();
        ctx.stroke();
        ctx.globalAlpha = 1; // Resetear opacidad para otras formas
    });
}

function drawStar(ctx, x, y, radius) {
    const spikes = 5;
    const outerRadius = radius;
    const innerRadius = radius / 2;
    let rot = Math.PI / 2 * 3;
    let cx = x;
    let cy = y;
    let step = Math.PI / spikes;

    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
        cx = x + Math.cos(rot) * outerRadius;
        cy = y + Math.sin(rot) * outerRadius;
        ctx.lineTo(cx, cy);
        rot += step;

        cx = x + Math.cos(rot) * innerRadius;
        cy = y + Math.sin(rot) * innerRadius;
        ctx.lineTo(cx, cy);
        rot += step;
    }
    ctx.lineTo(x, y - outerRadius);
    ctx.closePath();
}

clearButton.addEventListener('click', () => {
    shapes = [];
    drawShapes();
});

CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
    if (width < 2 * radius) radius = width / 2;
    if (height < 2 * radius) radius = height / 2;
    this.moveTo(x + radius, y);
    this.arcTo(x + width, y, x + width, y + height, radius);
    this.arcTo(x + width, y + height, x, y + height, radius);
    this.arcTo(x, y + height, x, y, radius);
    this.arcTo(x, y, x + width, y, radius);
    this.closePath();
    return this;
};

let bgShapes = [];

function createBgShapes() {
    const colors = ['rgba(255, 77, 77, 0.2)', 'rgba(77, 255, 77, 0.2)', 'rgba(77, 77, 255, 0.2)', 'rgba(255, 255, 77, 0.2)'];
    for (let i = 0; i < 30; i++) {
        const x = Math.random() * backgroundCanvas.width;
        const y = Math.random() * backgroundCanvas.height;
        const radius = Math.random() * 50 + 30;
        const dx = (Math.random() - 0.5) * 2;
        const dy = (Math.random() - 0.5) * 2;
        const color = colors[Math.floor(Math.random() * colors.length)];

        bgShapes.push({ x, y, radius, dx, dy, color });
    }
}

function animateBackground() {
    bgCtx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

    bgShapes.forEach(shape => {
        shape.x += shape.dx;
        shape.y += shape.dy;

        if (shape.x + shape.radius > backgroundCanvas.width || shape.x - shape.radius < 0) {
            shape.dx = -shape.dx;
        }
        if (shape.y + shape.radius > backgroundCanvas.height || shape.y - shape.radius < 0) {
            shape.dy = -shape.dy;
        }

        bgCtx.beginPath();
        bgCtx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
        bgCtx.fillStyle = shape.color;
        bgCtx.fill();
    });

    requestAnimationFrame(animateBackground);
}

createBgShapes();
animateBackground();

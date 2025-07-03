const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
        this.baseDirectionX = directionX; // Store original direction
        this.baseDirectionY = directionY; // Store original direction
    }
    // method to draw individual particle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = this.size * 1.5; // Low glow
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow blur for other drawings
    }
    // check particle position, move the particle, draw the particle
    update() {
        //check if particle is still within canvas
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // move particle
        this.x += this.directionX;
        this.y += this.directionY;
        // draw particle
        this.draw();
    }
}

// create particle array
function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    for (let i = 0; i < numberOfParticles*2; i++) {
        let size = (Math.random() * 5) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 2) - 1; // Reduced movement
        let directionY = (Math.random() * 2) - 1; // Reduced movement
        let color = '#00ffff'; // Initial color, will be overridden by gradient

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// animation loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

// check if particles are close enough to draw line between them
function connect(){
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
            + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width/10) * (canvas.height/10)) {
                opacityValue = 1 - (distance/20000);
                let gradient = ctx.createLinearGradient(particlesArray[a].x, particlesArray[a].y, particlesArray[b].x, particlesArray[b].y);
                gradient.addColorStop(0, 'rgba(0, 255, 255,' + opacityValue + ')');
                gradient.addColorStop(1, 'rgba(255, 0, 255,' + opacityValue + ')');
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// resize event
window.addEventListener('resize', 
    function(){
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        init();
    }
);

// Click event for particle detachment
canvas.addEventListener('click', function(event) {
    const clickX = event.clientX;
    const clickY = event.clientY;

    particlesArray.forEach(particle => {
        const distance = Math.sqrt(Math.pow(clickX - particle.x, 2) + Math.pow(clickY - particle.y, 2));
        if (distance < particle.size * 10) { // If click is within 10 times particle size
            // Detach particle with a strong, random outward force
            particle.directionX = (Math.random() - 0.5) * 20; 
            particle.directionY = (Math.random() - 0.5) * 20;

            // After a short delay, return to normal movement
            setTimeout(() => {
                particle.directionX = particle.baseDirectionX;
                particle.directionY = particle.baseDirectionY;
            }, 500); // 500ms detachment time
        }
    });
});

init();
animate();
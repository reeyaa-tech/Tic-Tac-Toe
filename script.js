const boxes = document.querySelectorAll(".box");
const resetBtn = document.getElementById("reset-btn");
const msgContainer = document.querySelector(".msg-container");
const msg = document.getElementById("msg");
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');

let turnO = true; 
let count = 0; 
let particles = [];

// --- CONFETTI ENGINE ---
const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function createParticle() {
    return {
        x: Math.random() * canvas.width,
        y: -20,
        vx: (Math.random() - 0.5) * 10,
        vy: Math.random() * 5 + 5,
        color: `hsl(${Math.random() * 360}, 80%, 60%)`,
        size: Math.random() * 7 + 3
    };
}

function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.2; 
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        if (p.y > canvas.height) particles.splice(i, 1);
    });
    if (particles.length > 0) requestAnimationFrame(animateConfetti);
}

function triggerConfetti() {
    for (let i = 0; i < 150; i++) particles.push(createParticle());
    animateConfetti();
}

// --- GAME LOGIC ---
const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

const checkWinner = () => {
    for (let pattern of winPatterns) {
        let p1 = boxes[pattern[0]].innerText;
        let p2 = boxes[pattern[1]].innerText;
        let p3 = boxes[pattern[2]].innerText;

        if (p1 !== "" && p1 === p2 && p2 === p3) {
            showWinner(p1, pattern);
            return true;
        }
    }
    return false;
};

const showWinner = (winner, pattern) => {
    msg.innerText = `Congratulations! ${winner} wins! 🎉`;
    msgContainer.classList.remove("hide");
    pattern.forEach(i => boxes[i].classList.add("winner-highlight"));
    boxes.forEach(box => box.disabled = true);
    triggerConfetti();
};

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (turnO) {
            box.innerText = "O";
            box.style.color = "#38bdf8"; // Light Blue
            turnO = false;
        } else {
            box.innerText = "X";
            box.style.color = "#fb7185"; // Light Pink
            turnO = true;
        }
        box.disabled = true;
        count++;

        let isWinner = checkWinner();
        if (count === 9 && !isWinner) {
            msg.innerText = "It's a Draw! 🤝";
            msgContainer.classList.remove("hide");
        }
    });
});

resetBtn.addEventListener("click", () => {
    turnO = true;
    count = 0;
    particles = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    boxes.forEach(box => {
        box.innerText = "";
        box.disabled = false;
        box.classList.remove("winner-highlight");
    });
    msgContainer.classList.add("hide");
});
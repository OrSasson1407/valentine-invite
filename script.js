// =====================================================
// VALENTINE'S INVITATION — main script
// Sections: floating hearts, countdown, escaping "no"
// button, success transition, confetti effect
// =====================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------
     1) FLOATING HEARTS BACKGROUND
     Continuously spawns small heart emojis that float
     up from the bottom of the screen.
  --------------------------------------------------- */
  const heartsContainer = document.getElementById('floatingHearts');
  const heartEmojis = ['❤️', '💕', '💖', '💗', '💓', '💘'];

  function spawnFloatingHeart() {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

    // Random horizontal position, size, duration and delay for variety
    const left = Math.random() * 100; // vw
    const size = 16 + Math.random() * 22; // px
    const duration = 8 + Math.random() * 8; // seconds

    heart.style.left = `${left}vw`;
    heart.style.fontSize = `${size}px`;
    heart.style.animationDuration = `${duration}s`;

    heartsContainer.appendChild(heart);

    // Clean up once the animation finishes so the DOM doesn't grow forever
    setTimeout(() => heart.remove(), duration * 1000);
  }

  // Spawn a new heart at a steady interval
  setInterval(spawnFloatingHeart, 450);
  // Seed a few immediately so the screen isn't empty on load
  for (let i = 0; i < 12; i++) {
    setTimeout(spawnFloatingHeart, i * 150);
  }


  /* ---------------------------------------------------
     2) COUNTDOWN TO THE DATE (29/7, 20:00)
     Assumes the current year; if that date already
     passed this year, it just shows "today" behavior
     gracefully.
  --------------------------------------------------- */
  const countdownText = document.getElementById('countdownText');

  function getTargetDate() {
    const now = new Date();
    let year = now.getFullYear();
    let target = new Date(year, 6, 29, 20, 0, 0); // month is 0-indexed → 6 = July
    if (target < now) {
      target = new Date(year + 1, 6, 29, 20, 0, 0);
    }
    return target;
  }

  const targetDate = getTargetDate();

  function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      countdownText.textContent = '🎉 היום זה קורה!';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    countdownText.textContent =
      `⏳ עוד ${days} ימים, ${hours} שעות, ${minutes} דקות ו-${seconds} שניות`;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);


  /* ---------------------------------------------------
     3) THE ESCAPING "NO" BUTTON
     On hover (desktop) or touch (mobile), the button
     jumps to a new random position within the viewport,
     always staying fully on-screen.
  --------------------------------------------------- */
  const noBtn = document.getElementById('noBtn');
  const yesBtn = document.getElementById('yesBtn');
  const hint = document.getElementById('hint');

  let escapeCount = 0;
  const funnyHints = [
    '💡 נסי ללחוץ על הכפתור השני...',
    '😏 כמעט הצלחת!',
    '🏃‍♀️ הוא ממש בורח ממך!',
    '😂 אין סיכוי לתפוס אותו',
    '🙈 גם לא ננסה יותר?',
    '❤️ אולי פשוט תלחצי על הכפתור השני?',
  ];

  function moveNoButtonToRandomPosition() {
    // Switch to fixed positioning so it can roam the whole viewport
    if (!noBtn.classList.contains('escaping')) {
      noBtn.classList.add('escaping');
    }

    const btnWidth = noBtn.offsetWidth || 160;
    const btnHeight = noBtn.offsetHeight || 56;
    const margin = 12;

    const maxX = Math.max(margin, window.innerWidth - btnWidth - margin);
    const maxY = Math.max(margin, window.innerHeight - btnHeight - margin);

    const randomX = margin + Math.random() * (maxX - margin);
    const randomY = margin + Math.random() * (maxY - margin);

    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;

    // Small playful rotation/scale for extra charm
    const randomRotate = (Math.random() * 20 - 10).toFixed(1);
    noBtn.style.transform = `rotate(${randomRotate}deg)`;

    // Update the hint text occasionally for humor
    escapeCount++;
    hint.textContent = funnyHints[Math.min(escapeCount, funnyHints.length - 1)];
  }

  // Desktop: escape on hover
  noBtn.addEventListener('mouseenter', moveNoButtonToRandomPosition);

  // Mobile / touch: escape before a tap can register as a click
  noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveNoButtonToRandomPosition();
  }, { passive: false });

  // Safety net: if it's ever somehow clicked (e.g. keyboard focus + enter),
  // just make it run away instead of doing anything else
  noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    moveNoButtonToRandomPosition();
  });

  noBtn.addEventListener('focus', moveNoButtonToRandomPosition);

  // Also nudge it away if the window resizes, so it never gets stuck
  // off-screen on orientation change
  window.addEventListener('resize', () => {
    if (noBtn.classList.contains('escaping')) {
      moveNoButtonToRandomPosition();
    }
  });


  /* ---------------------------------------------------
     4) "YES" BUTTON → SUCCESS SCREEN + CONFETTI
  --------------------------------------------------- */
  const invitationCard = document.getElementById('invitationCard');
  const successCard = document.getElementById('successCard');

  yesBtn.addEventListener('click', () => {
    // Smooth fade/scale transition between cards
    invitationCard.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    invitationCard.style.opacity = '0';
    invitationCard.style.transform = 'scale(0.9)';

    setTimeout(() => {
      invitationCard.hidden = true;
      successCard.hidden = false;
      launchConfetti();
    }, 400);
  });


  /* ---------------------------------------------------
     5) CONFETTI EFFECT
     Lightweight canvas-based confetti burst, no
     external libraries needed.
  --------------------------------------------------- */
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  let confettiPieces = [];
  let confettiAnimationId = null;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const confettiColors = ['#ff4d6d', '#ff8fa3', '#ffccd5', '#c9184a', '#ffb703', '#ffffff'];

  function createConfettiPiece() {
    return {
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.3,
      size: 6 + Math.random() * 8,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      speedY: 2 + Math.random() * 3,
      speedX: (Math.random() - 0.5) * 3,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      shape: Math.random() > 0.5 ? 'circle' : 'rect',
    };
  }

  function launchConfetti() {
    confettiPieces = [];
    const pieceCount = 150;
    for (let i = 0; i < pieceCount; i++) {
      confettiPieces.push(createConfettiPiece());
    }

    if (!confettiAnimationId) {
      animateConfetti();
    }

    // Stop spawning new frames after everything has fallen off-screen
    setTimeout(() => {
      confettiPieces = [];
    }, 6000);
  }

  function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiPieces.forEach((p) => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotationSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;

      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      }

      ctx.restore();
    });

    // Remove pieces that fell off the bottom of the screen
    confettiPieces = confettiPieces.filter((p) => p.y < canvas.height + 40);

    confettiAnimationId = requestAnimationFrame(animateConfetti);
  }

});
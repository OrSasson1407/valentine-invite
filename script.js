document.addEventListener("DOMContentLoaded", () => {
    
    const btnNo = document.getElementById("btn-no");
    const btnYes = document.getElementById("btn-yes");
    const invitationStep = document.getElementById("invitation-step");
    const successStep = document.getElementById("success-step");
    const heartsBackground = document.getElementById("hearts-background");

    // ==========================================
    // 1. מנגנון הבריחה של כפתור ה"לא יכולה"
    // ==========================================
    
    const escapeButton = () => {
        // שוליים בטוחים בפיקסלים כדי שהכפתור לא יגע בקצוות המסך
        const safeMargin = 40; 
        
        // חישוב השטח הפנוי במסך פחות גודל הכפתור והשוליים הבטוחים מכל צד
        const maxX = window.innerWidth - btnNo.offsetWidth - safeMargin;
        const maxY = window.innerHeight - btnNo.offsetHeight - safeMargin;

        // הגרלת מיקום חדש - מוודאים שהמיקום המינימלי הוא לפחות ה-safeMargin
        // והמקסימלי לא עובר את מה שחישבנו
        const randomX = Math.max(safeMargin, Math.floor(Math.random() * maxX));
        const randomY = Math.max(safeMargin, Math.floor(Math.random() * maxY));

        // הופכים את הכפתור לצף מעל הכל ומאפסים כיוונים אחרים
        btnNo.style.position = "fixed";
        btnNo.style.right = "auto"; // חשוב מאוד באתר RTL
        btnNo.style.bottom = "auto";
        btnNo.style.margin = "0"; // ביטול שוליים קיימים
        
        // החלת המיקום החדש
        btnNo.style.left = `${randomX}px`;
        btnNo.style.top = `${randomY}px`;
    };

    // מתאים גם כשמרחפים עם העכבר (מחשב) וגם כשמנסים לגעת (מובייל)
    btnNo.addEventListener("mouseover", escapeButton);
    btnNo.addEventListener("touchstart", (e) => {
        e.preventDefault(); // מונע את הלחיצה בפועל
        escapeButton();
    });
    btnNo.addEventListener("click", (e) => {
        e.preventDefault();
        escapeButton();
    });


    // ==========================================
    // 2. מנגנון אישור ההגעה (כפתור "כן")
    // ==========================================
    
    btnYes.addEventListener("click", () => {
        // מסתירים את מסך ההזמנה ומציגים את מסך ההצלחה
        invitationStep.classList.add("hidden");
        successStep.classList.remove("hidden");

        // מפעילים אפקט "פיצוץ" של לבבות (קונפטי)
        createConfetti();
    });


    // ==========================================
    // 3. אנימציית לבבות עולים ברקע ברציפות
    // ==========================================
    
    const createFloatingHeart = () => {
        const heart = document.createElement("div");
        heart.classList.add("heart");
        heart.innerHTML = "❤️";
        
        // הגרלת מיקום אופקי
        heart.style.left = Math.random() * 100 + "vw";
        // הגרלת גודל
        heart.style.fontSize = Math.random() * 15 + 10 + "px";
        // הגרלת מהירות אנימציה (בין 3 ל-6 שניות)
        const duration = Math.random() * 3 + 3;
        heart.style.animationDuration = duration + "s";
        
        // מתחיל מתחתית המסך
        heart.style.bottom = "-20px";
        
        heartsBackground.appendChild(heart);

        // מוחק את הלב לאחר שהאנימציה מסתיימת כדי לא להעמיס על הדפדפן
        setTimeout(() => {
            heart.remove();
        }, duration * 1000);
    };

    // יצירת לב מרחף כל 500 מילי-שניות (חצי שנייה)
    setInterval(createFloatingHeart, 500);


    // ==========================================
    // 4. אפקט קונפטי של לבבות במעבר למסך הצלחה
    // ==========================================
    
    const createConfetti = () => {
        for (let i = 0; i < 40; i++) {
            setTimeout(() => {
                const heart = document.createElement("div");
                heart.classList.add("heart");
                // גיוון באייקונים באפקט הקונפטי
                const emojis = ["❤️", "💖", "😍", "✨"];
                heart.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
                
                heart.style.left = Math.random() * 100 + "vw";
                heart.style.fontSize = Math.random() * 20 + 15 + "px";
                heart.style.animationDuration = Math.random() * 2 + 2 + "s";
                heart.style.bottom = "-20px";
                
                document.body.appendChild(heart);
                
                setTimeout(() => {
                    heart.remove();
                }, 4000);
            }, i * 50); // השהייה קטנה בין לב ללב למראה של "גשם" רציף
        }
    };
});
document.addEventListener("DOMContentLoaded", () => {
    // 1. Get main title
    const mainTitleEl = document.querySelector('.main-title');
    let mainTitle = null;
    if (mainTitleEl) {
        const text = mainTitleEl.textContent.trim();
        if (text) mainTitle = { el: mainTitleEl, text: text, progress: 0 };
    }

    // 2. Get title row elements
    const titleRowsEl = document.querySelectorAll('.titles-row h1');
    const titleRows = [];
    titleRowsEl.forEach(el => {
        const text = el.textContent.trim();
        if (text) titleRows.push({ el: el, text: text, progress: 0 });
    });

    // Clear initial text so they start empty
    if (mainTitle) mainTitle.el.textContent = "";
    titleRows.forEach(item => {
        item.el.textContent = "";
    });

    // Configuration for the animation loop
    const TYPE_MAIN = 1500;             // Main typing duration
    const TYPE_TITLE_EACH = 800;        // Typing duration for EACH subtitle
    const TYPE_TITLE_TOTAL = titleRows.length * TYPE_TITLE_EACH;
    const PAUSE_END = 2000;             // Pause when fully typed
    const DELETE_DURATION = 1000;       // Deleting duration (all delete together)
    const PAUSE_START = 500;            // Pause before restarting loop

    const TOTAL_CYCLE = TYPE_MAIN + TYPE_TITLE_TOTAL + PAUSE_END + DELETE_DURATION + PAUSE_START;

    let startTime = performance.now();

    function animate(currentTime) {
        let elapsed = (currentTime - startTime) % TOTAL_CYCLE;

        if (elapsed < TYPE_MAIN) {
            // Main typing forward
            if (mainTitle) mainTitle.progress = elapsed / TYPE_MAIN;
            titleRows.forEach(t => t.progress = 0);
        } else if (elapsed < TYPE_MAIN + TYPE_TITLE_TOTAL) {
            // Main finished, title typing forward sequentially (left -> center -> right)
            if (mainTitle) mainTitle.progress = 1;
            let titleElapsed = elapsed - TYPE_MAIN;
            
            titleRows.forEach((item, index) => {
                let start = index * TYPE_TITLE_EACH;
                let end = start + TYPE_TITLE_EACH;
                if (titleElapsed < start) {
                    item.progress = 0;
                } else if (titleElapsed >= end) {
                    item.progress = 1;
                } else {
                    item.progress = (titleElapsed - start) / TYPE_TITLE_EACH;
                }
            });
        } else if (elapsed < TYPE_MAIN + TYPE_TITLE_TOTAL + PAUSE_END) {
            // Both finished, pause
            if (mainTitle) mainTitle.progress = 1;
            titleRows.forEach(t => t.progress = 1);
        } else if (elapsed < TYPE_MAIN + TYPE_TITLE_TOTAL + PAUSE_END + DELETE_DURATION) {
            // Deleting backward (together)
            let deleteElapsed = elapsed - (TYPE_MAIN + TYPE_TITLE_TOTAL + PAUSE_END);
            let deleteProgress = 1 - (deleteElapsed / DELETE_DURATION);
            if (mainTitle) mainTitle.progress = deleteProgress;
            titleRows.forEach(t => t.progress = deleteProgress);
        } else {
            // Empty pause
            if (mainTitle) mainTitle.progress = 0;
            titleRows.forEach(t => t.progress = 0);
        }

        // Apply progress to main title
        if (mainTitle) {
            let charCount = Math.floor(mainTitle.progress * (mainTitle.text.length + 1));
            if (charCount < 0) charCount = 0;
            if (charCount > mainTitle.text.length) charCount = mainTitle.text.length;
            mainTitle.el.textContent = mainTitle.text.substring(0, charCount);
            
            if (mainTitle.progress > 0 && mainTitle.progress < 1) {
                mainTitle.el.classList.add('is-typing');
            } else {
                mainTitle.el.classList.remove('is-typing');
            }
        }

        // Apply progress to title rows
        titleRows.forEach(item => {
            let charCount = Math.floor(item.progress * (item.text.length + 1));
            if (charCount < 0) charCount = 0;
            if (charCount > item.text.length) charCount = item.text.length;
            item.el.textContent = item.text.substring(0, charCount);
            
            if (item.progress > 0 && item.progress < 1) {
                item.el.classList.add('is-typing');
            } else {
                item.el.classList.remove('is-typing');
            }
        });

        // Loop the animation
        requestAnimationFrame(animate);
    }

    // Start animation loop
    requestAnimationFrame(animate);
});
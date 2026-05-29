document.addEventListener('DOMContentLoaded', function () {
    const rooms = document.querySelectorAll('.room-group');
    const paths = document.querySelectorAll('.path-to-room');
    const info = document.querySelectorAll('.wrapp-info');
    const closeBtns = document.querySelectorAll('.close-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    const preview = document.getElementById('idlePreview');
    
    let idleTimer = null;
    let typingTimeout = null;
    let loopTimeout = null;
    const IDLE_DELAY = 60000;

    const linesData = [
        { id: 'line1', text: 'Добро пожаловать' },
        { id: 'line2', text: 'в Мелитопольский государственный университет.' },
        { id: 'line3', text: 'Коснитесь, чтобы продолжить.' }
    ];

    function deactivateAll() {
        rooms.forEach(r => r.classList.remove('active'));
        paths.forEach(p => p.classList.remove('active'));
        info.forEach(i => i.classList.remove('active'));
        menuItems.forEach(m => m.classList.remove('active'));
    }

    function activateElement(index) {
        const isAlreadyActive = rooms[index] ? rooms[index].classList.contains('active') : false;

        rooms.forEach((r, i) => { if (i !== index) r.classList.remove('active'); });
        paths.forEach((p, i) => { if (i !== index) p.classList.remove('active'); });
        info.forEach((item, i) => { if (i !== index) item.classList.remove('active'); });
        menuItems.forEach((item, i) => { if (i !== index) item.classList.remove('active'); });
        
        if (isAlreadyActive) {
            if (rooms[index]) rooms[index].classList.remove('active');
            if (paths[index]) paths[index].classList.remove('active');
            if (info[index]) info[index].classList.remove('active');
            if (menuItems[index]) menuItems[index].classList.remove('active');
        } else {
            if (rooms[index]) rooms[index].classList.add('active');
            if (paths[index]) paths[index].classList.add('active');
            if (info[index]) info[index].classList.add('add');
            if (menuItems[index]) menuItems[index].classList.add('active');
        }
    }

    function startTypingEffect() {
        clearTimeout(typingTimeout);
        clearTimeout(loopTimeout);

        linesData.forEach(line => {
            const el = document.getElementById(line.id);
            if (el) {
                el.textContent = '';
                el.classList.remove('typing-cursor');
            }
        });

        let currentLineIndex = 0;
        let currentCharIndex = 0;

        function type() {
            if (currentLineIndex >= linesData.length) {
                const lastEl = document.getElementById(linesData[linesData.length - 1].id);
                if (lastEl) lastEl.classList.add('typing-cursor'); 
                loopTimeout = setTimeout(startTypingEffect, 5000);
                return;
            }

            const currentLine = linesData[currentLineIndex];
            const targetElement = document.getElementById(currentLine.id);

            if (targetElement) {
                targetElement.classList.add('typing-cursor');

                if (currentCharIndex < currentLine.text.length) {
                    targetElement.textContent += currentLine.text.charAt(currentCharIndex);
                    currentCharIndex++;
                    typingTimeout = setTimeout(type, 60); 
                } else {
                    currentLineIndex++;
                    currentCharIndex = 0;
                    
                    if (currentLineIndex >= linesData.length) {
                        typingTimeout = setTimeout(type, 10);
                    } else {
                        typingTimeout = setTimeout(() => {
                            targetElement.classList.remove('typing-cursor');
                            type();
                        }, 600);
                    }
                }
            } else {
                currentLineIndex++;
                type();
            }
        }

        type();
    }

    function showPreview() {
        deactivateAll();
        if (preview) {
            preview.classList.remove('hidden');
            startTypingEffect();
        }
    }

    function resetIdleTimer() {
        if (preview && !preview.classList.contains('hidden')) {
            preview.classList.add('hidden');
            clearTimeout(typingTimeout);
            clearTimeout(loopTimeout);
            sessionStorage.setItem('user_active', 'true');
        }
        
        clearTimeout(idleTimer);
        
        idleTimer = setTimeout(function() {
            const isMainPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';

            sessionStorage.removeItem('user_active');

            if (isMainPage) {
                showPreview();
            } else {
                window.location.href = "index.html";
            }
        }, IDLE_DELAY);
    }

    const isMainPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';

    if (isMainPage) {
        const isUserActiveNow = sessionStorage.getItem('user_active');

        if (isUserActiveNow === 'true') {
            if (preview) preview.classList.add('hidden');
            resetIdleTimer();
        } else {
            showPreview();
        }
    } else {
        sessionStorage.setItem('user_active', 'true');
        resetIdleTimer();
    }

    const mapLink = document.querySelector('.nav-btns a[href="index.html"], .nav-btns a[href="/"]');
    if (mapLink) {
        mapLink.addEventListener('click', function() {
            sessionStorage.setItem('user_active', 'true');
        });
    }

    document.addEventListener('click', function (e) {
        resetIdleTimer();

        const isInsideRoom = e.target.closest('.room-group');
        const isInsidePath = e.target.closest('.path-to-room');
        const isInsideMenu = e.target.closest('.menu-item');

        if (!isInsideRoom && !isInsidePath && !isInsideMenu) {
            deactivateAll();
        }
    });

    rooms.forEach((room, index) => {
        room.addEventListener('click', function (e) {
            e.stopPropagation();
            activateElement(index);
        });
    });

    menuItems.forEach((item, index) => {
        item.addEventListener('click', function (e) {
            e.stopPropagation();
            activateElement(index);
        });
    });

    closeBtns.forEach((btn, index) => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            info[index].classList.remove('active');
            if (rooms[index]) rooms[index].classList.remove('active');
            if (paths[index]) paths[index].classList.remove('active');
            if (menuItems[index]) menuItems[index].classList.remove('active');
        });
    });
});
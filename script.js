// Matrix Rain Effect
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?";
const matrixArray = matrix.split("");

const fontSize = 14;
const columns = canvas.width / fontSize;

const drops = [];
for (let x = 0; x < columns; x++) {
    drops[x] = Math.random() * 100;
}

function drawMatrix() {
    ctx.fillStyle = 'rgba(10, 14, 39, 0.04)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00d9ff';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillStyle = `rgba(0, 217, 255, ${Math.random() * 0.5 + 0.2})`;
        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 35);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const newColumns = canvas.width / fontSize;
    drops.length = 0;
    for (let x = 0; x < newColumns; x++) {
        drops[x] = Math.random() * 100;
    }
});

// Window Management System
class WindowManager {
    constructor() {
        this.windows = new Map();
        this.zIndexCounter = 1000;
        this.windowTemplates = {
            about: document.getElementById('aboutWindow'),
            projects: document.getElementById('projectsWindow'),
            skills: document.getElementById('skillsWindow'),
            experience: document.getElementById('experienceWindow'),
            education: document.getElementById('educationWindow'),
            certificates: document.getElementById('certificatesWindow'),
            'certificate-viewer': document.getElementById('certificateViewerWindow'),
            contact: document.getElementById('contactWindow'),
            terminal: document.getElementById('terminalWindow'),
            game: document.getElementById('gameWindow'),
            paint: document.getElementById('paintWindow'),
            music: document.getElementById('musicWindow')
        };
        this.init();
    }

    init() {
        this.setupDesktopIcons();
        this.setupStartMenu();
        this.setupTaskbar();
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);

        const refitAll = () => {
            this.windows.forEach((el) => this.constrainWindowToViewport(el));
        };
        window.addEventListener('resize', refitAll);
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', refitAll);
        }
    }

    viewportWidth() {
        const inner = window.innerWidth;
        const vv = window.visualViewport?.width;
        if (vv == null || Number.isNaN(vv)) return inner;
        if (inner > vv + 32) return vv;
        return inner;
    }

    viewportHeight() {
        const inner = window.innerHeight;
        const vv = window.visualViewport?.height;
        if (vv == null || Number.isNaN(vv)) return inner;
        if (inner > vv + 48) return vv;
        return inner;
    }

    constrainWindowToViewport(windowElement) {
        if (!windowElement || windowElement.classList.contains('maximized')) return;

        const margin = 12;
        const innerW = window.innerWidth;
        const innerH = window.innerHeight;
        const vv = window.visualViewport;
        const useVisual = vv && innerW > vv.width + 32;

        const vw = useVisual ? vv.width : innerW;
        const vh = (useVisual ? vv.height : innerH) - 50;

        if (vw < 280) return;

        if (useVisual) {
            const maxW = Math.max(240, vw - margin * 2);
            windowElement.style.maxWidth = `${maxW}px`;
            const rect = windowElement.getBoundingClientRect();
            if (rect.width > maxW) {
                windowElement.style.width = `${maxW}px`;
            }
        } else {
            windowElement.style.removeProperty('max-width');
            windowElement.style.removeProperty('width');
        }

        const r = windowElement.getBoundingClientRect();
        const w = r.width;
        const h = r.height;

        let left = parseFloat(windowElement.style.left);
        let top = parseFloat(windowElement.style.top);
        if (Number.isNaN(left)) left = r.left;
        if (Number.isNaN(top)) top = r.top;

        const maxLeft = Math.max(margin, vw - w - margin);
        const maxTop = Math.max(margin, vh - h - margin);

        windowElement.style.left = `${Math.min(Math.max(margin, left), maxLeft)}px`;
        windowElement.style.top = `${Math.min(Math.max(margin, top), maxTop)}px`;
    }

    setupDesktopIcons() {
        document.querySelectorAll('.desktop-icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                const windowType = icon.dataset.window;
                this.openWindow(windowType);
            });
        });
    }

    setupStartMenu() {
        const startButton = document.getElementById('startButton');
        const startMenu = document.getElementById('startMenu');

        startButton.addEventListener('click', (e) => {
            e.stopPropagation();
            startMenu.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!startMenu.contains(e.target) && !startButton.contains(e.target)) {
                startMenu.classList.remove('active');
            }
        });

        document.querySelectorAll('.start-menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const windowType = item.dataset.window;
                this.openWindow(windowType);
                startMenu.classList.remove('active');
            });
        });
    }

    setupTaskbar() {
        // Taskbar apps will be added dynamically when windows open
    }

    openWindow(windowType) {
        // Check if window already exists
        if (this.windows.has(windowType)) {
            const existingWindow = this.windows.get(windowType);
            if (existingWindow.classList.contains('minimized')) {
                this.restoreWindow(windowType);
            }
            this.focusWindow(windowType);
            return;
        }

        // Get template
        const template = this.windowTemplates[windowType];
        if (!template) return;

        // Clone template
        const windowElement = template.content.cloneNode(true).querySelector('.window');
        const windowsContainer = document.querySelector('.windows-container');
        const offset = this.windows.size * 30;

        windowElement.style.zIndex = this.zIndexCounter++;
        windowsContainer.appendChild(windowElement);

        // Posisi pas di tengah layar (setelah di-render agar dapat ukuran asli)
        const rect = windowElement.getBoundingClientRect();
        const taskbarH = 50;
        const vh = this.viewportHeight();
        const vw = this.viewportWidth();
        const centerTop = (vh - taskbarH - rect.height) / 2;
        const topPos = Math.max(30, centerTop);
        const leftPos = (vw - rect.width) / 2 + offset;
        windowElement.style.left = `${Math.max(20, leftPos)}px`;
        windowElement.style.top = `${topPos}px`;
        this.windows.set(windowType, windowElement);
        this.constrainWindowToViewport(windowElement);

        // Setup window controls
        this.setupWindowControls(windowElement, windowType);

        // Setup drag
        this.setupDrag(windowElement);

        // Setup game-specific behavior
        if (windowType === 'game') {
            this.setupSnakeGame(windowElement);
        }

        // Setup paint-specific behavior
        if (windowType === 'paint') {
            this.setupPaint(windowElement);
        }

        // Setup projects window (klik kartu buka jendela detail)
        if (windowType === 'projects') {
            this.setupExplorer(windowElement);
            this.setupProjectFiles(windowElement);
        }

        if (windowType === 'certificates') {
            this.setupCertificates(windowElement);
        }

        // Setup music window
        if (windowType === 'music') {
            this.setupMusic(windowElement);
        }

        if (windowType === 'experience') {
            this.setupEvidenceViewer(windowElement);
        }

        // Add to taskbar
        this.addToTaskbar(windowType);

        // Focus window
        this.focusWindow(windowType);

        // Initialize terminal if terminal window
        if (windowType === 'terminal') {
            setTimeout(() => this.initTerminalTyping(windowElement), 200);
        }
    }

    setupWindowControls(windowElement, windowType) {
        const header = windowElement.querySelector('.window-header');
        const minimizeBtn = windowElement.querySelector('.window-btn.minimize');
        const maximizeBtn = windowElement.querySelector('.window-btn.maximize');
        const closeBtn = windowElement.querySelector('.window-btn.close');

        minimizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.minimizeWindow(windowType);
        });

        maximizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMaximize(windowType);
        });

        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeWindow(windowType);
        });
    }

    setupDrag(windowElement) {
        const header = windowElement.querySelector('.window-header');
        if (!header) return;

        let dragging = false;
        let activePointerId = null;
        let startX;
        let startY;
        let origLeft;
        let origTop;

        const readPos = () => {
            const st = windowElement.style;
            let left = parseFloat(st.left);
            let top = parseFloat(st.top);
            if (Number.isNaN(left) || Number.isNaN(top)) {
                const r = windowElement.getBoundingClientRect();
                left = r.left;
                top = r.top;
            }
            return { left, top };
        };

        const onPointerMove = (e) => {
            if (!dragging || e.pointerId !== activePointerId) return;
            if (windowElement.classList.contains('maximized')) return;
            e.preventDefault();

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            const rect = windowElement.getBoundingClientRect();
            const vw = this.viewportWidth();
            const vh = this.viewportHeight() - 50;

            let newLeft = origLeft + dx;
            let newTop = origTop + dy;
            const maxX = Math.max(0, vw - rect.width);
            const maxY = Math.max(0, vh - rect.height);

            newLeft = Math.max(0, Math.min(newLeft, maxX));
            newTop = Math.max(0, Math.min(newTop, maxY));

            windowElement.style.left = `${newLeft}px`;
            windowElement.style.top = `${newTop}px`;
        };

        const endDrag = () => {
            if (!dragging) return;
            dragging = false;
            if (activePointerId != null) {
                try {
                    header.releasePointerCapture(activePointerId);
                } catch (_) {}
                activePointerId = null;
            }
        };

        header.addEventListener('pointerdown', (e) => {
            if (windowElement.classList.contains('maximized')) return;
            if (e.pointerType === 'mouse' && e.button !== 0) return;
            if (e.target.closest('.window-controls')) return;

            dragging = true;
            activePointerId = e.pointerId;
            try {
                header.setPointerCapture(e.pointerId);
            } catch (_) {}

            startX = e.clientX;
            startY = e.clientY;
            const pos = readPos();
            origLeft = pos.left;
            origTop = pos.top;

            const id = windowElement.dataset.windowId;
            if (id) this.focusWindow(id);
        });

        header.addEventListener('pointermove', onPointerMove);
        header.addEventListener('pointerup', endDrag);
        header.addEventListener('pointercancel', endDrag);
    }

    minimizeWindow(windowType) {
        const windowElement = this.windows.get(windowType);
        if (windowElement) {
            windowElement.classList.add('minimized');
            this.updateTaskbarApp(windowType, false);
        }
    }

    restoreWindow(windowType) {
        const windowElement = this.windows.get(windowType);
        if (windowElement) {
            windowElement.classList.remove('minimized');
            this.updateTaskbarApp(windowType, true);
            this.focusWindow(windowType);
        }
    }

    toggleMaximize(windowType) {
        const windowElement = this.windows.get(windowType);
        if (windowElement) {
            windowElement.classList.toggle('maximized');
        }
    }

    closeWindow(windowType) {
        const windowElement = this.windows.get(windowType);
        if (windowElement) {
            if (windowElement._slideshowTimer) {
                clearInterval(windowElement._slideshowTimer);
                windowElement._slideshowTimer = null;
            }
            windowElement.remove();
            this.windows.delete(windowType);
            this.removeFromTaskbar(windowType);
        }
    }

    focusWindow(windowType) {
        const windowElement = this.windows.get(windowType);
        if (windowElement && !windowElement.classList.contains('minimized')) {
            windowElement.style.zIndex = this.zIndexCounter++;
            this.updateTaskbarApp(windowType, true);

            if (windowType === 'terminal') {
                const input = windowElement.querySelector('#terminal-input');
                if (input && window.matchMedia('(pointer: fine)').matches) {
                    requestAnimationFrame(() => input.focus({ preventScroll: true }));
                }
            }
        }
    }

    addToTaskbar(windowType) {
        const taskbarApps = document.getElementById('taskbarApps');
        const appButton = document.createElement('div');
        appButton.className = 'taskbar-app';
        appButton.dataset.windowType = windowType;
        appButton.innerHTML = `
            <span>${this.getWindowTitle(windowType)}</span>
        `;
        
        appButton.addEventListener('click', () => {
            const windowElement = this.windows.get(windowType);
            if (windowElement && windowElement.classList.contains('minimized')) {
                this.restoreWindow(windowType);
            } else {
                this.focusWindow(windowType);
            }
        });

        taskbarApps.appendChild(appButton);
    }

    removeFromTaskbar(windowType) {
        const appButton = document.querySelector(`.taskbar-app[data-window-type="${windowType}"]`);
        if (appButton) {
            appButton.remove();
        }
    }

    updateTaskbarApp(windowType, isActive) {
        const appButton = document.querySelector(`.taskbar-app[data-window-type="${windowType}"]`);
        if (appButton) {
            if (isActive) {
                document.querySelectorAll('.taskbar-app').forEach(btn => btn.classList.remove('active'));
                appButton.classList.add('active');
            } else {
                appButton.classList.remove('active');
            }
        }
    }

    getWindowTitle(windowType) {
        const titles = {
            about: 'About Me',
            projects: 'Projects',
            skills: 'Skills',
            experience: 'Experience',
            education: 'Pendidikan',
            certificates: 'Sertifikat',
            contact: 'Contact',
            terminal: 'Terminal',
            game: 'Snake Game',
            paint: 'Paint',
            music: 'Music',
            'project-detail': 'Project Detail',
            'certificate-viewer': 'Sertifikat'
        };
        return titles[windowType] || windowType;
    }

    setupSnakeGame(windowElement) {
        const canvas = windowElement.querySelector('#snakeCanvas');
        const scoreEl = windowElement.querySelector('#snakeScore');
        const bestEl = windowElement.querySelector('#snakeBest');
        const overlay = windowElement.querySelector('#snakeOverlay');
        const statusEl = windowElement.querySelector('#snakeStatus');
        const restartBtn = windowElement.querySelector('#snakeRestart');

        if (!canvas || !scoreEl || !bestEl || !overlay || !statusEl || !restartBtn) return;

        const ctx = canvas.getContext('2d');
        const gridSize = 20;
        const tileCount = canvas.width / gridSize;

        let snake = [{ x: 10, y: 10 }];
        let direction = { x: 1, y: 0 };
        let nextDirection = { x: 1, y: 0 };
        let food = this.randomFood(tileCount, snake);
        let score = 0;
        let best = parseInt(localStorage.getItem('snakeBestScore') || '0', 10);
        let gameLoopId = null;
        let isRunning = false;

        bestEl.textContent = best;
        scoreEl.textContent = score;

        const drawCell = (x, y, color) => {
            ctx.fillStyle = color;
            ctx.fillRect(x * gridSize, y * gridSize, gridSize - 2, gridSize - 2);
        };

        const draw = () => {
            ctx.fillStyle = '#050817';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw food
            drawCell(food.x, food.y, '#22c55e');

            // Draw snake
            snake.forEach((segment, index) => {
                const color = index === 0 ? '#0ea5e9' : '#38bdf8';
                drawCell(segment.x, segment.y, color);
            });
        };

        const tick = () => {
            direction = nextDirection;
            const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

            // Wall collision
            if (head.x < 0 || head.y < 0 || head.x >= tileCount || head.y >= tileCount) {
                return gameOver();
            }

            // Self collision
            if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
                return gameOver();
            }

            snake.unshift(head);

            // Food
            if (head.x === food.x && head.y === food.y) {
                score += 10;
                scoreEl.textContent = score;
                if (score > best) {
                    best = score;
                    bestEl.textContent = best;
                    localStorage.setItem('snakeBestScore', String(best));
                }
                food = this.randomFood(tileCount, snake);
            } else {
                snake.pop();
            }

            draw();
        };

        const startGame = () => {
            if (isRunning) return;
            isRunning = true;
            overlay.style.display = 'none';
            score = 0;
            scoreEl.textContent = score;
            snake = [{ x: 10, y: 10 }];
            direction = { x: 1, y: 0 };
            nextDirection = { x: 1, y: 0 };
            food = this.randomFood(tileCount, snake);
            draw();
            if (gameLoopId) clearInterval(gameLoopId);
            gameLoopId = setInterval(tick, 120);
        };

        const gameOver = () => {
            isRunning = false;
            if (gameLoopId) clearInterval(gameLoopId);
            overlay.style.display = 'flex';
            statusEl.textContent = 'Game Over - Tekan Restart untuk bermain lagi';
        };

        const handleKey = (e) => {
            if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
            e.preventDefault();
            if (!isRunning) {
                startGame();
            }
            if (e.key === 'ArrowUp' && direction.y !== 1) {
                nextDirection = { x: 0, y: -1 };
            } else if (e.key === 'ArrowDown' && direction.y !== -1) {
                nextDirection = { x: 0, y: 1 };
            } else if (e.key === 'ArrowLeft' && direction.x !== 1) {
                nextDirection = { x: -1, y: 0 };
            } else if (e.key === 'ArrowRight' && direction.x !== -1) {
                nextDirection = { x: 1, y: 0 };
            }
        };

        restartBtn.addEventListener('click', () => {
            statusEl.textContent = 'Press any arrow key to start';
            overlay.style.display = 'flex';
            isRunning = false;
            if (gameLoopId) clearInterval(gameLoopId);
            snake = [{ x: 10, y: 10 }];
            direction = { x: 1, y: 0 };
            nextDirection = { x: 1, y: 0 };
            food = this.randomFood(tileCount, snake);
            score = 0;
            scoreEl.textContent = score;
            draw();
        });

        window.addEventListener('keydown', handleKey);

        // initial draw
        draw();
    }

    randomFood(tileCount, snake) {
        while (true) {
            const x = Math.floor(Math.random() * tileCount);
            const y = Math.floor(Math.random() * tileCount);
            if (!snake.some(segment => segment.x === x && segment.y === y)) {
                return { x, y };
            }
        }
    }

    setupPaint(windowElement) {
        const canvas = windowElement.querySelector('#paintCanvas');
        const colorsContainer = windowElement.querySelector('#paintColors');
        const clearButton = windowElement.querySelector('#paintClear');

        if (!canvas || !colorsContainer || !clearButton) return;

        const ctx = canvas.getContext('2d');
        let drawing = false;
        let lastX = 0;
        let lastY = 0;
        let currentColor = '#ffffff';
        const lineWidth = 4;

        const getCanvasPos = (clientX, clientY) => {
            const rect = canvas.getBoundingClientRect();
            return {
                x: ((clientX - rect.left) / rect.width) * canvas.width,
                y: ((clientY - rect.top) / rect.height) * canvas.height
            };
        };

        const startDraw = (x, y) => {
            drawing = true;
            ({ x: lastX, y: lastY } = getCanvasPos(x, y));
        };

        const draw = (x, y) => {
            if (!drawing) return;
            const pos = getCanvasPos(x, y);
            ctx.strokeStyle = currentColor;
            ctx.lineWidth = lineWidth;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
            lastX = pos.x;
            lastY = pos.y;
        };

        const stopDraw = () => {
            drawing = false;
        };

        canvas.addEventListener('mousedown', (e) => startDraw(e.clientX, e.clientY));
        canvas.addEventListener('mousemove', (e) => draw(e.clientX, e.clientY));
        window.addEventListener('mouseup', stopDraw);

        canvas.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startDraw(touch.clientX, touch.clientY);
        }, { passive: true });

        canvas.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            draw(touch.clientX, touch.clientY);
        }, { passive: true });

        canvas.addEventListener('touchend', stopDraw);
        canvas.addEventListener('touchcancel', stopDraw);

        colorsContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.paint-color');
            if (!btn) return;
            currentColor = btn.dataset.color || '#ffffff';
            colorsContainer.querySelectorAll('.paint-color').forEach(el => el.classList.remove('is-active'));
            btn.classList.add('is-active');
        });

        clearButton.addEventListener('click', () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });

        // initial background
        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    setupExplorer(windowElement) {
        const navItems = windowElement.querySelectorAll('.explorer-item');
        const simpleView = windowElement.querySelector('#explorerSimpleView');
        const projectsView = windowElement.querySelector('#explorerProjectsView');
        const simpleTitle = windowElement.querySelector('#explorerMainTitle');
        const simpleBody = windowElement.querySelector('#explorerMainBody');
        if (!navItems.length || !simpleView || !projectsView) return;

        const sectionContent = {
            skills: {
                title: 'Skills',
                body: 'Ringkasan skill utama saya: JavaScript/TypeScript, React, Node.js, Python, dan dasar Machine Learning & AI.'
            },
            about: {
                title: 'About',
                body: 'Sedikit cerita tentang saya sebagai Web Developer & AI Engineer yang suka bereksperimen dengan teknologi baru.'
            },
            contact: {
                title: 'Contact',
                body: 'Hubungi saya untuk kolaborasi, freelance, atau diskusi seputar web development dan AI.'
            }
        };

        const activateProjectsView = () => {
            projectsView.style.display = 'block';
            simpleView.style.display = 'none';
        };

        const activateSimpleView = (key) => {
            projectsView.style.display = 'none';
            simpleView.style.display = 'block';
            const data = sectionContent[key];
            if (data && simpleTitle && simpleBody) {
                simpleTitle.textContent = data.title;
                simpleBody.textContent = data.body;
            }
        };

        navItems.forEach(btn => {
            btn.addEventListener('click', () => {
                navItems.forEach(i => i.classList.remove('is-active'));
                btn.classList.add('is-active');

                const section = btn.dataset.section;
                if (section === 'projects') {
                    activateProjectsView();
                } else {
                    activateSimpleView(section);
                }
            });
        });

        // default: tampilkan projects view (galeri kartu project)
        activateProjectsView();
    }

    setupProjectFiles(windowElement) {
        windowElement.querySelectorAll('.project-file-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const projectId = btn.dataset.project;
                if (projectId) this.openProjectDetail(projectId);
            });
        });
    }

    openProjectDetail(projectId) {
        const PROJECT_DATA = {
            diabetic_retinopathy: {
                title: 'Diabetic Retinopathy Detection',
                fullDesc: 'Mengembangkan sistem end-to-end untuk deteksi Diabetic Retinopathy menggunakan model CNN (EfficientNet dan DenseNet), mulai dari preprocessing data, pelatihan, hingga evaluasi performa. Sistem diintegrasikan ke dalam website berbasis web yang memungkinkan pengguna mengunggah citra retina dan memperoleh hasil prediksi secara real-time.',
                images: ['projects/DR.png', 'projects/DR2.png', 'projects/DR3.jpg', 'projects/DR4.jpg'],
                tech: ['Python', 'PyTorch', 'EfficientNet', 'DenseNet', 'Flask', 'HTML', 'CSS', 'JavaScript']
            },
            odigi: {
                title: 'Website Odigi (OTW DIGITAL)',
                fullDesc: 'Mengembangkan sistem keuangan berbasis web menggunakan Laravel untuk digitalisasi proses peminjaman dan pengajuan pinjaman. Sistem ini meningkatkan efisiensi operasional melalui pencatatan otomatis, monitoring real-time, serta pelaporan yang transparan dan terstruktur, sekaligus mengoptimalkan UI/UX untuk pengalaman pengguna yang lebih baik.',
                images: ['projects/Odigi.png', 'projects/Odigi2.png', 'projects/Odigi3.png', 'projects/Odigi4.png'],
                tech: ['Laravel', 'PHP', 'MySQL', 'HTML', 'CSS', 'JavaScript']
            },
            chatbot: {
                title: 'AI Chatbot Gym',
                fullDesc: 'Chatbot berbasis NLP yang dibangun menggunakan model DialoGPT-large dan di-fine-tune dengan dataset khusus domain fitness. Model ini mampu memahami konteks percakapan dan menghasilkan respons yang relevan terkait workout, latihan, dan kesehatan. Implementasi mencakup preprocessing data, fine-tuning model transformer, serta deployment chatbot berbasis web untuk interaksi real-time.',
                images: ['projects/Chatbot.png', 'projects/Chatbot2.png', 'projects/Chatbot3.png'],
                tech: ['Python', 'Hugging Face Transformers', 'PyTorch', 'DialoGPT-large (fine-tuned)','FastAPI (backend API)','HTML, CSS, JavaScript (frontend)']
            },
            predict: {
                title: 'Perjalanan Prediksi Kemacetan Taksi dengan Decision Tree',
                fullDesc: 'Membangun sistem prediksi perjalanan taksi menggunakan algoritma Decision Tree untuk menganalisis pola rute, waktu tempuh, dan estimasi biaya akibat kemacetan. Proyek ini memanfaatkan data perjalanan taksi untuk memprediksi durasi perjalanan berdasarkan faktor seperti lokasi penjemputan, tujuan, waktu keberangkatan, kondisi lalu lintas, dan jarak tempuh. Hasil prediksi divisualisasikan dalam bentuk dashboard interaktif berbasis web yang menampilkan analisis kemacetan, estimasi tarif perjalanan, serta perbandingan biaya pada kondisi lalu lintas normal dan padat. Sistem ini bertujuan membantu pengguna memahami dampak kemacetan terhadap efisiensi perjalanan dan pengeluaran transportasi.',
                images: ['projects/predict1.png', 'projects/predict2.png', 'projects/predict3.png'],
                tech: ['Python', 'Tkinter', 'Pandas', 'Scikit-learn', 'Decision Tree', 'NumPy']
            }
        };

        const data = PROJECT_DATA[projectId];
        if (!data) return;

        const windowId = 'project-detail';
        if (this.windows.has(windowId)) {
            this.closeWindow(windowId);
        }

        const template = document.getElementById('projectDetailWindow');
        if (!template) return;

        const windowElement = template.content.cloneNode(true).querySelector('.window');
        windowElement.dataset.windowId = windowId;

        const descEl = windowElement.querySelector('#projectDetailDesc');
        const techEl = windowElement.querySelector('#projectDetailTech');
        const titleEl = windowElement.querySelector('#projectDetailTitle');
        const imgEl = windowElement.querySelector('#projectSlideshowImg');
        const phEl = windowElement.querySelector('#projectSlideshowPlaceholder');
        const dotsEl = windowElement.querySelector('#projectSlideshowDots');
        const prevBtn = windowElement.querySelector('.slideshow-prev');
        const nextBtn = windowElement.querySelector('.slideshow-next');

        titleEl.textContent = data.title;
        descEl.textContent = data.fullDesc;

        data.tech.forEach(t => {
            const span = document.createElement('span');
            span.textContent = t;
            techEl.appendChild(span);
        });

        const placeholders = { diabetic_retinopathy: '🖥️', odigi: '🖥️', chatbot: '🤖', portfolio: '🖥️' };
        const placeholderEmoji = placeholders[projectId] || '📷';
        const slides = data.images;
        let index = 0;

        const showSlide = (i) => {
            index = (i + slides.length) % slides.length;
            const src = slides[index];
            imgEl.alt = `${data.title} – gambar ${index + 1}`;
            imgEl.hidden = false;
            phEl.hidden = true;
            imgEl.onerror = () => {
                imgEl.hidden = true;
                phEl.hidden = false;
                phEl.textContent = placeholderEmoji;
            };
            imgEl.onload = () => {
                imgEl.hidden = false;
                phEl.hidden = true;
            };
            imgEl.src = src;

            dotsEl.querySelectorAll('.slideshow-dot').forEach((dot, di) => {
                const active = di === index;
                dot.classList.toggle('is-active', active);
                dot.setAttribute('aria-selected', active ? 'true' : 'false');
            });
        };

        slides.forEach((_, di) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'slideshow-dot';
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', `Slide ${di + 1}`);
            dot.addEventListener('click', () => showSlide(di));
            dotsEl.appendChild(dot);
        });

        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showSlide(index - 1);
        });
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showSlide(index + 1);
        });

        showSlide(0);

        const autoplayMs = 5500;
        windowElement._slideshowTimer = setInterval(() => showSlide(index + 1), autoplayMs);

        const container = document.querySelector('.windows-container');
        windowElement.style.zIndex = this.zIndexCounter++;
        container.appendChild(windowElement);

        const rect = windowElement.getBoundingClientRect();
        const taskbarH = 50;
        const vh = this.viewportHeight();
        const vw = this.viewportWidth();
        const centerTop = (vh - taskbarH - rect.height) / 2;
        const topPos = Math.max(24, centerTop);
        const offset = this.windows.size * 24;
        windowElement.style.left = `${Math.max(16, (vw - rect.width) / 2 + offset)}px`;
        windowElement.style.top = `${topPos}px`;

        this.windows.set(windowId, windowElement);
        this.constrainWindowToViewport(windowElement);

        this.setupWindowControls(windowElement, windowId);
        this.setupDrag(windowElement);
        this.addToTaskbar(windowId);
        this.focusWindow(windowId);
    }

    setupCertificates(windowElement) {
        windowElement.querySelectorAll('.cert-link, .cert-card').forEach(btn => {
            btn.addEventListener('click', () => {
                const certId = btn.dataset.cert;
                if (certId) this.openCertificateViewer(certId);
            });
        });
    }

    openCertificateViewer(certId) {
        const CERT_DATA = {
            'cert-HKI': {
                title: 'HKI Sistem Deteksi Dini Retinopati Diabetik Berbasis Website',
                desc: 'Sertifikat Hak Kekayaan Intelektual (HKI) untuk sistem deteksi dini diabetic retinopathy berbasis kecerdasan buatan, yang dirancang untuk membantu identifikasi awal gangguan retina melalui analisis citra medis.',
                link: 'https://drive.google.com/file/d/1QFmr3fvnZuGYRcHHQM97xOcLQY7XCj3_/view?usp=sharing'
            },
            'cert-HKI2': {
                title: 'HKI Buku Panduan Sistem Deteksi Dini Retinopati Diabetik Platform Web',
                desc: 'Sertifikat Hak Kekayaan Intelektual (HKI) untuk buku panduan sistem deteksi dini diabetic retinopathy yang berisi konsep, metode, serta implementasi dalam membantu identifikasi awal gangguan retina.',
                link: 'https://drive.google.com/file/d/1c7ybes6j8GW2eGqq_Rj6E8NYCCcXWWTO/view?usp=sharing'
            },
            'cert-Microsoft': {
                title: 'Sertifikat Microsoft Azure AI Fundamentals',
                desc: 'Sertifikat Microsoft Azure AI Fundamentals yang mencakup pemahaman konsep AI, machine learning, computer vision, natural language processing, serta implementasi layanan AI berbasis cloud menggunakan Microsoft Azure.',
                link: 'https://drive.google.com/file/d/1KnLeAFIYHaZYjcYV47UmpRR_1gjju07G/view?usp=sharing'
            },
            'cert-Pengabdian': {
                title: 'Sertifikat Pengabdian Masyarakat - Pengajar AI',
                desc: 'Sertifikat pengabdian kepada masyarakat sebagai ketua dan pengajar kecerdasan buatan (AI) yang berkontribusi dalam perencanaan, pelaksanaan, serta penyampaian materi edukasi AI kepada siswa sekolah dasar.',
                link: 'https://drive.google.com/file/d/1YgHdGYUKrTyTnadUV3dIgG1CW2sHjVPK/view?usp=drive_link'
            }
        };

        const data = CERT_DATA[certId];
        if (!data) return;

        const windowId = 'certificate-viewer';
        if (this.windows.has(windowId)) {
            this.closeWindow(windowId);
        }

        const template = document.getElementById('certificateViewerWindow');
        if (!template) return;

        const windowElement = template.content.cloneNode(true).querySelector('.window');
        windowElement.dataset.windowId = windowId;

        const titleEl = windowElement.querySelector('#certificateViewerTitle');
        const descEl = windowElement.querySelector('#certificateDesc');
        const linkEl = windowElement.querySelector('#certificateAccessLink');

        titleEl.textContent = data.title;
        descEl.textContent = data.desc || '';
        const accessLink = (data.link && data.link !== '#') ? data.link : data.image;
        linkEl.href = accessLink;
        linkEl.style.display = 'inline-flex';
        linkEl.textContent = 'Akses Sertifikat';

        const container = document.querySelector('.windows-container');
        windowElement.style.zIndex = this.zIndexCounter++;
        container.appendChild(windowElement);

        const rect = windowElement.getBoundingClientRect();
        const taskbarH = 50;
        const vh = this.viewportHeight();
        const vw = this.viewportWidth();
        const centerTop = (vh - taskbarH - rect.height) / 2;
        const topPos = Math.max(24, centerTop);
        const offset = this.windows.size * 24;
        windowElement.style.left = `${Math.max(16, (vw - rect.width) / 2 + offset)}px`;
        windowElement.style.top = `${topPos}px`;

        this.windows.set(windowId, windowElement);
        this.constrainWindowToViewport(windowElement);

        this.setupWindowControls(windowElement, windowId);
        this.setupDrag(windowElement);
        this.addToTaskbar(windowId);
        this.focusWindow(windowId);
    }

    setupEvidenceViewer(windowElement) {
        windowElement.querySelectorAll('.evidence-thumb').forEach(btn => {
            btn.addEventListener('click', () => {
                const title = btn.dataset.viewerTitle || 'Bukti';
                const src = btn.dataset.src;
                if (src) this.openSimpleImageViewer(title, src);
            });
        });
    }

    openSimpleImageViewer(title, src) {
        const windowId = 'certificate-viewer';
        if (this.windows.has(windowId)) {
            this.closeWindow(windowId);
        }

        const template = document.getElementById('certificateViewerWindow');
        if (!template) return;

        const windowElement = template.content.cloneNode(true).querySelector('.window');
        windowElement.dataset.windowId = windowId;

        const titleEl = windowElement.querySelector('#certificateViewerTitle');
        const imgEl = windowElement.querySelector('#certificateImg');
        const phEl = windowElement.querySelector('#certificateImgPlaceholder');
        const descEl = windowElement.querySelector('#certificateDesc');

        titleEl.textContent = title;
        descEl.textContent = '';

        imgEl.alt = title;
        imgEl.hidden = false;
        phEl.hidden = true;
        imgEl.onerror = () => {
            imgEl.hidden = true;
            phEl.hidden = true;
        };
        imgEl.onload = () => {
            imgEl.hidden = false;
            phEl.hidden = true;
        };
        imgEl.src = src;

        const container = document.querySelector('.windows-container');
        windowElement.style.zIndex = this.zIndexCounter++;
        container.appendChild(windowElement);

        const rect = windowElement.getBoundingClientRect();
        const taskbarH = 50;
        const vh = this.viewportHeight();
        const vw = this.viewportWidth();
        const centerTop = (vh - taskbarH - rect.height) / 2;
        const topPos = Math.max(24, centerTop);
        const offset = this.windows.size * 24;
        windowElement.style.left = `${Math.max(16, (vw - rect.width) / 2 + offset)}px`;
        windowElement.style.top = `${topPos}px`;

        this.windows.set(windowId, windowElement);
        this.constrainWindowToViewport(windowElement);
        this.setupWindowControls(windowElement, windowId);
        this.setupDrag(windowElement);
        this.addToTaskbar(windowId);
        this.focusWindow(windowId);
    }

    setupMusic(windowElement) {
        const playBtn = windowElement.querySelector('#musicPlayBtn');
        const volumeRange = windowElement.querySelector('#musicVolume');
        const volumeValue = windowElement.querySelector('#musicVolumeValue');
        const stations = windowElement.querySelectorAll('.music-station');
        const titleEl = windowElement.querySelector('#musicTitle');
        const subtitleEl = windowElement.querySelector('#musicSubtitle');

        if (!playBtn || !volumeRange || !volumeValue || !stations.length || !titleEl || !subtitleEl) return;

        let isPlaying = false;

        playBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;
            playBtn.textContent = isPlaying ? '⏸' : '▶';
        });

        volumeRange.addEventListener('input', () => {
            volumeValue.textContent = `${volumeRange.value}%`;
        });

        stations.forEach(btn => {
            btn.addEventListener('click', () => {
                stations.forEach(s => s.classList.remove('is-active'));
                btn.classList.add('is-active');

                const title = btn.dataset.title;
                const subtitle = btn.dataset.subtitle;
                if (title) titleEl.textContent = title;
                if (subtitle) subtitleEl.textContent = subtitle;
            });
        });
    }

    initTerminalTyping(windowElement) {
        const input = windowElement.querySelector('#terminal-input');
        const output = windowElement.querySelector('.terminal-output');
        if (!input || !output) return;

        const printLine = (text, cssClass = 'output-line') => {
            const p = document.createElement('p');
            p.className = cssClass;
            p.textContent = text;
            output.appendChild(p);
            output.scrollTop = output.scrollHeight;
        };

        const handleCommand = (cmd) => {
            const command = cmd.trim();
            if (!command) return;

            printLine(`$ ${command}`, 'output-line');

            switch (command.toLowerCase()) {
                case 'help':
                    printLine("Perintah tersedia:");
                    printLine("  help   - lihat daftar perintah");
                    printLine("  about  - info singkat tentang kamu");
                    printLine("  skills - ringkasan skill");
                    printLine("  clear  - bersihkan layar");
                    break;
                case 'clear':
                    output.innerHTML = '';
                    break;
                case 'about':
                    printLine("Saya seorang Full Stack Developer yang suka membangun aplikasi modern.");
                    break;
                case 'skills':
                    printLine("Skills: JavaScript, React, Node.js, Python, dan lainnya.");
                    break;
                default:
                    printLine(`Perintah tidak dikenal: ${command}`);
                    printLine("Ketik 'help' untuk melihat perintah.");
            }
        };

        const onInputKeydown = (e) => {
            if (!windowElement.isConnected) {
                input.removeEventListener('keydown', onInputKeydown);
                return;
            }
            if (e.key === 'Enter') {
                e.preventDefault();
                handleCommand(input.value);
                input.value = '';
            }
        };

        input.addEventListener('keydown', onInputKeydown);

        const body = windowElement.querySelector('.terminal-body');
        if (body) {
            body.addEventListener('pointerdown', (e) => {
                if (e.target === input || input.contains(e.target)) return;
                if (e.target.closest('.window-header')) return;
                input.focus({ preventScroll: true });
            });
        }

        const finePointer = window.matchMedia('(pointer: fine)').matches;
        const docKeyHandler = (e) => {
            if (!windowElement.isConnected) {
                document.removeEventListener('keydown', docKeyHandler);
                return;
            }
            if (!finePointer) return;
            const ae = document.activeElement;
            if (ae === input) return;
            if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.tagName === 'SELECT' || ae.isContentEditable) && !ae.closest('.terminal-window')) {
                return;
            }
            const term = this.windows.get('terminal');
            if (!term || term !== windowElement || term.classList.contains('minimized')) return;
            const z = parseInt(term.style.zIndex, 10) || 0;
            let topZ = 0;
            this.windows.forEach((w) => {
                if (!w.classList.contains('minimized')) {
                    topZ = Math.max(topZ, parseInt(w.style.zIndex, 10) || 0);
                }
            });
            if (z < topZ) return;

            if (e.key === 'Enter') {
                e.preventDefault();
                handleCommand(input.value);
                input.value = '';
                return;
            }
            if (e.key === 'Backspace') {
                e.preventDefault();
                input.value = input.value.slice(0, -1);
                return;
            }
            if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                e.preventDefault();
                input.value += e.key;
            }
        };

        if (finePointer) {
            document.addEventListener('keydown', docKeyHandler);
        }
    }

    updateTime() {
        const timeElement = document.getElementById('trayTime');
        if (timeElement) {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            timeElement.textContent = `${hours}:${minutes}`;
        }
    }
}

// Initialize Window Manager
const windowManager = new WindowManager();

// Open welcome terminal on load
window.addEventListener('load', () => {
    setTimeout(() => {
        windowManager.openWindow('terminal');
    }, 500);
});

// Form Submission
document.addEventListener('submit', (e) => {
    if (e.target.classList.contains('contact-form')) {
        e.preventDefault();
        
        const name = e.target.querySelector('#name').value;
        const email = e.target.querySelector('#email').value;
        const message = e.target.querySelector('#message').value;
        
        console.log('Form submitted:', { name, email, message });
        alert('Terima kasih! Pesan Anda telah dikirim. (Ini adalah demo - integrasikan dengan backend untuk fungsi sebenarnya)');
        
        e.target.reset();
    }
});

// Prevent context menu on desktop icons
document.querySelectorAll('.desktop-icon').forEach(icon => {
    icon.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
});

// Add double-click sound effect (optional - visual feedback only)
document.querySelectorAll('.desktop-icon, .start-menu-item').forEach(element => {
    element.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
});

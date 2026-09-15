// Jake Altom Portfolio - Script.js

// Safe Storage Helpers (protects against browser security exceptions in iframes / private mode)
function safeGetStorage(type, key, defaultValue = null) {
    try {
        const storage = type === 'session' ? window.sessionStorage : window.localStorage;
        return storage ? storage.getItem(key) : defaultValue;
    } catch (e) {
        return defaultValue;
    }
}

function safeSetStorage(type, key, value) {
    try {
        const storage = type === 'session' ? window.sessionStorage : window.localStorage;
        if (storage) storage.setItem(key, value);
    } catch (e) {
        // Storage restricted or unavailable
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // --- Entrance Animation Gating ---
    const openingWrapper = document.getElementById('opening-wrapper');
    
    // Check if user came from inside the site
    const isInternalNavigation = document.referrer && document.referrer.includes(window.location.hostname);
    const skipAnimation = isInternalNavigation && safeGetStorage('session', 'portfolio_opened');

    if (openingWrapper && !skipAnimation) {
        openingWrapper.classList.add('opening-up-wrapper', 'opening-up-animate');
        safeSetStorage('session', 'portfolio_opened', 'true');
        setTimeout(() => {
            openingWrapper.classList.remove('opening-up-wrapper', 'opening-up-animate');
        }, 1500);
    }

    // --- Theme Management ---
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = safeGetStorage('local', 'theme', 'light');
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (themeToggle) {
        themeToggle.textContent = currentTheme === 'dark' ? 'LIGHT MODE' : 'DARK MODE';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            let newTheme = theme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            safeSetStorage('local', 'theme', newTheme);
            themeToggle.textContent = newTheme === 'dark' ? 'LIGHT MODE' : 'DARK MODE';
        });
    }

    // --- Robust Reveal System with Progressive Enhancement ---
    // Mark body as JS-ready
    document.body.classList.add('js-loaded');

    const reveals = document.querySelectorAll('.reveal');
    
    // Activate any elements already in or near the viewport immediately
    reveals.forEach(reveal => {
        const rect = reveal.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9) {
            reveal.classList.add('active');
        }
    });

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); 
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: "0px 0px 50px 0px"
        });

        reveals.forEach(reveal => {
            if (!reveal.classList.contains('active')) {
                revealObserver.observe(reveal);
            }
        });
    } else {
        // Fallback for environments without IntersectionObserver
        reveals.forEach(reveal => reveal.classList.add('active'));
    }

    // --- Smooth Anchor Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- Set Active Nav Link ---
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // --- Hobby Tab Switching ---
    const hobbyChips = document.querySelectorAll('.hobby-chips .chip');
    const hobbyPanels = document.querySelectorAll('.hobby-panel');

    if (hobbyChips && hobbyChips.length > 0) {
        hobbyChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const target = chip.getAttribute('data-hobby');
                
                // Update chips
                hobbyChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                
                // Update panels
                hobbyPanels.forEach(panel => {
                    if (panel.id === target) {
                        panel.classList.add('active');
                    } else {
                        panel.classList.remove('active');
                    }
                });
            });
        });
    }

    // --- Neural Network Hero Visualizer ---
    const canvas = document.getElementById('neural-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let dots = [];
        const dotCount = 25; // Decreased count
        const connectionDist = 140; // Increased distance for more visible connections
        
        const initCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            dots = [];
            for (let i = 0; i < dotCount; i++) {
                dots.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.4, // Slightly faster than the last "subtle" fix
                    vy: (Math.random() - 0.5) * 0.4
                });
            }
        };

        let mouse = { x: null, y: null };
        canvas.parentElement.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        canvas.parentElement.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        const drawDots = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const color = isDark ? '76, 175, 80' : '45, 90, 39'; // Primary color in RGB
            
            const activeDots = [...dots];
            if (mouse.x !== null) {
                activeDots.push({ x: mouse.x, y: mouse.y, isMouse: true });
            }

            activeDots.forEach((dot, index) => {
                if (!dot.isMouse) {
                    dot.x += dot.vx;
                    dot.y += dot.vy;

                    if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
                    if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;

                    ctx.beginPath();
                    ctx.arc(dot.x, dot.y, 3, 0, Math.PI * 2); // Bolder dots
                    ctx.fillStyle = `rgba(${color}, 0.8)`; // Stronger color
                    ctx.fill();
                }

                for (let j = index + 1; j < activeDots.length; j++) {
                    const other = activeDots[j];
                    const dx = dot.x - other.x;
                    const dy = dot.y - other.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDist) {
                        ctx.beginPath();
                        ctx.moveTo(dot.x, dot.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.strokeStyle = `rgba(${color}, ${0.8 - dist/connectionDist})`; // Bolder lines
                        ctx.lineWidth = dot.isMouse || other.isMouse ? 2 : 1.5;
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(drawDots);
        };

        initCanvas();
        drawDots();
        window.addEventListener('resize', initCanvas);
    }

    // --- Cognitive Insight Engine ---
    const insightText = document.getElementById('insight-text');
    const insightMeta = document.getElementById('insight-meta');
    
    if (insightText && insightMeta) {
        const insights = [
            { text: "Your brain's working memory can typically hold only 7±2 pieces of information. AI attention mechanisms aim to bypass this bottleneck.", category: "Cognitive Psychology" },
            { text: "Neural networks aren't 'smart'; they're just exceptionally good at high-dimensional pattern matching.", category: "AI Architecture" },
            { text: "The 'Uncanny Valley' occurs when a simulation is almost, but not perfectly, human, triggering a biological avoidance response.", category: "Human-AI Interaction" },
            { text: "Reinforcement Learning is modeled after Operant Conditioning: behaviors followed by rewards are more likely to be repeated.", category: "Behavioral AI" },
            { text: "Heuristics are mental shortcuts that ease cognitive load, often at the cost of accuracy. Modern AI uses similar trade-offs.", category: "Decision Theory" }
        ];

        let currentInsight = 0;
        
        const updateInsight = () => {
            const insight = insights[currentInsight];
            
            // Fade out
            insightText.style.opacity = 0;
            insightMeta.style.opacity = 0;
            
            setTimeout(() => {
                insightText.textContent = `"${insight.text}"`;
                insightMeta.textContent = `Theoretical Focus: ${insight.category}`;
                
                // Fade in
                insightText.style.opacity = 1;
                insightMeta.style.opacity = 1;
                
                currentInsight = (currentInsight + 1) % insights.length;
            }, 500);
        };

        // Initialize display styles for transitions
        insightText.style.transition = 'opacity 0.5s ease-in-out';
        insightMeta.style.transition = 'opacity 0.5s ease-in-out';
        
        // Initial update with delay for effect
        setTimeout(updateInsight, 1000);
        
        // Cycle every 8 seconds
        setInterval(updateInsight, 8000);
    }

    // --- Interactive Constructivist Globe with On-Hover Location Labels ---
    const globeCanvas = document.getElementById('globe-canvas');
    if (globeCanvas) {
        const parent = document.getElementById('globe-parent');
        const context = globeCanvas.getContext('2d');
        let width = parent.offsetWidth;
        let height = parent.offsetHeight;
        const dpr = window.devicePixelRatio || 1;
        
        let world;
        let isDragging = false;
        let rotation = [0, -20];
        let velocity = [0.055, 0];
        let lastTime = Date.now();
        let pauseUntil = 0;
        let mouseX = -1000;
        let mouseY = -1000;

        const projection = d3.geoOrthographic()
            .precision(0.1);
            
        const path = d3.geoPath(projection, context);

        function updateDimensions() {
            width = parent.offsetWidth;
            height = parent.offsetHeight;
            globeCanvas.width = width * dpr;
            globeCanvas.height = height * dpr;
            globeCanvas.style.width = width + 'px';
            globeCanvas.style.height = height + 'px';
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.scale(dpr, dpr);
            
            projection
                .scale((Math.min(width, height) / 2) - 16)
                .translate([width / 2, height / 2]);
        }

        updateDimensions();

        // Mouse hover tracking for interactive dot labels
        globeCanvas.addEventListener('mousemove', (e) => {
            const rect = globeCanvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        });

        globeCanvas.addEventListener('mouseleave', () => {
            mouseX = -1000;
            mouseY = -1000;
            if (!isDragging) parent.style.cursor = 'grab';
        });

        // Click to pause spinning for 4 seconds
        globeCanvas.addEventListener('click', () => {
            pauseUntil = Date.now() + 4000;
        });
        globeCanvas.addEventListener('pointerdown', () => {
            pauseUntil = Date.now() + 4000;
        });

        // Visited locations
        const locations = [
            { lat: 40.4237, lon: -86.9212, name: "Purdue University (West Lafayette, IN)" },
            { lat: 40.5734, lon: -74.7293, name: "Readington, NJ" },
            { lat: -33.8688, lon: 151.2093, name: "Sydney, Australia" },
            { lat: -37.8136, lon: 144.9631, name: "Melbourne, Australia" },
            { lat: -16.4836, lon: 145.4653, name: "Port Douglas, Australia" },
            { lat: -25.3444, lon: 131.0369, name: "Uluru, Australia" },
            { lat: 21.1619, lon: -86.8515, name: "Cancun, Mexico" },
            { lat: 41.9028, lon: 12.4964, name: "Rome, Italy" },
            { lat: 9.9281, lon: -84.0907, name: "Costa Rica" },
            { lat: 18.4655, lon: -66.1057, name: "Puerto Rico" },
            { lat: 18.5601, lon: -68.3725, name: "Punta Cana, Dominican Republic" },
            { lat: 21.3069, lon: -157.8583, name: "Hawaii, USA" },
            { lat: 30.2672, lon: -97.7431, name: "Austin, Texas" },
            { lat: 25.7617, lon: -80.1918, name: "Miami, Florida" },
            { lat: 35.6762, lon: 139.6503, name: "Tokyo, Japan" }
        ];

        // Load map data
        d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(data => {
            world = topojson.feature(data, data.objects.countries);
            startAnimation();
        }).catch(err => {
            console.error("Globe data failed to load:", err);
            world = { type: "FeatureCollection", features: [] };
            startAnimation();
        });

        function startAnimation() {
            function render() {
                const now = Date.now();
                const dt = now - lastTime;
                lastTime = now;

                const isPaused = now < pauseUntil;

                if (!isDragging && !isPaused) {
                    rotation[0] += velocity[0] * dt * 0.1;
                }
                projection.rotate(rotation);

                context.clearRect(0, 0, width, height);
                
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                
                // Constructivist Palette
                const colors = isDark ? {
                    sea: '#080c08',
                    land: '#2D5A27',
                    stroke: 'rgba(76, 175, 80, 0.4)',
                    outline: '#4CAF50',
                    dots: '#cfb991' // Purdue Gold
                } : {
                    sea: '#f0f4f0',
                    land: '#4CAF50',
                    stroke: 'rgba(45, 90, 39, 0.2)',
                    outline: '#2D5A27',
                    dots: '#8E793E' 
                };

                // 1. Sphere background (Sea)
                context.beginPath();
                path({type: 'Sphere'});
                context.fillStyle = colors.sea;
                context.fill();

                // 2. Graticule (Grid lines)
                const graticule = d3.geoGraticule();
                context.beginPath();
                path(graticule());
                context.strokeStyle = colors.stroke;
                context.lineWidth = 0.5;
                context.stroke();

                // 3. Landmasses
                if (world) {
                    context.beginPath();
                    path(world);
                    context.fillStyle = colors.land;
                    context.fill();
                }

                // 4. Globe Outline
                context.beginPath();
                path({type: 'Sphere'});
                context.strokeStyle = colors.outline;
                context.lineWidth = 2;
                context.stroke();

                // 5. Markers (Visited Locations) with Hit Testing
                let hoveredLocation = null;
                const hitRadius = 16;

                locations.forEach(d => {
                    const coord = projection([d.lon, d.lat]);
                    const gdistance = d3.geoDistance([d.lon, d.lat], [-rotation[0], -rotation[1]]);
                    
                    // Only draw if on the visible hemisphere
                    if (gdistance < Math.PI / 2) {
                        if (!coord) return;

                        // Check if hovered
                        const dx = coord[0] - mouseX;
                        const dy = coord[1] - mouseY;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < hitRadius && !isDragging) {
                            hoveredLocation = { ...d, coord };
                        }

                        // Core marker dot
                        context.beginPath();
                        context.arc(coord[0], coord[1], 4, 0, 2 * Math.PI);
                        context.fillStyle = colors.dots;
                        context.fill();
                        context.strokeStyle = "#fff";
                        context.lineWidth = 1;
                        context.stroke();
                        
                        // Pulsing radar effect
                        const pulse = Math.sin(now / 300) * 4 + 6;
                        context.beginPath();
                        context.arc(coord[0], coord[1], pulse, 0, 2 * Math.PI);
                        context.strokeStyle = colors.dots;
                        context.globalAlpha = 0.4;
                        context.stroke();
                        context.globalAlpha = 1.0;
                    }
                });

                // 6. Draw label ONLY for hovered location
                if (hoveredLocation && !isDragging) {
                    parent.style.cursor = 'pointer';
                    const { coord, name } = hoveredLocation;

                    // Highlight hovered dot
                    context.beginPath();
                    context.arc(coord[0], coord[1], 6, 0, 2 * Math.PI);
                    context.fillStyle = colors.dots;
                    context.fill();
                    context.strokeStyle = "#ffffff";
                    context.lineWidth = 2;
                    context.stroke();

                    // Larger ripple
                    const hoverRipple = Math.sin(now / 150) * 4 + 11;
                    context.beginPath();
                    context.arc(coord[0], coord[1], hoverRipple, 0, 2 * Math.PI);
                    context.strokeStyle = colors.dots;
                    context.lineWidth = 1.5;
                    context.globalAlpha = 0.75;
                    context.stroke();
                    context.globalAlpha = 1.0;

                    // Tooltip badge
                    context.font = 'bold 11px var(--font-main), sans-serif';
                    const textMetrics = context.measureText(name);
                    const textWidth = textMetrics.width;
                    const padX = 10;
                    const boxHeight = 24;
                    const boxWidth = textWidth + padX * 2;
                    
                    let boxX = coord[0] + 12;
                    let boxY = coord[1] - 12;
                    
                    // Keep tooltip inside canvas boundaries
                    if (boxX + boxWidth > width - 8) {
                        boxX = coord[0] - boxWidth - 12;
                    }
                    if (boxY < 8) {
                        boxY = 8;
                    }

                    // Connector line from dot to tooltip
                    context.beginPath();
                    context.moveTo(coord[0], coord[1]);
                    context.lineTo(boxX > coord[0] ? boxX : boxX + boxWidth, boxY + boxHeight / 2);
                    context.strokeStyle = colors.outline;
                    context.lineWidth = 1.5;
                    context.stroke();

                    // Tooltip box
                    context.fillStyle = isDark ? '#142612' : '#2D5A27';
                    context.fillRect(boxX, boxY, boxWidth, boxHeight);
                    context.strokeStyle = colors.dots;
                    context.lineWidth = 2;
                    context.strokeRect(boxX, boxY, boxWidth, boxHeight);

                    // Tooltip label text
                    context.fillStyle = '#F8F7F2';
                    context.textBaseline = 'middle';
                    context.fillText(name, boxX + padX, boxY + boxHeight / 2);
                } else if (!isDragging) {
                    parent.style.cursor = 'grab';
                }

                requestAnimationFrame(render);
            }
            render();
        }

        // Drag Interactivity
        d3.select(globeCanvas).call(d3.drag()
            .on('start', () => {
                isDragging = true;
                pauseUntil = Date.now() + 4000;
                parent.style.cursor = 'grabbing';
            })
            .on('drag', (event) => {
                const r = projection.rotate();
                const k = 75 / projection.scale();
                rotation = [r[0] + event.dx * k, r[1] - event.dy * k];
                projection.rotate(rotation);
                pauseUntil = Date.now() + 4000;
            })
            .on('end', () => {
                isDragging = false;
                pauseUntil = Date.now() + 4000;
                parent.style.cursor = 'grab';
                lastTime = Date.now();
            })
        );

        window.addEventListener('resize', updateDimensions);
    }
});

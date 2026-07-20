/**
 * CYBER AWARENESS - Quiz Application Logic
 * Cyber Security Theme with High-Tension Cinematic Synth Music
 */

// Web Audio API Synthesizer for authentic Cyber Sound FX
const CyberSound = {
    ctx: null,
    muted: false,

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        // Force resume in case browser suspended the audio context
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },

    toggleMute() {
        this.muted = !this.muted;
        CyberMusic.setMute(this.muted);
        return this.muted;
    },

    playTone(freq, type, duration, gainStart, gainEnd = 0.001) {
        if (this.muted) return;
        this.init();
        
        try {
            const osc = this.ctx.createOscillator();
            const gainNode = this.ctx.createGain();
            
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            
            gainNode.gain.setValueAtTime(gainStart, this.ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(gainEnd, this.ctx.currentTime + duration);
            
            osc.connect(gainNode);
            gainNode.connect(this.ctx.destination);
            
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {
            console.warn("Audio Context blocked or not supported:", e);
        }
    },

    click() {
        this.playTone(800, 'sine', 0.05, 0.15); 
    },

    tick() {
        this.playTone(300, 'sine', 0.02, 0.08); 
    },

    warning() {
        this.playTone(900, 'square', 0.15, 0.25); 
    },

    correct() {
        const now = this.ctx ? this.ctx.currentTime : 0;
        this.playTone(523.25, 'sine', 0.1, 0.2); // C5
        setTimeout(() => this.playTone(659.25, 'sine', 0.1, 0.2), 80); // E5
        setTimeout(() => this.playTone(783.99, 'sine', 0.2, 0.3), 160); // G5
    },

    wrong() {
        if (this.muted) return;
        this.init();
        try {
            const osc = this.ctx.createOscillator();
            const gainNode = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(220, this.ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(110, this.ctx.currentTime + 0.4);
            gainNode.gain.setValueAtTime(0.3, this.ctx.currentTime); 
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
            osc.connect(gainNode);
            gainNode.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.4);
        } catch (e) {}
    },

    levelComplete() {
        if (this.muted) return;
        this.init();
        try {
            const freqs = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
            freqs.forEach((f, i) => {
                setTimeout(() => {
                    this.playTone(f, 'triangle', 0.6, 0.25);
                }, i * 150);
            });
        } catch (e) {}
    }
};

// Web Audio Suspenseful Background Music Loop Engine (HIGH TENSION & LOUDER)
const CyberMusic = {
    ctx: null,
    isPlaying: false,
    muted: false,
    intervalId: null,

    init() {
        if (!this.ctx) {
            this.ctx = CyberSound.ctx || new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },

    play() {
        this.init();
        if (this.isPlaying || this.muted) return;
        this.isPlaying = true;

        try {
            // High-tension dissonant sequence (extremely harsh sawtooth & square alarms)
            const bassSequence = [73.42, 77.78, 82.41, 77.78]; // D2, D#2, E2, D#2 (Dissonant bass cycle)
            const melodySequence = [1200, 1600, 1800, 2200]; // Piercing high-pitch tones
            let step = 0;

            const playStep = () => {
                if (!this.isPlaying || this.muted) return;
                
                // Play loud, vibrating bass beat - Volume: 0.8 (Sawtooth with high filter cutoff)
                const bassFreq = bassSequence[step % bassSequence.length];
                this.playSynthNote(bassFreq, 'sawtooth', 0.35, 0.8, 400);

                // Play a secondary detuned, dissonant bass oscillator (detuned by 3Hz) to create a disturbing, vibrating pulse
                this.playSynthNote(bassFreq + 3, 'sawtooth', 0.35, 0.8, 400);

                // High-tension screeching siren notes (Play loud square alarm waves frequently)
                if (step % 2 === 0) {
                    const alarmFreq = melodySequence[step % melodySequence.length];
                    this.playSynthNote(alarmFreq, 'square', 0.2, 0.45, 6000); // 0.45 gain, extremely piercing!
                }

                step++;
            };

            playStep();
            this.intervalId = setInterval(playStep, 350); // Ultra-fast heartbeat tempo (350ms)
        } catch (e) {
            console.warn("Could not play music:", e);
        }
    },

    playSynthNote(freq, type, duration, volume, filterFreq = 1000, delay = 0) {
        if (this.muted) return;
        setTimeout(() => {
            if (!this.isPlaying || this.muted) return;
            try {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const filter = this.ctx.createBiquadFilter();

                osc.type = type;
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(filterFreq, this.ctx.currentTime);

                gain.gain.setValueAtTime(volume, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

                osc.connect(filter);
                filter.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start();
                osc.stop(this.ctx.currentTime + duration);
            } catch (err) {}
        }, delay * 1000);
    },

    stop() {
        this.isPlaying = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    },

    setMute(state) {
        this.muted = state;
        if (state) {
            this.stop();
        } else {
            const isQuizActive = document.getElementById("quizSection").classList.contains("active");
            if (isQuizActive) {
                this.play();
            }
        }
    }
};

// 30 cybersecurity questions with dynamically randomized option indices (A, B, C, D uniform sequence)
const QUESTIONS = [
    {
        q: "Apa yang dimaksud dengan Phishing?",
        options: [
            "Teknik mempercepat koneksi internet",
            "Proses membersihkan virus dari komputer",
            "Upaya penipuan untuk mencuri data sensitif melalui pesan/email palsu",
            "Aktivitas membagikan file secara ilegal"
        ],
        answer: 2 // C
    },
    {
        q: "Manakah dari pilihan berikut yang merupakan contoh kata sandi (password) yang PALING KUAT?",
        options: [
            "12345678",
            "password2026",
            "P@55w0rd!",
            "K34m4n4n#S1b3r!2026"
        ],
        answer: 3 // D
    },
    {
        q: "Apa fungsi utama dari Two-Factor Authentication (2FA) / Otentikasi Dua Faktor?",
        options: [
            "Menambah lapisan keamanan tambahan selain password",
            "Mempercepat proses login",
            "Menyimpan password secara otomatis",
            "Mengubah password secara berkala"
        ],
        answer: 0 // A
    },
    {
        q: "Apa yang harus Anda lakukan jika menerima email dari pengirim tak dikenal yang meminta Anda mengklik tautan (link) tertentu?",
        options: [
            "Langsung mengklik link tersebut untuk melihat isinya",
            "Mengabaikan atau melaporkannya sebagai spam/phishing dan tidak mengklik link",
            "Membalas email tersebut untuk bertanya",
            "Meneruskan (forward) email tersebut ke semua teman"
        ],
        answer: 1 // B
    },
    {
        q: "Mengapa disarankan untuk tidak menggunakan jaringan Wi-Fi Publik gratis saat melakukan transaksi perbankan?",
        options: [
            "Wi-Fi publik biasanya sangat lambat",
            "Baterai HP akan lebih cepat habis",
            "Lalu lintas data pada Wi-Fi publik dapat diintersepsi/dilihat oleh peretas (eavesdropping)",
            "Transaksi perbankan akan otomatis ditolak"
        ],
        answer: 2 // C
    },
    {
        q: "Apa yang dimaksud dengan Social Engineering (Rekayasa Sosial)?",
        options: [
            "Teknik meretas server menggunakan koding tingkat tinggi",
            "Cara membuat akun media sosial yang aman",
            "Perbaikan jaringan komputer secara bersama-sama",
            "Manipulasi psikologis terhadap seseorang agar membocorkan informasi rahasia"
        ],
        answer: 3 // D
    },
    {
        q: "Apa tujuan dari perangkat lunak berbahaya yang disebut Ransomware?",
        options: [
            "Mengunci/mengenkripsi data korban dan meminta tebusan uang",
            "Menampilkan iklan berlebihan di layar",
            "Mencuri koneksi Wi-Fi tetangga",
            "Mengabaikan pembaruan sistem operasi"
        ],
        answer: 0 // A
    },
    {
        q: "Manakah tindakan yang tepat ketika Anda harus meninggalkan meja kerja/komputer sebentar?",
        options: [
            "Membiarkan layar tetap terbuka",
            "Mengunci layar komputer (Lock Screen / Win + L)",
            "Mematikan layar monitor saja tanpa mengunci sistem",
            "Meminta rekan kerja menjaga komputer"
        ],
        answer: 1 // B
    },
    {
        q: "Apa ancaman keamanan yang timbul jika Anda menggunakan password yang sama untuk banyak akun berbeda?",
        options: [
            "Anda akan mudah lupa password",
            "Sistem akan otomatis memblokir akun Anda",
            "Jika satu akun bocor, semua akun lainnya ikut terancam (Credential Stuffing)",
            "Koneksi internet menjadi lambat"
        ],
        answer: 2 // C
    },
    {
        q: "Mengapa melakukan update/pembaruan perangkat lunak (software) secara berkala itu penting?",
        options: [
            "Agar tampilan aplikasi selalu berubah",
            "Menghapus semua data lama",
            "Memperbesar kapasitas penyimpanan perangkat",
            "Menutup celah keamanan (vulnerability) yang ditemukan pada versi sebelumnya"
        ],
        answer: 3 // D
    },
    {
        q: "Apa yang dimaksud dengan kode OTP (One-Time Password)?",
        options: [
            "Kode verifikasi sekali pakai yang bersifat rahasia dan berlaku singkat",
            "Kata sandi rahasia yang digunakan selamanya",
            "Nama pengguna unik pada aplikasi",
            "Nomor seri pada kartu SIM"
        ],
        answer: 0 // A
    },
    {
        q: "Bolehkah Anda membagikan kode OTP kepada petugas/panggilan yang mengaku dari pihak bank/instansi resmi?",
        options: [
            "Boleh, jika petugas tersebut bersikap sopan",
            "TIDAK PERNAH, kode OTP adalah rahasia pribadi yang tidak boleh diberikan kepada siapa pun",
            "Boleh, jika diminta untuk keperluan verifikasi data",
            "Boleh, asal melalui pesan WhatsApp"
        ],
        answer: 1 // B
    },
    {
        q: "Apa risiko utama dari mengunggah foto dokumen pribadi (seperti KTP/SIM/Paspor) ke media sosial?",
        options: [
            "Foto akan terhapus secara otomatis",
            "Kualitas foto akan menurun",
            "Penyalahgunaan data pribadi untuk penipuan atau pinjaman online ilegal (Identity Theft)",
            "Akun media sosial akan diblokir"
        ],
        answer: 2 // C
    },
    {
        q: "Apa arti dari tanda gembok atau awalan https:// pada alamat website?",
        options: [
            "Website tersebut bebas dari seluruh jenis virus",
            "Website tersebut milik pemerintah",
            "Website tidak bisa diakses orang lain",
            "Komunikasi data antara browser dan website telah terenkripsi secara aman"
        ],
        answer: 3 // D
    },
    {
        q: "Apa risiko mengunduh aplikasi/software dari sumber tidak resmi (aplikasi bajakan/MOD)?",
        options: [
            "Perangkat rentan terinfeksi malware atau trojan yang disisipkan di aplikasi",
            "Aplikasi berjalan lebih cepat",
            "Menghemat kuota internet",
            "Garansi HP akan bertambah"
        ],
        answer: 0 // A
    },
    {
        q: "Istilah Malware merupakan singkatan dari...",
        options: [
            "Malicious Hardware",
            "Malicious Software",
            "Maximum Ware",
            "Main Network Software"
        ],
        answer: 1 // B
    },
    {
        q: "Apa fungsi dari program Antivirus pada komputer/HP?",
        options: [
            "Mengatur kecerahan layar",
            "Mempercepat unduhan file",
            "Mendeteksi, mencegah, dan menghapus perangkat lunak berbahaya",
            "Mengatur jadwal kegiatan harian"
        ],
        answer: 2 // C
    },
    {
        q: "Ketika Anda menerima pesan singkat (SMS/WA) berisi hadiah ratusan juta rupiah yang menyertakan link, tindakan terbaik adalah...",
        options: [
            "Mengklik link untuk klaim hadiah",
            "Mengirimkan uang administrasi yang diminta",
            "Meneruskan pesan ke keluarga",
            "Mengabaikan, memblokir nomor, dan tidak mengklik link apapun"
        ],
        answer: 3 // D
    },
    {
        q: "Mengapa Backup (pencadangan) data secara berkala sangat penting dilakukan?",
        options: [
            "Agar data tetap aman dan bisa dipulihkan jika perangkat rusak, hilang, atau terkena ransomware",
            "Agar memori internal cepat penuh",
            "Agar orang lain bisa membaca data kita",
            "Karena diwajibkan oleh penyedia koneksi internet"
        ],
        answer: 0 // A
    },
    {
        q: "Apa yang dimaksud dengan Shoulder Surfing?",
        options: [
            "Menatap layar komputer terlalu dekat",
            "Mengintip layar atau papan ketik seseorang secara langsung untuk mencuri informasi rahasia (seperti PIN/password)",
            "Berbagi layar komputer melalui aplikasi meeting",
            "Menggunakan komputer di ruang terbuka"
        ],
        answer: 1 // B
    },
    {
        q: "Media fisik berikut yang berpotensi menyebarkan malware jika dicolokkan ke komputer sembarangan adalah...",
        options: [
            "Kabel HDMI",
            "Kabel daya/charger dinding",
            "USB Flashdisk yang ditemukan di tempat umum",
            "Kartu garansi"
        ],
        answer: 2 // C
    },
    {
        q: "Mengapa memasang kunci layar (PIN, Pattern, atau Biometrik) di smartphone itu wajib?",
        options: [
            "Agar smartphone terlihat lebih keren",
            "Menghemat penggunaan baterai",
            "Meningkatkan sinyal seluler",
            "Mencegah orang tidak berwenang mengakses data pribadi jika HP hilang atau tertinggal"
        ],
        answer: 3 // D
    },
    {
        q: "Apa yang harus dilakukan jika akun media sosial Anda tiba-tiba tidak bisa diakses dan terindikasi diretas?",
        options: [
            "Menggunakan fitur pemicu pemulihan akun (Account Recovery) dan melapor ke pusat bantuan resmi platform",
            "Membiarkannya dan membuat akun baru",
            "Mengunggah status panik dari akun teman",
            "Mematikan koneksi internet rumah"
        ],
        answer: 0 // A
    },
    {
        q: "Manakah di bawah ini yang merupakan ciri-ciri umum pesan Phishing?",
        options: [
            "Menggunakan bahasa formal dan alamat email resmi perusahaan",
            "Menciptakan rasa panik/mendesak, meminta data pribadi, dan menggunakan alamat pengirim yang janggal",
            "Selalu dikirim pada jam kerja",
            "Tidak memiliki lampiran file"
        ],
        answer: 1 // B
    },
    {
        q: "Mengapa tindakan Over-sharing (terlalu banyak membagikan aktivitas pribadi) di media sosial berbahaya?",
        options: [
            "Membuat teman merasa bosan",
            "Mengurangi jumlah pengikut (followers)",
            "Memberikan bahan bagi pelaku rekayasa sosial untuk menyusun skenario penipuan yang meyakinkan",
            "Menghabiskan kapasitas penyimpanan server media sosial"
        ],
        answer: 2 // C
    },
    {
        q: "Apa yang dimaksud dengan istilah Cyberbullying?",
        options: [
            "Kegiatan meretas situs web resmi",
            "Membeli barang ilegal secara online",
            "Membuat program antivirus buatan sendiri",
            "Perundungan, perundungan siber, atau intimidasi yang dilakukan melalui media digital/siber"
        ],
        answer: 3 // D
    },
    {
        q: "Apa yang disarankan jika Anda ingin membuang atau menjual komputer/HP lama?",
        options: [
            "Melakukan Factory Reset (Kembali ke Pengaturan Pabrik) dan menghapus seluruh data secara permanen (Wipe)",
            "Langsung menghapus folder foto saja",
            "Melepas kartu SIM saja",
            "Mengubah password akun"
        ],
        answer: 0 // A
    },
    {
        q: "Apa peran dari Firewall dalam sistem jaringan komputer?",
        options: [
            "Memadamkan api jika perangkat panas",
            "Menyaring dan memantau lalu lintas jaringan yang masuk dan keluar berdasarkan aturan keamanan",
            "Memperbaiki komponen hardware yang rusak",
            "Menyimpan dokumen kantor secara otomatis"
        ],
        answer: 1 // B
    },
    {
        q: "Apa yang dimaksud dengan Data Breach (Kebocoran Data)?",
        options: [
            "Kerusakan fisik pada harddisk",
            "Penurunan kecepatan transfer data",
            "Kejadian di mana data rahasia/pribadi diakses, dicuri, atau diungkap tanpa izin",
            "Penghapusan file secara sengaja oleh pemiliknya"
        ],
        answer: 2 // C
    },
    {
        q: "Siapa yang bertanggung jawab atas keamanan siber di lingkungan organisasi/instansi?",
        options: [
            "Hanya Tim IT / Siber",
            "Hanya Pimpinan Instansi",
            "Pihak penyedia layanan internet (ISP)",
            "Seluruh personil / pengguna yang terhubung ke jaringan instansi"
        ],
        answer: 3 // D
    }
];

// App State Management
const State = {
    user: {
        nama: '',
        pangkat: '',
        nrp: '',
        jabatan: '',
        satuan: ''
    },
    currentQuestionIndex: 0,
    score: 0,
    correctCount: 0,
    wrongCount: 0,
    unansweredCount: 0,
    timer: null,
    timeLeft: 18,
    isMuted: false,

    // Mock Live Leaderboard competitors
    competitors: [
        { name: "Puspen_TNI", satuan: "Mabes TNI", score: 250 },
        { name: "Siber_Polda", satuan: "Polda Metro", score: 230 },
        { name: "Satkom_Lek", satuan: "Kodiklat", score: 210 },
        { name: "Intel_Ops_5", satuan: "BAIS", score: 190 },
        { name: "Reskrim_Siber", satuan: "Bareskrim", score: 180 }
    ],

    reset() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctCount = 0;
        this.wrongCount = 0;
        this.unansweredCount = 0;
        clearInterval(this.timer);
    }
};

let chartInstance = null;

// Initialize components when DOM loads
document.addEventListener("DOMContentLoaded", () => {
    setupFormValidation();
    setupMuteToggle();
    
    // Global User Interaction Audio Unlocker
    const unlockAudio = () => {
        CyberSound.init();
        CyberMusic.init();
        document.body.removeEventListener('click', unlockAudio);
        document.body.removeEventListener('keydown', unlockAudio);
    };
    document.body.addEventListener('click', unlockAudio);
    document.body.addEventListener('keydown', unlockAudio);
});

// Validate registration inputs to enable "Mulai Kuis"
function setupFormValidation() {
    const inputs = ['inputNama', 'inputPangkat', 'inputNrp', 'inputJabatan', 'inputSatuan'];
    const startBtn = document.getElementById("startQuizBtn");
    const regForm = document.getElementById("registrationForm");

    const checkInputs = () => {
        let allFilled = true;
        inputs.forEach(id => {
            const val = document.getElementById(id).value.trim();
            if (!val) allFilled = false;
        });

        if (allFilled) {
            startBtn.classList.remove("disabled");
            startBtn.disabled = false;
        } else {
            startBtn.classList.add("disabled");
            startBtn.disabled = true;
        }
    };

    inputs.forEach(id => {
        document.getElementById(id).addEventListener("input", checkInputs);
    });

    regForm.addEventListener("submit", (e) => {
        e.preventDefault();
        // Save user data
        State.user.nama = document.getElementById("inputNama").value.trim();
        State.user.pangkat = document.getElementById("inputPangkat").value.trim();
        State.user.nrp = document.getElementById("inputNrp").value.trim();
        State.user.jabatan = document.getElementById("inputJabatan").value.trim();
        State.user.satuan = document.getElementById("inputSatuan").value.trim();

        // Switch to Quiz view and initialize audio components
        CyberSound.init();
        CyberSound.click();
        
        // Start background suspense music explicitly
        CyberMusic.setMute(CyberSound.muted);
        CyberMusic.play();

        switchView("quizSection");
        startQuiz();
    });
}

function setupMuteToggle() {
    const muteBtn = document.getElementById("muteBtn");
    const muteIcon = document.getElementById("muteIcon");

    muteBtn.addEventListener("click", () => {
        const isMuted = CyberSound.toggleMute();
        muteIcon.innerHTML = isMuted ? "&#x1F507;" : "&#x1F50A;";
        if (!isMuted) {
            CyberSound.click();
        }
    });
}

// Transition helper between views
function switchView(viewId) {
    document.querySelectorAll(".cyber-section").forEach(sec => {
        sec.classList.remove("active");
    });
    const target = document.getElementById(viewId);
    target.classList.add("active");
    window.scrollTo(0, 0);
}

// Quiz Game Loop
function startQuiz() {
    State.reset();
    initLeaderboardChart();
    loadQuestion();
}

function loadQuestion() {
    if (State.currentQuestionIndex >= QUESTIONS.length) {
        finishQuiz();
        return;
    }

    const currentQ = QUESTIONS[State.currentQuestionIndex];
    
    // Update tracker
    const questionNumStr = String(State.currentQuestionIndex + 1).padStart(2, '0');
    document.getElementById("currentQuestionNum").innerText = questionNumStr;
    
    // Update active score displays
    document.getElementById("activeScore").innerText = State.score;
    document.getElementById("correctMini").innerText = State.correctCount;
    document.getElementById("wrongMini").innerText = State.wrongCount;

    // Update Progress bar width
    const progressPercent = ((State.currentQuestionIndex) / QUESTIONS.length) * 100;
    document.getElementById("progressBarFill").style.width = `${progressPercent}%`;

    // Write Question Text
    document.getElementById("questionText").innerText = currentQ.q;

    // Populate Option Buttons
    const optionsContainer = document.getElementById("optionsContainer");
    optionsContainer.innerHTML = '';

    const markers = ['A', 'B', 'C', 'D'];
    currentQ.options.forEach((optText, index) => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.onclick = () => selectOption(index);
        
        btn.innerHTML = `
            <span class="option-marker">${markers[index]}</span>
            <span class="option-text">${escapeHtml(optText)}</span>
        `;
        optionsContainer.appendChild(btn);
    });

    // Reset and start countdown timer (18 seconds)
    resetTimer();
}

function resetTimer() {
    clearInterval(State.timer);
    State.timeLeft = 18;
    
    const timerText = document.getElementById("timerSeconds");
    const timerBar = document.getElementById("timerBar");
    const timerContainer = document.querySelector(".timer-container");
    
    timerText.innerText = State.timeLeft;
    timerBar.style.strokeDashoffset = 0;
    timerContainer.classList.remove("warning", "danger");

    // 2 * PI * r = 213.6 for strokeDasharray
    const totalDash = 213.6;

    State.timer = setInterval(() => {
        State.timeLeft--;
        timerText.innerText = State.timeLeft;

        // Visual warning updates (scaled for 18 seconds)
        if (State.timeLeft <= 8 && State.timeLeft > 3) {
            timerContainer.classList.add("warning");
            CyberSound.tick();
        } else if (State.timeLeft <= 3) {
            timerContainer.classList.remove("warning");
            timerContainer.classList.add("danger");
            CyberSound.warning();
        } else {
            CyberSound.tick();
        }

        // Set Dashoffset percentage
        const progress = (18 - State.timeLeft) / 18;
        timerBar.style.strokeDashoffset = totalDash * progress;

        if (State.timeLeft <= 0) {
            clearInterval(State.timer);
            handleTimeOut();
        }
    }, 1000);
}

// Option selection handler
function selectOption(selectedIndex) {
    clearInterval(State.timer);
    
    const currentQ = QUESTIONS[State.currentQuestionIndex];
    const optionsContainer = document.getElementById("optionsContainer");
    const optionButtons = optionsContainer.getElementsByClassName("option-btn");
    const overlay = document.getElementById("emojiOverlay");

    // Disable all options immediately to prevent double-click
    for (let btn of optionButtons) {
        btn.classList.add("disabled");
    }

    // Reset overlay state
    overlay.className = "emoji-large-overlay";
    void overlay.offsetWidth; // force reflow

    if (selectedIndex === currentQ.answer) {
        // Correct Answer
        optionButtons[selectedIndex].classList.add("correct");
        optionButtons[selectedIndex].innerHTML += ` <span class="feedback-emoji">👍</span>`;
        
        overlay.innerText = "👍";
        overlay.classList.add("show-correct");
        
        State.score += 10;
        State.correctCount++;
        CyberSound.correct();
    } else {
        // Wrong Answer
        optionButtons[selectedIndex].classList.add("wrong");
        optionButtons[selectedIndex].innerHTML += ` <span class="feedback-emoji">🤪</span>`;
        optionButtons[currentQ.answer].classList.add("correct");
        optionButtons[currentQ.answer].innerHTML += ` <span class="feedback-emoji">👍</span>`;
        
        overlay.innerText = "🤪";
        overlay.classList.add("show-wrong");
        
        State.score = Math.max(0, State.score - 5); // Prevent score from going below 0
        State.wrongCount++;
        CyberSound.wrong();
    }

    // Dynamic mock leaderboard update on each action
    updateLeaderboardRealtime();

    // Small delay to let the user see the answer, then proceed to the next question
    setTimeout(() => {
        overlay.className = "emoji-large-overlay";
        State.currentQuestionIndex++;
        loadQuestion();
    }, 1200);
}

function handleTimeOut() {
    const currentQ = QUESTIONS[State.currentQuestionIndex];
    const optionsContainer = document.getElementById("optionsContainer");
    const optionButtons = optionsContainer.getElementsByClassName("option-btn");
    const overlay = document.getElementById("emojiOverlay");

    // Reset overlay state
    overlay.className = "emoji-large-overlay";
    void overlay.offsetWidth; // force reflow

    // Show correct answer and flag as unanswered
    optionButtons[currentQ.answer].classList.add("correct");
    optionButtons[currentQ.answer].innerHTML += ` <span class="feedback-emoji">👍</span>`;
    
    overlay.innerText = "🤪";
    overlay.classList.add("show-wrong");

    State.unansweredCount++;
    CyberSound.wrong();

    // Disable choices
    for (let btn of optionButtons) {
        btn.classList.add("disabled");
    }

    setTimeout(() => {
        overlay.className = "emoji-large-overlay";
        State.currentQuestionIndex++;
        loadQuestion();
    }, 1200);
}

// Chart.js Live Leaderboard initialization
function initLeaderboardChart() {
    const ctx = document.getElementById('liveLeaderboardChart').getContext('2d');
    
    // Prepare initial data
    const chartData = getLeaderboardData();

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.map(d => d.name),
            datasets: [{
                label: 'Skor Personel',
                data: chartData.map(d => d.score),
                backgroundColor: chartData.map(d => d.isPlayer ? '#39ff14' : '#00f0ff'),
                borderColor: chartData.map(d => d.isPlayer ? '#39ff14' : '#00f0ff'),
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(0, 240, 255, 0.1)' },
                    ticks: { color: '#8a9bb8', font: { family: 'Share Tech Mono' } },
                    suggestedMax: 300
                },
                y: {
                    grid: { display: false },
                    ticks: { color: '#ffffff', font: { family: 'Rajdhani', size: 14 } }
                }
            }
        }
    });
}

// Combine player score and competitors, sort descending
function getLeaderboardData() {
    const playerItem = {
        name: State.user.nama || "Anda",
        satuan: State.user.satuan,
        score: State.score,
        isPlayer: true
    };

    const combined = [...State.competitors, playerItem];
    combined.sort((a, b) => b.score - a.score);
    return combined;
}

// Realtime leaderboard dynamics
function updateLeaderboardRealtime() {
    if (!chartInstance) return;

    // Small random incremental increase to competitors to simulate other players doing the quiz
    State.competitors.forEach(comp => {
        if (Math.random() > 0.4) {
            comp.score += Math.floor(Math.random() * 8) + 2;
        }
    });

    const updatedData = getLeaderboardData();

    chartInstance.data.labels = updatedData.map(d => d.name);
    chartInstance.data.datasets[0].data = updatedData.map(d => d.score);
    chartInstance.data.datasets[0].backgroundColor = updatedData.map(d => d.isPlayer ? '#39ff14' : '#00f0ff');
    chartInstance.data.datasets[0].borderColor = updatedData.map(d => d.isPlayer ? '#39ff14' : '#00f0ff');
    
    chartInstance.update('none'); // Update without full animation to be performant
}

// Finish Quiz: Calculate final standings, display podium, load certificate
function finishQuiz() {
    CyberMusic.stop();
    switchView("resultSection");

    const isPassed = State.correctCount >= 16;
    
    // Adjust competitor scores dynamically to ensure the player stands on the podium (Top 3)
    // and displays their actual name/rank based on score.
    if (State.score >= 250) {
        // Player is 1st Place (Gold)
        State.competitors[0].score = State.score - 15;
        State.competitors[1].score = State.score - 30;
        State.competitors[2].score = State.score - 50;
        State.competitors[3].score = State.score - 70;
        State.competitors[4].score = State.score - 90;
    } else if (State.score >= 150) {
        // Player is 2nd Place (Silver)
        State.competitors[0].score = State.score + 20; // 1st Place
        State.competitors[1].score = State.score - 20; // 3rd Place
        State.competitors[2].score = State.score - 40;
        State.competitors[3].score = State.score - 60;
        State.competitors[4].score = State.score - 80;
    } else {
        // Player is 3rd Place (Bronze)
        State.competitors[0].score = State.score + 40; // 1st Place
        State.competitors[1].score = State.score + 20; // 2nd Place
        State.competitors[2].score = State.score - 15;
        State.competitors[3].score = State.score - 30;
        State.competitors[4].score = State.score - 50;
    }

    // Sort final participants for podium
    const finalStandings = getLeaderboardData();
    
    // Podium top 3
    const p1 = finalStandings[0] || { name: 'Empty', score: 0 };
    const p2 = finalStandings[1] || { name: 'Empty', score: 0 };
    const p3 = finalStandings[2] || { name: 'Empty', score: 0 };

    const formatPodiumName = (p) => {
        if (p.isPlayer) {
            return `${State.user.pangkat} ${p.name.split(' ')[0]} (ANDA)`;
        }
        return p.name;
    };

    document.getElementById("podium1Name").innerText = formatPodiumName(p1);
    document.getElementById("podium1Score").innerText = `${p1.score} Poin`;
    document.getElementById("podium2Name").innerText = formatPodiumName(p2);
    document.getElementById("podium2Score").innerText = `${p2.score} Poin`;
    document.getElementById("podium3Name").innerText = formatPodiumName(p3);
    document.getElementById("podium3Score").innerText = `${p3.score} Poin`;

    // Highlight Player Column
    const col1 = document.getElementById("podiumCol1");
    const col2 = document.getElementById("podiumCol2");
    const col3 = document.getElementById("podiumCol3");
    
    col1.classList.remove("player-highlight");
    col2.classList.remove("player-highlight");
    col3.classList.remove("player-highlight");

    if (p1.isPlayer) col1.classList.add("player-highlight");
    if (p2.isPlayer) col2.classList.add("player-highlight");
    if (p3.isPlayer) col3.classList.add("player-highlight");

    // Fill Certificate Preview
    document.getElementById("certName").innerText = State.user.nama.toUpperCase();
    document.getElementById("certPangkat").innerText = State.user.pangkat;
    document.getElementById("certNrp").innerText = State.user.nrp;
    document.getElementById("certJabatan").innerText = State.user.jabatan;
    document.getElementById("certSatuan").innerText = State.user.satuan;
    document.getElementById("certScore").innerText = State.score;
    document.getElementById("certCorrect").innerText = State.correctCount;
    document.getElementById("certWrong").innerText = `${State.wrongCount} / ${State.unansweredCount}`;

    // Set Certificate Date
    const today = new Date();
    const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    document.getElementById("certDate").innerText = today.toLocaleDateString('id-ID', dateOptions);

    // Set Unique Serial Number
    const randSerial = Math.floor(Math.random() * 9000) + 1000;
    document.getElementById("certSerial").innerText = `ID: CERT-CA-2026-${randSerial}`;

    // Evaluate Pass/Fail Threshold (16 or more correct answers = PASS)
    if (isPassed) {
        CyberSound.levelComplete();
        document.getElementById("certBadge").innerText = "SECURE SYSTEMS ASSURANCE";
        document.getElementById("certTitle").innerText = "SERTIFIKAT KELULUSAN";
        document.getElementById("certStatus").innerText = "LULUS";
        document.getElementById("certStatus").className = "c-val text-green";
        document.getElementById("certSummaryText").innerHTML = `Dinyatakan <strong>LULUS & KOMPETEN</strong> dalam evaluasi siber "CYBER AWARENESS" SPABAN VII/SIBER SINTELAD. Personel ini membuktikan kecakapan dan kesadaran taktis tingkat tinggi untuk mendeteksi, mencegah, dan menanggulangi ancaman keamanan siber di lingkungan kerja.`;
        startConfetti();
    } else {
        CyberSound.wrong();
        document.getElementById("certBadge").innerText = "EVALUASI KEAMANAN SIBER";
        document.getElementById("certTitle").innerText = "HASIL EVALUASI SIBER";
        document.getElementById("certStatus").innerText = "TIDAK LULUS";
        document.getElementById("certStatus").className = "c-val text-red";
        document.getElementById("certSummaryText").innerHTML = `Dinyatakan <strong>BELUM LULUS (TIDAK LULUS)</strong> dalam evaluasi siber "CYBER AWARENESS" SPABAN VII/SIBER SINTELAD. Syarat minimal kelulusan adalah <strong>16 jawaban benar</strong> (Hasil Anda: ${State.correctCount} benar). Personel diwajibkan mengulangi simulasi kuis guna meningkatkan pemahaman pertahanan siber.`;
    }
}

// Print Certificate
function printReport() {
    CyberSound.click();
    window.print();
}

// Restart Quiz
function restartQuiz() {
    CyberMusic.stop();
    CyberSound.click();
    switchView("loginSection");
    
    // Reset form inputs
    const inputs = ['inputNama', 'inputPangkat', 'inputNrp', 'inputJabatan', 'inputSatuan'];
    inputs.forEach(id => {
        document.getElementById(id).value = '';
    });
    
    // Disable start button until refilled
    const startBtn = document.getElementById("startQuizBtn");
    startBtn.classList.add("disabled");
    startBtn.disabled = true;

    // Reset competitors scores
    State.competitors = [
        { name: "Puspen_TNI", satuan: "Mabes TNI", score: 250 },
        { name: "Siber_Polda", satuan: "Polda Metro", score: 230 },
        { name: "Satkom_Lek", satuan: "Kodiklat", score: 210 },
        { name: "Intel_Ops_5", satuan: "BAIS", score: 190 },
        { name: "Reskrim_Siber", satuan: "Bareskrim", score: 180 }
    ];
}

// Custom Lightweight Canvas Confetti Engine
let confettiInterval = null;
function startConfetti() {
    const canvas = document.getElementById("confettiCanvas");
    const ctx = canvas.getContext("2d");
    
    // Set proper canvas dimension based on card size
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    const colors = ["#00f0ff", "#39ff14", "#ff0055", "#ffd700", "#ffffff"];
    const particles = [];

    for (let i = 0; i < 75; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 6 + 4,
            d: Math.random() * canvas.height,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.random() * 10 - 5,
            tiltAngleIncremental: Math.random() * 0.07 + 0.02,
            tiltAngle: 0
        });
    }

    if (confettiInterval) {
        clearInterval(confettiInterval);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((p, idx) => {
            p.tiltAngle += p.tiltAngleIncremental;
            p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
            p.tilt = Math.sin(p.tiltAngle - idx / 3) * 15;

            // Recalculate horizontal dispersion
            p.x += Math.sin(p.d) * 0.5;

            ctx.beginPath();
            ctx.lineWidth = p.r;
            ctx.strokeStyle = p.color;
            ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
            ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
            ctx.stroke();

            // Reset particle once it reaches bottom of card
            if (p.y > canvas.height) {
                particles[idx] = {
                    x: Math.random() * canvas.width,
                    y: -20,
                    r: p.r,
                    d: p.d,
                    color: p.color,
                    tilt: p.tilt,
                    tiltAngleIncremental: p.tiltAngleIncremental,
                    tiltAngle: p.tiltAngle
                };
            }
        });
    }

    confettiInterval = setInterval(draw, 24);

    // Stop confetti loop after 10 seconds to save CPU cycles
    setTimeout(() => {
        clearInterval(confettiInterval);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 10000);
}

// Utility to escape HTML
function escapeHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

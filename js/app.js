document.addEventListener('DOMContentLoaded', () => {
    // Fungsi untuk halaman login
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        const loginForm = document.getElementById('loginForm');
        const errorMessage = document.getElementById('errorMessage');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;

                // Contoh autentikasi sederhana
                if (username === 'user' && password === 'pass') {
                    localStorage.setItem('loggedIn', 'true');
                    localStorage.setItem('username', username);
                    window.location.href = 'dashboard.html';
                } else {
                    errorMessage.textContent = 'Nama pengguna atau kata sandi salah!';
                    errorMessage.style.display = 'block';
                }
            });
        }

        // Cek jika sudah login, langsung redirect ke dashboard
        if (localStorage.getItem('loggedIn') === 'true' && window.location.pathname !== '/dashboard.html') {
            window.location.href = 'dashboard.html';
        }

    }

    // Fungsi untuk halaman dashboard
    if (window.location.pathname.endsWith('dashboard.html')) {
        const loggedInUsernameSpan = document.getElementById('loggedInUsername');
        const logoutBtn = document.querySelector('.logout-btn');
        const quizCards = document.querySelectorAll('.quiz-card');

        // Cek status login
        if (localStorage.getItem('loggedIn') !== 'true') {
            window.location.href = 'index.html'; // Kembali ke login jika belum login
            return;
        }

        // Tampilkan nama pengguna
        const username = localStorage.getItem('username');
        if (loggedInUsernameSpan && username) {
            loggedInUsernameSpan.textContent = username;
        }

        // Event listener untuk tombol "Mulai Kuis"
        quizCards.forEach(card => {
            const startButton = card.querySelector('.start-quiz-btn');
            startButton.addEventListener('click', () => {
                const quizId = card.dataset.quizId;
                localStorage.setItem('currentQuizId', quizId); // Simpan ID kuis yang dipilih
                window.location.href = 'quiz.html';
            });
        });

        // Event listener untuk tombol logout
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('loggedIn');
                localStorage.removeItem('username');
                localStorage.removeItem('currentQuizId'); // Bersihkan juga ID kuis
                window.location.href = 'index.html';
            });
        }
    }
});
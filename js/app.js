document.addEventListener('DOMContentLoaded', () => {
    // Fungsi untuk halaman utama (index.html) yang sekarang berfungsi untuk input nama
    // Cek apakah URL berakhir dengan 'index.html' atau merupakan root path (misal jika di-deploy)
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        const nameForm = document.getElementById('nameForm');

        if (nameForm) {
            nameForm.addEventListener('submit', (e) => {
                e.preventDefault(); // Mencegah form submit secara default
                const guestName = document.getElementById('guestName').value;

                if (guestName.trim() !== '') { // Pastikan nama tidak kosong
                    // Simpan status bahwa guest sudah "login" (masuk)
                    localStorage.setItem('isGuestLoggedIn', 'true');
                    // Simpan nama guest
                    localStorage.setItem('guestUsername', guestName.trim());
                    // Langsung redirect ke dashboard
                    window.location.href = 'dashboard.html';
                } else {
                    alert('Nama tidak boleh kosong!'); // Beri peringatan jika nama kosong
                }
            });
        }

        // Jika sudah ada nama guest tersimpan, langsung redirect ke dashboard saat mengakses index.html
        if (localStorage.getItem('isGuestLoggedIn') === 'true') {
            window.location.href = 'dashboard.html';
        }
    }

    // Fungsi untuk halaman dashboard (tidak ada perubahan pada dashboard.html itu sendiri,
    // tapi logikanya di app.js yang terhubung ke dashboard akan disesuaikan)
    if (window.location.pathname.endsWith('dashboard.html')) {
        const loggedInUsernameSpan = document.getElementById('loggedInUsername');
        const logoutBtn = document.querySelector('.logout-btn'); // Tombol ini sekarang akan berfungsi sebagai "Ganti Nama"
        const quizCards = document.querySelectorAll('.quiz-card');

        // Cek apakah guest sudah "login" (masuk). Jika belum, kembalikan ke halaman input nama.
        if (localStorage.getItem('isGuestLoggedIn') !== 'true') {
            window.location.href = 'index.html'; // Kembali ke halaman index.html (input nama)
            return; // Hentikan eksekusi lebih lanjut
        }

        // Tampilkan nama guest di dashboard
        const guestUsername = localStorage.getItem('guestUsername');
        if (loggedInUsernameSpan && guestUsername) {
            loggedInUsernameSpan.textContent = guestUsername;
        }

        // Event listener untuk tombol "Mulai Kuis" (tidak berubah dari sebelumnya)
        quizCards.forEach(card => {
            const startButton = card.querySelector('.start-quiz-btn');
            startButton.addEventListener('click', () => {
                const quizId = card.dataset.quizId;
                localStorage.setItem('currentQuizId', quizId); // Simpan ID kuis yang dipilih
                window.location.href = 'quiz.html'; // Langsung ke halaman kuis
            });
        });

        // Event listener untuk tombol "Ganti Nama" (sebelumnya tombol logout)
        if (logoutBtn) {
            logoutBtn.textContent = 'Ganti Nama'; // Ubah teks tombol di dashboard
            logoutBtn.addEventListener('click', () => {
                // Hapus semua data sesi guest dari localStorage
                localStorage.removeItem('isGuestLoggedIn');
                localStorage.removeItem('guestUsername');
                localStorage.removeItem('currentQuizId'); // Bersihkan juga ID kuis yang sedang dimainkan
                window.location.href = 'index.html'; // Kembali ke halaman input nama
            });
        }
    }

    // Logika untuk quiz.js dan questions.js tidak perlu diubah karena fokusnya pada alur masuk dan dashboard.
});
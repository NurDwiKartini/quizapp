document.addEventListener('DOMContentLoaded', () => {
    const quizTitleElem = document.getElementById('quizTitle');
    const questionTextElem = document.getElementById('questionText');
    const optionsContainer = document.getElementById('optionsContainer');
    const nextQuestionBtn = document.getElementById('nextQuestionBtn');
    const questionContainer = document.getElementById('questionContainer');
    const resultContainer = document.getElementById('resultContainer');
    const scoreSpan = document.getElementById('score');
    const totalQuestionsSpan = document.getElementById('totalQuestions');
    const backToDashboardBtn = document.querySelector('.back-to-dashboard-btn');

    // Elemen baru untuk gamifikasi
    const quizTimerElem = document.getElementById('quizTimer');
    const currentQuestionNumElem = document.getElementById('currentQuestionNum');
    const totalQuestionsCountElem = document.getElementById('totalQuestionsCount');
    const feedbackMessageElem = document.getElementById('feedbackMessage');


    let currentQuizId = localStorage.getItem('currentQuizId');
    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let selectedOption = null; // Menyimpan opsi yang dipilih saat ini

    const TIME_PER_QUESTION = 25; // Waktu per soal dalam detik
    let timerInterval;
    let timeLeft = TIME_PER_QUESTION;

    // Cek apakah sudah login dan ada kuis yang dipilih
    if (localStorage.getItem('loggedIn') !== 'true' || !currentQuizId || !quizzes[currentQuizId]) {
        alert('Anda belum memilih kuis atau belum login. Kembali ke dashboard.');
        window.location.href = 'dashboard.html';
        return;
    }

    // Inisialisasi kuis
    quizTitleElem.textContent = currentQuizId.toUpperCase().replace('_', ' ') + " Kuis";
    questions = quizzes[currentQuizId];
    totalQuestionsSpan.textContent = questions.length;
    totalQuestionsCountElem.textContent = questions.length; // Update total questions count

    function startTimer() {
        timeLeft = TIME_PER_QUESTION;
        quizTimerElem.textContent = timeLeft;
        timerInterval = setInterval(() => {
            timeLeft--;
            quizTimerElem.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                autoSelectIncorrectAnswer(); // Jika waktu habis, anggap jawaban salah
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function loadQuestion() {
        stopTimer(); // Hentikan timer sebelumnya
        startTimer(); // Mulai timer untuk soal baru

        const questionData = questions[currentQuestionIndex];
        questionTextElem.textContent = questionData.question;
        optionsContainer.innerHTML = ''; // Bersihkan opsi sebelumnya
        selectedOption = null; // Reset pilihan
        nextQuestionBtn.disabled = true; // Nonaktifkan tombol 'Selanjutnya'
        currentQuestionNumElem.textContent = currentQuestionIndex + 1; // Update nomor soal
        
        // Sembunyikan feedback message
        feedbackMessageElem.classList.remove('show', 'correct', 'incorrect');
        feedbackMessageElem.textContent = '';


        questionData.options.forEach(option => {
            const button = document.createElement('button');
            button.classList.add('option-btn');
            button.textContent = option;
            button.dataset.option = option;
            button.addEventListener('click', () => selectOption(button));
            optionsContainer.appendChild(button);
        });
    }

    function selectOption(button) {
        // Hanya izinkan pemilihan jika belum ada opsi yang dipilih atau jika ingin mengganti pilihan
        if (!selectedOption || selectedOption !== button) {
            // Hapus kelas 'selected' dari opsi sebelumnya (jika ada)
            if (selectedOption) {
                selectedOption.classList.remove('selected');
            }

            // Tambahkan kelas 'selected' ke opsi yang baru dipilih
            button.classList.add('selected');
            selectedOption = button;
            
            // Langsung cek jawaban setelah opsi dipilih (feedback instan)
            checkAnswer();
        }
    }

    function autoSelectIncorrectAnswer() {
        // Jika waktu habis dan tidak ada jawaban yang dipilih, anggap salah
        if (!selectedOption) {
            // Kita bisa menandai opsi pertama sebagai pilihan 'salah' atau secara implisit menganggap tidak ada jawaban
            // Untuk tujuan feedback, kita bisa langsung memprosesnya sebagai jawaban salah.
            feedbackMessageElem.textContent = "Waktu habis!";
            feedbackMessageElem.classList.add('show', 'incorrect');
        }
        checkAnswer(true); // Panggil checkAnswer dengan flag waktu habis
    }


    function checkAnswer(timeUp = false) {
        stopTimer(); // Hentikan timer setelah jawaban dipilih atau waktu habis

        const correctAnswer = questions[currentQuestionIndex].answer;
        let isCorrect = false;

        // Nonaktifkan semua tombol opsi setelah menjawab
        optionsContainer.querySelectorAll('.option-btn').forEach(btn => {
            btn.disabled = true;
        });

        if (!timeUp && selectedOption) {
            const chosenAnswer = selectedOption.dataset.option;
            // Beri warna pada semua opsi untuk menunjukkan jawaban benar/salah
            optionsContainer.querySelectorAll('.option-btn').forEach(btn => {
                if (btn.dataset.option === correctAnswer) {
                    btn.classList.add('correct');
                } else if (btn.dataset.option === chosenAnswer) {
                    btn.classList.add('incorrect');
                }
            });

            if (chosenAnswer === correctAnswer) {
                score++;
                isCorrect = true;
                feedbackMessageElem.textContent = "Benar!";
                feedbackMessageElem.classList.add('show', 'correct');
            } else {
                feedbackMessageElem.textContent = `Salah! Jawaban yang benar adalah "${correctAnswer}".`;
                feedbackMessageElem.classList.add('show', 'incorrect');
            }
        } else if (timeUp) {
            // Jika waktu habis dan belum ada pilihan, tampilkan jawaban yang benar
            optionsContainer.querySelectorAll('.option-btn').forEach(btn => {
                if (btn.dataset.option === correctAnswer) {
                    btn.classList.add('correct');
                }
            });
            // Feedback message sudah diatur di autoSelectIncorrectAnswer
        }


        nextQuestionBtn.disabled = false; // Aktifkan tombol 'Selanjutnya' setelah feedback
    }

    function showResults() {
        questionContainer.style.display = 'none';
        resultContainer.style.display = 'block';
        scoreSpan.textContent = score;
    }

    nextQuestionBtn.addEventListener('click', () => {
        // Tidak perlu memanggil checkAnswer di sini lagi karena sudah dipanggil di selectOption atau autoSelectIncorrectAnswer
        // Ini hanya untuk navigasi ke soal berikutnya
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            showResults();
        }
    });

    backToDashboardBtn.addEventListener('click', () => {
        localStorage.removeItem('currentQuizId'); // Bersihkan ID kuis saat kembali
        window.location.href = 'dashboard.html';
    });

    // Mulai kuis
    loadQuestion();
});
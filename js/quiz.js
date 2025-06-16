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

    const quizTimerElem = document.getElementById('quizTimer');
    const currentQuestionNumElem = document.getElementById('currentQuestionNum');
    const totalQuestionsCountElem = document.getElementById('totalQuestionsCount');
    const feedbackMessageElem = document.getElementById('feedbackMessage');

    let currentQuizId = localStorage.getItem('currentQuizId');
    let questions = []; // Akan diisi dari `quizzes` yang dimuat dari `questions.js`
    let currentQuestionIndex = 0;
    let score = 0;
    let selectedOption = null;

    const TIME_PER_QUESTION = 25;
    let timerInterval;
    let timeLeft = TIME_PER_QUESTION;

    // --- Perubahan Utama di sini ---
    // Cek apakah guest sudah "masuk" dan kuis telah dipilih
    // Asumsi `quizzes` sudah tersedia dari `questions.js`
    if (localStorage.getItem('isGuestLoggedIn') !== 'true' || !currentQuizId || !quizzes[currentQuizId]) {
        alert('Anda belum memulai sesi atau memilih kuis. Kembali ke halaman utama.');
        window.location.href = 'index.html'; // Navigasi ke index.html
        return;
    }

    // Inisialisasi kuis
    quizTitleElem.textContent = currentQuizId.toUpperCase().replace('_', ' ') + " Kuis";
    questions = quizzes[currentQuizId]; // Mengambil data kuis dari objek global `quizzes`
    totalQuestionsSpan.textContent = questions.length;
    totalQuestionsCountElem.textContent = questions.length;

    function startTimer() {
        timeLeft = TIME_PER_QUESTION;
        quizTimerElem.textContent = timeLeft;
        timerInterval = setInterval(() => {
            timeLeft--;
            quizTimerElem.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                autoSelectIncorrectAnswer();
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function loadQuestion() {
        stopTimer();
        startTimer();

        const questionData = questions[currentQuestionIndex];
        questionTextElem.textContent = questionData.question;
        optionsContainer.innerHTML = '';
        selectedOption = null;
        nextQuestionBtn.disabled = true;
        currentQuestionNumElem.textContent = currentQuestionIndex + 1;

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
        if (!selectedOption || selectedOption !== button) {
            if (selectedOption) {
                selectedOption.classList.remove('selected');
            }
            button.classList.add('selected');
            selectedOption = button;
            checkAnswer();
        }
    }

    function autoSelectIncorrectAnswer() {
        if (!selectedOption) {
            feedbackMessageElem.textContent = "Waktu habis!";
            feedbackMessageElem.classList.add('show', 'incorrect');
        }
        checkAnswer(true);
    }

    function checkAnswer(timeUp = false) {
        stopTimer();

        const correctAnswer = questions[currentQuestionIndex].answer;
        let isCorrect = false;

        optionsContainer.querySelectorAll('.option-btn').forEach(btn => {
            btn.disabled = true;
        });

        if (!timeUp && selectedOption) {
            const chosenAnswer = selectedOption.dataset.option;
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
            optionsContainer.querySelectorAll('.option-btn').forEach(btn => {
                if (btn.dataset.option === correctAnswer) {
                    btn.classList.add('correct');
                }
            });
        }

        nextQuestionBtn.disabled = false;
    }

    function showResults() {
        questionContainer.style.display = 'none';
        resultContainer.style.display = 'block';
        scoreSpan.textContent = score;
    }

    nextQuestionBtn.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            showResults();
        }
    });

    backToDashboardBtn.addEventListener('click', () => {
        localStorage.removeItem('currentQuizId');
        window.location.href = 'dashboard.html'; // Navigasi ke dashboard.html
    });

    // Mulai kuis
    loadQuestion();
});
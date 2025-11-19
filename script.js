let quizData = [];
let currentQuestionIndex = 0;

const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextButton = document.getElementById('next-button');
const progressText = document.getElementById('progress-text');
const progressDots = document.getElementById('progress-dots');
const resultScreen = document.getElementById('result-screen');
const quizContent = document.getElementById('quiz-content');
const resultTitle = document.getElementById('result-title');
const scoreMessage = document.getElementById('score-message');
const restartButton = document.getElementById('restart-button');

function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

function decodeHTML(html) {
    let txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

async function loadQuizData() {
    try {
        progressText.textContent = "Loading questions...";
        const response = await fetch("https://opentdb.com/api.php?amount=15&category=9&type=multiple");
        const data = await response.json();

        quizData = data.results.map(q => ({
            question: decodeHTML(q.question),
            options: shuffle([...q.incorrect_answers, q.correct_answer].map(decodeHTML)),
            answer: decodeHTML(q.correct_answer)
        }));

        renderQuestion();

    } catch (error) {
        progressText.textContent = "Failed to load quiz data.";
    }
}

function renderQuestion() {
    if (currentQuestionIndex >= quizData.length) {
        showResults();
        return;
    }

    const { question, options } = quizData[currentQuestionIndex];

    progressText.textContent = `Question ${currentQuestionIndex + 1} of ${quizData.length}`;
    updateProgressDots();

    questionText.textContent = question;
    optionsContainer.innerHTML = "";
    nextButton.disabled = true;

    options.forEach(optionText => {
        const optionElement = document.createElement("div");
        optionElement.classList.add("option");
        optionElement.textContent = optionText;

        optionElement.addEventListener("click", () =>
            checkAnswer(optionElement, optionText)
        );

        optionsContainer.appendChild(optionElement);
    });
}

function checkAnswer(selectedElement, selectedAnswer) {
    const correctAnswer = quizData[currentQuestionIndex].answer;
    const allOptions = document.querySelectorAll(".option");
    const iconSpan = document.createElement("span");

    allOptions.forEach(opt => opt.style.pointerEvents = "none");

    if (selectedAnswer === correctAnswer) {
        selectedElement.classList.add("correct");
        iconSpan.innerHTML = "✔️";
        selectedElement.appendChild(iconSpan);
    } else {
        selectedElement.classList.add("incorrect");
        iconSpan.innerHTML = "❌";
        selectedElement.appendChild(iconSpan);

        allOptions.forEach(opt => {
            if (opt.textContent === correctAnswer) {
                const correctIcon = document.createElement("span");
                correctIcon.innerHTML = "✔️";
                opt.appendChild(correctIcon);
                opt.classList.add("correct");
            }
        });
    }

    nextButton.disabled = false;

    if (currentQuestionIndex === quizData.length - 1) {
        nextButton.textContent = "Finish Quiz";
    }
}

function goToNextQuestion() {
    currentQuestionIndex++;
    nextButton.textContent = "Next Question";
    renderQuestion();
}

function updateProgressDots() {
    progressDots.innerHTML = "";
    for (let i = 0; i < quizData.length; i++) {
        const dot = document.createElement("div");
        dot.classList.add("dot");

        if (i < currentQuestionIndex) dot.classList.add("completed");
        if (i === currentQuestionIndex) dot.classList.add("active");

        progressDots.appendChild(dot);
    }
}

function showResults() {
    quizContent.classList.add("hidden");
    progressDots.classList.add("hidden");
    progressText.classList.add("hidden");
    nextButton.classList.add("hidden");
    resultScreen.classList.remove("hidden");

    resultTitle.textContent = "Congratulations! 🎉";
    scoreMessage.textContent = "You successfully completed the quiz.";
}

function restartQuiz() {
    currentQuestionIndex = 0;

    quizContent.classList.remove("hidden");
    progressDots.classList.remove("hidden");
    progressText.classList.remove("hidden");
    nextButton.classList.remove("hidden");
    resultScreen.classList.add("hidden");

    nextButton.textContent = "Next Question";
    renderQuestion();
}

document.addEventListener("DOMContentLoaded", loadQuizData);
nextButton.addEventListener("click", goToNextQuestion);
restartButton.addEventListener("click", restartQuiz);

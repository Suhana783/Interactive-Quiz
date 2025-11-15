const quizData = [
    {
        question: "What is the capital of Australia?",
        options: ["Sydney", "Melbourne", "Canberra", "Perth"],
        answer: "Canberra"
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        answer: "Mars"
    },
    {
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        answer: "Leonardo da Vinci"
    },
    {
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        answer: "Pacific Ocean"
    },
    {
        question: "In which year did World War II end?",
        options: ["1943", "1944", "1945", "1946"],
        answer: "1945"
    },
    {
        question: "What is the smallest country in the world?",
        options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
        answer: "Vatican City"
    },
    {
        question: "What is the chemical symbol for gold?",
        options: ["Ag", "Au", "Fe", "Pb"],
        answer: "Au"
    },
    {
        question: "Who wrote 'Romeo and Juliet'?",
        options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
        answer: "William Shakespeare"
    },
    {
        question: "How many sides does a heptagon have?",
        options: ["6", "7", "8", "9"],
        answer: "7"
    },
    {
        question: "What is the main component of the sun?",
        options: ["Oxygen", "Iron", "Hydrogen", "Helium"],
        answer: "Hydrogen"
    },
    {
        question: "What is the process by which plants make their food?",
        options: ["Respiration", "Photosynthesis", "Transpiration", "Fermentation"],
        answer: "Photosynthesis"
    },
    {
        question: "Which mountain range includes Mount Everest?",
        options: ["Andes", "Rockies", "Himalayas", "Alps"],
        answer: "Himalayas"
    },
    {
        question: "Which gas do humans primarily exhale?",
        options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Methane"],
        answer: "Carbon Dioxide"
    },
    {
        question: "What is the official currency of Japan?",
        options: ["Yuan", "Won", "Euro", "Yen"],
        answer: "Yen"
    },
    {
        question: "What is the fastest land animal?",
        options: ["Lion", "Cheetah", "Gazelle", "Tiger"],
        answer: "Cheetah"
    }
];

let currentQuestionIndex = 0;
let score = 0;
const totalQuestions = quizData.length;
const passingScore = Math.ceil(totalQuestions / 2);

const quizContainer = document.getElementById('quiz-container');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextButton = document.getElementById('next-button');
const progressText = document.getElementById('progress-text');
const progressDots = document.getElementById('progress-dots');
const resultScreen = document.getElementById('result-screen');
const quizContent = document.getElementById('quiz-content');
const resultTitle = document.getElementById('result-title');
const finalScore = document.getElementById('final-score');
const scoreMessage = document.getElementById('score-message');
const restartButton = document.getElementById('restart-button');


const renderQuestion = () => {
    if (currentQuestionIndex >= totalQuestions) {
        showResults();
        return;
    }

    const {question, options} = quizData[currentQuestionIndex];

    progressText.textContent = `Question ${currentQuestionIndex + 1} of ${totalQuestions}`;
    updateProgressDots();

    questionText.textContent = question;
    optionsContainer.innerHTML = '';
    
    // Check if nextButton exists before manipulating it (fix for missing HTML elements)
    if (nextButton) {
        nextButton.textContent = "Next Question";
        nextButton.disabled = true;
    }

    options.forEach(optionText => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        optionElement.textContent = optionText;

        optionElement.addEventListener('click', () => checkAnswer(optionElement, optionText));
        optionsContainer.appendChild(optionElement);
    });
};

const checkAnswer = (selectedElement, selectedAnswer) => {
    const correctAnswer = quizData[currentQuestionIndex].answer;
    
    // 💥 CRITICAL FIX: The typo was 'quesrySelectorAll'. It must be 'querySelectorAll'.
    const allOptions = document.querySelectorAll('.option'); 

    allOptions.forEach(opt => {
        const icon = opt.querySelector('.feedback-icon');
        if (icon) icon.remove();
    });

    const iconSpan = document.createElement('span');
    iconSpan.classList.add('feedback-icon');

    if(selectedAnswer === correctAnswer) {
     
        score++;
        selectedElement.classList.add('correct');
        iconSpan.innerHTML = '✅';
        selectedElement.appendChild(iconSpan);

        // Apply 'correct' class to all options to disable them all
        allOptions.forEach(opt => opt.classList.add('correct'));
        
        if (nextButton) {
            nextButton.disabled = false;
            if (currentQuestionIndex === totalQuestions - 1) {
                nextButton.textContent = "Complete Quiz";
            }
        }
    } else {
        selectedElement.classList.add('incorrect');
        iconSpan.innerHTML = '❌';
        selectedElement.appendChild(iconSpan);
        selectedElement.classList.add('disabled');
        selectedElement.style.pointerEvents = 'none';
    }
};

// 💡 FIX: Function name typo corrected from goToNextQustion to goToNextQuestion
const goToNextQuestion = () => {
    currentQuestionIndex++;
    renderQuestion();
};


const updateProgressDots = () => {
    // Check if progressDots exists before manipulating it
    if (!progressDots) return;
    
    progressDots.innerHTML = '';

    for (let i = 0; i < totalQuestions; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot')
        if (i < currentQuestionIndex) {
            dot.classList.add('completed');
        } else if (i === currentQuestionIndex) {
            dot.classList.add('active')
        }

        progressDots.appendChild(dot);
    }
};

const showResults = () => {

    // Check if elements exist before manipulating them
    if (quizContent) quizContent.classList.add('hidden');
    if (progressDots) progressDots.classList.add('hidden');
    if (progressText) progressText.classList.add('hidden');
    if (nextButton) nextButton.classList.add('hidden');
    if (resultScreen) resultScreen.classList.remove('hidden');

    finalScore.textContent = `You scored ${score} out of ${totalQuestions}.`;

    let message = "";
    // 💡 FIX: The variable was 'litle' which should be 'title'
    let title = ""; 

    if (score < passingScore) {
        title = "Oops! Keep Going.";
        message = "Sorry, you failed. Your score is lower than half. You can try again!";
    }
    else if (score === passingScore) {
        title = "Good Job!";
        message = "You scored exactly half of fifteen. You did nice!";
    } else {
        title = "Great Success! 🎉";
        message = "Your score is more than half (8 or more). You successfully completed the quiz!";
    }
    
    // Check if elements exist before setting content
    if (resultTitle) resultTitle.textContent = title;
    if (scoreMessage) scoreMessage.textContent = message;
};

const restartQuiz = () => {
    currentQuestionIndex = 0;
    score = 0;

    // Check if elements exist before removing 'hidden' class
    if (quizContent) quizContent.classList.remove('hidden');
    if (progressDots) progressDots.classList.remove('hidden');
    if (progressText) progressText.classList.remove('hidden');
    if (nextButton) nextButton.classList.remove('hidden');
    if (resultScreen) resultScreen.classList.add('hidden');
    
    renderQuestion();
};

document.addEventListener('DOMContentLoaded', renderQuestion);

if (nextButton) nextButton.addEventListener('click', goToNextQuestion);
if (restartButton) restartButton.addEventListener('click', restartQuiz);
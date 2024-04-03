const splitUrl = window.location.href.split('/');
const n = splitUrl.length
let space = 0;
if(splitUrl[n-1] == ""){
    space = 1
}
const questionId = splitUrl[n-1-space];
const topic = splitUrl[n-2-space];
const quizId = splitUrl[n-3-space];


// Fetch question data from the API
async function fetchQuestionData() {


    const response = await fetch(`/api/student/${quizId}/${topic}/${questionId}`);
    const data = await response.json();
    return data;
}

// Function to update the HTML elements with fetched data
async function populateQuestionData() {
    const questionData = await fetchQuestionData();
    
    // Update question section
    const questionElement = document.querySelector('.question');
    questionElement.textContent = questionData.data.questions.question;

    // Update your answer section
    const yourAnswerElement = document.querySelector('.your-answer');
    yourAnswerElement.textContent = questionData.data.questions.options[questionData.data.userOption-1];

    // Update actual answer section
    const actualAnswerElement = document.querySelector('.actual-answer');
    const answerIndex = questionData.data.questions.answer - 1; // Answer index is 0-based
    actualAnswerElement.textContent = questionData.data.questions.options[answerIndex];

    // Update resource section
    const resourceElement = document.querySelector('.resource');
    resourceElement.textContent = questionData.data.questions.generated_resources;
}

// Call the function to populate question data
populateQuestionData();


document.getElementById("back-btn").addEventListener("click", () => {
    window.location.replace(`/student/${quizId}/${topic}`)
})
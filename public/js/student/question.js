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

    const parsedResources = JSON.parse(questionData.data.questions.generated_resources)
    console.log(parsedResources)
    // Update resource section
    const jsonData = JSON.parse(questionData.data.questions.generated_resources);
    const resourceElement = document.querySelector('.resource');

    // Clear existing content
    resourceElement.innerHTML = '';

    // Create and append solution
    const solutionHeading = document.createElement('h3');
    solutionHeading.textContent = "Solution:";
    resourceElement.appendChild(solutionHeading);

    const solutionParagraph = document.createElement('p');
    solutionParagraph.textContent = jsonData.solution;
    resourceElement.appendChild(solutionParagraph);

    // Create and append evaluations
    const evalHeading = document.createElement('h3');
    evalHeading.textContent = "Evaluations:";
    resourceElement.appendChild(evalHeading);

    const evalList = document.createElement('ul');
    for (const [key, value] of Object.entries(jsonData.eval)) {
        const evalItem = document.createElement('li');
        evalItem.textContent = `${key}: ${value}`;
        evalList.appendChild(evalItem);
    }
    resourceElement.appendChild(evalList);

    // Create and append resources
    const resourcesHeading = document.createElement('h3');
    resourcesHeading.textContent = "Resources:";
    resourceElement.appendChild(resourcesHeading);

    const resourcesList = document.createElement('ul');
    jsonData.resources.forEach(resource => {
        const resourceItem = document.createElement('li');
        const resourceLink = document.createElement('a');
        resourceLink.href = resource.link;
        resourceLink.textContent = resource.desc;
        resourceItem.appendChild(resourceLink);
        resourcesList.appendChild(resourceItem);
    });
    resourceElement.appendChild(resourcesList);

    
}

// Call the function to populate question data
populateQuestionData();


document.getElementById("back-btn").addEventListener("click", () => {
    window.location.replace(`/student/${quizId}/${topic}`)
})

document.getElementById("logout-btn").addEventListener("click", async (e) => {
    await fetch('/api/student/logout');
    window.location.replace("/auth/")
})
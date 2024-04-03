const splitUrl = window.location.href.split('/');
const n = splitUrl.length
let space = 0;
if(splitUrl[n-1] == ""){
    space = 1
}
const topic = decodeURI(splitUrl[n-1-space]);
const quizId = decodeURI(splitUrl[n-2-space]);


// Fetch data from the API and populate the question card and information
async function fetchAndPopulateQuestion() {
    showModal("Loading...")

    document.getElementById("topic-title").innerText = topic;

    try {
        const response = await fetch(`/api/student/${quizId}/${topic}`);
        const data = await response.json();

        if (!data.success || !data.data || !data.data.questions || data.data.questions.length === 0) {
            console.log(data);
            throw new Error(data.error);
        }

        const questions = data.data.questions;
        const resources = data.data.resources;

        const leftPanel = document.querySelector('.left-panel');
        const rightPanel = document.querySelector('.right-panel');

        // Clear existing question cards and information
        leftPanel.innerHTML = '';
        rightPanel.innerHTML = '';

        questions.forEach((questionData, index) => {
            const realAnswer = questionData.question.answer;
            const userOption = questionData.userOption;
            
            const linkWrapper = document.createElement('a');
            linkWrapper.href = `${window.location.href}/${questionData.question._id}`
            linkWrapper.style.color = 'inherit'

            const questionCard = document.createElement('div');
            questionCard.classList.add('question-card');

            questionCard.innerHTML = `
                <h2 class="question">${questionData.question.question}</h2>
                <div class="options">
                    ${questionData.question.options.map((option, optionIndex) => {
                        if(realAnswer === optionIndex+1){
                            return `
                            <div class="option correct-option">
                                <label for="option${optionIndex}">${option}</label>
                            </div>`
                        }
                        if(realAnswer === userOption && userOption === optionIndex+1){
                            return `
                            <div class="option correct-option">
                                <label for="option${optionIndex}">${option}</label>
                            </div>`
                        }else if(realAnswer !== userOption && userOption === optionIndex+1){
                            return `
                            <div class="option wrong-option">
                                <label for="option${optionIndex}">${option}</label>
                            </div>`
                        }else{
                            return `
                            <div class="option">
                                <label for="option${optionIndex}">${option}</label>
                            </div>`
                        }
                    }).join('')}
                </div>
            `;
            
            linkWrapper.appendChild(questionCard)
            leftPanel.appendChild(linkWrapper);
        });

        const questionInfo = document.createElement('div');
        questionInfo.classList.add('question-info');
        questionInfo.innerHTML = `
            <h2>${topic} Resources</h2>
            <p>${resources}</p>
        `;
        
        rightPanel.appendChild(questionInfo);
        hideModal();
    } catch (error) {
        showModal(error.message, "Back", )
        console.error('Error fetching and populating question:', error.message);
        // Display error message or handle error as required
    }
}

// Call the function to fetch and populate the question card and information
fetchAndPopulateQuestion();


document.getElementById("back-btn").addEventListener("click", () => {
    window.location.replace(`/student/${quizId}`)
})
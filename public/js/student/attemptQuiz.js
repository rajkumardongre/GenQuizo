async function fetchAndDisplayQuiz() {
    
    try {
        showModal("Loading...", "Reload", window.location.href)
        // Get the URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        // Fetch the 'id' parameter from the URL
        const quizId = urlParams.get('id');

        if (!quizId) {
            throw new Error('Quiz id is missing in the URL query parameters.');
        }

        const response = await fetch(`/api/student/attempt-quiz?id=${quizId}`);
        const data = await response.json();
        if (!response.ok) {
            if(data){
                throw new Error(data.error);
            }else{
                throw new Error('Failed to fetch quiz data.');
            }
        }


        const quizTitle = document.getElementById("quiz-title");
        quizTitle.innerHTML = data.quiz.title;
        const questionsContainer = document.getElementById('quiz-questions-container');

        let html = '';

        data.quiz.questions.forEach((question, index) => {
            html += `
                <div class="question-card">
                    <h2 class="question">Q ${index + 1}. ${question.question}</h2>
                    <div class="options">
            `;

            question.options.forEach((option, optionIndex) => {
                html += `
                    <label class="option">
                        <span> ${String.fromCharCode(65 + optionIndex)}</span>
                        <input type="radio" name="${question._id}" value="${optionIndex+1}" required>
                        <span> ${option} </span>
                    </label>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        });

        questionsContainer.innerHTML = html;
        hideModal();

        // Add event listener to submit button
        // const submitButton = document.querySelector('.submit-btn');
        const quizForm = document.getElementById("quiz-form");
        // submitButton.addEventListener('click', async (event) => {
        quizForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            showModal("Submitting, Don't leave page.");

            const userResponses = [];

            // Collect user responses
            data.quiz.questions.forEach((question) => {
                const selectedOption = document.querySelector(`input[name="${question._id}"]:checked`);
                if (selectedOption) {
                    userResponses.push([question._id, parseInt(selectedOption.value)]);
                }
            });

            // Make a POST request with user responses
            const postResponse = await fetch(`/api/student/submit-quiz?id=${quizId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ responses: userResponses })
            });

            const res = await postResponse.json();

            if (!postResponse.ok) {
                if(res){
                    throw new Error(res.error);
                }else{
                    throw new Error('Failed to submit quiz responses.');
                }
            }
            // Handle success response
            // You may want to redirect or show a success message
            console.log(userResponses)
            console.log(res)
            showModal("Submitted Successfully!")
            window.location.replace("/student")
        });

    } catch (error) {
        showModal(error.message, "home", "/student")
        console.error('Error fetching and displaying quiz:', error.message);
        // You can display an error message to the user or handle the error in another way
    }
}

window.addEventListener('DOMContentLoaded', fetchAndDisplayQuiz);

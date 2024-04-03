document.addEventListener('DOMContentLoaded', function () {
    const addQuestionButton = document.getElementById('add-question-btn');
    const questionsContainer = document.getElementById('questions-container');
    const submitBtn = document.getElementById('submit-btn');
    const quizForm = document.getElementById('quiz-form');
    const quizFormControl = document.getElementById("quiz-form-control");
    const quizTitle = document.getElementById("quiz-title");

    let questionCounter = 1;
    let quizQuestions = []; // Array to store all the quiz questions

    addQuestionButton.addEventListener('click', function () {
        submitBtn.style.display = "block";
        quizTitle.style.display = "block";
        quizFormControl.style.justifyContent = "space-between";
        
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        questionDiv.innerHTML = `
        <h3 style="align-self: self-start;">Question ${questionCounter}</h3>
        <div class="input-wrapper topic-wrapper">
            <span>Topic</span>
            <input type="text" id="topic-${questionCounter}" class="topic-input" placeholder="Enter Topic"
                name="topic-${questionCounter}" required>
        </div>
        <div class="input-wrapper">
            <span>Q.</span><input type="text" id="question-${questionCounter}" placeholder="Enter Question"
                name="question-${questionCounter}" required>
        </div>

        <div class="input-wrapper">
            <span>A.</span>
            <input type="text" id="optA-${questionCounter}" placeholder="Option A"
                name="optA-${questionCounter}" required>
        </div>
        <div class="input-wrapper">
            <span>B.</span>
            <input type="text" id="optB-${questionCounter}" placeholder="Option B"
                name="optB-${questionCounter}" required>
        </div>
        <div class="input-wrapper">
            <span>C.</span>
            <input type="text" id="optC-${questionCounter}" placeholder="Option C"
                name="optC-${questionCounter}" required>
        </div>
        <div class="input-wrapper">
            <span>D.</span>
            <input type="text" id="optD-${questionCounter}" placeholder="Option D"
                name="optD-${questionCounter}" required>
        </div>
        <select id="answer-${questionCounter}" name="answer-${questionCounter}" required>
            <option value="">Select Answer</option>
            <option value="1">A</option>
            <option value="2">B</option>
            <option value="3">C</option>
            <option value="4">D</option>
        </select>
        `;
        questionsContainer.appendChild(questionDiv);
        questionCounter++;
    });

    quizForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the form from submitting

        // Reset the quizQuestions array
        quizQuestions = [];

        // Loop through each question div to gather data
        document.querySelectorAll('.question').forEach(function(questionDiv, index) {
            const question = questionDiv.querySelector(`#question-${index + 1}`).value;
            const topic = questionDiv.querySelector(`#topic-${index + 1}`).value;
            const optA = questionDiv.querySelector(`#optA-${index + 1}`).value;
            const optB = questionDiv.querySelector(`#optB-${index + 1}`).value;
            const optC = questionDiv.querySelector(`#optC-${index + 1}`).value;
            const optD = questionDiv.querySelector(`#optD-${index + 1}`).value;
            const answer = parseInt(questionDiv.querySelector(`#answer-${index + 1}`).value);

            // Create an object for each question and push it to the quizQuestions array
            quizQuestions.push({
                question: question,
                options: [optA, optB, optC, optD],
                answer: answer,
                topic: topic
            });
        });

        // Log the quizQuestions array
        console.log(quizQuestions);

        try {
            let title = "Untitled";
            if(quizTitle.value){
                title = quizTitle.value;
            }
            console.log('Quiz data:', { quizQuestions: quizQuestions, title:title });

            // Make a POST request to the server
            const response = await fetch('/api/teacher/add-quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quizQuestions: quizQuestions, title:title })
            });
            const data = await response.json();
    
            if (!response.ok || !data.success) {
                throw new Error(data.error);
            }
    
            // Handle successful response
            window.location.replace("/teacher")
        } catch (error) {
            console.error('There was a problem adding quiz questions:', error);
            // Handle error
        }
    });

    document.getElementById("logout-btn").addEventListener("click", async (e) => {
        await fetch('/api/teacher/logout');
        window.location.replace("/auth/")
    })
});

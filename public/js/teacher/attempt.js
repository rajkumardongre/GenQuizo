const splitUrl = window.location.href.split('/');
const n = splitUrl.length
let space = 0;
if(splitUrl[n-1] == ""){
    space = 1
}
const quizId = splitUrl[n-2-space];


// Function to fetch attempt data and populate student cards
async function fetchAndPopulateStudents() {
    try {
        const response = await fetch(`/api/teacher/${quizId}/attempt`);
        const data = await response.json();
        console.log(data)
        if (!data.success || !data.data || data.data.length === 0) {
            throw new Error('Failed to fetch attempt data for the quiz.');
        }


        // console.log(correctCount, wrongCount)
        const studentCardsContainer = document.querySelector('.student-cards');

        // Clear existing student cards
        studentCardsContainer.innerHTML = '';

        // Iterate over attempt data and create student cards
        data.data.forEach(attempt => {
            const studentCard = document.createElement('div');
            studentCard.classList.add('student-card');

            document.getElementById("page-title").innerHTML = attempt.quizId.title;


            // Initialize counts
            let correctCount = 0;
            let wrongCount = 0;

            Object.values(attempt.topics).forEach(topic => {
                // Increment counts based on correct and wrong arrays
                correctCount += topic.correct.length;
                wrongCount += topic.wrong.length;
            });

            studentCard.innerHTML = `
                <h2 class="email">${attempt.studentId.email}</h2>
                <div class="marks-container">
                    <p class="correct-marks">✔️ ${correctCount}</p>
                    <p class="wrong-marks">❌ ${wrongCount}</p>
                </div>
            `;

            studentCardsContainer.appendChild(studentCard);
        });
    } catch (error) {
        console.error('Error fetching and populating students:', error.message);
        // Display error message or handle error as required
    }
}

// Call the function to fetch and populate students
fetchAndPopulateStudents();


document.getElementById("back-btn").addEventListener("click", (e) => {
    window.location.replace("/teacher")
})


document.getElementById("logout-btn").addEventListener("click", async (e) => {
    await fetch('/api/teacher/logout');
    window.location.replace("/auth/")
})
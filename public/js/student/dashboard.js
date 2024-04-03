document.addEventListener('DOMContentLoaded', function () {

    const quizCardsContainer = document.getElementById('quiz-cards');
    const userEmail = document.getElementById("user-email")

    // Function to fetch quizzes from the API and render quiz cards
    const renderQuizzes = async () => {
        try {
            showModal("Loading...", "Reload", window.location.href)

            const response = await fetch('/api/student/');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();

            userEmail.innerHTML = data.user.email;

            // Clear existing quiz cards
            quizCardsContainer.innerHTML = '';


            // Render quiz cards
            data.quizzes.forEach(quiz => {
                const quizCard = `
                    <div class="quiz-card">
                        <h3>${quiz.title}</h3>
                        <p class="timestamp">Created on: ${new Date(quiz.createdAt).toDateString()}</p>
                        <p class="attempts">Number of attempts: ${quiz.attempts.length}</p>
                        ${quiz.attempted ? 
                            `<button class="btn view-btn"><a style="text-decoration:none;color:white;" href="/student/${quiz._id}">View Result</a></button>` : 
                            `<button class="btn view-btn" style="background-color:orange;"><a style="text-decoration:none;color:white;" href="/student/attempt-quiz?id=${quiz._id}">Attempt Quiz</a></button>`}
                    </div>
                `;
                quizCardsContainer.innerHTML += quizCard;
            });
            hideModal()
        } catch (error) {
            showModal(error.message, "Back", `${window.location.origin}/student/login`)
            
            console.error('Error fetching quizzes:', error);
        }
    };

    // Call renderQuizzes function when the page loads
    renderQuizzes();

    document.getElementById("logout-btn").addEventListener("click", async (e) => {
        await fetch('/api/student/logout');
        window.location.replace("/auth/")
    })
});

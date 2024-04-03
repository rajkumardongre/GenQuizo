document.addEventListener('DOMContentLoaded', function () {
    const quizCardsContainer = document.getElementById('quiz-cards');
    const userEmail = document.getElementById("user-email")

    // Function to fetch quizzes from the API and render quiz cards
    const renderQuizzes = async () => {
        try {
            quizCardsContainer.innerHTML = '<h3>Loading...</h3>';
            const response = await fetch('/api/teacher/');
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
                        <a href="/teacher/${quiz._id}/attempt"><button class="btn view-btn">View</button></a>
                    </div>
                `;
                quizCardsContainer.innerHTML += quizCard;
            });

            if(data.quizzes.length === 0){
                quizCardsContainer.innerHTML = "<h3>No Quizes Created!</h3>"
            }
        } catch (error) {
            console.error('Error fetching quizzes:', error);
        }
    };

    // Call renderQuizzes function when the page loads
    renderQuizzes();

    document.getElementById("logout-btn").addEventListener("click", async (e) => {
        await fetch('/api/teacher/logout');
        window.location.replace("/auth/")
    })
});

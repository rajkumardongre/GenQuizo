document.addEventListener('DOMContentLoaded', async function () {
    try {
        // const quizId = '660c842ea5c8daa7ef6dca1b'; // Replace this with the actual quizId
        const splitUrl = window.location.href.split("/"); // Replace this with the actual quizId
        const quizId = splitUrl[splitUrl.length-1].split("#")[0]; // Replace this with the actual quizId
        showModal("Loading...", "Back", `${window.location.origin}/student`)
        const response = await fetch(`/api/student/${quizId}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch quiz data');
        }

        const quizTitle = data.data.quizId.title;
        const topics = data.data.topics;

        // Set quiz title
        document.querySelector('.page-title').innerHTML = quizTitle;

        // Get topic cards container
        const topicCardsContainer = document.querySelector('.topic-cards');

        // Populate topic cards dynamically
        for (const topic in topics) {
            const correctCount = topics[topic].correct.length;
            const wrongCount = topics[topic].wrong.length;
            const totalCount = correctCount + wrongCount;

            // Create topic card
            const topicCard = document.createElement('div');
            topicCard.classList.add('topic-card');
            topicCard.innerHTML = `
                <h2 class="topic-title">${topic}</h2>
                <div class="topic-info">
                    <p class="correct-questions">✔️ ${correctCount}</p>
                    <p class="wrong-questions">❌ ${wrongCount}</p>
                </div>
                <div class="topic-control">
                    <p class="total-questions">Total: ${totalCount}</p>
                    <a href="/student/${quizId}/${topic}"><button class="check-button">Check</button></a>
                </div>
            `;

            // Append topic card to container
            topicCardsContainer.appendChild(topicCard);
        }
        hideModal();
    } catch (error) {
        showModal('Failed to load quiz data. Please try again later.', 'OK', window.location.href);
        console.error('Error:', error);
    }
});

document.getElementById("back-btn").addEventListener("click", () => {
    window.location.replace("/student")
})


document.getElementById("logout-btn").addEventListener("click", async (e) => {
    await fetch('/api/student/logout');
    window.location.replace("/auth/")
})
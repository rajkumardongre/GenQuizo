function showModal(msg, label=null, redirectURL=null) {
    // Get modal elements
    const modalBackground = document.getElementById('modal-background');
    const modalMessage = document.getElementById('modal-message');
    const modalButton = document.getElementById('modal-button');

    // Set modal message and button label
    modalMessage.textContent = msg;
    if(!label){
        modalButton.style.display = "none";
    }else{
        modalButton.style.display = "block";
        modalButton.textContent = label;
    }

    // Show modal
    modalBackground.style.display = 'block';

    // If redirect URL is provided, redirect when button is clicked
    if (redirectURL) {
        modalButton.addEventListener('click', function() {
            window.location.href = redirectURL;
        });
    }
}

function hideModal() {
    // Get modal background element
    const modalBackground = document.getElementById('modal-background');

    // Hide modal
    modalBackground.style.display = 'none';
}

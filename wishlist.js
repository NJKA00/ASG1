document.addEventListener('DOMContentLoaded', () => {
    // 1. Select all elements with the class 'product-button'
    const buttons = document.querySelectorAll('.product-button');

    // 2. Loop through every button found
    buttons.forEach(btn => {
        // 3. Add a 'click' listener to each button
        btn.addEventListener('click', function() {
            
            // Get the title of the product associated with this button
            // We go up to the parent (.product-info) and find the h3 inside it
            const productTitle = this.parentElement.querySelector('.product-title').innerText;

            // Check if the button is already clicked
            if (this.innerText === "Wishlist") {
                
                // Change the Text
                this.innerText = "Added! ";
                
                // Change the Background Color to Pink
                this.style.backgroundColor = "#ff7bf8";
                this.style.color = "white";

                // Make the website "Say Something" (Alert)
                alert("You added '" + productTitle + "' to your wishlist!");

            } else {
                // Undo the changes if clicked again
                this.innerText = "Wishlist";
                this.style.backgroundColor = "#7d1fff"; // Original purple
                this.style.color = "black";
            }
        });
    });
});
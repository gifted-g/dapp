document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("booking-form");
    const output = document.getElementById("output");
    const remainingTicketsEl = document.getElementById("remaining-tickets");
  
    // Fetch initial data (remaining tickets)
    fetch('/remainingTickets')
      .then(response => response.json())
      .then(data => {
        remainingTicketsEl.textContent = data.remainingTickets;
      })
      .catch(error => console.error('Error fetching tickets:', error));
  
    // Form submit handler
    form.addEventListener("submit", function (e) {
      e.preventDefault();
  
      const formData = new FormData(form);
      const data = {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        tickets: parseInt(formData.get("tickets"))
      };
  
      fetch('/bookTicket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            output.textContent = `Thank you ${data.firstName} for booking ${data.tickets} tickets! You will receive a confirmation email shortly.`;
            remainingTicketsEl.textContent = result.remainingTickets;
          } else {
            output.textContent = `Error: ${result.message}`;
            output.style.color = "red";
          }
        })
        .catch(error => {
          output.textContent = "Error booking tickets. Please try again.";
          output.style.color = "red";
          console.error("Error:", error);
        });
    });
  });
  =
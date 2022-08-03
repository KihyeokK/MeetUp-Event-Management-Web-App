const modalBtns = document.querySelectorAll("#modalBtn"); // buttons that open modal
const modalInput = document.getElementById("modalInput");

// when modal button is clicked (delete button), the corresponding event id
// is passed to modal input as a value.
// this event id will then be sent with POST request.
// The event id will be used to delete the correct event.

modalBtns.forEach((element) => {
  element.addEventListener("click", (e) => {
    const eventId = e.target.dataset.id;
    modalInput.value = eventId;
  });
});

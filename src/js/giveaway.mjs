
const GIVEAWAY_KEY = "sleepOutside:giveawaySeen";

export default function initGiveaway() {
  const modal = document.querySelector("#giveaway-modal");
  const closeButton = document.querySelector("#giveaway-close");
  const dismissButton = document.querySelector("#giveaway-dismiss");
  const registerButton = document.querySelector(".giveaway-register");

  if (!modal) return;

  // Only show the giveaway to first-time visitors
  if (!localStorage.getItem(GIVEAWAY_KEY)) {
    modal.hidden = false;
    localStorage.setItem(GIVEAWAY_KEY, "true");
  }

  // Close the giveaway modal
  function closeModal() {
    modal.hidden = true;
  }

  closeButton.addEventListener("click", closeModal);
  dismissButton.addEventListener("click", closeModal);

  // Remember visitors who choose to register
  registerButton.addEventListener("click", () => {
    localStorage.setItem(GIVEAWAY_KEY, "true");
  });

  // Close modal when clicking outside the content
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
}

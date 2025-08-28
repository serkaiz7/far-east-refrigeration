document.getElementById("submitBtn").addEventListener("click", function() {
  const form = document.getElementById("contactForm");

  // Collect form data
  const formData = new FormData(form);
  let output = "CONTACT FORM SUBMISSION\n\n";
  formData.forEach((value, key) => {
    output += `${key.toUpperCase()}: ${value}\n`;
  });

  // Create text file
  const blob = new Blob([output], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "contact-form.txt";
  link.click();

  // Show Messenger share note
  document.getElementById("submitNote").classList.remove("hidden");
});

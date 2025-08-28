document.getElementById("submitBtn").addEventListener("click", function() {
  const form = document.getElementById("contactForm");

  html2canvas(form).then(canvas => {
    let link = document.createElement("a");
    link.download = "contact-form.png";
    link.href = canvas.toDataURL("image/png");
    link.click();

    document.getElementById("submitNote").classList.remove("hidden");

    // Redirect to Messenger after 2s
    setTimeout(() => {
      window.open("https://m.me/fabale2005", "_blank");
    }, 2000);
  });
});

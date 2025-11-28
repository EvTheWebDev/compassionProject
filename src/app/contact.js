function setupContactFormHandler() {
  const form = document.getElementById('contactForm');

  if (!form) {
    console.error("Contact form element (#contactForm) not found. Check router timing.");
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitButton = form.querySelector('.btn-submit');
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    const formData = new FormData(form);
    
    // Convert FormData to a JSON object matching your form fields
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
    };

    try {
      // Send data to your Vercel/Node API endpoint
      const response = await fetch('/api/send_email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('Thank you for contacting us! We will get back to you soon.');
        form.reset();
      } else {
        alert('There was a problem submitting your form. The server rejected the request.');
      }
    } catch (error) {
      console.error("Form submission error:", error);
      alert('There was a network error submitting your form.');
    } finally {
        submitButton.textContent = 'Send Message';
        submitButton.disabled = false;
    }
  });
}
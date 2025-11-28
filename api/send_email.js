import { Resend } from 'resend';

// Initialize Resend using the environment variable
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Ensure only POST requests are processed
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Destructure the form data sent from the client
  const { name, email, subject, message } = req.body;
  
  const finalSubject = `New Contact Form: ${subject || 'No Subject'} (${name})`;
  
  // Construct the email body using HTML
  const body = `
    <h1>New Contact Submission for The Compassion Project</h1>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <hr/>
    <p><strong>Message:</strong></p>
    <p style="white-space: pre-wrap;">${message}</p>
  `;
    
  try {
    await resend.emails.send({
      from: 'Contact Form <noreply@yourdomain.org>', // Must be a domain you verified with Resend
      to: 'yourcompanyemail@example.com', // 🔑 Change this to your actual receiving email
      reply_to: email, // Set sender's email as reply-to
      subject: finalSubject,
      html: body,
    });
    
    // Success response
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Resend Error:', error);
    res.status(500).json({ success: false, message: 'Error sending email via Resend.' });
  }
}
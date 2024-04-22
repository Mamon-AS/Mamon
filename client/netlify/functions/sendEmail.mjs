import { MailService, send } from '@sendgrid/mail';
import axios from 'axios';
import process from 'process';
import validator from 'validator';

const sendgridClient = new MailService();

sendgridClient.setApiKey(process.env.VITE_SENDGRID_API_KEY);

exports.handler = async (event) => {

  const data = JSON.parse(event.body);

  // Sanitize inputs
  const sanitizedEmail = validator.normalizeEmail(data.email);
  const sanitizedMessage = validator.escape(data.message);
  const sanitizedName = validator.escape(data.name);
  const sanitizedPhone = data.phone ? validator.escape(data.phone) : '';

  const msg = {
    to: 'Hei@mamon.no',
    from: 'Hei@mamon.no', // Yes, this is correct - because you are not allowed to receive emails on your domain from SendGrid
    subject: 'Ny melding ' + sanitizedName + '.',
    text: `Navn: ${sanitizedName}\nEpost: ${sanitizedEmail}\nTelefon: ${sanitizedPhone}\nMelding: ${sanitizedMessage}`,
    html: `<strong>Navn:</strong> ${sanitizedName}<br><strong>Epost:</strong> ${sanitizedEmail}<br><strong>Telefon:</strong> ${sanitizedPhone || 'Sendte ikke tlf'}<br><strong>Melding:</strong> ${sanitizedMessage}`,
  };

  try {
    await axios({
      method: 'post',
      url: 'https://api.sendgrid.com/v3/mail/send',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ personalizations: [{ to: [{ email: msg.to }] }], from: { email: msg.from }, subject: msg.subject, content: [{ type: 'text/plain', value: msg.text }] })
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully" })
    };
  } catch (error) {
    console.error('SendGrid error', error.response ? error.response.data : error.message);
    return {
      statusCode: error.response.status || 500,
      body: JSON.stringify({ message: "Failed to send email" })
    };
  }
}

import process from 'process';
import validator from 'validator';
import mailchimpTransactional from '@mailchimp/mailchimp_transactional' 

const mailchimpClient = mailchimpTransactional(process.env.VITE_MANDRILL_API_KEY);

 exports.handler = async (event) => {
   const data = JSON.parse(event.body);
   // Sanitize inputs
   
   const newsletter = data.newsletter;
   const sanitizedEmail = validator.normalizeEmail(data.email);
   const sanitizedMessage = validator.escape(data.message);
   const sanitizedName = validator.escape(data.name);
   const sanitizedPhone = data.phone ? validator.escape(data.phone) : '';
   const msg = {
     from_email: "Hei@mamon.no",
     status: newsletter ? "subscribed" : "pending",
     to: [
       { email: "Hei@mamon.no",
         type: "to"  
       }
     ], 
     subject: 'Ny melding fra ' + sanitizedName + '.',
     text: `Navn: ${sanitizedName}\nEpost: ${sanitizedEmail}\nTelefon: ${sanitizedPhone}\nMelding: ${sanitizedMessage}`,
     html: `<strong>Navn:</strong> ${sanitizedName}<br><strong>Epost:</strong> ${sanitizedEmail}<br><strong>Telefon:</strong> ${sanitizedPhone || 'Sendte ikke tlf'}<br><strong>Melding:</strong> ${sanitizedMessage}`,
   };
   try {
     const response = await mailchimpClient.messages.send({ message: msg });
     return {
       statusCode: 200,
       body: JSON.stringify({ message: "Email sent successfully" })
     };
   } catch (error) {
     console.error('error', error.response ? error.response.data : error.message);
     return {
       statusCode: error.response.status || 500,
       body: JSON.stringify({ message: "Failed to send email" })
     };
   }
 }

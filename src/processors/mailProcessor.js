import mailer from '../config/mailConfig.js';
import mailQueue from "../queues/mailQueue.js";

mailQueue.process( async (job) => {
    const emailData = job.data;
    console.log('Processing email', emailData);

    try {
        const response = await mailer.sendMail(emailData);
        console.log('Email sent', response);
      } catch (error) {
        console.log('Error processing email', error);
      }
    
})
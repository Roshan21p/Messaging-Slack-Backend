import '../processors/mailProcessor.js';

import mailQueue from '../queues/mailQueue.js';

export const addEmailToMailQueue = async (emailData) => {
  console.log('initiating email sending process');
  try {
    const job = await mailQueue.add(emailData);
    console.log('Email added to mail queue');
    return job;
  } catch (error) {
    console.log('Add email to mail queue error', error);
  }
};

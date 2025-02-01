import cron from 'node-cron';

import CronJobs from './jobs';

export default () => {
  try {
    CronJobs.forEach(cj => {
      console.log(`Register cron job *${cj.name}* successful`);
      cron.schedule(cj.interval, cj.handler);
    });
  } catch (error) {
    throw error;
  }
};

// TODO - Expiring function for Bills

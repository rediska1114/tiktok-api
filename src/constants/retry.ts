import { Options } from 'async-retry';

export const RETRY_OPTIONS: Options = {
  retries: 10,
  minTimeout: 1000,
  maxTimeout: 5000,
  factor: 2,
  onRetry: (error, attempt) => {
    console.log(`Retry attempt ${attempt} due to: ${error}`);
  },
};

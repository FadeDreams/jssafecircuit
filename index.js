


import { EventEmitter } from 'events';

export const CircuitBreakerState = {
  CLOSED: 'closed',
  OPEN: 'open',
  HALF_OPEN: 'half_open'
};

export class CircuitBreaker extends EventEmitter {
  constructor(maxFailures, timeout, pauseTime, maxConsecutiveSuccesses) {
    super();
    this.state = CircuitBreakerState.CLOSED;
    this.consecutiveFailures = 0;
    this.totalFailures = 0;
    this.totalSuccesses = 0;
    this.maxFailures = maxFailures;
    this.timeout = timeout;
    this.openTimeout = new Date(0);
    this.pauseTime = pauseTime;
    this.consecutiveSuccesses = 0;
    this.maxConsecutiveSuccesses = maxConsecutiveSuccesses;
  }

  execute(fn) {
    return new Promise(async (resolve, reject) => {
      const executeFunction = async () => {
        try {
          const result = await fn();
          this.handleSuccess();
          resolve(result);
        } catch (error) {
          this.handleFailure();
          reject(error);
        }
      };

      switch (this.state) {
        case CircuitBreakerState.OPEN:
          if (new Date() > this.openTimeout) {
            this.state = CircuitBreakerState.HALF_OPEN;
            this.emit('halfOpen');
          } else {
            return reject(new Error("circuit breaker is open"));
          }
          break;

        case CircuitBreakerState.HALF_OPEN:
          await executeFunction();
          await this.delay(this.pauseTime);
          return;
      }

      await executeFunction();
    });
  }

  handleFailure() {
    this.consecutiveFailures += 1;
    this.totalFailures += 1;
    if (this.consecutiveFailures >= this.maxFailures) {
      this.trip();
    }
  }

  handleSuccess() {
    this.reset();
    this.totalSuccesses += 1;
  }

  trip() {
    this.state = CircuitBreakerState.OPEN;
    this.consecutiveFailures = 0;
    this.consecutiveSuccesses = 0;
    this.openTimeout = new Date(Date.now() + this.timeout * 1000);
    this.emit('open');
  }

  reset() {
    this.state = CircuitBreakerState.CLOSED;
    this.consecutiveFailures = 0;
    this.consecutiveSuccesses = 0;
    this.emit('close');
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  setOnOpen(callback) {
    this.on('open', callback);
  }

  setOnClose(callback) {
    this.on('close', callback);
  }

  setOnHalfOpen(callback) {
    this.on('halfOpen', callback);
  }
}

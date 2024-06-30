
Here is a README.md file for the CircuitBreaker module including the example usage:

### jsSafeCircuit
This module implements a basic circuit breaker pattern in JavaScript using the EventEmitter class from Node.js. The circuit breaker is used to prevent repeated execution of a function that is failing frequently, allowing it to recover before being called again.

### CircuitBreaker States
- CLOSED: The circuit is closed and the function can be executed.
- OPEN: The circuit is open and the function will not be executed.
- HALF_OPEN: The circuit is half-open, allowing the function to be executed on a trial basis.

### Example Usage
```javascript
import { CircuitBreaker, CircuitBreakerState } from 'jssafecircuit';

// Create an instance of CircuitBreaker
const circuitBreaker = new CircuitBreaker(3, 5, 1000, 2);

// Example usage:
const riskyOperation = async () => {
  // Simulating a risky operation that could fail
  if (Math.random() < 0.5) {
    throw new Error('Operation failed');
  }
  return 'Operation successful';
};

circuitBreaker.execute(riskyOperation)
  .then(result => {
    console.log('Success:', result);
  })
  .catch(error => {
    console.error('Error:', error);
  });

// Example: Setting event listeners
circuitBreaker.setOnOpen(() => {
  console.log('Circuit breaker opened');
});

circuitBreaker.setOnClose(() => {
  console.log('Circuit breaker closed');
});

circuitBreaker.setOnHalfOpen(() => {
  console.log('Circuit breaker half-open');
});
```

### methods
- maxFailures: The maximum number of consecutive failures allowed before the circuit opens.
- timeout: The timeout period (in seconds) for which the circuit remains open before transitioning to half-open.
- pauseTime: The pause time (in milliseconds) between executions when the circuit is half-open.
- maxConsecutiveSuccesses: The number of consecutive successes required to reset the circuit to closed.
- execute(fn): Executes the provided function and handles success or failure according to the circuit breaker state.
- handleFailure(): Handles a failure, updating the state and counters.
- handleSuccess(): Handles a success, updating the state and counters.
- trip(): Trips the circuit, setting the state to open and starting the timeout.
- reset(): Resets the circuit, setting the state to closed.
- delay(ms): Returns a promise that resolves after the specified - delay (in milliseconds).
- setOnOpen(callback): Sets a callback to be executed when the circuit opens.
- setOnClose(callback): Sets a callback to be executed when the circuit closes.
- setOnHalfOpen(callback): Sets a callback to be executed when the circuit transitions to half-open.

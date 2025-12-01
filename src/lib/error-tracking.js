/**
 * Error tracking utility for monitoring and logging application errors
 * Can be integrated with services like Sentry, LogRocket, etc.
 */

/**
 * Log error to monitoring service
 * @param {string} errorName - Descriptive error name
 * @param {Error} error - Error object
 * @param {Object} context - Additional context data
 */
export function logError(errorName, error, context = {}) {
  // Console logging for development
  console.error(`[${errorName}]`, {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString()
  })

  // TODO: Integrate with error tracking service
  // Example: Sentry.captureException(error, { tags: { errorName }, extra: context })
  
  // For production, you could send to your backend
  if (process.env.NODE_ENV === 'production') {
    try {
      fetch('/api/log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: errorName,
          message: error.message,
          stack: error.stack,
          context,
          timestamp: new Date().toISOString()
        })
      }).catch(err => console.error('Failed to log error:', err))
    } catch (err) {
      // Silently fail - don't break the app if error logging fails
    }
  }
}

/**
 * Log warning to monitoring service
 * @param {string} warningName - Descriptive warning name
 * @param {string} message - Warning message
 * @param {Object} context - Additional context data
 */
export function logWarning(warningName, message, context = {}) {
  console.warn(`[${warningName}]`, { message, context })
  
  // TODO: Send to monitoring service for production
}

/**
 * Log info event to monitoring service
 * @param {string} eventName - Event name
 * @param {Object} data - Event data
 */
export function logEvent(eventName, data = {}) {
  if (process.env.NODE_ENV === 'development') {
    console.info(`[Event: ${eventName}]`, data)
  }
  
  // TODO: Send to analytics service
}

/**
 * Registration debugging utilities
 * Used to track and debug registration process
 */

class RegistrationLogger {
  constructor(options = {}) {
    this.enabled = options.enabled ?? (import.meta.env.DEV || false);
    this.steps = [];
    this.startTime = null;
    this.errors = [];
  }

  /**
   * Start logging a registration attempt
   * @param {Object} userData - Initial user data (sensitive fields will be masked)
   */
  start(userData) {
    if (!this.enabled) return;

    this.startTime = performance.now();
    const sanitizedData = this._sanitizeUserData(userData);

    this.steps = [
      {
        step: "start",
        timestamp: new Date().toISOString(),
        data: sanitizedData,
      },
    ];

    console.log("🚀 Starting registration process", sanitizedData);
  }

  /**
   * Log a step in the registration process
   * @param {string} step - Step name
   * @param {Object} data - Associated data
   */
  logStep(step, data = {}) {
    if (!this.enabled) return;

    const stepInfo = {
      step,
      timestamp: new Date().toISOString(),
      timeFromStart: performance.now() - this.startTime,
      data,
    };

    this.steps.push(stepInfo);
    console.log(`➡️ Registration step: ${step}`, data);
  }

  /**
   * Log an error during registration
   * @param {string} step - Step where error occurred
   * @param {Error|Object} error - Error object
   */
  logError(step, error) {
    if (!this.enabled) return;

    const errorInfo = {
      step,
      timestamp: new Date().toISOString(),
      timeFromStart: performance.now() - this.startTime,
      message: error.message || "Unknown error",
      code: error.code,
      status: error.status,
      details: error,
    };

    this.errors.push(errorInfo);
    this.steps.push({
      step: `error:${step}`,
      timestamp: new Date().toISOString(),
      timeFromStart: performance.now() - this.startTime,
      error: errorInfo,
    });

    console.error(`❌ Registration error at step ${step}:`, error);
  }

  /**
   * Complete the registration process
   * @param {boolean} success - Whether registration was successful
   * @param {Object} data - Result data
   */
  complete(success, data = {}) {
    if (!this.enabled) return;

    const endTime = performance.now();
    const duration = endTime - this.startTime;

    const result = {
      success,
      timestamp: new Date().toISOString(),
      duration,
      steps: this.steps.length,
      errors: this.errors.length,
      data,
    };

    this.steps.push({
      step: "complete",
      timestamp: new Date().toISOString(),
      timeFromStart: duration,
      data: result,
    });

    console.log(
      `${success ? "✅" : "❌"} Registration ${
        success ? "completed" : "failed"
      } in ${duration.toFixed(2)}ms`
    );

    if (success) {
      console.log("Registration summary:", {
        duration: `${duration.toFixed(2)}ms`,
        steps: this.steps.length - 2, // Exclude start/complete
        user: this._sanitizeUserData(data),
      });
    } else {
      console.warn("Registration failed:", {
        duration: `${duration.toFixed(2)}ms`,
        errors: this.errors,
        lastStep: this.steps[this.steps.length - 2]?.step,
      });
    }

    // Save to sessionStorage for debugging tools
    if (typeof window !== "undefined") {
      try {
        const sessionData = {
          timestamp: new Date().toISOString(),
          success,
          duration,
          steps: this.steps,
          errors: this.errors,
        };
        sessionStorage.setItem(
          "lastRegistrationAttempt",
          JSON.stringify(sessionData)
        );
      } catch (err) {
        console.error(
          "Failed to save registration log to session storage",
          err
        );
      }
    }
  }

  /**
   * Get the registration log
   * @returns {Object} The full registration log
   */
  getLog() {
    return {
      enabled: this.enabled,
      startTime: this.startTime,
      steps: this.steps,
      errors: this.errors,
      duration: this.startTime ? performance.now() - this.startTime : 0,
    };
  }

  /**
   * Sanitize user data by masking sensitive fields
   * @private
   * @param {Object} userData - User data to sanitize
   * @returns {Object} Sanitized user data
   */
  _sanitizeUserData(userData) {
    if (!userData) return {};

    const sanitized = { ...userData };

    // Mask sensitive fields
    if (sanitized.password) sanitized.password = "********";
    if (sanitized.confirmPassword) sanitized.confirmPassword = "********";

    // Email anonymization for production
    if (!import.meta.env.DEV && sanitized.email) {
      const [username, domain] = sanitized.email.split("@");
      if (username && domain) {
        sanitized.email = `${username.substring(0, 2)}***@${domain}`;
      }
    }

    return sanitized;
  }
}

// Create a singleton instance
export const registrationLogger = new RegistrationLogger();

// Export for direct use
export default registrationLogger;

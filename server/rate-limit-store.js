"use strict";

class DailyIpRateLimiter {
  constructor({ limit, windowMs }) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.store = new Map();
  }

  consume(key, now = Date.now()) {
    this.prune(now);

    const current = this.store.get(key);
    if (!current || current.resetAt <= now) {
      const nextEntry = { count: 1, resetAt: now + this.windowMs };
      this.store.set(key, nextEntry);
      return {
        allowed: true,
        remaining: Math.max(this.limit - 1, 0),
        limit: this.limit,
        resetAt: nextEntry.resetAt
      };
    }

    if (current.count >= this.limit) {
      return {
        allowed: false,
        remaining: 0,
        limit: this.limit,
        resetAt: current.resetAt
      };
    }

    current.count += 1;
    return {
      allowed: true,
      remaining: Math.max(this.limit - current.count, 0),
      limit: this.limit,
      resetAt: current.resetAt
    };
  }

  prune(now = Date.now()) {
    for (const [key, entry] of this.store.entries()) {
      if (entry.resetAt <= now) {
        this.store.delete(key);
      }
    }
  }
}

module.exports = {
  DailyIpRateLimiter
};

const requests = new Map();

// Simple in-memory per-user rate limiter for AI endpoint
// Limit: 6 requests per 60 seconds per user
export const aiRateLimiter = (req, res, next) => {
  try {
    const userId = req.user?._id?.toString() || req.ip;
    const now = Date.now();
    const windowMs = 60 * 1000; // 60s
    const maxRequests = 6;

    const entry = requests.get(userId) || { timestamps: [] };
    // prune old
    entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

    if (entry.timestamps.length >= maxRequests) {
      return res.status(429).json({ message: 'Rate limit exceeded for AI endpoint' });
    }

    entry.timestamps.push(now);
    requests.set(userId, entry);
    next();
  } catch (err) {
    console.error('aiRateLimiter error', err);
    next();
  }
};

// Optional: cleanup map periodically to avoid memory leak in long-running server
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of requests.entries()) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < 60 * 1000);
    if (entry.timestamps.length === 0) requests.delete(key);
  }
}, 60 * 1000).unref && 60 * 1000;

import aj from '#config/arcjet.js';
import logger from '#config/logger.js';
import { slidingWindow } from '@arcjet/node';

export const securityMiddleware = async (req, res, next) => {
  try {
    const role = req.user?.role || 'guest';

    let limit;
    let message;

    switch (role) {
      case 'admin':
        limit = 20;
        message =
          'Admin request limit exceeded (20 requests per minute). Slow down!';
        break;
      case 'user':
        limit = 10;
        message =
          'User request limit exceeded (10 requests per minute). Please wait before making more requests.';
        break;
      default:
        limit = 5;
        message =
          'Guest request limit exceeded (5 requests per minute). Consider signing up for more access.';
    }

    const client = aj.withRule(
      slidingWindow({
        mode: 'LIVE',
        interval: '1m',
        max: limit,
        name: `${role}_rate_limit`,
      })
    );

    const decision = await client.protect(req);

    if (decision.isDenied() && decision.reason.isBot()) {
      logger.warn('Bot request blocked , ', {
        ip: req.ip,
        userAgent: req.headers['User-Agent'],
        path: req.path,
      });
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied due to suspected bot activity.',
      });
    }
    if (decision.isDenied() && decision.reason.isShield()) {
      // Top 10 OWASP
      logger.warn('Shield request blocked , ', {
        ip: req.ip,
        userAgent: req.headers['User-Agent'],
        path: req.path,
        method: req.method,
      });
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied due to security policy violation.',
      });
    }
    if (decision.isDenied() && decision.reason.isRateLimit()) {
      logger.warn(`Rate limit exceeded for ${role} , `, {
        ip: req.ip,
        userAgent: req.headers['User-Agent'],
        path: req.path,
        method: req.method,
      });
      return res.status(429).json({
        error: 'Too Many Requests',
        message,
      });
    }
    next();
  } catch (e) {
    logger.error('Arcjet middleware Error', e);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Something went wrong with Security Middleware',
    });
  }
};

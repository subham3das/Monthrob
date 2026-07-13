import AdminLog from '../models/AdminLog.js';

export const logAdminAction = (req, res, next) => {
  res.on('finish', () => {
    if (res.statusCode >= 200 && res.statusCode < 300 && ['POST', 'PUT', 'DELETE'].includes(req.method) && req.user?.role === 'admin') {
      let resource = req.originalUrl.split('/')[2] || 'Resource';
      // Format resource properly (e.g., 'categories' -> 'Categories')
      resource = resource.charAt(0).toUpperCase() + resource.slice(1).split('?')[0];
      
      let action = `Modified ${resource}`;
      if (req.method === 'POST') action = `Created ${resource}`;
      if (req.method === 'DELETE') action = `Deleted ${resource}`;
      
      // Specifically avoid logging the /logs endpoint itself
      if (resource.toLowerCase() === 'logs') return;

      AdminLog.create({
        adminEmail: req.user.email || req.user.id, // Fallback if email is missing in older tokens
        action: action
      }).catch(err => console.error("Logger error:", err));
    }
  });
  next();
};

const audit = require('audit-js');

audit.setup({
  path: 'audit_logs',
  useUnifiedTopology: true
});

module.exports = audit;
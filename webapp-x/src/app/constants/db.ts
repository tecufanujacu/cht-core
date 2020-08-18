export const DB_SYNC = Object.freeze({
  READ_ONLY_TYPES: ['form', 'translations'],
  READ_ONLY_IDS: ['resources', 'branding', 'service-worker-meta', 'zscore-charts', 'settings', 'partners'],
  DDOC_PREFIX: ['_design/'],
  LAST_REPLICATED_SEQ_KEY: 'medic-last-replicated-seq',
  LAST_REPLICATED_DATE_KEY: 'medic-last-replicated-date',
  SYNC_INTERVAL: 5 * 60 * 1000, // 5 minutes
  META_SYNC_INTERVAL: 30 * 60 * 1000, // 30 minutes
  MAX_REPLICATION_RETRY_COUNT: 3
});

// Regex to test for characters that are invalid in db names
// Only lowercase characters (a-z), digits (0-9), and any of the characters _, $, (, ), +, -, and / are allowed.
// https://wiki.apache.org/couchdb/HTTP_database_API#Naming_and_Addressing
export const DB_CONFIG = Object.freeze({
  DISALLOWED_CHARS: /[^a-z0-9_$()+/-]/g,
  USER_DB_SUFFIX: 'user',
  META_DB_SUFFIX: 'meta',
  USERS_DB_SUFFIX: 'users'
});

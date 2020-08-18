export const SYNC_STATUS = Object.freeze({
  inProgress: Object.freeze({
    icon: 'fa-refresh',
    key: 'sync.status.in_progress',
    disableSyncButton: true
  }),
  success: Object.freeze({
    icon: 'fa-check',
    key: 'sync.status.not_required',
    className: 'success'
  }),
  required: Object.freeze({
    icon: 'fa-exclamation-triangle',
    key: 'sync.status.required',
    className: 'required'
  }),
  unknown: Object.freeze({
    icon: 'fa-info-circle',
    key: 'sync.status.unknown'
  })
});

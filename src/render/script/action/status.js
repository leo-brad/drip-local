export function updateStatus({ instance, field, }) {
  return {
    type: 'status/update',
    field,
    instance,
  };
}

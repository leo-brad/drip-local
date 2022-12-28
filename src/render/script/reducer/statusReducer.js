export default function statusReducer(state = { status: {}, }, action) {
  let ans = state;
  if (action.type === 'status/update') {
    const { instance, field, } = action;
    const newStatus = {};
    newStatus[instance] = field;
    ans = { ...state, ...newStatus, };
  }
  return ans;
}

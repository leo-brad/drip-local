export default function statusReducer(state = {}, action) {
  let ans = state;
  if (action.type === 'status/update') {
    const { instance, field, } = action;
    ans[instance] = field;
    ans = { ...ans, };
  }
  return ans;
}

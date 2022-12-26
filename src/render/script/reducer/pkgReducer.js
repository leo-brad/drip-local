export default function pkgReducer(state = { pkg: [], }, action) {
  let ans = state;
  if (action.type === 'pkg/update') {
    const pkg = {};
    action.pkg.forEach((p) => {
      new Function(p)();
      const { name, exports, } = window.module;
      pkg[name] = exports;
    });
    delete window.module;
    ans = { ...state, pkg, };
  }
  return ans;
}

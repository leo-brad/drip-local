export function updatePkg(pkg) {
  return {
    type: 'pkg/update',
    pkg,
  };
}

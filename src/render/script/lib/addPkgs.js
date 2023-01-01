import global from '~/render/script/obj/global';

export default function addPkgs(pkgs) {
  const { pkg, } = global;
  pkgs.forEach((p) => {
    new Function(p)();
    const { name, exports, } = window.module;
    pkg[name] = exports;
  });
  delete window.module;
}

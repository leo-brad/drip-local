import { renderToStaticMarkup, } from 'react-dom/server';
import global from '~/render/script/obj/global';

export default function renderToNode(component) {
  let elem;
  if (typeof component.type === 'function') {
    const { template, } = global;
    template.innerHTML = renderToStaticMarkup(component);
    elem = template.children[0];
  } else {
    elem = document.createElement(component.type);
    const { props, } = component;
    Object.keys(props).forEach((k) => {
      switch (k) {
        case 'children': {
          const children = props[k];
          if (typeof children === 'string') {
            elem.append(children);
          }
          if (Array.isArray(children)) {
            childrens.forEach((c) => {
              if (typeof c === 'string') {
                elem.append(c);
              } else {
                elem.append(renderToNode(c));
              }
            })
          }
        }
        default:
          elem.setAttribute(k, props[k]);
          break;
      }
    });
  }
  return elem;
}

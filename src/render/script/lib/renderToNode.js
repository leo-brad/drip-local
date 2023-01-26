export default function renderToNode(component) {
  const elem = document.createElement(component.type);
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
        switch (k) {
          case 'className':
            elem.setAttribute('class', props[k]);
            break;
          default:
          elem.setAttribute(k, props[k]);
        }
        break;
    }
  });
  return elem;
}

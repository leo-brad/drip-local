import ReactDOM from 'react-dom/client';
import React from 'react';
import global from '~/render/script/obj/global';
import Router from '~/render/script/component/Router';
import Template from '~/render/script/component/Template';
import communicate from '~/render/script/lib/communicate';
import syncData from '~/render/script/lib/syncData';
import focusAndBlur from '~/render/script/lib/focusAndBlur';

syncData();
focusAndBlur();

const root = ReactDOM.createRoot(document.getElementById('root'));
const router = <Router key={0} />;
global.router = router;
root.render([
  <Template key={1} />,
  router,
]);

communicate();

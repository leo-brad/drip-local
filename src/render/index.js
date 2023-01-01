import ReactDOM from 'react-dom';
import React from 'react';
import { Provider, } from 'react-redux';
import { HashRouter, Routes, Route, } from 'react-router-dom';
import '~/render/style/index.css';
import Home from '~/render/script/page/Home';
import store from '~/render/script/obj/store';

import communicate from '~/render/script/lib/communicate';
import syncContent from '~/render/script/lib/syncContent';
import focusAndBlur from '~/render/script/lib/focusAndBlur';

communicate(store);
syncContent();
focusAndBlur();

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </HashRouter>
  </Provider>,
  document.getElementById('root'),
);

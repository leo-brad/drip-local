import ReactDOM from 'react-dom';
import React from 'react';
import { HashRouter, Routes, Route, } from 'react-router-dom';
import '~/render/style/index.css';
import Home from '~/render/script/page/Home';
import communicate from '~/render/script/lib/communicate';
import syncData from '~/render/script/lib/syncData';
import focusAndBlur from '~/render/script/lib/focusAndBlur';

syncData();
focusAndBlur();

ReactDOM.render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  </HashRouter>,
  document.getElementById('root'),
);

communicate();

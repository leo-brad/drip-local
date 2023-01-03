import ReactDOM from 'react-dom';
import React from 'react';
import { HashRouter, Routes, Route, } from 'react-router-dom';
import '~/render/style/index.css';
import Home from '~/render/script/page/Home';
import main from '~/render/script/lib/main';

ReactDOM.render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  </HashRouter>,
  document.getElementById('root'),
);

main();

import React from 'react';
import * as RouterDom from 'react-router-dom';
import { Provider } from  'mobx-react';
import Game from './page/game/game';
import Menu from './page/menu/menu';

import rootStore from './store/rootStore';
import 'antd/dist/antd.css';
import './app.less';

const { BrowserRouter, Switch, Route, Redirect } = RouterDom;

function App() {
  return (
    <div className="App">   
      <Provider {...rootStore}>
        <BrowserRouter>
          <Switch>
            <Route path='/menu' component={Menu}/>
            <Route path='/game' component={Game}/>
            <Redirect to='/menu'/>
          </Switch>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;

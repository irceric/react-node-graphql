import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from './Header';
import ProductList from './ProductList';
import CreateProduct from './CreateProduct';
import Login from './Login';
import Search from './Search';
class App extends Component {
  render() {
    return (
      <div className="center w85">
        <Header />
        <div className="ph3 pv1 background-gray">
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/" component={ProductList} />
            <Route exact path="/create" component={CreateProduct} />
            <Route exact path="/search" component={Search} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;

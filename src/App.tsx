import * as React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import FrontPage from './components/frontpage';
import About from './components/about';

export const App: React.FunctionComponent = () => {
    return (
        <Router>
            <Switch>
                <Route path="/about">
                    <About />
                </Route>
                <Route path="/">
                    <FrontPage />
                </Route>
            </Switch>
        </Router>
    );
};

export default App;

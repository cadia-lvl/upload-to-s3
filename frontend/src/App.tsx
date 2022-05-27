import * as React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import FrontPage from './components/frontpage';
import Thanks from './components/thanks';

export const App: React.FunctionComponent = () => {
    return (
        <Router>
            <Switch>
                <Route path="/takk">
                    <Thanks />
                </Route>
                <Route path="/">
                    <FrontPage />
                </Route>
            </Switch>
        </Router>
    );
};

export default App;

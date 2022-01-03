import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';

import MainRoute from './routes/MainRoute';
import store from './store';

const App = () => {

    return (
        <ReduxProvider store={store}>
            <MainRoute />
        </ReduxProvider>
    )
}
export default App;
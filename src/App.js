import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import AuthProvider from './utils/useAuth';

import MainRoute from './routes/MainRoute';
import store from './store';

const App = () => {

    return (
        <ReduxProvider store={store}>
            <AuthProvider>
                <MainRoute />
            </AuthProvider>
        </ReduxProvider>
    )
}
export default App;
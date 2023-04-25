import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { PersistGate } from 'redux-persist/integration/react';
import './asset/style/App.scss';
import LayoutWrapper from './component/LayoutWrapper';
import { configureStore } from './store/store';

function App() {
    return (
        <>
            <ToastContainer />
            <Provider store={configureStore.store}>
                <PersistGate
                    loading={null}
                    persistor={configureStore.persistor}
                >
                    <BrowserRouter>
                        <LayoutWrapper />
                    </BrowserRouter>
                </PersistGate>
            </Provider>
        </>
    );
}

export default App;

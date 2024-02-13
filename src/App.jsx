import './App.css';
import NotePage from './pages/note-page';

import { Provider } from 'react-redux';
import store from './data/store';
function App() {
  return (
    <>
      <div className='main'>
        <Provider store={store}>
          <NotePage />
        </Provider>
      </div>
    </>
  );
}

export default App;

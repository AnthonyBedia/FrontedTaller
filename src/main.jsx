import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { store } from './general/store';
import { Provider } from 'react-redux';
import { AyudaDocWeb } from './AyudaDocWeb';

createRoot(document.getElementById('root')).render(
      <Provider store={ store }>
        <BrowserRouter>
          <AyudaDocWeb />
        </BrowserRouter>
      </Provider>
)

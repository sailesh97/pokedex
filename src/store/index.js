import { configureStore } from '@reduxjs/toolkit';

import contentReducer from './content-slice';
import filterReducer from './filter-slice';


const store = configureStore({
  reducer: { content: contentReducer, filter: filterReducer },
});

export default store;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pokemonData: [],
  weakAgainstData: [] // Array of Objects where each object looks like, {typeId: '1', typeName:'normal', weakAgainst: []}
};

const contentSlice = createSlice({
  name: 'content',
  initialState: initialState,
  reducers: {
    addData(state, action){
      state.pokemonData.push(action.payload.data);
    },
    addWeakAgainstDataOfAPokemon(state, action){
      const pokemonTypeData = {typeId: action.payload.typeId, typeName: action.payload.typeName ,weakAgainst: action.payload.weakAgainst}
      state.weakAgainstData.push(pokemonTypeData);
    },
    replaceData(state, action) {
        state.pokemonData = action.payload.data;
    }
  },
});

export const contentActions = contentSlice.actions;

export default contentSlice.reducer;
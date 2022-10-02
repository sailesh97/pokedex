import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    searchKeyword: '',
    typeFilter: [],
    genderFilter: [],
    selectedTypes: {},
    selectedGender: {}
};

const filterSlice = createSlice({
    name: 'filter',
    initialState: initialState,
    reducers: {
        setGenderFilter(state, action){
            state.genderFilter.push(...action.payload.gender)
        },
        setTypeFilter(state, action){
            state.typeFilter.push(...action.payload.type)
        },
        updateSearchKeyword(state, action){
            state.searchKeyword = action.payload.keyword;
        },
        updateTypeFilter(state, action){
            state.selectedTypes[action.payload.name] = action.payload.value;
        },
        updateGenderFilter(state, action){
            state.selectedGender[action.payload.name] = action.payload.value;
        },
        updateGenderFilterWithArrayofSelectedValues(state, action){
            state.selectedGender = action.payload;
        },
        updateTypeFilterWithArrayofSelectedValues(state, action){
           state.selectedTypes = action.payload;
        },
        resetTypeState(state, action){
            state.selectedTypes = action.payload;
        },
        resetGenderState(state, action){
            state.selectedGender = action.payload;
        }
    },
});

export const filterActions = filterSlice.actions;

export default filterSlice.reducer;
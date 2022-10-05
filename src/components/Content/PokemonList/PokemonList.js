import React from 'react';
import {useSelector} from 'react-redux';
import Pokemon from './Pokemon/Pokemon';
import classes from './PokemonList.module.css';
const PokemonList = () => {
    let contentData = useSelector(state => state.content.pokemonData);

    // Filtering Data based on Search Keyword
    let searchKeyword = useSelector(state => state.filter.searchKeyword);
    if(searchKeyword !== ''){
        let key = '';
        key = isNaN(parseInt(searchKeyword)) ? 'name' : 'id';
        contentData = contentData.filter(content => {
            if(key === 'name'){
                return content[key].toLowerCase().startsWith(searchKeyword.toLowerCase());
            } else{
                searchKeyword = searchKeyword.toString();

                let pokemonId = content[key].toString();
                if(pokemonId.length == 1){ pokemonId = "00" + pokemonId}
                if(pokemonId.length == 2){ pokemonId = "0" + pokemonId}

                return pokemonId.toString().toLowerCase().startsWith(searchKeyword.toLowerCase());

                // return content[key] === parseInt(searchKeyword);
            }
        })
    }

    // Filtering Data based on selected type
    let selectedTypes = useSelector(state => state.filter.selectedTypes);
    let keys = Object.keys(selectedTypes);

    let selectedTypesCopy = {...selectedTypes};
    keys.map(key => {
        if(selectedTypesCopy[key] === false){
            delete selectedTypesCopy[key];
        }
    })
    
    keys = Object.keys(selectedTypesCopy);
    console.log("Update--selectedTypesCopy", selectedTypesCopy, keys)
    contentData = contentData.filter(pokemon => {
        let found = false;
        for (let i = 0; i < pokemon.types.length; i++) {
            let pokemonType = pokemon.types[i];
            let typeName = pokemonType["type"]['name'];
            console.log("selectedTypesCopy", selectedTypesCopy);
            if (selectedTypesCopy && keys.length > 0) {
                for (let i = 0; i < keys.length; i++) {
                    let key = keys[i];
                    if (selectedTypesCopy[key]) {
                        if (key === typeName) {
                            console.log(key, typeName)
                            found = true;
                            break;
                        }
                    }
                }
            }
            else {
                found = true;
            }
        }
        return found;
    })


    // Filtering Data based on selected gender
    let selectedGender = useSelector(state => state.filter.selectedGender);
    let selectedGenderCopy = {...selectedGender};
    let genderKeys = Object.keys(selectedGenderCopy);
    genderKeys.map(key => {
        if(selectedGenderCopy[key] === false){
            delete selectedGenderCopy[key];
        }
    })
    genderKeys = Object.keys(selectedGenderCopy);
    console.log("Selected Gendrr----", selectedGenderCopy);
    contentData = contentData.filter(pokemon => {
        if (selectedGenderCopy && genderKeys.length > 0) {
            let found = false;
            for (let i = 0; i < genderKeys.length; i++) {
                let key = genderKeys[i];
                if (selectedGenderCopy[key]) {
                    if (pokemon.gender[key]) {
                        found = true;
                        break;
                    }
                }
            }
            return found;
        } else {
            return true;
        }
    });
    
    // Sorting Filtered Data Based on Id
    contentData = contentData.slice().sort((a, b) => a.id - b.id)

    return (
        <div className={`${classes.container_p} container mt-4`}>
            <div className="row">
                {contentData.map(content => <Pokemon key={content.id} pokemonDetails={content}/>)}
                {contentData.length === 0 && <p className={classes.nopokemons}>No pokemons with selected filters found.</p>}
            </div>
        </div>
    );
}

export default PokemonList
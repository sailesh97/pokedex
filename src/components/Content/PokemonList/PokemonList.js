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
    contentData = contentData.filter(pokemon => {
        let found = false;
        for (let i = 0; i < pokemon.types.length; i++) {
            let pokemonType = pokemon.types[i];
            let typeName = pokemonType["type"]['name'];
            console.log("selectedTypes", selectedTypes);
            let keys = Object.keys(selectedTypes);
            if (selectedTypes && keys.length > 0) {
                for (let i = 0; i < keys.length; i++) {
                    let key = keys[i];
                    if (selectedTypes[key]) {
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
    contentData = contentData.filter(pokemon => {
        let keys = Object.keys(selectedGender);
        if (selectedGender && keys.length > 0) {
            let found = false;
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                if (selectedGender[key]) {
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
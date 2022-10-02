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
    Object.keys(selectedTypes).map(key => {
        if(selectedTypes[key]){
            contentData = contentData.filter(pokemon => {
                let found = false;
                for(let i = 0; i < pokemon.types.length; i++){
                    let pokemonType = pokemon.types[i];
                    let typeName = pokemonType["type"]['name'];
                    if(key === typeName){
                        found = true;
                        break;
                    }
                }
                return found;
            })
        }
    })

    // Filtering Data based on selected gender
    let selectedGender = useSelector(state => state.filter.selectedGender);
    Object.keys(selectedGender).map(key => {
        if(selectedGender[key]){
            contentData = contentData.filter(pokemon => {
                return pokemon.gender[key];
            })
        }
    })
    
    // Sorting Filtered Data Based on Id
    contentData = contentData.slice().sort((a, b) => a.id - b.id)

    return (
        <div className={`${classes.container_p} container mt-4`}>
            <div className="row">
                {contentData.map(content => <Pokemon key={content.id} pokemonDetails={content}/>)}
            </div>
        </div>
    );
}

export default PokemonList
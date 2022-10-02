import React from 'react';
import classes from './Pokemon.module.css';
import { useState } from 'react';
import Modal from '../../../../UI/Modal/Modal';
import PokemonDetailsModal from '../PokemonDetailsModal/PokemonDetailsModal';
import PokemonDetailsBackdrop from '../PokemonDetailsBackdrop/PokemonDetailsBackdrop';
import Color from '../../../../colors/colors';
const Pokemon = (props) => {
    const [modalState, setModalState] = useState(false);
    
    const showModal = () => {
        setModalState(true)
    }

    const hideModal = () => {
        setModalState(false);
    }
    
    const url = props.pokemonDetails.sprites.other.dream_world.front_default;
    let pokemonName = props.pokemonDetails.name;
    pokemonName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);

    let pokemonId = props.pokemonDetails.id.toString();
    if (pokemonId.length === 1) {
        pokemonId = "00" + pokemonId;
    } else if (pokemonId.length === 2) {
        pokemonId = "0" + pokemonId;
    }

    const backdrop = { element: <PokemonDetailsBackdrop onConfirm={hideModal} />, place: 'PokemonDetailsBackdrop' };
    const modal = { element: <PokemonDetailsModal data={props.pokemonDetails} title="Pokemon" onConfirm={hideModal} />, place: 'PokemonDetailsModal' };

    let pokemonTypes = [];
    props.pokemonDetails.types.map(type => {
        type = type['type'];
        pokemonTypes.push(type.name);
    });

    let color1 = Color[pokemonTypes[0]], color2 = Color[pokemonTypes[1]];

    
    return (
        <React.Fragment>
            <div className={`col px-md-2 py-md-4 m-md-3 ${classes.pokemon_container}`} 
                style={{background: 
                        pokemonTypes.length >= 2 ? `linear-gradient(${color1}, ${color2})` 
                            : `${color1}`
                }}
                onClick={showModal}>
                <img className={classes.pokemon_image} src={url} alt={props.pokemonDetails.name} />
                <p className={classes.pokemon_name}>{pokemonName}</p>
                <p className={classes.pokemonId}>{pokemonId}</p>
            </div>

            {modalState && <Modal
                backdrop={backdrop}
                modal={modal}
            />}
        </React.Fragment>
    )
}

export default Pokemon;
import classes from './PokemonDetailsBackdrop.module.css';

const PokemonDetailsBackdrop = (props) => {
    return <div className={classes.backdrop} onClick={props.onConfirm} />;
};

export default PokemonDetailsBackdrop;
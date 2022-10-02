import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';

import { fetchContent } from "../../store/content-actions";

import PokemonList from "./PokemonList/PokemonList";
import LoadingSpinner from '../../UI/LoadingSpinner/LoadingSpinner';

import classes from './Content.module.css';

const Content = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        dispatch(fetchContent(setLoading));
    }, []);

    return (
        <React.Fragment>
            {loading && (
                <div className={classes.loading}>
                    <LoadingSpinner />
                </div>
            )}
            <PokemonList></PokemonList>
        </React.Fragment>
    )
}

export default Content;
import { Fragment } from 'react';

import styles from './Header.module.css'

const Header = () => {
    return (
        <Fragment>
            <h2 className={`d-md-inline fw-bolder pe-4 py-2 font-monospace ${styles.brand}`}>Pokédex</h2>
            <hr className={`d-md-none ${styles.line}`}/>
            <h5 className={`d-md-inline ps-sm-0 ps-md-4 fw-bolder ${styles.subText}`}>Search for any Pokémon that exists on the planet</h5>
        </Fragment>
    )
}

export default Header;
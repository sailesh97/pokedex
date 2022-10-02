import React, { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from './Filters.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faCaretDown, faBars } from '@fortawesome/free-solid-svg-icons'
import Modal from "../../UI/Modal/Modal";

import Backdrop from "./Backdrop/Backdrop";
import ModalOverlay from "./ModalOverlay/ModalOverlay";

import LoadingSpinner from '../../UI/LoadingSpinner/LoadingSpinner';

import { fetchFilter } from '../../store/filter-actions';
import { filterActions } from '../../store/filter-slice';

const { REACT_APP_API_URL : HOME_API_URL } = process.env;

const Filters = () => {
    const dispatch = useDispatch();
    let genderFilter = [], typeFilter = [];
    genderFilter = useSelector(state => state.filter.genderFilter);
    typeFilter = useSelector(state => state.filter.typeFilter);
    const selectedTypes = useSelector(state => state.filter.selectedTypes);
    const selectedGenders = useSelector(state => state.filter.selectedGender);

    const [modalState, setModalState] = useState(false);
    const [typeDropdownDisplayName, setTypeDropdownDisplayName] = useState([]);
    const [genderDropdownDisplayName, setGenderDropdownDisplayName] = useState([]);
    const [loading,setLoading] = useState(false);
    
    const getDisplayName = (dropdownDisplayName) => {
        let displayname = '', firstNameChecked = dropdownDisplayName[0];
        if(dropdownDisplayName.length == 1){
            displayname = firstNameChecked[0].toUpperCase() + firstNameChecked.slice(1);
        } else if(dropdownDisplayName.length > 1){
            let firstName = firstNameChecked[0].toUpperCase() + firstNameChecked.slice(1);
            displayname = firstName + " + " + (dropdownDisplayName.length - 1) + ' more';
        }
        return displayname;
    }

    let typeDisplayname = getDisplayName(typeDropdownDisplayName),
        genderDisplayname = getDisplayName(genderDropdownDisplayName);

    const toggleModalState = () => {
        setModalState(modalState => {
            return modalState = !modalState;
        });
    }

    const hideModal = () => {
        setModalState(false);
    };

    const backdrop = { element: <Backdrop onConfirm={hideModal} />, place: 'backdrop-root' };
    const modal = { element: <ModalOverlay title="Filters" onConfirm={hideModal} />, place: 'modal-root' };

    useEffect(() => {
        Object.keys(selectedTypes).map(key => {
            setDisplayNameState(selectedTypes[key], key, setTypeDropdownDisplayName)
        })
        Object.keys(selectedGenders).map(key => {
            setDisplayNameState(selectedGenders[key], key, setGenderDropdownDisplayName)
        })
    }, [selectedTypes, selectedGenders])

    useEffect(() => {
        const urlArray = [{
            url: HOME_API_URL+'/gender',
            filterType: 'gender'
        }, {
            url: HOME_API_URL+'/type/',
            filterType: 'type'
        }]
        dispatch(fetchFilter(urlArray, setLoading));
    }, []);

    const searchKeywordChanged = (event) => {
        dispatch(filterActions.updateSearchKeyword({keyword:event.target.value}));
    }

    const setDisplayNameState = (checked, name, setName) => {
        if(checked){
            setName(state => {
                if(state.indexOf(name) === -1){
                    return [...state, name];
                } else {return state;}
            })
        } else{
            setName(state => {
                const newState = [...state];
                let indexEl = newState.indexOf(name);
                if(indexEl !== -1){
                    newState.splice(indexEl, 1);
                }
                return newState;
            })
        }
    }

    const typeFilterChanged = (event) => {
        dispatch(filterActions.updateTypeFilter({ 
            name: event.target.name,
            value: event.target.checked
        }));
        // console.log(event.target.checked, event.currentTarget.checked)
        setDisplayNameState(event.target.checked,event.target.name, setTypeDropdownDisplayName);
    }

    const genderFilterChanged = (event) => {
        dispatch(filterActions.updateGenderFilter({
            name: event.target.name,
            value: event.target.checked
        }));

        // console.log(event.target.checked, event.currentTarget.checked)
        setDisplayNameState(event.target.checked,event.target.name, setGenderDropdownDisplayName);
    }

    return (
        <Fragment>
            <div className={`mt-5 row ${styles.parent}`}>
                {/* Search Box */}
                <div className={`col-md ${styles.firstChild}`}>
                    <label htmlFor="pokemon" className={`ps-2 ${styles.labelEl} d-none d-md-block`}>Search by</label>
                    <div className={`form-group`}>
                        <input type="text" id="pokemon" 
                            className={`form-control ${styles.inputEl}`} 
                            placeholder="Name or Number" autoComplete="off" 
                            onChange={searchKeywordChanged}
                        />
                        <FontAwesomeIcon className={styles.search_icon} icon={faMagnifyingGlass} />
                    </div>
                </div>

                {/* Only show in medium or more width devices */}
                <div className="col-md d-flex justify-content-center d-none d-md-flex">
                    <div className={`${styles.filterEl} ${styles.filterEl1}`}>
                        <label htmlFor="type_of_pokemon" className={`ps-2 ${styles.labelEl}`}>Type</label>
                        <div className="dropdown">
                            <input type="text"
                                autoComplete="off"
                                id="type_of_pokemon" className={`form-control dropdown-toggle ${styles.inputEl}`} 
                                data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside" 
                                // value={typeInputValue ? typeInputValue : ''}
                                readOnly
                                value={typeDisplayname}
                                />
                            <FontAwesomeIcon icon={faCaretDown} className={styles.caret_down} />
                            <form className={`dropdown-menu p-4 w-100 mt-2 shadow ${styles.typeDropdownMenu}`}>
                                {loading && <LoadingSpinner />}
                                {typeFilter.length > 0 && typeFilter.map((type, indx) => {
                                    return (
                                        <React.Fragment key={indx}>
                                            <div className="form-check bg-white pb-1">
                                                <input className={`form-check-input ${styles.checkboxInput}`} type="checkbox"
                                                    name={type.name}
                                                    id={type.name} 
                                                    checked={selectedTypes[type.name]}
                                                    onChange = {typeFilterChanged} />
                                                <label className={`form-check-label bg-white ${styles.checkbox_label}`} htmlFor={type.name}>
                                                    {type.name[0].toUpperCase() + type.name.slice(1)}
                                                </label>
                                            </div>
                                            {(typeFilter.length-1 !== indx) && <hr className={styles.checkbox_separator} />}
                                        </React.Fragment>
                                    )
                                })}
                            </form>
                        </div>
                    </div>

                    <div className={styles.filterEl}>
                        <label htmlFor="gender_of_pokemon" className={`ps-2 ${styles.labelEl}`}>Gender</label>
                        <div className="dropdown">
                            <input type="text"
                                autoComplete="off"
                                id="gender_of_pokemon" className={`form-control dropdown-toggle ${styles.inputEl}`} 
                                data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside" 
                                readOnly
                                value={genderDisplayname}    
                            />
                            <FontAwesomeIcon icon={faCaretDown} className={styles.caret_down} />
                            <form className="dropdown-menu p-4 w-100 mt-2 shadow">
                                {loading && <LoadingSpinner />}
                                {genderFilter.length > 0 && genderFilter.map((gender, indx) => {
                                    return (
                                        <React.Fragment key={indx}>
                                            <div className="form-check bg-white pb-1">
                                                <input className={`form-check-input ${styles.checkboxInput}`} type="checkbox"
                                                    name={gender.name}
                                                    id={gender.name}
                                                    checked={selectedGenders[gender.name]}
                                                    onChange = {genderFilterChanged} />
                                                <label className={`form-check-label bg-white ${styles.checkbox_label}`} htmlFor={gender.name}>
                                                    {gender.name[0].toUpperCase() + gender.name.slice(1)}
                                                </label>
                                            </div>
                                            {(genderFilter.length-1 !== indx) && <hr className={styles.checkbox_separator} />}
                                        </React.Fragment>
                                    )
                                })}
                            </form>
                        </div>
                    </div>
                </div>

                {/* Only show in mobile devices */}

                <div className={`d-xs-flex d-sm-flex d-md-none ${styles.hamburger_icon_parent}`}
                    onClick={toggleModalState}
                >
                    <FontAwesomeIcon icon={faBars} className={styles.hamburger_icon} />
                </div>
            </div>
            {modalState && <Modal
                backdrop={backdrop}
                modal={modal}
            />}
        </Fragment>
    )
}

export default Filters;
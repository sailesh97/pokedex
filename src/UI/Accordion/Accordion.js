import { faChildRifle } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState, useRef, useImperativeHandle } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { filterActions } from '../../store/filter-slice';
import classes from './Accordion.module.css';

const Accordion = React.forwardRef((props, ref) => {
    useImperativeHandle(ref, () => {
        return {
            resetFilters: resetFilters,
            applyFilters: applyFilters
        }
    })
    const dispatch = useDispatch();

    const typeParentRef1 = useRef();
    const typeParentRef2 = useRef();
    const genderParentRef = useRef();

    const [typeDropdownDisplayName, setTypeDropdownDisplayName] = useState([]);
    const [genderDropdownDisplayName, setGenderDropdownDisplayName] = useState([]);

    const genderFilter = useSelector(state => state.filter.genderFilter);
    const typeFilter = useSelector(state => state.filter.typeFilter);

    const selectedTypes = useSelector(state => state.filter.selectedTypes);
    const selectedGenders = useSelector(state => state.filter.selectedGender);


    const [selectedGenderState, setSelectedGenderState] = useState({ ...selectedGenders });
    const [selectedTypeState, setSelectedTypeState] = useState({ ...selectedTypes });

    // console.log("----------RE-RENDERED----------", selectedGenderState, selectedTypeState)


    const setDisplayNameState = (checked, name, setName) => {
        if (checked) {
            setName(state => {
                if (state.indexOf(name) === -1) {
                    return [...state, name];
                } else { return state; }
            })
        } else {
            setName(state => {
                const newState = [...state];
                let indexEl = newState.indexOf(name);
                if (indexEl !== -1) {
                    newState.splice(indexEl, 1);
                }
                return newState;
            })
        }
    };

    const changeDisplayNameState = (iterable, setState) => {
        Object.keys(iterable).map(key => {
            setDisplayNameState(iterable[key], key, setState)
        })
    }

    useEffect(() => {
        Object.keys(selectedTypes).map(key => {
            setDisplayNameState(selectedTypes[key], key, setTypeDropdownDisplayName)
        })
        Object.keys(selectedGenders).map(key => {
            setDisplayNameState(selectedGenders[key], key, setGenderDropdownDisplayName)
        })
        
    }, [selectedTypes, selectedGenders])



    const getDisplayName = (dropdownDisplayName) => {
        let displayname = '', subName = '', firstNameChecked = dropdownDisplayName[0];
        if (dropdownDisplayName.length === 1) {
            displayname = firstNameChecked[0].toUpperCase() + firstNameChecked.slice(1);
        } else if (dropdownDisplayName.length > 1) {
            displayname = firstNameChecked[0].toUpperCase() + firstNameChecked.slice(1);
            subName = " + " + (dropdownDisplayName.length - 1) + ' more'
        }
        return [displayname, subName];
    }

    let [typeDisplayname, subTypeDisplayName] = getDisplayName(typeDropdownDisplayName);
    let [genderDisplayname, subGenderDisplayName] = getDisplayName(genderDropdownDisplayName);

    const typeFilterChanged = (event) => {
        const device = detectDeviceType();
        const newTypeObj = {
            name: event.target.name,
            value: event.target.checked
        };
        if (device === 'Desktop') {
            dispatch(filterActions.updateTypeFilter(newTypeObj));
        } else {
            setSelectedTypeState(state => {
                let name = event.target.name, value = event.target.checked;
                if (state[name] != undefined) {
                    const newState = {
                        ...state,
                        [event.target.name]: value
                    }
                    return newState;
                }
                else {
                    return {
                        ...state,
                        [event.target.name]: value
                    }
                }
            })
        }
        setDisplayNameState(event.target.checked, event.target.name, setTypeDropdownDisplayName);
    }

    const genderFilterChanged = (event) => {
        const device = detectDeviceType();
        const newGenderObj = {
            name: event.target.name,
            value: event.target.checked
        };
        if (device === 'Desktop') {
            dispatch(filterActions.updateGenderFilter(newGenderObj));
        } else {
            setSelectedGenderState(state => {
                let name = event.target.name, value = event.target.checked;
                if (state[name] != undefined) {
                    const newState = {
                        ...state,
                        [event.target.name]: value
                    }
                    return newState;
                } else {
                    return {
                        ...state,
                        [event.target.name]: value
                    }
                }
            })
        }
        setDisplayNameState(event.target.checked, event.target.name, setGenderDropdownDisplayName);
    }

    const detectDeviceType = () =>
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            ? 'Mobile' : 'Desktop';

    const resetFilters = () => {
        setSelectedGenderState({ ...selectedGenders });
        setSelectedTypeState({ ...selectedTypes });
        changeDisplayNameState(selectedTypes, setTypeDropdownDisplayName);
        changeDisplayNameState(selectedGenders, setGenderDropdownDisplayName);
    }

    const getCheckboxValues = (ref, values) => {
        for (let i = 0; i < ref.current.children.length; i++) {
            let children = ref.current.children[i];
            let input = children.children[0];
                let key = input.name;
                values[key] = input.value == 'true' ? true : false;
        }
    }

    const applyFilters = () => {
        const typeValues = {}, genderValues = {};
        getCheckboxValues(typeParentRef1, typeValues);
        getCheckboxValues(typeParentRef2, typeValues);
        getCheckboxValues(genderParentRef, genderValues);
        dispatch(filterActions.updateTypeFilterWithArrayofSelectedValues(typeValues));
        dispatch(filterActions.updateGenderFilterWithArrayofSelectedValues(genderValues));
    }

    return (
        <div className="accordion bg-white" id="accordionExample">

            <div className={`accordion-item ${classes.a_item}`}>
                <h2 className="accordion-header" id="headingOne">
                    <button className={`accordion-button collapsed ${classes.accBtn}`} type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne"
                        aria-expanded="true" aria-controls="collapseOne">
                        <p className={`d-inline-block ${classes.para}`}>Type</p>
                        {typeDisplayname && (
                            <p className={`d-inline-block ${classes.sub_para}`}>
                                ({typeDisplayname}  <strong className='bg-white'>{subTypeDisplayName}</strong>)
                            </p>
                        )}

                    </button>
                </h2>
                {/* {typeDisplayname} */}
                <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample">
                    <div className="accordion-body bg-white">
                        <div className="row bg-transparent">
                            <div className="col bg-transparent" ref={typeParentRef1}>
                                {typeFilter.length > 0 && typeFilter.map((type, indx) => {
                                    return (indx <= ((typeFilter.length / 2) - 1) &&
                                        <React.Fragment key={indx}>
                                            <div className="form-check bg-white pb-1 my-2">
                                                <input className={`form-check-input ${classes.checkboxInput}`} type="checkbox"
                                                    name={type.name}
                                                    id={type.name}
                                                    checked={selectedTypeState[type.name]}
                                                    value={selectedTypeState[type.name]}
                                                    onChange={typeFilterChanged} />
                                                <label className={`form-check-label bg-white ${classes.checkbox_label}`} htmlFor={type.name}>
                                                    {type.name[0].toUpperCase() + type.name.slice(1)}
                                                </label>
                                            </div>
                                           
                                        </React.Fragment>
                                    )
                                })}
                            </div>
                            <div className="col bg-transparent" ref={typeParentRef2}>
                                {typeFilter.length > 0 && typeFilter.map((type, indx) => {
                                    return (indx >= (typeFilter.length / 2) &&
                                        <React.Fragment key={indx}>
                                            <div className="form-check bg-white pb-1 my-2">
                                                <input className={`form-check-input ${classes.checkboxInput}`} type="checkbox"
                                                    name={type.name}
                                                    id={type.name}
                                                    checked={selectedTypeState[type.name]}
                                                    value={selectedTypeState[type.name]}
                                                    onChange={typeFilterChanged} />
                                                <label className={`form-check-label bg-white ${classes.checkbox_label}`} htmlFor={type.name}>
                                                    {type.name[0].toUpperCase() + type.name.slice(1)}
                                                </label>
                                            </div>
                                        </React.Fragment>
                                    )
                                })}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div className={`accordion-item ${classes.a_item}`}>
                <h2 className="accordion-header" id="headingTwo">
                    <button className={`accordion-button collapsed ${classes.accBtn}`} type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                        <p className={`d-inline-block ${classes.para}`}>Gender</p>
                        {genderDisplayname && (
                            <p className={`d-inline-block ${classes.sub_para}`}>
                                ({genderDisplayname}  <strong className='bg-white'>{subGenderDisplayName}</strong>)
                            </p>
                        )}
                    </button>
                </h2>
                <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo"
                    data-bs-parent="#accordionExample">
                    <div className="accordion-body bg-white" ref={genderParentRef}>
                        {genderFilter.length > 0 && genderFilter.map((gender, indx) => {
                            return (
                                <React.Fragment key={indx}>
                                    <div className="form-check bg-white pb-1 my-2">
                                        <input className={`form-check-input ${classes.checkboxInput}`} type="checkbox"
                                            name={gender.name}
                                            id={gender.name}
                                            checked={selectedGenderState[gender.name]}
                                            value={selectedGenderState[gender.name]}
                                            onChange={genderFilterChanged} />
                                        <label className={`form-check-label bg-white ${classes.checkbox_label}`} htmlFor={gender.name}>
                                            {gender.name[0].toUpperCase() + gender.name.slice(1)}
                                        </label>
                                    </div>
                                </React.Fragment>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
});

export default Accordion;
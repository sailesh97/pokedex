import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactTooltip from "react-tooltip";
import classes from './PokemonDetailsModal.module.css';
import Card from '../../../../UI/Card/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { fetchWeakAgainstTypes } from '../../../../store/content-actions';
import LoadingSpinner from '../../../../UI/LoadingSpinner/LoadingSpinner';
import Color from '../../../../colors/colors';

const PokemonDetailsModal = (props) => {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);

    /** State that, I render in JSX */
    const [pokemonFeatures, setPokemonFeatures] = useState({
        name: "",
        url: "",
        id: "",
        description: "",
        truncatedDescription: "",
        height: "",
        weight: "",
        gender: [],
        eggGroups: [],
        abilities: '',
        types: []
    });

    const weakAgainstStateInStore = useSelector(state => state.content.weakAgainstData);

    let foundTypeDataInStore = false;
    let pokemonName = '', pokemonId = '', imageUrl = '', wholeDescription = '', truncatedDescription = '',
        height = '', weight = (props.data.weight) / 10, eggGroupsStr = '', genderStr = '', abilitiesStr = '', pokemonTypeArr = [], typesArr = '', typesUrls = [];

    pokemonName = props.data.name.toUpperCase();

    pokemonId = props.data.id.toString();
    if (pokemonId.length === 1) {
        pokemonId = "00" + pokemonId;
    } else if (pokemonId.length === 2) {
        pokemonId = "0" + pokemonId;
    }

    imageUrl = props.data.sprites.other.dream_world.front_default;

    const detectDeviceType = () =>{
        if(/iPad/i.test(navigator.userAgent)) return 'iPad'; 
        return /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            ? 'Mobile' : 'Desktop';}


    const getDescription = () => {
        let description = '';
        props.data.description.flavor_text_entries.map(entry => {
            if (entry.language.name === 'en') {
                if (description.indexOf(entry.flavor_text) === -1) {
                    description = description + entry.flavor_text;
                }
            }
        })
        wholeDescription = description;
        if (detectDeviceType() === 'Desktop') {
            truncatedDescription = description.substring(0, 399) + '...';
        } else if(detectDeviceType() === 'iPad'){
            truncatedDescription = description.substring(0, 209) + '...';
        } else {
            truncatedDescription = description.substring(0, 70) + '...';
        }
    }

    const calculateHeight = () => {
        let heightInDecimeters = props.data.height;
        let heightInMeters = heightInDecimeters / 10;
        let heightInFeet = heightInMeters * 3.2808;
        let heightInDecimalFeet = heightInFeet % 1;
        let heightInInches = heightInDecimalFeet * 12;
        heightInInches = Math.round(heightInInches);
        heightInFeet = heightInFeet / 1;
        height = Math.floor(heightInFeet) + "'" + heightInInches + "''";
    }

    const getEggGroups = () => {
        const eggGroups = [];
        props.data.description.egg_groups.map(eggGroup => {
            eggGroups.push(eggGroup.name[0].toUpperCase() + eggGroup.name.slice(1));
        });
        eggGroupsStr = eggGroups.join(', ');
    }

    const getGender = () => {
        let genderArray = [];
        genderArray.push(props.data.gender['male'] && 'Male');
        genderArray.push(props.data.gender['female'] && 'Female');
        genderArray.push(props.data.gender['genderless'] && 'Genderless');
        genderArray = genderArray.filter(gender => typeof gender === 'string')
        genderStr = genderArray.join(', ')
    }

    const getAbilities = () => {
        let abilitiesArr = [];
        props.data.abilities.map(ability => {
            let name = ability['ability'].name;
            name = name[0].toUpperCase() + name.slice(1);
            abilitiesArr.push(name);
        })
        abilitiesStr = abilitiesArr.join(', ');
    }

    const getIdFromUrl = (url) => {
        let arr = url.split('/');
        arr = arr.filter(el => el != '');
        let lastIndex = arr.length - 1;
        return arr[lastIndex];
    }

    const getTypes = () => {
        let nameArray = [];
        props.data.types.map(type => {
            let typeObj = type['type'];
            nameArray.push(typeObj.name);
            // typesUrls.push(typeObj.url);
            let pokemonTypeObj = {
                typeName: typeObj.name,
                typeId: getIdFromUrl(typeObj.url)
            }
            pokemonTypeArr.push(pokemonTypeObj);
        })
        typesArr = nameArray;
    }

    // Ref1
    // let say pokemonTypeArr = fire & flying.
    // fetch data from store related to fire n flying and push it in weakAgainstDataArr and the in useEffect call setWeakAgainst(weakAgainstDataArr)
    let weakAgainstDataArr = [];
    const getWeakAgainst = () => {
        pokemonTypeArr.forEach(pokemon => {
            for (let i = 0; i < weakAgainstStateInStore.length; i++) {
                let waData = weakAgainstStateInStore[i];
                if (waData.typeId === pokemon.typeId) {
                    let weakAgainst = waData['weakAgainst'];
                    weakAgainst = weakAgainst['damage_relations'];
                    weakAgainst = weakAgainst['double_damage_from'];
                    weakAgainstDataArr.push(...weakAgainst);
                    break;
                }
            }
        });
    }

    calculateHeight();
    getDescription();
    getEggGroups();
    getGender();
    getAbilities();
    getTypes();
    getWeakAgainst();

    useEffect(() => {
        setPokemonFeatures({
            name: pokemonName,
            url: imageUrl,
            id: pokemonId,
            description: wholeDescription,
            truncatedDescription: truncatedDescription,
            height: height,
            weight: weight,
            gender: genderStr,
            eggGroups: eggGroupsStr,
            abilities: abilitiesStr,
            types: typesArr,
            pokemonTypeDetails: pokemonTypeArr
        });
    }, []);

    pokemonTypeArr.forEach(pokemon => {
        weakAgainstStateInStore.forEach(waData => {
            if (pokemon.typeId === waData.typeId) {
                foundTypeDataInStore = true;
                return;
            }
        });
    })

    useEffect(() => {
        pokemonTypeArr.map(pokemonType => {
            if (!foundTypeDataInStore) {
                dispatch(fetchWeakAgainstTypes(pokemonType.typeId, pokemonType.typeName, setLoading));
            }
        });
    }, [foundTypeDataInStore]);

    let statsDisplayName = {
        "hp": 'HP',
        "attack": 'Attack',
        "defense": 'Defense',
        'special-attack': 'Sp. Attack',
        'special-defense': 'Sp. Defense',
        'speed': 'Speed'
    };


    let color1 = Color[typesArr[0]], color2 = Color[typesArr[1]];

    return (
        <React.Fragment>
            <Card className={`${classes.modal}`}>
                <div className={`container p-md-5 p-xs-3 h-100 position-relative ${classes.modalContainer}`}>
                    <FontAwesomeIcon icon={faCircleXmark} className={` ${classes.close}`} onClick={props.onConfirm} />
                    {/* <p className="clearfix d-none"></p> */}
                    <div className={`d-flex ${classes.topImageHeadingContainer}`}>
                        <div className="row d-md-none d-xs-block mb-4 ">
                            <h2 className={`${classes.pokemonName}  pe-2 d-inline-block`}>{pokemonFeatures.name}</h2>
                            <h3 className={`${classes.pokemonId}  d-inline-block`}>{pokemonFeatures.id}</h3>
                        </div>


                        <div className={`${classes.image_container} text-center`}
                            style={{
                                background:
                                    typesArr.length >= 2 ? `linear-gradient(${color1}, ${color2})`
                                        : `${color1}`
                            }}
                        >
                            <img className={`bg-transparent px-3 py-4 ${classes.pokemonImage}`} src={imageUrl} alt={props.data.name} width={185} height={260} />
                            <div className="row d-md-none d-xs-block">
                                <p className={classes.description}>{pokemonFeatures.truncatedDescription}<strong className={`${classes.read_more} ${classes.tooltip}`} data-tip data-for="registerTip">read more</strong></p>
                                <ReactTooltip id="registerTip" clickable={true} backgroundColor="#2e3156" place="bottom" effect="solid" className={classes.tooltip}>
                                    {pokemonFeatures.description}
                                </ReactTooltip>
                            </div>
                        </div>
                        <div className={`px-3 mx-3 d-none d-md-block ${classes.flex_container_height}`}>
                            <h2 className={`${classes.pokemonName} border-end border-secondary pe-3 me-3`}>{pokemonFeatures.name}</h2>
                            <h3 className={`${classes.pokemonId} border-end border-secondary pe-3 me-3`}>{pokemonFeatures.id}</h3>
                            <p className={classes.description}>{pokemonFeatures.truncatedDescription} <strong className={`${classes.read_more} ${classes.tooltip}`} data-tip data-for="registerTip">read more</strong></p>
                            <ReactTooltip id="registerTip" clickable={true} backgroundColor="#2e3156" place="bottom" effect="solid" className={classes.tooltip}>
                                {pokemonFeatures.description}
                            </ReactTooltip>
                        </div>

                        <p className="clearfix d-none"></p>
                    </div>
                    <div className="container mt-5 pt-3">
                        <div className="row">
                            <div className="row col-md-6 me-3">
                                <div className="row col-xs-6 col-md-12">
                                    <div className="row pb-2">
                                        <div className={`col-8 ${classes.pokemonShapeLabel}`}>Height</div>
                                        <div className={`col-4 ${classes.pokemonShapeLabel}`}>Weight</div>
                                    </div>
                                </div>
                                <div className="row col-xs-6 col-md-12">
                                    <div className="row">
                                        <div className={`col-8 ${classes.pokemonShapeValue}`}>{pokemonFeatures.height}</div>
                                        <div className={`col-4 ${classes.pokemonShapeValue}`}>{pokemonFeatures.weight} Kg</div>
                                    </div>
                                </div>
                            </div>
                            <div className="row col-md-6">
                                <div className="row col-xs-6 col-md-12">
                                    <div className="row pb-2">
                                        <div className={`col-8 ${classes.pokemonShapeLabel}`}>Gender(s)</div>
                                        <div className={`col-4 ${classes.pokemonShapeLabel}`}>Egg Groups</div>
                                    </div>
                                </div>
                                <div className="row col-xs-6 col-md-12">
                                    <div className="row">
                                        <div className={`col-8 ${classes.pokemonShapeValue}`}>{pokemonFeatures.gender}</div>
                                        <div className={`col-4 ${classes.pokemonShapeValue}`}>{pokemonFeatures.eggGroups}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* ----------------------------- */}
                        <div className="row mt-5">
                            <div className="row col-md-6 me-3">
                                <div className="row col-xs-6 col-md-12">
                                    <div className="row pb-2">
                                        <div className={`col-8 ${classes.pokemonShapeLabel}`}>Abilities</div>
                                        <div className={`col-4 ${classes.pokemonShapeLabel}`}>Types</div>
                                    </div>
                                </div>
                                <div className="row col-xs-6 col-md-12">
                                    <div className="row">
                                        <div className={`col-8 ${classes.pokemonShapeValue}`}>{pokemonFeatures.abilities}</div>
                                        <div className={`col-4 ${classes.pokemonShapeValue}`}>
                                            {pokemonFeatures.types.map((type, indx) => <h6 key={indx} className={` ${classes.badgeInline}`}><span style={{ background: Color[type] }} className={`me-1 ${classes.pokemonBadges}`}>{type[0].toUpperCase() + type.slice(1)}</span></h6>)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row col-md-6">
                                <div className="row col-xs-6 col-md-12">
                                    <div className="row pb-2">
                                        <div className={`col ${classes.pokemonShapeLabel}`}>Weak Against</div>
                                    </div>
                                </div>
                                <div className="row col-xs-6 col-md-12">
                                    <div className="row">
                                        <div className={`col ${classes.pokemonBadgeContainer}`}>
                                            {loading && <LoadingSpinner/>}
                                            {weakAgainstDataArr.map((waData, indx) => <h6 key={indx} className={` ${classes.badgeInline}`}><span style={{ background: Color[waData.name] }} className={`me-1 ${classes.pokemonBadges}`}>{waData.name[0].toUpperCase() + waData.name.slice(1)}</span></h6>)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ----------------------------- */}
                        <div className={`row ${classes.statsContainer}`}>
                            <h3 className={`${classes.statsHeaderLabel}`}>Stats</h3>
                            <div className="row bg-transparent">
                                {props.data.stats.map((stat, indx) => {
                                    return (
                                        <div className={`col-md-6 col-sm-12 d-flex bg-transparent ${classes.alignContent}`} key={indx}>
                                            <span className={classes.statLabel}>
                                                {statsDisplayName[stat['stat'].name]}
                                            </span>
                                            <div className={`progress my-2 mx-2 ${classes.progresCont}`}>
                                                <div className={`progress-bar ${classes.progresBar}`} role="progressbar" aria-label={stat['stat'].name[0].toUpperCase() + stat['stat'].name.slice(1)}
                                                    style={{ width: stat.base_stat + '%' }}
                                                    aria-valuenow={stat.base_stat} aria-valuemin="0" aria-valuemax="100">{stat.base_stat}</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                        </div>
                    </div>
                </div>
            </Card>
        </React.Fragment>
    )
}

export default PokemonDetailsModal;

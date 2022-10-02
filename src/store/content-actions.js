import { contentActions } from './content-slice';
const { REACT_APP_API_URL : HOME_API_URL } = process.env;

const fetchData = async (url, setLoading) => {
    setLoading(true);
    const response = await fetch(url);
    setLoading(false)
    if (!response.ok) {
        throw new Error('Could not fetch cart data!');
    }

    const data = await response.json();

    return data;
};

export const fetchWeakAgainstTypes = (typeId, typeName, setLoading) => {
    return async (dispatch) => {
        try {
            const weakAgainstResponse = await fetchData(`${HOME_API_URL}/type/${typeId}/`, setLoading);
            const {damage_relations} = weakAgainstResponse;
            const weakAgainst = {damage_relations}
            dispatch(contentActions.addWeakAgainstDataOfAPokemon({ weakAgainst, typeId, typeName }));
        } catch (error) {
            console.log("ERROR------", error)
        }
    }
}

export const fetchContent = (setLoading) => {
    return async (dispatch) => {
        const transformData = async (contentData) => {
            let femaleGenderPokemons = await fetchData(`${HOME_API_URL}/gender/1`, setLoading);
            let maleGenderPokemons = await fetchData(`${HOME_API_URL}/gender/2`, setLoading);
            let genderlessPokemons = await fetchData(`${HOME_API_URL}/gender/3`, setLoading);

            let genderData = {
                'male': JSON.stringify(maleGenderPokemons),
                'female': JSON.stringify(femaleGenderPokemons),
                'genderless': JSON.stringify(genderlessPokemons)
            }

            contentData.map(async content => {
                let pokemonData = await fetchData(content.url, setLoading);
                let { name, id, height, weight, abilities, types, stats, sprites } = pokemonData;

                let checkIfFemale = genderData['female'].includes(name);
                let checkIfMale = genderData['male'].includes(name);
                let checkIfGenderless = genderData['genderless'].includes(name);

                let gender = { 'female': checkIfFemale, 'male': checkIfMale, genderless: checkIfGenderless };

                let descriptionResponse = await fetchData(`${HOME_API_URL}/pokemon-species/${id}`, setLoading);
                let {flavor_text_entries, egg_groups} = descriptionResponse;
                let description = {flavor_text_entries, egg_groups};

                dispatch(contentActions.addData({
                    data: { name, id, height, weight, abilities, types, stats, sprites, gender, description }
                }));
            });
        }

        try {
            const contentData = await fetchData(HOME_API_URL+'/pokemon?limit=21', setLoading);
            await transformData(contentData.results || []);
        } catch (error) {
            // Could show a notifcation here..
            console.log("ERROR------", error)
        }
    }
}

// https://pokeapi.co/api/v2/pokemon?offset=100&limit=20
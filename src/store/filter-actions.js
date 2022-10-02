import { filterActions } from './filter-slice';

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

export const fetchFilter = (urlArray, setLoading) => {
    return async (dispatch) => {
        try{
            urlArray.forEach(async urlObj => {
                const response = await fetchData(urlObj.url , setLoading );
                if(urlObj.filterType === 'gender'){
                    dispatch(filterActions.setGenderFilter({gender:response.results}));
                } else if(urlObj.filterType === 'type'){
                    dispatch(filterActions.setTypeFilter({type:response.results}));
                }
            });
        } catch(error){
            console.log("ERROR---", error);
        }
    }
}
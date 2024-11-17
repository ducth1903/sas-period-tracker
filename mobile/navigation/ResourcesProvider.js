import React, {useState, createContext} from 'react';

const ResourceContext = createContext();

// This is a global provider for resourcesMap that is fetched from the resourceHomeScreen fetchAllResources function
// This cache helps to avoid fetching data repeatedly if data is already pulled from the data base once.
// This global resources is also essential in passing the resources available to the search/filtering screen in resourceSearch
const ResourceProvider = (props) => {
    const [globalResources, setGlobalResources ] = useState([])

    return (
        <ResourceContext.Provider value={[globalResources,setGlobalResources]}>
            {props.children}
        </ResourceContext.Provider>
    )
}

export {ResourceContext, ResourceProvider}
import algoliasearch from "algoliasearch/lite"
import React, {createRef, useMemo, useState} from "react"
import {InstantSearch} from "react-instantsearch-dom"
import useClickOutside from "./use-click-outside"
import SearchBox from "./search-box"
import SearchResult from "./search-result";

import "./index.scss"

export default function Search({indices}) {
    const rootRef = createRef()
    const [query, setQuery] = useState()
    const [hasFocus, setFocus] = useState(false)
    const searchClient = useMemo(
        () =>
            algoliasearch(
                process.env.GATSBY_ALGOLIA_APP_ID,
                process.env.GATSBY_ALGOLIA_SEARCH_KEY
            ),
        []
    )

    useClickOutside(rootRef, () => setFocus(false));

    return (
        <div ref={rootRef} className={"instant-search"}>
            <InstantSearch
                searchClient={searchClient}
                indexName={indices[0].name}
                onSearchStateChange={({query}) => setQuery(query)}
            >
                <SearchBox onFocus={() => setFocus(true)} hasFocus={hasFocus}/>
                {hasFocus && query && (
                    <div className={"search-result-wrapper"}>
                        <SearchResult indices={indices}/>
                    </div>
                )}
            </InstantSearch>
        </div>
    )
}
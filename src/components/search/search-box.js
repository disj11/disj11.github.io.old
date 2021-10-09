import React from "react"
import {connectSearchBox} from "react-instantsearch-dom"
import {Search as SearchIcon} from "@styled-icons/fa-solid"

import "./search-box.scss"

export default connectSearchBox(
    ({refine, currentRefinement, onFocus, hasFocus}) => (
        <form className={"search-box"}>
            <SearchIcon className="search-icon"/>
            <input
                className={hasFocus ? "search-input open" : "search-input close"}
                type="text"
                placeholder="Search"
                aria-label="Search"
                onChange={e => refine(e.target.value)}
                value={currentRefinement}
                onFocus={onFocus}
            />
        </form>
    )
)
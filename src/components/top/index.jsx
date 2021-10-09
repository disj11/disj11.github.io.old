import React from 'react'
import {Link} from 'gatsby'
import Search from "../search";

import './index.scss'

const searchIndices = [
    {
        name: process.env.GATSBY_ALGOLIA_INDEX_NAME,
        title: process.env.GATSBY_ALGOLIA_INDEX_NAME,
    }
]
export const Top = ({title, location, rootPath}) => {
    const isRoot = location.pathname === rootPath
    return (
        <div className="top">
            <div>
                {!isRoot && (
                    <Link to={`/`} className="link">
                        {title}
                    </Link>
                )}
            </div>
            <div>
                <Search indices={searchIndices}/>
            </div>
        </div>
    )
}

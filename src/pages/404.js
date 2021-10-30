import React from 'react'
import {graphql} from 'gatsby'

import {Layout} from '../layout'
import {Head} from '../components/head'
import {Search as SearchIcon} from "@styled-icons/fa-solid/Search";

class NotFoundPage extends React.Component {
    render() {
        const {data} = this.props
        const siteTitle = data.site.siteMetadata.title

        return (
            <Layout location={this.props.location} title={siteTitle}>
                <Head title="404: Not Found"/>
                <h1>Not Found</h1>
                <div>
                    페이지를 찾을 수 없다면 상단바의
                    <SearchIcon className="search-icon" size="16" style={{marginLeft: 5, marginRight: 5}}/>
                    을 사용해보세요!
                </div>
            </Layout>
        )
    }
}

export default NotFoundPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`

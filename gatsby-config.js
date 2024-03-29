require("dotenv").config()
const metaConfig = require('./gatsby-meta-config')

module.exports = {
    siteMetadata: metaConfig,
    plugins: [
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `${__dirname}/content/blog`,
                name: `blog`,
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `${__dirname}/content/__about`,
                name: `about`,
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `${__dirname}/content/assets`,
                name: `assets`,
            },
        },
        {
            resolve: `gatsby-transformer-remark`,
            options: {
                plugins: [
                    {
                        resolve: `gatsby-remark-katex`,
                        options: {
                            strict: `ignore`,
                        },
                    },
                    {
                        resolve: `gatsby-remark-images`,
                        options: {
                            maxWidth: 1200,
                            linkImagesToOriginal: false,
                        },
                    },
                    {
                        resolve: `gatsby-remark-images-medium-zoom`,
                        options: {
                            margin: 36,
                            scrollOffset: 0,
                        },
                    },
                    {
                        resolve: `gatsby-remark-responsive-iframe`,
                        options: {
                            wrapperStyle: `margin-bottom: 1.0725rem`,
                        },
                    },
                    {
                        resolve: `gatsby-remark-prismjs`,
                        options: {
                            inlineCodeMarker: '%',
                        },
                    },
                    `gatsby-remark-copy-linked-files`,
                    `gatsby-remark-smartypants`,
                    `gatsby-remark-autolink-headers`,
                    `gatsby-remark-emoji`,
                ],
            },
        },
        {
            resolve: `gatsby-plugin-google-gtag`,
            options: {
                trackingIds: [
                    metaConfig.ga,
                ],
                gtagConfig: {
                    anonymize_ip: true,
                },
                pluginConfig: {
                    head: true,
                }
            },
        },
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: metaConfig.title,
                short_name: metaConfig.title,
                start_url: `/`,
                background_color: `#ffffff`,
                theme_color: `#663399`,
                display: `minimal-ui`,
                icon: metaConfig.icon,
            },
        },
        {
            resolve: `gatsby-plugin-typography`,
            options: {
                pathToConfigModule: `src/utils/typography`,
            },
        },
        {
            resolve: 'gatsby-plugin-robots-txt',
            options: {
                host: 'https://disj11.github.io',
                sitemap: 'https://disj11.github.io/sitemap/sitemap-index.xml',
                policy: [
                    {
                        userAgent: '*',
                        allow: '/',
                    },
                ],
            },
        },
        `gatsby-plugin-image`,
        `gatsby-plugin-sharp`,
        `gatsby-transformer-sharp`,
        {
            resolve: `gatsby-plugin-feed`,
            options: {
                query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
                feeds: [
                    {
                        serialize: ({query: {site, allMarkdownRemark}}) => {
                            return allMarkdownRemark.edges.map(edge => {
                                return Object.assign({}, edge.node.frontmatter, {
                                    description: edge.node.excerpt,
                                    date: edge.node.frontmatter.date,
                                    url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                                    guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                                    custom_elements: [{"content:encoded": edge.node.html}],
                                })
                            })
                        },
                        query: `
              {
                allMarkdownRemark(
                  sort: { order: DESC, fields: [frontmatter___date] },
                ) {
                  edges {
                    node {
                      excerpt
                      html
                      fields { slug }
                      frontmatter {
                        title
                        date
                      }
                    }
                  }
                }
              }
            `,
                        output: "/rss.xml",
                        title: "Dev Logs RSS Feed",
                    },
                ],
            },
        },
        `gatsby-plugin-offline`,
        `gatsby-plugin-react-helmet`,
        `gatsby-plugin-sass`,
        `gatsby-plugin-lodash`,
        `gatsby-plugin-sitemap`,
        `gatsby-plugin-styled-components`,
        {
            resolve: `gatsby-plugin-algolia`,
            options: {
                appId: process.env.GATSBY_ALGOLIA_APP_ID,
                // Use Admin API key without GATSBY_ prefix, so that the key isn't exposed in the application
                // Tip: use Search API key with GATSBY_ prefix to access the service from within components
                apiKey: process.env.ALGOLIA_API_KEY,
                indexName: process.env.GATSBY_ALGOLIA_INDEX_NAME, // for all queries
                queries: require("./src/utils/algolia-queries"),
                chunkSize: 10000, // default: 1000
                settings: {
                    // optional, any index settings
                    // Note: by supplying settings, you will overwrite all existing settings on the index
                },
                enablePartialUpdates: true, // default: false
                matchFields: ['slug', 'modified'], // Array<String> default: ['modified']
                concurrentQueries: false, // default: true
                skipIndexing: process.env.ALGOLIA_SKIPPING_INDEX === 'true', // default: false, useful for e.g. preview deploys or local development
                continueOnFailure: false, // default: false, don't fail the build if algolia indexing fails
            },
        },
    ],
}

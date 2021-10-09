const myQuery = `{
  pages: allSitePage {
    nodes {
      # try to find a unique id for each node
      # if this field is absent, it's going to
      # be inserted by Algolia automatically
      # and will be less simple to update etc.
      objectID: id
      component
      path
      componentChunkName
      jsonName
      internal {
        type
        contentDigest
        owner
      }
    }
  }
}`;

const queries = [
    {
        query: myQuery,
        transformer: ({ data }) => data.pages.nodes, // optional
        settings: {
            // optional, any index settings
            // Note: by supplying settings, you will overwrite all existing settings on the index
        },
        matchFields: ['slug', 'modified'], // Array<String> overrides main match fields, optional
    },
];

module.exports = queries
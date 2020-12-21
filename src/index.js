const apollo = require('./handlers/apollo')
const playground = require('./handlers/playground')
const setCors = require('./utils/setCors')

const graphQLOptions = {
  // Set the path for the GraphQL server
  // baseEndpoint: 'https://query-templates.hasura.app/v1/',
  baseEndpoint: 'https://query-templates.hasura.app/v1/',

  // Set the path for the GraphQL playground
  // This option can be removed to disable the playground route
  playgroundEndpoint: '/graphql',

  // When a request's path isn't matched, forward it to the origin
  forwardUnmatchedRequestsToOrigin: true,

  // Enable debug mode to return script errors directly in browser
  debug: true,

  // Enable CORS headers on GraphQL requests
  // Set to `true` for defaults (see `utils/setCors`),
  // or pass an object to configure each header
  cors: false,
  // cors: {
  //   allowCredentials: 'true',
  //   allowHeaders: 'Content-type',
  //   allowOrigin: '*',
  //   allowMethods: 'GET, POST, PUT',
  // },

  // Enable KV caching for external REST data source requests
  // Note that you'll need to add a KV namespace called
  // WORKERS_GRAPHQL_CACHE in your wrangler.toml file for this to
  // work! See the project README for more information.
  kvCache: false,
}

const handleRequest = async request => {
  const url = new URL(request.url)
  try {
    return await apollo(request, graphQLOptions)
  } catch (err) {
    return new Response(graphQLOptions.debug ? err : 'Something went wrong', { status: 500 })
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

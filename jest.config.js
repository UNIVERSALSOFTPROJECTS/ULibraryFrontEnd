module.exports = {
  transform: {
    '^.+\\.svelte$': 'svelte-jester',
    '^.+\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: [
    "node_modules/(?!axios/.*)",
],
  moduleFileExtensions: ['js', 'svelte'],
}
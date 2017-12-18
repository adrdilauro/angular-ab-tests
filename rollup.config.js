export default {
  entry: 'dist/index.js',
  dest: 'dist/bundles/angular-ab-tests.umd.js',
  sourceMap: false,
  format: 'umd',
  moduleName: 'ng.angularabtests',
  globals: {
    '@angular/core': 'ng.core',
  }
}

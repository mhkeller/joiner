import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  entry: 'src/joiner/index.js',
  format: 'cjs',
  plugins: [ babel(), nodeResolve(), commonjs() ],
  dest: 'dist/joiner.node.js'
}

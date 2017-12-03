import fs from 'fs'
import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

const v = JSON.parse(fs.readFileSync('package.json', 'utf-8')).version

const defaults = {
  banner: `/* @version joiner ${v} */`
}

const outputs = [
  {
    format: 'cjs',
    file: 'dist/joiner.cjs.js'
  }, {
    format: 'es',
    file: 'dist/joiner.es.js'
  }, {
    format: 'umd',
    file: 'dist/joiner.js',
    name: 'joiner'
  }].map(d => Object.assign(d, defaults))

export default {
  input: 'src/index.js',
  plugins: [ nodeResolve(), commonjs(), babel({exclude: 'node_modules/**/*'}) ],
  output: outputs
}

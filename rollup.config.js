import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'

const production = false

export default [
	{
		input: './src/index.tsx',
		plugins: [
			resolve({}),
			babel({
				extensions: ['.ts', '.tsx'],
				babelHelpers: 'bundled',
				plugins: [
					'@babel/plugin-transform-class-static-block',
					['@babel/plugin-proposal-decorators', {version: '2023-11'}],
					'@babel/plugin-transform-class-properties',
				],
				presets: ['pota/babel-preset', '@babel/preset-typescript'],
			}),
			...(production ? [terser()] : []),
		],
		output: [
			{
				format: 'es',
				sourcemap: true,
				sourcemapExcludeSources: false,
				file: './dist/index.js',
			},
		],
	},
]

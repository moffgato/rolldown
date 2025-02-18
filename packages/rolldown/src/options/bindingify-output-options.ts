import type { BindingOutputOptions } from '../binding'
import type { NormalizedOutputOptions } from './normalized-output-options'

export function bindingifyOutputOptions(
  outputOptions: NormalizedOutputOptions,
): BindingOutputOptions {
  const {
    dir,
    format,
    exports,
    sourcemap,
    sourcemapIgnoreList,
    sourcemapPathTransform,
    name,
    assetFileNames,
    entryFileNames,
    chunkFileNames,
    cssEntryFileNames,
    cssChunkFileNames,
    banner,
    footer,
    intro,
    outro,
    esModule,
    globals,
    file,
  } = outputOptions
  return {
    dir,
    // Handle case: rollup/test/sourcemaps/samples/sourcemap-file-hashed/_config.js
    file: file == null ? undefined : file,
    format: (function () {
      switch (format) {
        case 'es':
          return 'es'
        case 'cjs':
          return 'cjs'
        case 'iife':
          return 'iife'
        case 'umd':
          return 'umd'
      }
    })(),
    exports,
    sourcemap: bindingifySourcemap(sourcemap),
    sourcemapIgnoreList,
    sourcemapPathTransform,
    banner,
    footer,
    intro,
    outro,
    extend: outputOptions.extend,
    globals,
    esModule: bindingifyEsModule(esModule),
    name,
    assetFileNames,
    entryFileNames,
    chunkFileNames,
    cssEntryFileNames,
    cssChunkFileNames,
    // TODO(sapphi-red): support parallel plugins
    plugins: [],
    minify: outputOptions.minify,
    externalLiveBindings: outputOptions.externalLiveBindings,
    inlineDynamicImports: outputOptions.inlineDynamicImports,
    advancedChunks: outputOptions.advancedChunks,
  }
}

function bindingifySourcemap(
  sourcemap: NormalizedOutputOptions['sourcemap'],
): BindingOutputOptions['sourcemap'] {
  switch (sourcemap) {
    case true:
      return 'file'

    case 'inline':
      return 'inline'

    case false:
    case undefined:
      return undefined

    case 'hidden':
      return 'hidden'

    default:
      throw new Error(`unknown sourcemap: ${sourcemap}`)
  }
}

function bindingifyEsModule(
  esModule: NormalizedOutputOptions['esModule'],
): BindingOutputOptions['esModule'] {
  switch (esModule) {
    case true:
    case false:
    case 'if-default-prop':
      return esModule
    default:
      throw new Error(`unknown esModule: ${esModule}`)
  }
}

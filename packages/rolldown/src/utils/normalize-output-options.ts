import { unimplemented } from './misc'
import type { OutputOptions } from '../types/output-options'
import type { NormalizedOutputOptions } from '../options/normalized-output-options'

export function normalizeOutputOptions(
  opts: OutputOptions,
): NormalizedOutputOptions {
  const {
    dir,
    format,
    exports,
    sourcemap,
    sourcemapIgnoreList,
    sourcemapPathTransform,
    globals,
    assetFileNames,
    entryFileNames,
    chunkFileNames,
    cssEntryFileNames,
    cssChunkFileNames,
    name,
    esModule,
    file,
  } = opts
  return {
    dir: dir,
    file,
    format: getFormat(format),
    exports: exports ?? 'auto',
    sourcemap: sourcemap ?? false,
    sourcemapIgnoreList:
      typeof sourcemapIgnoreList === 'function'
        ? sourcemapIgnoreList
        : sourcemapIgnoreList === false
          ? () => false
          : (relativeSourcePath: string, _sourcemapPath: string) =>
              relativeSourcePath.includes('node_modules'),
    sourcemapPathTransform,
    banner: getAddon(opts, 'banner'),
    footer: getAddon(opts, 'footer'),
    intro: getAddon(opts, 'intro'),
    outro: getAddon(opts, 'outro'),
    esModule: esModule ?? 'if-default-prop',
    // TODO support functions
    globals: globals ?? {},
    entryFileNames: entryFileNames ?? '[name].js',
    chunkFileNames: chunkFileNames ?? '[name]-[hash].js',
    cssEntryFileNames: cssEntryFileNames ?? '[name].css',
    cssChunkFileNames: cssChunkFileNames ?? '[name]-[hash].css',
    assetFileNames: assetFileNames ?? 'assets/[name]-[hash][extname]',
    plugins: [],
    minify: opts.minify,
    extend: opts.extend,
    name,
    externalLiveBindings: opts.externalLiveBindings ?? true,
    inlineDynamicImports: opts.inlineDynamicImports ?? false,
    advancedChunks: opts.advancedChunks,
  }
}

function getFormat(
  format: OutputOptions['format'],
): NormalizedOutputOptions['format'] {
  switch (format) {
    case undefined:
    case 'es':
    case 'esm':
    case 'module': {
      return 'es'
    }

    case 'cjs':
    case 'commonjs': {
      return 'cjs'
    }

    case 'iife': {
      return 'iife'
    }

    case 'umd': {
      return 'umd'
    }

    default:
      unimplemented(`output.format: ${format}`)
  }
}

const getAddon = <T extends 'banner' | 'footer' | 'intro' | 'outro'>(
  config: OutputOptions,
  name: T,
): NormalizedOutputOptions[T] => {
  return async (chunk) => {
    const configAddon = config[name]
    if (typeof configAddon === 'function') {
      return configAddon(chunk)
    }
    return configAddon || ''
  }
}

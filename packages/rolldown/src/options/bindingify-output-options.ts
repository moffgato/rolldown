import { BindingOutputOptions } from '../binding'
import type { NormalizedInputOptions } from './normalized-input-options'
import { NormalizedOutputOptions } from './normalized-output-options'

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
    entryFileNames,
    chunkFileNames,
    banner,
    footer,
  } = outputOptions
  return {
    dir,
    format,
    exports,
    sourcemap: bindingifySourcemap(sourcemap),
    sourcemapIgnoreList,
    sourcemapPathTransform,
    banner,
    footer,
    entryFileNames,
    chunkFileNames,
    // TODO(sapphi-red): support parallel plugins
    plugins: [],
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
    case 'hidden':
      return 'hidden'

    default:
      throw new Error(`unknown sourcemap: ${sourcemap}`)
  }
}

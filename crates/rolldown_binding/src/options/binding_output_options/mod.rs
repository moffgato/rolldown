mod types;

use crate::types::js_callback::{JsCallback, MaybeAsyncJsCallback};
use std::collections::HashMap;

use super::super::types::binding_rendered_chunk::RenderedChunk;
use super::plugin::BindingPluginOrParallelJsPluginPlaceholder;
use crate::types::binding_pre_rendered_chunk::PreRenderedChunk;
use derivative::Derivative;
use napi::Either;
use napi_derive::napi;
use serde::Deserialize;
use types::binding_advanced_chunks_options::BindingAdvancedChunksOptions;

pub type AddonOutputOption = MaybeAsyncJsCallback<RenderedChunk, Option<String>>;
pub type ChunkFileNamesOutputOption = Either<String, JsCallback<PreRenderedChunk, String>>;

#[napi(object, object_to_js = false)]
#[derive(Deserialize, Derivative)]
#[serde(rename_all = "camelCase")]
#[derivative(Debug)]
pub struct BindingOutputOptions {
  // --- Options Rolldown doesn't need to be supported
  // /** @deprecated Use the "renderDynamicImport" plugin hook instead. */
  // dynamicImportFunction: string | undefined;
  pub name: Option<String>,
  pub asset_file_names: Option<String>,

  #[derivative(Debug = "ignore")]
  #[serde(skip_deserializing)]
  #[napi(ts_type = "string | ((chunk: PreRenderedChunk) => string)")]
  pub entry_file_names: Option<ChunkFileNamesOutputOption>,
  #[derivative(Debug = "ignore")]
  #[serde(skip_deserializing)]
  #[napi(ts_type = "string | ((chunk: PreRenderedChunk) => string)")]
  pub chunk_file_names: Option<ChunkFileNamesOutputOption>,
  #[derivative(Debug = "ignore")]
  #[serde(skip_deserializing)]
  #[napi(ts_type = "string | ((chunk: PreRenderedChunk) => string)")]
  pub css_entry_file_names: Option<ChunkFileNamesOutputOption>,
  #[derivative(Debug = "ignore")]
  #[serde(skip_deserializing)]
  #[napi(ts_type = "string | ((chunk: PreRenderedChunk) => string)")]
  pub css_chunk_file_names: Option<ChunkFileNamesOutputOption>,

  // amd: NormalizedAmdOptions;
  // assetFileNames: string | ((chunkInfo: PreRenderedAsset) => string);
  #[derivative(Debug = "ignore")]
  #[serde(skip_deserializing)]
  #[napi(ts_type = "(chunk: RenderedChunk) => MaybePromise<VoidNullable<string>>")]
  pub banner: Option<AddonOutputOption>,
  // chunkFileNames: string | ((chunkInfo: PreRenderedChunk) => string);
  // compact: boolean;
  pub dir: Option<String>,
  pub file: Option<String>,
  // pub entry_file_names: String, // | ((chunkInfo: PreRenderedChunk) => string)
  #[serde(skip_deserializing)]
  #[napi(ts_type = "boolean | 'if-default-prop'")]
  pub es_module: Option<Either<bool, String>>,
  #[napi(ts_type = "'default' | 'named' | 'none' | 'auto'")]
  pub exports: Option<String>,
  pub extend: Option<bool>,
  pub external_live_bindings: Option<bool>,
  // footer: () => string | Promise<string>;
  #[derivative(Debug = "ignore")]
  #[serde(skip_deserializing)]
  #[napi(ts_type = "(chunk: RenderedChunk) => MaybePromise<VoidNullable<string>>")]
  pub footer: Option<AddonOutputOption>,
  #[napi(ts_type = "'es' | 'cjs' | 'iife' | 'umd'")]
  pub format: Option<String>,
  // freeze: boolean;
  // generatedCode: NormalizedGeneratedCodeOptions;
  pub globals: Option<HashMap<String, String>>,
  // hoistTransitiveImports: boolean;
  // indent: true | string;
  pub inline_dynamic_imports: Option<bool>,
  // interop: GetInterop;
  #[derivative(Debug = "ignore")]
  #[serde(skip_deserializing)]
  #[napi(ts_type = "(chunk: RenderedChunk) => MaybePromise<VoidNullable<string>>")]
  pub intro: Option<AddonOutputOption>,
  // manualChunks: ManualChunksOption;
  // minifyInternalExports: boolean;
  // namespaceToStringTag: boolean;
  // noConflict: boolean;
  #[derivative(Debug = "ignore")]
  #[serde(skip_deserializing)]
  #[napi(ts_type = "(chunk: RenderedChunk) => MaybePromise<VoidNullable<string>>")]
  pub outro: Option<AddonOutputOption>,
  // paths: OptionsPaths;
  #[serde(skip_deserializing)]
  #[napi(ts_type = "(BindingBuiltinPlugin | BindingPluginOptions | undefined)[]")]
  pub plugins: Vec<BindingPluginOrParallelJsPluginPlaceholder>,
  // preferConst: boolean;
  // preserveModules: boolean;
  // preserveModulesRoot: string | undefined;
  // sanitizeFileName: (fileName: string) => string;
  #[napi(ts_type = "'file' | 'inline' | 'hidden'")]
  pub sourcemap: Option<String>,
  #[derivative(Debug = "ignore")]
  #[serde(skip_deserializing)]
  #[napi(ts_type = "(source: string, sourcemapPath: string) => boolean")]
  pub sourcemap_ignore_list: Option<JsCallback<(String, String), bool>>,
  pub sourcemap_debug_ids: Option<bool>,
  #[derivative(Debug = "ignore")]
  #[serde(skip_deserializing)]
  #[napi(ts_type = "(source: string, sourcemapPath: string) => string")]
  pub sourcemap_path_transform: Option<JsCallback<(String, String), String>>,
  // sourcemapExcludeSources: boolean;
  // sourcemapFile: string | undefined;
  // strict: boolean;
  // systemNullSetters: boolean;
  // validate: boolean;

  // --- Enhanced options
  pub minify: Option<bool>,
  pub advanced_chunks: Option<BindingAdvancedChunksOptions>,
}

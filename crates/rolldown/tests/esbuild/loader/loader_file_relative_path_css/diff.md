# Reason
1. css reference .png
2. not support asset path template
# Diff
## /out/image-LSAMBFUD.png
### esbuild
```js
x
```
### rolldown
```js

```
### diff
```diff
===================================================================
--- esbuild	/out/image-LSAMBFUD.png
+++ rolldown	
@@ -1,1 +0,0 @@
-x;

```
## /out/entries/entry.css
### esbuild
```js
/* src/entries/entry.css */
div {
  background: url("../image-LSAMBFUD.png");
}
```
### rolldown
```js

```
### diff
```diff
===================================================================
--- esbuild	/out/entries/entry.css
+++ rolldown	
@@ -1,4 +0,0 @@
-/* src/entries/entry.css */
-div {
-  background: url("../image-LSAMBFUD.png");
-}
\ No newline at end of file

```
import { expect, test, vi } from 'vitest'
import { watch } from 'rolldown'
import fs from 'node:fs'
import path from 'node:path'

const input = path.join(import.meta.dirname, './main.js')
const inputSource = fs.readFileSync(input, 'utf-8')
const output = path.join(import.meta.dirname, './dist/main.js')

test.sequential('watch', async () => {
  const watchChangeFn = vi.fn()
  const closeWatcherFn = vi.fn()
  const watcher = await watch({
    input,
    cwd: import.meta.dirname,
    plugins: [
      {
        watchChange(id, event) {
          // The macos emit create event when the file is changed, not sure the reason,
          // so here only check the update event
          if (event.event === 'update') {
            watchChangeFn()
            expect(id).toBe(input)
          }
        },
      },
      {
        closeWatcher() {
          closeWatcherFn()
        },
      },
    ],
  })
  await waitBuildFinished()
  // should run build once
  expect(fs.readFileSync(output, 'utf-8').includes('console.log(1)')).toBe(true)

  // edit file
  fs.writeFileSync(input, 'console.log(2)')
  await waitBuildFinished()
  expect(fs.readFileSync(output, 'utf-8').includes('console.log(2)')).toBe(true)
  // The different platform maybe emit multiple events
  expect(watchChangeFn).toBeCalled()

  await watcher.close()
  expect(closeWatcherFn).toBeCalledTimes(1)

  // revert change
  fs.writeFileSync(input, inputSource)
})

test.sequential('watch close', async () => {
  const watcher = await watch({
    input,
    cwd: import.meta.dirname,
  })
  await waitBuildFinished()

  await watcher.close()
  // edit file
  fs.writeFileSync(input, 'console.log(3)')
  await waitBuildFinished()
  // The watcher is closed, so the output file should not be updated
  expect(fs.readFileSync(output, 'utf-8').includes('console.log(1)')).toBe(true)

  // revert change
  fs.writeFileSync(input, inputSource)
})

test.sequential('watch event', async () => {
  const watcher = await watch({
    input,
    cwd: import.meta.dirname,
  })

  await waitBuildFinished()

  const events: any[] = []
  watcher.on('event', (event) => {
    if (event.code === 'BUNDLE_END') {
      expect(event.output).toEqual([path.join(import.meta.dirname, './dist')])
      expect(event.duration).toBeTypeOf('number')
      events.push({ code: 'BUNDLE_END' })
    } else {
      events.push(event)
    }
  })
  const restartFn = vi.fn()
  watcher.on('restart', restartFn)
  const closeFn = vi.fn()
  watcher.on('close', closeFn)
  const changeFn = vi.fn()
  watcher.on('change', (id, event) => {
    // The macos emit create event when the file is changed, not sure the reason,
    // so here only check the update event
    if (event.event === 'update') {
      changeFn()
      expect(id).toBe(input)
    }
  })

  // edit file
  fs.writeFileSync(input, 'console.log(3)')
  await waitBuildFinished()
  await watcher.close()
  // The different platform maybe emit multiple events, so here only check the first 4 events
  expect(events.slice(0, 4)).toEqual([
    { code: 'START' },
    { code: 'BUNDLE_START' },
    { code: 'BUNDLE_END' },
    { code: 'END' },
  ])
  expect(restartFn).toBeCalled()
  expect(closeFn).toBeCalled()
  expect(changeFn).toBeCalled()

  // revert change
  fs.writeFileSync(input, inputSource)
})

test.sequential('watch skipWrite', async () => {
  const dir = path.join(import.meta.dirname, './skipWrite-dist/')
  const watcher = await watch({
    input,
    cwd: import.meta.dirname,
    output: {
      dir,
    },
    watch: {
      skipWrite: true,
    },
  })
  await waitBuildFinished()
  expect(fs.existsSync(dir)).toBe(false)
  await watcher.close()
})

test.sequential('PluginContext addWatchFile', async () => {
  const foo = path.join(import.meta.dirname, './foo.js')
  const watcher = await watch({
    input,
    cwd: import.meta.dirname,
    plugins: [
      {
        buildStart() {
          this.addWatchFile(foo)
        },
      },
    ],
  })

  await waitBuildFinished()

  const changeFn = vi.fn()
  watcher.on('change', (id, event) => {
    // The macos emit create event when the file is changed, not sure the reason,
    // so here only check the update event
    if (event.event === 'update') {
      changeFn()
      expect(id).toBe(foo)
    }
  })

  // edit file
  fs.writeFileSync(foo, 'console.log(2)')
  // wait for watcher to detect the change
  await new Promise((resolve) => {
    setTimeout(resolve, 50)
  })
  expect(changeFn).toBeCalled()

  // revert change
  fs.writeFileSync(foo, 'console.log(1)\n')
  await watcher.close()
})

test.sequential('watch include/exclude', async () => {
  const watcher = await watch({
    input,
    cwd: import.meta.dirname,
    watch: {
      exclude: 'main.js',
    },
  })

  await waitBuildFinished()

  // edit file
  fs.writeFileSync(input, 'console.log(2)')
  // wait for watcher to detect the change
  await new Promise((resolve) => {
    setTimeout(resolve, 50)
  })
  // The input is excluded, so the output file should not be updated
  expect(fs.readFileSync(output, 'utf-8').includes('console.log(1)')).toBe(true)

  // revert change
  fs.writeFileSync(input, 'console.log(1)\n')
  await watcher.close()
})

async function waitBuildFinished() {
  // sleep 50ms
  await new Promise((resolve) => {
    setTimeout(resolve, 50)
  })
}

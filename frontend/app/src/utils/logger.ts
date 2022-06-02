import * as tauriLog from 'tauri-plugin-log-api'

type FnType = 'error' | 'warn' | 'info' | 'debug' | 'trace'

export var error = loggerFactory('error')
export var warn = loggerFactory('warn')
export var info = loggerFactory('info')
export var debug = loggerFactory('debug')
export var trace = loggerFactory('trace')

function loggerFactory(cb: FnType) {
  let fn = import.meta.env.TAURI_DEBUG
    ? tauriLog[cb]
    : (m: string) => Promise.resolve(console[cb](m))

  return function actualLogger(...args: Array<any>): Promise<void> {
    if (args.length == 1) {
      return fn(args[0])
    } else {
      let message = args
        .map((v) => {
          if (typeof v == 'string') {
            return v
          } else {
            return JSON.stringify(v, null, 3)
          }
        })
        .join(', ')

      return fn(message)
    }
  }
}

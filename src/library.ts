import path from 'path'
import fs from 'fs'

import {
  log,
}                   from './config'
import { Backend }  from './backend'

const backend = new Backend()

export function LIBRARY (
  libraryFile?: string,
) {
  log.verbose('ffi-adapter', 'LIBRARY(%s)', libraryFile || '')

  /**
   * Freeze the current library settings,
   * and save the libIndex for finalizing.
   */
  const libraryId = backend.id()
  backend.freeze()
  void libraryId

  return getClassDecorator(libraryId, libraryFile)
}

function getClassDecorator (
  libraryId: number,
  libraryFile?: string,
) {

  /**
   * See: https://www.typescriptlang.org/docs/handbook/decorators.html#class-decorators
   */
  return function classDecorator <
    T extends {
      new (...args: any[]): {},
    }
  > (
    constructor:T,
  ) {
    let instance: any = null

    return class extends constructor {

      constructor (...args: any[]) {
        super(...args)

        if (instance) {
          log.verbose(this.constructor.name + '(ffi-adapter)', 'constructor() singleton')
          return instance // return the singleton instance after the first initiation.
        } else {
          /**
           * Constructor Tasks
           */
          log.verbose(this.constructor.name + '(ffi-adapter)', 'constructor(%s)', args.join(','))
          instance = this

          backendFinalize(libraryId, libraryFile, args)
          // no need to return at the first instantiation.
        }

      }

    }
  }
}

/**
 * Finalize the library backend by file from libraryFile or args.
 */
function backendFinalize (
  libraryId: number,
  libraryFile: undefined | string,
  args: any[]
): void {
  log.verbose('ffi-adapter', 'LIBRARY() backendFinalize(%s, %s, %s)', libraryId, libraryFile, JSON.stringify(args))

  /**
   * The libraryFile in constructor(libraryFile) has high priority
   */
  if (typeof args[0] !== 'undefined') {
    if (typeof args[0] !== 'string') {
      throw new Error('constructor(arg1): the arg1 must be the library path!')
    }
    libraryFile = args[0]
  }

  if (!libraryFile) {
    throw new Error('ffi-adapter: we must specify library file in @LIBRARY(libFile) or in the first arg of constructor(libFile)!')
  }

  libraryFile = path.resolve(libraryFile)
  if (!fs.existsSync(libraryFile)) {
    throw new Error(`Library file not found: ${libraryFile}`)
  }

  backend.finalize(libraryId, libraryFile)
}

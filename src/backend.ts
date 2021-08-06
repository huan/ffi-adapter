import ffi from 'ffi-napi'

import {
  log,
}                           from './config'

import {
  FfiLibraryConfig,
  FfiLibraryFuncConfig,
}                           from './types'

let singletonInstance: null | Backend = null

export class Backend {

  private currentIndex = 0

  private libDict = new Map<number, any>()
  private configDict = new Map<number, FfiLibraryConfig>()
  private indexDict = new Map<string, number>()
  private fileDict = new Map<number, string>()

  /**
   * Singleton
   */
  constructor () {
    if (singletonInstance) {
      log.verbose('ffi-adapter', 'Backend.constructor() singleton')
      return singletonInstance
    }
    log.verbose('ffi-adapter', 'Backend.constructor()')

    // Init the system settings.
    this.configDict.set(0, {})

    singletonInstance = this
  }

  /**
   * Id of current library
   */
  id (): number {
    log.verbose('ffi-adapter', 'Backend.id() = %s', this.currentIndex)
    return this.currentIndex
  }

  lib (id: number): any { // ffi.Library
    log.verbose('ffi-adapter', 'Backend.lib(%s: "%s")', id, this.file(id))

    const lib = this.libDict.get(id)
    if (!lib) {
      throw new Error(`lib not found for id: ${id}`)
    }

    return lib
  }

  config (
    funcName: string,
    funcConfig: FfiLibraryFuncConfig,
  ): void { // add a method to library of current id
    log.verbose('ffi-adapter', 'Backend.config(%s, %s)',
      funcName,
      JSON.stringify(funcConfig),
    )
    const libConfig = this.configDict.get(this.currentIndex) as FfiLibraryConfig
    if (!libConfig) {
      throw new Error(`can not found libConfig for libIndex:${this.currentIndex}`)
    }
    libConfig[funcName] = funcConfig
  }

  /**
   * freeze config and bump the library index number
   *  use id() before freeze() to get the current library index
   */
  freeze () {
    log.verbose('ffi-adapter', 'Backend.freeze() index=%s', this.currentIndex)

    const config = this.configDict.get(this.currentIndex)
    log.silly('ffi-adapter', 'Backend.freeze() config="%s"', JSON.stringify(config))

    /**
     * Prepare for setting the next library
     *  by increasing the this.index by 1
     */
    this.currentIndex++
    this.configDict.set(this.currentIndex, {})
  }

  /**
   * finalize config for libIndex with libPath
   */
  finalize (libId: number, libPath: string) {
    log.verbose('ffi-adapter', 'Backend.finalize(%s, %s)', libId, libPath)

    /**
     * Record the filePath
     */
    if (this.indexDict.has(libPath)) {
      throw new Error(`Library(${libPath}) can only be bridged once!`)
    }
    this.indexDict.set(libPath, libId)
    this.fileDict.set(libId, libPath)   // save reverse dict to query by id

    /**
     * Get the current libConfig,
     */
    const libConfig = this.configDict.get(libId)
    if (!libConfig) {
      throw new Error(`can not found config for id ${libId}`)
    }

    /**
     * Init the ffi.Library
     */
    const library = ffi.Library(
      libPath,
      libConfig,
    )
    this.libDict.set(libId, library)
  }

  public file (id: number): string {
    const libFile = this.fileDict.get(id)
    if (!libFile) {
      throw new Error(`Can not find library file for id ${id}!`)
    }
    return libFile
  }

  /**
   * for unit/integration testing porpuse
   */
  public reset () {
    this.currentIndex = 0

    this.libDict.clear()
    this.configDict.clear()
    this.indexDict.clear()
    this.fileDict.clear()

    this.configDict.set(0, {})
  }

}

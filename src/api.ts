import {
  PSEUDO_RETURN,
  log,
}                         from './config'

import {
  DesignType,
  FfiType,
  FfiLibraryFuncConfig,

  toFfiType,
  isStatic,
}                         from './types'

import {
  Backend,
}               from './backend'

const backend = new Backend()

export function API (
  returnType?: FfiType,
) {
  // log.verbose('ffi-adapter', 'API(%s)', returnType || '')

  return (
    target : any,
    key : string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    // console.info('target:', typeof target, target, target.constructor.name)
    // console.info('descriptor:', descriptor)
    const designReturnType = Reflect.getMetadata('design:returntype', target, key) as DesignType
    const designParamTypes = Reflect.getMetadata('design:paramtypes', target, key) as DesignType[]

    log.silly('ffi-adapter', 'API(%s) wrapper(%s, <%s> %s) designReturnType="%s", designParamTypes=[%s]',
      returnType || '',
      target.name /* static */ || target.constructor.name /* instance */,
      isStatic(target) ? 'static' : 'instance',
      key,
      designReturnType && designReturnType.name,
      designParamTypes.map(t => typeof t).join(','),
    )

    const [ffiReturnType, async] = getReturnTuple(designReturnType, returnType)
    // Huan(202001): 'number' will became 'int'. what if we need a 'int64'?
    const ffiParamTypeList = designParamTypes.map(t => toFfiType(t)[0])

    log.verbose('ffi-adapter', 'API(%s) wrapper(%s, <%s> %s) returnType="%s", paramTypeList=[%s]',
      returnType || '',
      target.name /* static */ || target.constructor.name /* instance */,
      isStatic(target) ? 'static' : 'instance',
      key,
      ffiReturnType,
      ffiParamTypeList.join(','),
    )

    const ffiLibFuncConfig = [ffiReturnType, [...ffiParamTypeList]] as FfiLibraryFuncConfig
    backend.config(key, ffiLibFuncConfig)

    replaceMethod(target, key, descriptor, async)

    return descriptor
  }
}

export function replaceMethod (
  target: any,
  method: string,
  descriptor: PropertyDescriptor,
  async: boolean,
) {
  const targetName = target.name || target.constructor.name

  log.verbose('ffi-adapter', 'replaceMethod(%s, %s, %s, %s)',
    targetName,
    method,
    JSON.stringify(descriptor),
    async,
  )

  /**
   * Get the current library backend Index
   *  We use index at here is becasue at this time, the library instance itself is not initialized yet.
   */
  const libraryId = backend.id()

  let pseudoMethod: Function

  /**
   * Implemente method to the DLL
   */
  const newMethod = function (...args: any[]) {
    log.verbose(
      targetName + '(ffi-adapter)',
      `${method}(%s)`,
      // FIXME(huan) 202001: perhaps Buffer in args will get problem with ffi/ref Callback (?)
      args.join(','),
    )

    /**
     * Check the PSEUDO RETURN value by RETURN()
     */
    const pseudoReturn = pseudoMethod.apply(target, args)
    if (pseudoReturn instanceof Promise) {
      pseudoReturn.then(ret => {
        if (ret !== PSEUDO_RETURN) {
          log.error(
            targetName + '(ffi-adapter)',
            `${method}<replaceMethod() newMethod()>(): API method must return RETURN() to confirm bridging.`,
            (target.name || target.constructor.name),
            method,
          )
        }
        return ret
      }).catch(console.error)
    } else if (pseudoReturn !== PSEUDO_RETURN) {
      throw new Error('API method must return RETURN() to confirm bridging.')
    }

    /**
     * Do the lift with ffi Library
     */
    const library = backend.lib(libraryId)

    if (async) {
      /**
       * See: https://github.com/node-ffi/node-ffi/wiki/Node-FFI-Tutorial#async-library-calls
       */
      return new Promise((resolve, reject) => {
        library[method].async.call(library, ...args, function (err: any, res: any) {
          if (err) {
            return reject(err)
          }
          resolve(res)
        })
      })
    } else {
      return library[method].apply(library, args)
    }
  }

  /**
   * Update the method
   */
  if (isStatic(target)) {                   // Static Class
    pseudoMethod = target[method]
    target[method] = newMethod
  } else {                                  // Instance Class
    pseudoMethod = descriptor.value
    descriptor.value = newMethod
  }

}

export function getReturnTuple (
  designReturnType: DesignType,
  returnType?: FfiType,
): [FfiType, boolean] {

  if (designReturnType === Promise) {
    if (typeof returnType === 'undefined') {
      throw new Error('A method that return Promise must be decorated by @API(ReturnType)')
    }
    return [returnType, true]
  }

  const typeList = toFfiType(designReturnType)
  if (typeof returnType === 'undefined') {
    // TODO(Huan, 202001): the default type is typeList[0], does this has any problem?
    returnType = typeList[0]
  } else if (!typeList.includes(returnType)) {
    throw new Error(`ReturnType does not match: @API(${returnType}) must be included in method return type list: ${typeList.join(',')}`)
  }

  return [returnType, false]
}

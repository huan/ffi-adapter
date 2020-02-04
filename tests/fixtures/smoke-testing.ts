#!/usr/bin/env ts-node

// tslint:disable:arrow-parens
// tslint:disable:max-line-length
// tslint:disable:member-ordering
// tslint:disable:no-shadowed-variable
// tslint:disable:unified-signatures
// tslint:disable:no-console

import {
  LIBRARY,
  API,
  RETURN,
  VERSION,
}                 from 'ffi-adapter'

import {
  FIXTURE_LIB_FACTORIAL_FILE,
}                               from './library/'

@LIBRARY(FIXTURE_LIB_FACTORIAL_FILE)
class Test {
  @API('uint64') factorial (n: number): number { return RETURN(n) }
}

async function main () {
  if (VERSION === '0.0.0') {
    throw new Error('version should not be 0.0.0 when prepare for publishing')
  }

  const lib = new Test()
  const result = lib.factorial(5)
  if (result !== 120) {
    throw new Error(`result error: the result:${result} is not 120`)
  }
  console.info(`FfiAdapter v${VERSION} smoke testing passed.`)
  return 0
}

main()
  .then(process.exit)
  .catch(e => {
    console.error(e)
    process.exit(1)
  })

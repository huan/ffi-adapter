#!/usr/bin/env ts-node

/* eslint-disable padded-blocks */

import { test }  from 'tstest'

import ffi from 'ffi-napi'

import {
  LIBRARY,
  API,
  RETURN,
}                   from '../src/mod'

import {
  Backend,
}             from '../src/backend'

import {
  FIXTURE_LIB_FACTORIAL_FILE,
}                                 from './fixtures/library'

const backend = new Backend()

test('FFI with libfactorial.{dll,so}', async (t) => {
  const INPUT_NUMBER = 5
  const EXPECTED_RESULT = 120

  const libfactorial = ffi.Library(
    FIXTURE_LIB_FACTORIAL_FILE,
    {
      factorial: ['uint64', ['int']],
    },
  )

  const result = libfactorial.factorial(INPUT_NUMBER)
  t.equal(result, EXPECTED_RESULT, 'should get the expected factorial result')
})

test('@LIBRARY & @API decorater for libfactorial.{dll,so}', async (t) => {
  backend.reset()

  const TEST_NUM = 64
  /**
   * Huan(202001): FFI will convert large uint64 number to string
   *  because in nodejs, float(9223372036854775808) will became 9223372036854776000
   */
  const EXPECTED_RESULT = '9223372036854775808'

  @LIBRARY(FIXTURE_LIB_FACTORIAL_FILE)
  class TestLibrary {
    @API('uint64') factorial (n: number): number { return RETURN(n) }
  }

  const lib = new TestLibrary()
  const result = lib.factorial(TEST_NUM)

  t.equal(result, EXPECTED_RESULT, 'should get the expected result')
})

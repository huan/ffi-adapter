#!/usr/bin/env ts-node
/* eslint-disable padded-blocks */

import test  from 'blue-tape'

import { LIBRARY } from './library'
import { Backend } from './backend'

import {
  FIXTURE_LIB_FACTORIAL_FILE,
}                               from '../tests/fixtures/library'

const backend = new Backend()

test('Instance singleton', async t => {
  backend.reset()

  @LIBRARY(FIXTURE_LIB_FACTORIAL_FILE)
  class TestSingleton {}

  const instance1 = new TestSingleton()
  const instance2 = new TestSingleton()
  t.equal(instance1, instance2, 'should get the same instance through different instantiation')
})

test('Library file checking', async t => {
  backend.reset()

  @LIBRARY(FIXTURE_LIB_FACTORIAL_FILE)
  class TestLib { constructor () {} }

  t.doesNotThrow(() => new TestLib(), 'defined library fine in LIBRARY(libraryFile)')
})

test('Constructor file checking', async t => {
  backend.reset()

  @LIBRARY()
  class TestConstructor { constructor (libraryFile: string) { void libraryFile } }

  t.doesNotThrow(() =>  new TestConstructor(FIXTURE_LIB_FACTORIAL_FILE), 'defined library fine in constructor(libraryFile)')
})

test('Throw Error if neither LIBRARY(libraryFile) nor constructor(libraryFile) defined', async t => {
  backend.reset()

  @LIBRARY()
  class TestEmpty {}

  t.throws(() =>  new TestEmpty(), 'show throw error because no library file defined')
})

test('Make sure the global libraryIndex is right when decorating more than one LIBRARY class', async t => {
  t.skip('to be write')
})

test('Should throw error if adapte a DLL file more than onece', async t => {
  t.skip('to be write')
})

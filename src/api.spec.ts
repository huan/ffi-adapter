#!/usr/bin/env ts-node
/* eslint-disable padded-blocks */

import test  from 'blue-tape'

test('Should throw error if the bridged methods not exist in the DLL', async t => {
  /**
   * C:\Users\huan\git\wechaty-puppet-dll\node_modules\ffi\lib\dynamic_library.js:112
   * throw new Error('Dynamic Symbol Retrieval Error: ' + this.error())
   * Error: Dynamic Symbol Retrieval Error: Win32 error 127
   */
  t.skip('to be write')
})

test('API() can be called without any parameters to auto inference the sync return type', async t => {
  t.skip('to be write')
})

test('API() should throw an error if called without any parameter with an async return type (Promise<any>)', async t => {
  t.skip('to be write')
})

test('method return Promise must be decorated with @API(ReturnType)', async (t) => {
  t.pass('tbw')
})

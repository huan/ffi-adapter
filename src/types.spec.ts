#!/usr/bin/env ts-node
/* eslint-disable padded-blocks */

import test  from 'blue-tape'

import {
  isStatic,
} from          './types'

test('isStatic()', async t => {
  class Test {}
  const test = new Test()

  t.ok(isStatic(Test), 'should identify static Class')
  t.ok(!isStatic(test), 'should identify class instance')
})

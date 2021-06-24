#!/usr/bin/env ts-node

// tslint:disable:no-shadowed-variable
import test  from 'blue-tape'

import { Backend } from './backend'

test('Class & Properties decorate should orderd one by one', async t => {
  t.skip('to be write')
})

test('Singleton: new twice will get the same instance', async t => {
  const b1 = new Backend()
  const b2 = new Backend()
  t.equal(b1, b2, 'should get singleton instances')
})

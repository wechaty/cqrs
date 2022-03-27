#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import { AssertEqual, test }  from 'tstest'
import type { ActionBuilder } from 'typesafe-actions'

import type { MetaRequest, MetaResponse } from './meta.js'

import type { PayloadMetaActionFactory }  from './payload-meta-action-factory.js'

test('PayloadMetaActionFactory Request', async t => {
  type TType = 'TType'
  type TPayload = { rPayload: string }
  type TArgs = [string]

  type R = PayloadMetaActionFactory<TType, TPayload, MetaRequest, TArgs>
  type E = (_: string) => ActionBuilder<TType, TPayload, MetaRequest>

  const typingTest: AssertEqual<R, E> = true
  t.ok(typingTest, 'should be expected')
})

test('PayloadMetaActionFactory Response', async t => {
  type RType = 'RType'
  type RPayload = { rPayload: string }
  type TRes = { metaResponse: string } & MetaResponse

  type R = PayloadMetaActionFactory<RType, RPayload, MetaResponse, [TRes]>
  type E = (res: TRes) => ActionBuilder<RType, RPayload, MetaResponse>

  const typingTest: AssertEqual<R, E> = true
  t.ok(typingTest, 'should be expected')
})

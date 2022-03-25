#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import { AssertEqual, test }  from 'tstest'
import type { ActionBuilder } from 'typesafe-actions'

import type { MetaRequest, MetaResponse } from '../cqr-event/meta.js'

import type { MetaActionCreator }         from './meta-action-creator.js'

test('MetaActionCreator Request', async t => {
  type TType = 'TType'
  type TPayload = { rPayload: string }
  type TArgs = [string]

  type R = MetaActionCreator<TType, TPayload, MetaRequest, TArgs>
  type E = (_: string) => ActionBuilder<TType, TPayload, MetaRequest>

  const typingTest: AssertEqual<R, E> = true
  t.ok(typingTest, 'should be expected')
})

test('MetaActionCreator Response', async t => {
  type RType = 'RType'
  type RPayload = { rPayload: string }
  type TRes = { metaResponse: string } & MetaResponse

  type R = MetaActionCreator<RType, RPayload, MetaResponse, [TRes]>
  type E = (res: TRes) => ActionBuilder<RType, RPayload, MetaResponse>

  const typingTest: AssertEqual<R, E> = true
  t.ok(typingTest, 'should be expected')
})

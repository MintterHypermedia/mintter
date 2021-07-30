import type {Statement} from '@mintter/mttast'
import {statement, paragraph, text} from '@mintter/mttast-builder'
import {nanoid} from 'nanoid'
import {BaseRange, Range} from 'slate'

export function createStatement(): Statement {
  return statement({id: nanoid()}, [paragraph([text('')])])
}

export function isCollapsed(range: unknown): range is Range {
  return Range.isCollapsed(range as BaseRange)
}

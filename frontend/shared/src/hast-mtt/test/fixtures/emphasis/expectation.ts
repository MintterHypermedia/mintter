import {u} from 'unist-builder'
import {paragraph, text} from '../../../../mttast/builder'

export const emphasis = u('root', [
  paragraph([text('Hello World.', {emphasis: true})]),
  paragraph([text('Hello World.', {emphasis: true})]),
  paragraph([text('Hello World.', {emphasis: true})]),
])

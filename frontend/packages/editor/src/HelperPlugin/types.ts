import {Element} from 'slate'
import {ELEMENT_BLOCK} from '../BlockPlugin/defaults'
import {ELEMENT_IMAGE} from '../ImagePlugin/defaults'
export interface useHelperOptions {
  trigger?: string
}

export interface HelperNodeData {
  value: string
  [key: string]: any
}

export interface HelperOptionsNodeData {
  name: string
  type: string
  url?: string
}

export interface UseHelperOptions {
  trigger?: string
}

export interface InsertBlockOptions {
  type: ELEMENT_BLOCK | ELEMENT_IMAGE
  target?: Path | Range
}

export interface HelperNode extends Element, HelperNodeData {}

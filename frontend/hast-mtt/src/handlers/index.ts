import {all} from '../all'
import {a} from './a'
import {base} from './base'
import {blockquote} from './blockquote'
import {br} from './br'
import {code} from './code'
import {em} from './em'
import {heading} from './heading'
import {inlineCode} from './inline-code'
import {list} from './list'
import {listItem} from './list-item'
import {p} from './p'
import {root} from './root'
import {strikethrough} from './strikethrough'
import {strong} from './strong'
import {text} from './text'
import {underline} from './underline'

export const handlers = {
  root,
  text,
  a,
  b: strong,
  base,
  blockquote,
  br,
  code: inlineCode,
  dir: list,
  dt: listItem,
  dd: listItem,
  del: strikethrough,
  em,
  h1: heading,
  h2: heading,
  h3: heading,
  h4: heading,
  h5: heading,
  h6: heading,
  i: em,
  kbd: inlineCode,
  li: listItem,
  listing: code,
  mark: em,
  ol: list,
  p,
  plaintext: code,
  pre: code,
  s: strikethrough,
  samp: inlineCode,
  strike: strikethrough,
  strong,
  summary: p,
  tt: inlineCode,
  u: underline,
  ul: list,
  var: inlineCode,
  xmp: code,
  abbr: all,
  acronym: all,
  bdi: all,
  bdo: all,
  big: all,
  blink: all,
  button: all,
  canvas: all,
  cite: all,
  data: all,
  details: all,
  dfn: all,
  font: all,
  ins: all,
  label: all,
  map: all,
  marquee: all,
  meter: all,
  nobr: all,
  noscript: all,
  object: all,
  output: all,
  progress: all,
  rb: all,
  rbc: all,
  rp: all,
  rt: all,
  rtc: all,
  ruby: all,
  slot: all,
  small: all,
  span: all,
  sup: all,
  sub: all,
  tbody: all,
  tfoot: all,
  thead: all,
  time: all,
  hr: ignore,
  doctype: ignore,
  applet: ignore,
  area: ignore,
  basefont: ignore,
  bgsound: ignore,
  caption: ignore,
  col: ignore,
  colgroup: ignore,
  command: ignore,
  content: ignore,
  datalist: ignore,
  dialog: ignore,
  element: ignore,
  embed: ignore,
  frame: ignore,
  frameset: ignore,
  isindex: ignore,
  keygen: ignore,
  link: ignore,
  math: ignore,
  menu: ignore,
  menuitem: ignore,
  meta: ignore,
  nextid: ignore,
  noembed: ignore,
  noframes: ignore,
  optgroup: ignore,
  option: ignore,
  param: ignore,
  script: ignore,
  shadow: ignore,
  source: ignore,
  spacer: ignore,
  style: ignore,
  svg: ignore,
  template: ignore,
  title: ignore,
  track: ignore,
  // comment,
  // q,
  // select,
  // table,
  // td: tableCell,
  // textarea,
  // th: tableCell,
  // tr: tableRow,
  // video: media,
  // wbr,
  // iframe,
  // img,
  // image: img,
  // input,
  // address: wrapChildren,
  // article: wrapChildren,
  // aside: wrapChildren,
  // body: wrapChildren,
  // center: wrapChildren,
  // div: wrapChildren,
  // fieldset: wrapChildren,
  // figcaption: wrapChildren,
  // figure: wrapChildren,
  // form: wrapChildren,
  // footer: wrapChildren,
  // header: wrapChildren,
  // hgroup: wrapChildren,
  // html: wrapChildren,
  // legend: wrapChildren,
  // main: wrapChildren,
  // multicol: wrapChildren,
  // nav: wrapChildren,
  // picture: wrapChildren,
  // section: wrapChildren,
  // audio: media,
  // dl,
}

function ignore() {}

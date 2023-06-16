import {ImageBlock} from '@app/types/image'
import {defaultBlockSchema} from '@app/blocknote-core'

export const hdBlockSchema = {
  paragraph: defaultBlockSchema.paragraph,
  heading: defaultBlockSchema.heading,
  image: ImageBlock,
  // numberedListItem: defaultBlockSchema.numberedListItem,
  // bulletListItem: defaultBlockSchema.bulletListItem,
}

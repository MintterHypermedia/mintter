import documents from '@mintter/api/documents/v1alpha/documents_pb';
import mintter from '@mintter/api/v2/mintter_pb';
import { makeProto } from './make-proto';
import {
  focusBlockStartById,
  normalizeDescendantsToDocumentFragment,
} from '@udecode/slate-plugins';

import faker from 'faker';
import { createId } from './create-id';

export function buildProfile(): mintter.Profile.AsObject {
  return {
    peerId: faker.finance.bitcoinAddress(),
    accountId: faker.finance.bitcoinAddress(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    bio: faker.lorem.paragraph(),
    connectionStatus: mintter.ConnectionStatus.CONNECTED,
  };
}

export function buildBlocksMap(
  blocks: documents.Block[],
): Array<[string, documents.Block.AsObject]> {
  return blocks.map((b) => {
    let block = b.toObject();

    return [block.id, block];
  });
}

export function buildChildrensList(blocks: documents.Block[]): string[] {
  return blocks.map((b) => b.getId());
}

export function buildPublication(): documents.Publication {
  let pub = new documents.Publication();

  pub.setDocument(buildDocument());
  pub.setVersion(createId());

  return pub;
}

type BuildDocumentOptions = Partial<documents.Document.AsObject> & {
  blocks?: documents.Block[];
};

export function buildDocument({
  author = faker.finance.bitcoinAddress(),
  blocks,
  childrenListStyle = documents.ListStyle.NONE,
  title = faker.lorem.sentence(),
  subtitle = faker.lorem.sentence(),
  id = createId(),
}: BuildDocumentOptions = {}): documents.Document {
  console.log('author', author);

  let block1: documents.Block;
  let block2: documents.Block;
  let block3: documents.Block;
  if (blocks === undefined) {
    block1 = buildBlock();
    block2 = buildBlock();
    block3 = buildBlock();
    blocks = [block1, block2, block3];
  }

  let doc = new documents.Document();
  doc.setId(id);
  doc.setTitle(title);
  doc.setSubtitle(subtitle);
  doc.setAuthor(author);
  doc.setChildrenListStyle(childrenListStyle);
  doc.setChildrenList(buildChildrensList(blocks));
  let blocksMap = doc.getBlocksMap();
  blocks.forEach((b) => {
    blocksMap.set(b.getId(), b);
  });
  let linksMap = doc.getLinksMap();
  // set links map when needed
  return doc;
}

type BuildBlockOptions = Partial<documents.Block.AsObject> & {
  elementsList?: documents.InlineElement[];
};

export function buildBlock({
  elementsList,
  id = createId(),
  childListStyle = documents.ListStyle.NONE,
  parent = '',
  type = documents.Block.Type.BASIC,
  childrenList = [],
}: BuildBlockOptions = {}): documents.Block {
  let inlineElements: documents.InlineElement[];
  if (elementsList === undefined) {
    elementsList = [
      buildTextInlineElement(),
      buildTextInlineElement(),
      buildTextInlineElement(),
    ];
  } else {
    elementsList.map((n) => buildTextInlineElement(n.textRun));
  }

  let block = new documents.Block();
  block.setId(id);
  block.setElementsList(elementsList as documents.InlineElement[]);
  block.setChildListStyle(childListStyle);
  block.setParent(parent);
  block.setChildrenList(childrenList);
  block.setType(type);

  return block;
}

export function buildTextInlineElement(
  textRun?: documents.TextRun.AsObject,
): documents.InlineElement {
  if (textRun === undefined) {
    textRun = {
      text: faker.lorem.sentence(),
      bold: false,
      italic: false,
      underline: false,
      strikethrough: false,
      code: false,
      linkKey: '',
      blockquote: false,
    };
  }

  let node = new documents.InlineElement();
  let text = makeProto<documents.TextRun>(new documents.TextRun(), textRun);

  node.setTextRun(text);

  return node;
}

export function buildImageInlineElement(
  image?: documents.Image.AsObject,
  linkKey?: string,
): documents.InlineElement {
  if (linkKey === undefined) {
    linkKey = createId();
  }
  if (image === undefined) {
    image = {
      altText: faker.lorem.sentence(),
      linkKey,
    };
  }
  let node = new documents.InlineElement();
  let element = makeProto<documents.Image>(new documents.Image(), image);
  node.setImage(element);

  return node;
}

export function buildQuoteInlineElement(
  quote?: documents.Quote.AsObject,
  linkKey?: string,
): documents.InlineElement {
  if (linkKey === undefined) {
    linkKey = createId();
  }
  if (quote === undefined) {
    quote = {
      linkKey,
      startOffset: 0,
      endOffset: 0,
    };
  }
  let node = new documents.InlineElement();
  let element = makeProto<documents.Quote>(new documents.Quote(), quote);
  node.setQuote(element);
  return node;
}
// export function buildGetDocument({
//   author = faker.finance.bitcoinAddress(),
//   publishingState = PublishingState.PUBLISHED,
//   quotersList = [],
// } = {}): GetDocumentResponse.AsObject {
//   const blockRefList = bluidBlockRefList();
//   const blocksMap: [string, Block.AsObject][] = [
//     [
//       blockRefList.refsList[0].ref,
//       {
//         id: blockRefList.refsList[0].ref,
//         paragraph: {
//           inlineElementsList: [
//             {
//               text: faker.lorem.sentence(),
//             },
//           ],
//         },
//         quotersList,
//       },
//     ],
//   ];

//   return {
//     document: buildDocument({ blockRefList, author, publishingState }),
//     blocksMap,
//   };
// }

// export function bluidBlockRefList(): BlockRefList.AsObject {
//   return {
//     style: BlockRefList.Style.NONE,
//     refsList: [
//       {
//         ref: faker.random.uuid(),
//       },
//     ],
//   };
// }

// export function buildSuggestedConnection(): SuggestedProfile.AsObject {
//   return {
//     profile: buildProfile(),
//     addrsList: buildAddrsList(),
//   };
// }

// export function buildAddrsList(): string[] {
//   return [faker.internet.ip(), faker.internet.ip(), faker.internet.ip()];
// }

// export function buildDraft({
//   author = faker.finance.bitcoinAddress(),
//   publishingState = PublishingState.DRAFT,
//   blockRefList = bluidBlockRefList(),
// } = {}) {
//   return buildDocument({ author, publishingState, blockRefList });
// }

// export function buildEditProfile(): Pick<
//   Profile.AsObject,
//   'username' | 'bio' | 'email'
// > {
//   return {
//     username: faker.internet.userName(),
//     email: faker.internet.email(),
//     bio: faker.lorem.paragraph(),
//   };
// }

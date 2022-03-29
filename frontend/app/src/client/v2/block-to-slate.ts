// import { toSlateMachine } from "@app/client/v2/block-to-slate-machine";
import { FlowContent, PhrasingContent } from "@mintter/mttast";
// import { interpret } from "xstate";
import { Block, Layer, layerContains } from "./types";

// function main() {
//   let service = interpret(toSlateMachine).start()
// }

// main()

export function blockToSlate(blk: Block): FlowContent {

  const out = {
    id: blk.id,
    type: blk.type,
    // TODO: handle block attributes too. I guess we've lost
    // the "paragraph" type of the content node during the conversion ¯\_(ツ)_/¯.
    // Let's pretend it's there though.
    children: [
      {
        type: blk.type == 'heading' ? 'staticParagraph' : 'paragraph',
        children: [] as Array<PhrasingContent>,
      },
    ],
  };

  // NOTICE: It's a bit messy here, but it works.
  // Some of those helper function are not "pure", and use some of the variables
  // defined bellow. It can get a bit confusing, and definitely could be improved.

  // The basic idea here is that we iterate the text string from the API block
  // and we need to keep track of our current position. Both in UTF-16 code units
  // and Unicode Code Points. We use code point position to check it across all the
  // block layers. And we use the UTF-16 positions to extract the substring from the block text.

  // Store the pointer to the leaves array in the resulting block.
  // Just for convenience.
  const leaves = out.children[0].children;
  // Current leaf. At the beginning there's nothing.
  let leaf: any = null
  let linkOrEmbed: any = null
  // Start UTF-16 offset of the current leaf. It indicates the beginning
  // of the substring in the block text that would correspond to the current leaf.
  // to get the substring of the block text to insert it in the actual leaf.
  let textStart = 0;
  // Our current position in the UTF-16 string of the block text.
  // When we finish the current leaf, we use start, and this position
  // to extract the substring that belongs to the current leaf from the block text.
  let i = 0;
  // Last UTF-16 offset. Used to finish the last leaf. Otherwise we never get to
  // fill the leaf value.
  const stopPoint = blk.text.length - 1;
  // Code point position we're currently at. We check it across all the
  // block layers to determine where leafs should start and end.
  let pos = 0;
  // Here we track layers enabled for the current leaf.
  const leafLayers = new Set<Layer>();

  // Main loop that iterates over the block text string.
  // TODO: need to handle U+FFFC properly, and a lot more other edge cases.
  while (i < blk.text.length) {

    // This tracks how many UTF-16 code units we need to "consume", i.e. advance our position forward.
    // It's mostly 1, but we skip the second half of the surrogate pair when we see the first one.
    let ul = 1;
    let surrogate = isSurrogate(blk.text, i)
    if (surrogate) {
      ul++;
    }

    // We have to check each code point position whether it belongs to any of the layers of the block.
    let layersChanged = trackPosLayers(pos);

    // When we reach the stop point, we need to finish the current leaf before returning.
    if (i == stopPoint) {

      if (layersChanged) {
        if (leaf) {
          finishLeaf(textStart, i);
        }
        startLeaf(leafLayers);
      }
      finishLeaf(textStart, i + 1);

      if (linkOrEmbed) {
        leaves.push(linkOrEmbed)
        linkOrEmbed = null
      }

      return out as FlowContent;
    }

    // On the first iteration we won't have the leaf.
    if (!leaf) {
      startLeaf(leafLayers);
      advance(ul);
      continue;
    }

    // When layers change we need to finish the current leaf and start the new one.
    if (layersChanged) {
      finishLeaf(textStart, i);
      startLeaf(leafLayers);
    }

    advance(ul);
  }

  // We should never get here, because we would returned when we reach the stop point.
  throw Error("BUG: should not get here");

  // Advances our position. Used after every iteration.
  // Accepts the number of code units to advance the UTF-16 position.
  // Mostly it is 1, but for surrogate pairs it's 2.
  function advance(codeUnits: number) {
    pos++;
    i += codeUnits;
  };

  // Creates a new leaf, and makes it current.
  // Uses layers current position belongs to.
  function startLeaf(posLayers: Set<Layer>) {
    leaf = {
      type: "text",
    };

    // this var keeps track if in the current layers there's a link or embed layer or not. this is important to make sure we are adding items to the correct array
    let linkLayer: Layer | null = null

    posLayers.forEach((l) => {
      // Here's we'd need to do something more sophisticated
      // to determine how different layers affect the leaf node.
      // We'd need to check the layer "identity", but I'm
      // checking only type here for brevity.
      if (['link', 'embed'].includes(l.type)) {
        // TODO: modify leaf if is link or embed
        linkLayer = l
      }
      if (['strong', 'emphasis', 'strikethrough', 'underline', 'superscript', 'subscript'].includes(l.type)) {
        leaf[l.type] = true
      }
    });

    if (linkLayer) {

      if (linkOrEmbed) {
        if (linkChangedIdentity(linkLayer)) {
          leaves.push(linkOrEmbed)
          linkOrEmbed = {
            type: (linkLayer as Layer).type,
            ...(linkLayer as Layer).attributes,
            children: []
          }
        }
      } else {
        linkOrEmbed = {
          type: (linkLayer as Layer).type,
          ...(linkLayer as Layer).attributes,
          children: []
        }
      }
    } else {
      if (linkOrEmbed) {
        leaves.push(linkOrEmbed)
        linkOrEmbed = null
      }
    }
  };

  function linkChangedIdentity(layer: Layer): boolean {
    if (!linkOrEmbed) return false
    let currentLink = linkOrEmbed.url
    return currentLink != layer.attributes?.url
  }

  function finishLeaf(low: number, high: number) {
    let newValue = blk.text.substring(low, high);
    leaf.value = newValue
    textStart = high;

    if (linkOrEmbed) {
      if (linkOrEmbed.type == 'embed') {
        linkOrEmbed.children.push({ ...leaf, value: "" })
      } else {
        linkOrEmbed.children.push(leaf)
      }

    } else {
      leaves.push(leaf);
    }
  };

  function trackPosLayers(pos: number): boolean {
    // Whenever we detect that layers of the current position are not the same as the ones for
    // the previous position, we change this to true, and use it to start a new leaf later.
    let layersChanged = false;

    // When position matches — we enable the layer for the current leaf.
    // When it doesn't match — we disable the layer for the current leaf.
    blk.layers.forEach((l) => {

      let spanIdx = layerContains(l, pos)
      if (spanIdx === -1) {
        // If the layer was in the set, we remove it and mark set as "dirty".
        if (leafLayers.delete(l)) {
          layersChanged = true;
        }
        return;
      }

      // If the layer was already enabled we continue.
      if (leafLayers.has(l)) {
        return;
      }

      // Whenever we found a new layer that current position matches,
      // we add it to the set and mark te set as "dirty".
      leafLayers.add(l);
      layersChanged = true;
    });

    return layersChanged;
  };

  function hasLinkOrEmbed(layers: Set<Layer>): any | null {
    let link: any = null

    layers.forEach(l => {
      if (['link', 'embed'].includes(l.type)) {
        link = l
      }
    })

    return link ? {
      type: link.type,
      ...link.attributes,
      children: []
    } : null
  }
}

// Checks if a UTF-16 code unit i in string s is start of a surrogate pair.
function isSurrogate(s: string, i: number): boolean {
  const code = s.charCodeAt(i);
  return 0xd800 <= code && code <= 0xdbff;
}
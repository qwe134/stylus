'use strict';

(() => {
  if (!Object.entries) {
    Object.entries = obj => Object.keys(obj).map(k => [k, obj[k]]);
  }
  if (!Object.values) {
    Object.values = obj => Object.keys(obj).map(k => obj[k]);
  }
  if (typeof document === 'object') {
    const ELEMENT_METH = {
      append: {
        base: [Element, Document, DocumentFragment],
        fn: (node, frag) => {
          node.appendChild(frag);
        }
      },
      prepend: {
        base: [Element, Document, DocumentFragment],
        fn: (node, frag) => {
          node.insertBefore(frag, node.firstChild);
        }
      },
      before: {
        base: [Element, CharacterData, DocumentType],
        fn: (node, frag) => {
          node.parentNode.insertBefore(frag, node);
        }
      },
      after: {
        base: [Element, CharacterData, DocumentType],
        fn: (node, frag) => {
          node.parentNode.insertBefore(frag, node.nextSibling);
        }
      }
    };

    for (const [key, {base, fn}] of Object.entries(ELEMENT_METH)) {
      for (const cls of base) {
        if (cls.prototype[key]) {
          continue;
        }
        cls.prototype[key] = function (...nodes) {
          const frag = document.createDocumentFragment();
          for (const node of nodes) {
            frag.appendChild(typeof node === 'string' ? document.createTextNode(node) : node);
          }
          fn(this, frag);
        };
      }
    }
  }
})();

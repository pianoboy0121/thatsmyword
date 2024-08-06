["^ ","~:resource-id",["~:shadow.build.classpath/resource","goog/structs/heap.js"],"~:js","goog.loadModule(function(exports) {\n  \"use strict\";\n  goog.module(\"goog.structs.Heap\");\n  goog.module.declareLegacyNamespace();\n  const Node = goog.require(\"goog.structs.Node\");\n  const object = goog.require(\"goog.object\");\n  class Heap {\n    constructor(opt_heap) {\n      this.nodes_ = [];\n      if (opt_heap) {\n        this.insertAll(opt_heap);\n      }\n    }\n    insert(key, value) {\n      const node = new Node(key, value);\n      const nodes = this.nodes_;\n      nodes.push(node);\n      this.moveUp_(nodes.length - 1);\n    }\n    insertAll(heap) {\n      let keys;\n      let values;\n      if (heap instanceof Heap) {\n        keys = heap.getKeys();\n        values = heap.getValues();\n        if (this.getCount() <= 0) {\n          const nodes = this.nodes_;\n          for (let i = 0; i < keys.length; i++) {\n            nodes.push(new Node(keys[i], values[i]));\n          }\n          return;\n        }\n      } else {\n        keys = object.getKeys(heap);\n        values = object.getValues(heap);\n      }\n      for (let i = 0; i < keys.length; i++) {\n        this.insert(keys[i], values[i]);\n      }\n    }\n    remove() {\n      const nodes = this.nodes_;\n      const count = nodes.length;\n      const rootNode = nodes[0];\n      if (count <= 0) {\n        return undefined;\n      } else if (count == 1) {\n        nodes.length = 0;\n      } else {\n        nodes[0] = nodes.pop();\n        this.moveDown_(0);\n      }\n      return rootNode.getValue();\n    }\n    peek() {\n      const nodes = this.nodes_;\n      if (nodes.length == 0) {\n        return undefined;\n      }\n      return nodes[0].getValue();\n    }\n    peekKey() {\n      return this.nodes_[0] && this.nodes_[0].getKey();\n    }\n    moveDown_(index) {\n      const nodes = this.nodes_;\n      const count = nodes.length;\n      const node = nodes[index];\n      for (; index < count >> 1;) {\n        const leftChildIndex = this.getLeftChildIndex_(index);\n        const rightChildIndex = this.getRightChildIndex_(index);\n        const smallerChildIndex = rightChildIndex < count && nodes[rightChildIndex].getKey() < nodes[leftChildIndex].getKey() ? rightChildIndex : leftChildIndex;\n        if (nodes[smallerChildIndex].getKey() > node.getKey()) {\n          break;\n        }\n        nodes[index] = nodes[smallerChildIndex];\n        index = smallerChildIndex;\n      }\n      nodes[index] = node;\n    }\n    moveUp_(index) {\n      const nodes = this.nodes_;\n      const node = nodes[index];\n      for (; index > 0;) {\n        const parentIndex = this.getParentIndex_(index);\n        if (nodes[parentIndex].getKey() > node.getKey()) {\n          nodes[index] = nodes[parentIndex];\n          index = parentIndex;\n        } else {\n          break;\n        }\n      }\n      nodes[index] = node;\n    }\n    getLeftChildIndex_(index) {\n      return index * 2 + 1;\n    }\n    getRightChildIndex_(index) {\n      return index * 2 + 2;\n    }\n    getParentIndex_(index) {\n      return index - 1 >> 1;\n    }\n    getValues() {\n      const nodes = this.nodes_;\n      const rv = [];\n      const l = nodes.length;\n      for (let i = 0; i < l; i++) {\n        rv.push(nodes[i].getValue());\n      }\n      return rv;\n    }\n    getKeys() {\n      const nodes = this.nodes_;\n      const rv = [];\n      const l = nodes.length;\n      for (let i = 0; i < l; i++) {\n        rv.push(nodes[i].getKey());\n      }\n      return rv;\n    }\n    containsValue(val) {\n      return this.nodes_.some(node => {\n        return node.getValue() == val;\n      });\n    }\n    containsKey(key) {\n      return this.nodes_.some(node => {\n        return node.getKey() == key;\n      });\n    }\n    clone() {\n      return new Heap(this);\n    }\n    getCount() {\n      return this.nodes_.length;\n    }\n    isEmpty() {\n      return this.nodes_.length === 0;\n    }\n    clear() {\n      this.nodes_.length = 0;\n    }\n  }\n  exports = Heap;\n  return exports;\n});\n","~:source","/**\n * @license\n * Copyright The Closure Library Authors.\n * SPDX-License-Identifier: Apache-2.0\n */\n\n/**\n * @fileoverview Datastructure: Heap.\n *\n *\n * This file provides the implementation of a Heap datastructure. Smaller keys\n * rise to the top.\n *\n * The big-O notation for all operations are below:\n * <pre>\n *  Method          big-O\n * ----------------------------------------------------------------------------\n * - insert         O(logn)\n * - remove         O(logn)\n * - peek           O(1)\n * - contains       O(n)\n * </pre>\n */\n// TODO(user): Should this rely on natural ordering via some Comparable\n//     interface?\n\n\ngoog.module('goog.structs.Heap');\ngoog.module.declareLegacyNamespace();\n\nconst Node = goog.require('goog.structs.Node');\nconst object = goog.require('goog.object');\n\n\n/**\n * Class for a Heap datastructure.\n *\n * @template K, V\n */\nclass Heap {\n  /**\n   * @param {?Heap|?Object=} opt_heap Optional Heap or\n   *     Object to initialize heap with.\n   */\n  constructor(opt_heap) {\n    /**\n     * The nodes of the heap.\n     *\n     * This is a densely packed array containing all nodes of the heap, using\n     * the standard flat representation of a tree as an array (i.e. element [0]\n     * at the top, with [1] and [2] as the second row, [3] through [6] as the\n     * third, etc). Thus, the children of element `i` are `2i+1` and `2i+2`, and\n     * the parent of element `i` is `⌊(i-1)/2⌋`.\n     *\n     * The only invariant is that children's keys must be greater than parents'.\n     *\n     * @private @const {!Array<!Node>}\n     */\n    this.nodes_ = [];\n\n    if (opt_heap) {\n      this.insertAll(opt_heap);\n    }\n  }\n\n  /**\n   * Insert the given value into the heap with the given key.\n   * @param {K} key The key.\n   * @param {V} value The value.\n   */\n  insert(key, value) {\n    const node = new Node(key, value);\n    const nodes = this.nodes_;\n    nodes.push(node);\n    this.moveUp_(nodes.length - 1);\n  }\n\n  /**\n   * Adds multiple key-value pairs from another Heap or Object\n   * @param {?Heap|?Object} heap Object containing the data to add.\n   */\n  insertAll(heap) {\n    let keys, values;\n    if (heap instanceof Heap) {\n      keys = heap.getKeys();\n      values = heap.getValues();\n\n      // If it is a heap and the current heap is empty, I can rely on the fact\n      // that the keys/values are in the correct order to put in the underlying\n      // structure.\n      if (this.getCount() <= 0) {\n        const nodes = this.nodes_;\n        for (let i = 0; i < keys.length; i++) {\n          nodes.push(new Node(keys[i], values[i]));\n        }\n        return;\n      }\n    } else {\n      keys = object.getKeys(heap);\n      values = object.getValues(heap);\n    }\n\n    for (let i = 0; i < keys.length; i++) {\n      this.insert(keys[i], values[i]);\n    }\n  }\n\n  /**\n   * Retrieves and removes the root value of this heap.\n   * @return {V} The value removed from the root of the heap.  Returns\n   *     undefined if the heap is empty.\n   */\n  remove() {\n    const nodes = this.nodes_;\n    const count = nodes.length;\n    const rootNode = nodes[0];\n    if (count <= 0) {\n      return undefined;\n    } else if (count == 1) {\n      nodes.length = 0;\n    } else {\n      nodes[0] = nodes.pop();\n      this.moveDown_(0);\n    }\n    return rootNode.getValue();\n  }\n\n  /**\n   * Retrieves but does not remove the root value of this heap.\n   * @return {V} The value at the root of the heap. Returns\n   *     undefined if the heap is empty.\n   */\n  peek() {\n    const nodes = this.nodes_;\n    if (nodes.length == 0) {\n      return undefined;\n    }\n    return nodes[0].getValue();\n  }\n\n  /**\n   * Retrieves but does not remove the key of the root node of this heap.\n   * @return {K} The key at the root of the heap. Returns undefined if the\n   *     heap is empty.\n   */\n  peekKey() {\n    return this.nodes_[0] && this.nodes_[0].getKey();\n  }\n\n  /**\n   * Moves the node at the given index down to its proper place in the heap.\n   * @param {number} index The index of the node to move down.\n   * @private\n   */\n  moveDown_(index) {\n    const nodes = this.nodes_;\n    const count = nodes.length;\n\n    // Save the node being moved down.\n    const node = nodes[index];\n    // While the current node has a child.\n    while (index < (count >> 1)) {\n      const leftChildIndex = this.getLeftChildIndex_(index);\n      const rightChildIndex = this.getRightChildIndex_(index);\n\n      // Determine the index of the smaller child.\n      const smallerChildIndex = rightChildIndex < count &&\n              nodes[rightChildIndex].getKey() < nodes[leftChildIndex].getKey() ?\n          rightChildIndex :\n          leftChildIndex;\n\n      // If the node being moved down is smaller than its children, the node\n      // has found the correct index it should be at.\n      if (nodes[smallerChildIndex].getKey() > node.getKey()) {\n        break;\n      }\n\n      // If not, then take the smaller child as the current node.\n      nodes[index] = nodes[smallerChildIndex];\n      index = smallerChildIndex;\n    }\n    nodes[index] = node;\n  }\n\n  /**\n   * Moves the node at the given index up to its proper place in the heap.\n   * @param {number} index The index of the node to move up.\n   * @private\n   */\n  moveUp_(index) {\n    const nodes = this.nodes_;\n    const node = nodes[index];\n\n    // While the node being moved up is not at the root.\n    while (index > 0) {\n      // If the parent is greater than the node being moved up, move the parent\n      // down.\n      const parentIndex = this.getParentIndex_(index);\n      if (nodes[parentIndex].getKey() > node.getKey()) {\n        nodes[index] = nodes[parentIndex];\n        index = parentIndex;\n      } else {\n        break;\n      }\n    }\n    nodes[index] = node;\n  }\n\n  /**\n   * Gets the index of the left child of the node at the given index.\n   * @param {number} index The index of the node to get the left child for.\n   * @return {number} The index of the left child.\n   * @private\n   */\n  getLeftChildIndex_(index) {\n    return index * 2 + 1;\n  }\n\n  /**\n   * Gets the index of the right child of the node at the given index.\n   * @param {number} index The index of the node to get the right child for.\n   * @return {number} The index of the right child.\n   * @private\n   */\n  getRightChildIndex_(index) {\n    return index * 2 + 2;\n  }\n\n  /**\n   * Gets the index of the parent of the node at the given index.\n   * @param {number} index The index of the node to get the parent for.\n   * @return {number} The index of the parent.\n   * @private\n   */\n  getParentIndex_(index) {\n    return (index - 1) >> 1;\n  }\n\n  /**\n   * Gets the values of the heap.\n   * @return {!Array<V>} The values in the heap.\n   */\n  getValues() {\n    const nodes = this.nodes_;\n    const rv = [];\n    const l = nodes.length;\n    for (let i = 0; i < l; i++) {\n      rv.push(nodes[i].getValue());\n    }\n    return rv;\n  }\n\n  /**\n   * Gets the keys of the heap.\n   * @return {!Array<K>} The keys in the heap.\n   */\n  getKeys() {\n    const nodes = this.nodes_;\n    const rv = [];\n    const l = nodes.length;\n    for (let i = 0; i < l; i++) {\n      rv.push(nodes[i].getKey());\n    }\n    return rv;\n  }\n\n  /**\n   * Whether the heap contains the given value.\n   * @param {V} val The value to check for.\n   * @return {boolean} Whether the heap contains the value.\n   */\n  containsValue(val) {\n    return this.nodes_.some((node) => node.getValue() == val);\n  }\n\n  /**\n   * Whether the heap contains the given key.\n   * @param {K} key The key to check for.\n   * @return {boolean} Whether the heap contains the key.\n   */\n  containsKey(key) {\n    return this.nodes_.some((node) => node.getKey() == key);\n  }\n\n  /**\n   * Clones a heap and returns a new heap\n   * @return {!Heap} A new Heap with the same key-value pairs.\n   */\n  clone() {\n    return new Heap(this);\n  }\n\n  /**\n   * The number of key-value pairs in the map\n   * @return {number} The number of pairs.\n   */\n  getCount() {\n    return this.nodes_.length;\n  }\n\n  /**\n   * Returns true if this heap contains no elements.\n   * @return {boolean} Whether this heap contains no elements.\n   */\n  isEmpty() {\n    return this.nodes_.length === 0;\n  }\n\n  /**\n   * Removes all elements from the heap.\n   */\n  clear() {\n    this.nodes_.length = 0;\n  }\n}\nexports = Heap;\n","~:compiled-at",1722915042665,"~:source-map-json","{\n\"version\":3,\n\"file\":\"goog.structs.heap.js\",\n\"lineCount\":148,\n\"mappings\":\"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\",\n\"sources\":[\"goog/structs/heap.js\"],\n\"sourcesContent\":[\"/**\\n * @license\\n * Copyright The Closure Library Authors.\\n * SPDX-License-Identifier: Apache-2.0\\n */\\n\\n/**\\n * @fileoverview Datastructure: Heap.\\n *\\n *\\n * This file provides the implementation of a Heap datastructure. Smaller keys\\n * rise to the top.\\n *\\n * The big-O notation for all operations are below:\\n * <pre>\\n *  Method          big-O\\n * ----------------------------------------------------------------------------\\n * - insert         O(logn)\\n * - remove         O(logn)\\n * - peek           O(1)\\n * - contains       O(n)\\n * </pre>\\n */\\n// TODO(user): Should this rely on natural ordering via some Comparable\\n//     interface?\\n\\n\\ngoog.module('goog.structs.Heap');\\ngoog.module.declareLegacyNamespace();\\n\\nconst Node = goog.require('goog.structs.Node');\\nconst object = goog.require('goog.object');\\n\\n\\n/**\\n * Class for a Heap datastructure.\\n *\\n * @template K, V\\n */\\nclass Heap {\\n  /**\\n   * @param {?Heap|?Object=} opt_heap Optional Heap or\\n   *     Object to initialize heap with.\\n   */\\n  constructor(opt_heap) {\\n    /**\\n     * The nodes of the heap.\\n     *\\n     * This is a densely packed array containing all nodes of the heap, using\\n     * the standard flat representation of a tree as an array (i.e. element [0]\\n     * at the top, with [1] and [2] as the second row, [3] through [6] as the\\n     * third, etc). Thus, the children of element `i` are `2i+1` and `2i+2`, and\\n     * the parent of element `i` is `\\u230a(i-1)/2\\u230b`.\\n     *\\n     * The only invariant is that children's keys must be greater than parents'.\\n     *\\n     * @private @const {!Array<!Node>}\\n     */\\n    this.nodes_ = [];\\n\\n    if (opt_heap) {\\n      this.insertAll(opt_heap);\\n    }\\n  }\\n\\n  /**\\n   * Insert the given value into the heap with the given key.\\n   * @param {K} key The key.\\n   * @param {V} value The value.\\n   */\\n  insert(key, value) {\\n    const node = new Node(key, value);\\n    const nodes = this.nodes_;\\n    nodes.push(node);\\n    this.moveUp_(nodes.length - 1);\\n  }\\n\\n  /**\\n   * Adds multiple key-value pairs from another Heap or Object\\n   * @param {?Heap|?Object} heap Object containing the data to add.\\n   */\\n  insertAll(heap) {\\n    let keys, values;\\n    if (heap instanceof Heap) {\\n      keys = heap.getKeys();\\n      values = heap.getValues();\\n\\n      // If it is a heap and the current heap is empty, I can rely on the fact\\n      // that the keys/values are in the correct order to put in the underlying\\n      // structure.\\n      if (this.getCount() <= 0) {\\n        const nodes = this.nodes_;\\n        for (let i = 0; i < keys.length; i++) {\\n          nodes.push(new Node(keys[i], values[i]));\\n        }\\n        return;\\n      }\\n    } else {\\n      keys = object.getKeys(heap);\\n      values = object.getValues(heap);\\n    }\\n\\n    for (let i = 0; i < keys.length; i++) {\\n      this.insert(keys[i], values[i]);\\n    }\\n  }\\n\\n  /**\\n   * Retrieves and removes the root value of this heap.\\n   * @return {V} The value removed from the root of the heap.  Returns\\n   *     undefined if the heap is empty.\\n   */\\n  remove() {\\n    const nodes = this.nodes_;\\n    const count = nodes.length;\\n    const rootNode = nodes[0];\\n    if (count <= 0) {\\n      return undefined;\\n    } else if (count == 1) {\\n      nodes.length = 0;\\n    } else {\\n      nodes[0] = nodes.pop();\\n      this.moveDown_(0);\\n    }\\n    return rootNode.getValue();\\n  }\\n\\n  /**\\n   * Retrieves but does not remove the root value of this heap.\\n   * @return {V} The value at the root of the heap. Returns\\n   *     undefined if the heap is empty.\\n   */\\n  peek() {\\n    const nodes = this.nodes_;\\n    if (nodes.length == 0) {\\n      return undefined;\\n    }\\n    return nodes[0].getValue();\\n  }\\n\\n  /**\\n   * Retrieves but does not remove the key of the root node of this heap.\\n   * @return {K} The key at the root of the heap. Returns undefined if the\\n   *     heap is empty.\\n   */\\n  peekKey() {\\n    return this.nodes_[0] && this.nodes_[0].getKey();\\n  }\\n\\n  /**\\n   * Moves the node at the given index down to its proper place in the heap.\\n   * @param {number} index The index of the node to move down.\\n   * @private\\n   */\\n  moveDown_(index) {\\n    const nodes = this.nodes_;\\n    const count = nodes.length;\\n\\n    // Save the node being moved down.\\n    const node = nodes[index];\\n    // While the current node has a child.\\n    while (index < (count >> 1)) {\\n      const leftChildIndex = this.getLeftChildIndex_(index);\\n      const rightChildIndex = this.getRightChildIndex_(index);\\n\\n      // Determine the index of the smaller child.\\n      const smallerChildIndex = rightChildIndex < count &&\\n              nodes[rightChildIndex].getKey() < nodes[leftChildIndex].getKey() ?\\n          rightChildIndex :\\n          leftChildIndex;\\n\\n      // If the node being moved down is smaller than its children, the node\\n      // has found the correct index it should be at.\\n      if (nodes[smallerChildIndex].getKey() > node.getKey()) {\\n        break;\\n      }\\n\\n      // If not, then take the smaller child as the current node.\\n      nodes[index] = nodes[smallerChildIndex];\\n      index = smallerChildIndex;\\n    }\\n    nodes[index] = node;\\n  }\\n\\n  /**\\n   * Moves the node at the given index up to its proper place in the heap.\\n   * @param {number} index The index of the node to move up.\\n   * @private\\n   */\\n  moveUp_(index) {\\n    const nodes = this.nodes_;\\n    const node = nodes[index];\\n\\n    // While the node being moved up is not at the root.\\n    while (index > 0) {\\n      // If the parent is greater than the node being moved up, move the parent\\n      // down.\\n      const parentIndex = this.getParentIndex_(index);\\n      if (nodes[parentIndex].getKey() > node.getKey()) {\\n        nodes[index] = nodes[parentIndex];\\n        index = parentIndex;\\n      } else {\\n        break;\\n      }\\n    }\\n    nodes[index] = node;\\n  }\\n\\n  /**\\n   * Gets the index of the left child of the node at the given index.\\n   * @param {number} index The index of the node to get the left child for.\\n   * @return {number} The index of the left child.\\n   * @private\\n   */\\n  getLeftChildIndex_(index) {\\n    return index * 2 + 1;\\n  }\\n\\n  /**\\n   * Gets the index of the right child of the node at the given index.\\n   * @param {number} index The index of the node to get the right child for.\\n   * @return {number} The index of the right child.\\n   * @private\\n   */\\n  getRightChildIndex_(index) {\\n    return index * 2 + 2;\\n  }\\n\\n  /**\\n   * Gets the index of the parent of the node at the given index.\\n   * @param {number} index The index of the node to get the parent for.\\n   * @return {number} The index of the parent.\\n   * @private\\n   */\\n  getParentIndex_(index) {\\n    return (index - 1) >> 1;\\n  }\\n\\n  /**\\n   * Gets the values of the heap.\\n   * @return {!Array<V>} The values in the heap.\\n   */\\n  getValues() {\\n    const nodes = this.nodes_;\\n    const rv = [];\\n    const l = nodes.length;\\n    for (let i = 0; i < l; i++) {\\n      rv.push(nodes[i].getValue());\\n    }\\n    return rv;\\n  }\\n\\n  /**\\n   * Gets the keys of the heap.\\n   * @return {!Array<K>} The keys in the heap.\\n   */\\n  getKeys() {\\n    const nodes = this.nodes_;\\n    const rv = [];\\n    const l = nodes.length;\\n    for (let i = 0; i < l; i++) {\\n      rv.push(nodes[i].getKey());\\n    }\\n    return rv;\\n  }\\n\\n  /**\\n   * Whether the heap contains the given value.\\n   * @param {V} val The value to check for.\\n   * @return {boolean} Whether the heap contains the value.\\n   */\\n  containsValue(val) {\\n    return this.nodes_.some((node) => node.getValue() == val);\\n  }\\n\\n  /**\\n   * Whether the heap contains the given key.\\n   * @param {K} key The key to check for.\\n   * @return {boolean} Whether the heap contains the key.\\n   */\\n  containsKey(key) {\\n    return this.nodes_.some((node) => node.getKey() == key);\\n  }\\n\\n  /**\\n   * Clones a heap and returns a new heap\\n   * @return {!Heap} A new Heap with the same key-value pairs.\\n   */\\n  clone() {\\n    return new Heap(this);\\n  }\\n\\n  /**\\n   * The number of key-value pairs in the map\\n   * @return {number} The number of pairs.\\n   */\\n  getCount() {\\n    return this.nodes_.length;\\n  }\\n\\n  /**\\n   * Returns true if this heap contains no elements.\\n   * @return {boolean} Whether this heap contains no elements.\\n   */\\n  isEmpty() {\\n    return this.nodes_.length === 0;\\n  }\\n\\n  /**\\n   * Removes all elements from the heap.\\n   */\\n  clear() {\\n    this.nodes_.length = 0;\\n  }\\n}\\nexports = Heap;\\n\"],\n\"names\":[\"goog\",\"module\",\"declareLegacyNamespace\",\"Node\",\"require\",\"object\",\"Heap\",\"constructor\",\"opt_heap\",\"nodes_\",\"insertAll\",\"insert\",\"key\",\"value\",\"node\",\"nodes\",\"push\",\"moveUp_\",\"length\",\"heap\",\"keys\",\"values\",\"getKeys\",\"getValues\",\"getCount\",\"i\",\"remove\",\"count\",\"rootNode\",\"undefined\",\"pop\",\"moveDown_\",\"getValue\",\"peek\",\"peekKey\",\"getKey\",\"index\",\"leftChildIndex\",\"getLeftChildIndex_\",\"rightChildIndex\",\"getRightChildIndex_\",\"smallerChildIndex\",\"parentIndex\",\"getParentIndex_\",\"rv\",\"l\",\"containsValue\",\"val\",\"some\",\"containsKey\",\"clone\",\"isEmpty\",\"clear\",\"exports\"]\n}\n"]
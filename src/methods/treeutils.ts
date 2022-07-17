/* Allow for accessing properties with a string */
export interface IIndexable<T = any> {
  [key: string]: T
}

/* Interfaces used by the arrayToTree method */
export interface ITreeItem {
  Id: number
  ParentId: number | null
  [key: string]: any
}

export interface ITreeItemKeyMappings {
  idProperty: string
  parentIdProperty: string
}

export interface ITreeNode {
  key: string | number
  data: ITreeItem | null
  children: ITreeNode[]
}

export default class treeUtils {
  /* Unflattens an array to a tree */
  static composeTreeFromArray(
    items: ITreeItem[],
    propertyNames: ITreeItemKeyMappings = {
      idProperty: 'Id',
      parentIdProperty: 'ParentId'
    }
  ): ITreeNode[] {
    // the resulting unflattened tree
    const rootItems: ITreeNode[] = []

    // stores all already processed items with ther ids as key so we can easily look them up
    const lookup: { [id: string]: ITreeNode } = {}

    // idea of this loop:
    // whenever an item has a parent, but the parent is not yet in the lookup object, we store a preliminary parent
    // in the lookup object and fill it with the data of the parent later
    // if an item has no parentId, add it as a root element to rootItems
    for (const item of items) {
      const itemId = item[propertyNames.idProperty]
      const parentId = item[propertyNames.parentIdProperty]

      // look whether item already exists in the lookup table
      if (!Object.prototype.hasOwnProperty.call(lookup, itemId)) {
        // item is not yet there, so add a preliminary item (its data will be added later)
        lookup[itemId] = { key: '', data: null, children: [] }
      }

      // add the current item's data to the item in the lookup table
      lookup[itemId].data = item

      const TreeItem = lookup[itemId]

      if (parentId === null) {
        // is a root item
        rootItems.push(TreeItem)
      } else {
        // has a parent
        // look whether the parent already exists in the lookup table
        if (!Object.prototype.hasOwnProperty.call(lookup, parentId)) {
          // parent is not yet there, so add a preliminary parent (its data will be added later)
          lookup[parentId] = { key: '', data: null, children: [] }
        }

        // add the current item to the parent
        lookup[parentId].children.push(TreeItem)
      }
    }

    return rootItems
  }

  /**
   * Return a flat array from a hierachical array
   */
  static composeArrayFromTree(
    rootNode: ITreeNode,
    config: ITreeItemKeyMappings = {
      idProperty: 'Id',
      parentIdProperty: 'ParentId'
    }
  ): ITreeItem[] {
    const treeItems: ITreeItem[] = []

    const iterateChildren = (id: string | number) => {
      for (const node of rootNode.children) {
        treeItems.push({
          Id: typeof node.key == 'string' ? parseInt(node.key) : node.key,
          ParentId: typeof id == 'string' ? parseInt(id) : id
        })
        iterateChildren(node.key)
      }
    }

    return treeItems
  }

  static findNodeByKey(node: ITreeNode, key: string): ITreeNode | null {
    if (node.key === key) return node

    if (node.children && node.children.length)
      for (const child of node.children) return this.findNodeByKey(child, key)

    return null
  }

  static traverseTree(tree: ITreeNode, task: () => boolean) {
    for (const child of tree.children)
      if (task.call(child) != false) this.traverseTree(child, task)
  }

  static traverseObject(obj: IIndexable<Object | any>, task: () => boolean) {
    for (const child in obj) {
      if (obj[child] !== null) {
        if (typeof obj[child] === 'object')
          this.traverseObject(obj[child], task)
        else if (task.call(child) != false) break
      }
    }
  }

  static getCyclicJSON(obj: object, tabChar: string = '\t'): string {
    // if (Array.isArray(obj)) // || !_.isObject(obj)) {
    //  return obj.toString();

    const seen: any[] = []
    const value = JSON.stringify(
      obj,
      function (key, val) {
        if (val != null && typeof val === 'object') {
          if (seen.indexOf(val) >= 0) return
          seen.push(val)
        }
        return val
      },
      tabChar
    )
    return value
  }
}

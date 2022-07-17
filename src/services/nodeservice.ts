export default class NodeService {
  getTreeTableNodes() {
    return fetch('src/stores/treetablenodes.json')
      .then((res) => {
        return res.json()
      })
      .then((d) => d.root)
  }

  getTreeNodes() {
    return fetch('src/stores/tabledata.json')
      .then((res) => res.json())
      .then((d) => d.root)
  }
}



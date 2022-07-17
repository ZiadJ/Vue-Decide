export class mathUtils {
  static getRandomValues(arrayLength: number, maxValue: number): Array<number> {
    return new Array(arrayLength)
      .fill(0)
      .map(() => Math.round(Math.random() * maxValue))
  }

  static getAverage(numArray: number[]) {
    const sum = numArray.reduce((prev, curr) => {
      return prev + +curr // the newly pushed numbers are handled like strings, need to cast curr
    }, 0)

    return Math.round((sum / numArray.length) * 100) / 100
  }
}

export class uiElementUtils {
  static getPosition(el: Element) {
    const rect = el.getBoundingClientRect()
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY
    }
  }

  static row: Element
  static rowDragStart(e: UIEvent) {
    if (e.target) this.row = e.target as Element
  }
  static rowDragOver(e: UIEvent) {
    e.preventDefault()

    const target = e.target as Element
    const parentNode = target.parentNode as Element
    const topParentNode = parentNode.parentNode as Element
    if (topParentNode != null) {
      const children = Array.from(topParentNode.children)
      if (children.indexOf(parentNode) > children.indexOf(this.row))
        parentNode.after(this.row)
      else parentNode.before(this.row)
    }
  }
}

function getSelectedWord() {
  const sel = window.getSelection()
  const str = sel?.anchorNode?.nodeValue
  if (str) {
    const len = str.length
    let a = sel.anchorOffset
    let b = a

    if (a) {
      while (str[a] != ' ' && a--) {}

      if (str[a] == ' ') a++ // start of word

      while (str[b] != ' ' && b++ < len) {} // end of word+1
    }

    console.log(str.substring(a, b))
  }
}

// Callback function to execute when mutations are observed
function observeNode(
  mutationType: string = '',
  callback: (mt: MutationRecord, nd: Node) => boolean | undefined,
  config: MutationObserverInit
): MutationObserver {
  const observer = new MutationObserver((list) => {
    observer.observe(document.head, config)

    for (const mutation of list) {
      if (mutationType === '' || mutation.type === mutationType) {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          if (callback(mutation, mutation.addedNodes[i])) {
            break
          }
        }
      }
    }
  })
  return observer
}

export const vueConsole = (channelName = 'console-log') => {
  const bc = new BroadcastChannel(channelName)

  bc.addEventListener('message', (e) => eval(e.data))

  return {
    close: () => {
      bc.close()
    },
    post: (message: any) => {
      bc.postMessage(message)
    }
  }
}

export const _console = vueConsole()

export const json = (
  obj: object | string | number | any,
  tabChar: string | number = 2 // -1 to highlight syntax
) => {
  if (typeof obj == 'string') return obj

  try {
    const text = JSON.stringify(obj, null, 2)
    return tabChar == -1 ? jsonHighlight(text) : text
  } catch {
    // Filter out cyclical references if needed
    const seen: any[] = []
    const text = JSON.stringify(
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
    return tabChar == -1 ? jsonHighlight(text) : text
  }
}

export const log = (
  obj: object | any,
  title: string = '',
  tabChar: string | number = 2
): string => {
  const text = json(obj)

  console.log((!title.length ? '' : title + ': ') + text)

  _console.post((!title.length ? '' : title + ': ') + jsonHighlight(text))

  return text
}

export const js = json
//export const bc = console

export function jsonHighlight(json: string) {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      var cls = 'json-number'
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'json-key'
        } else {
          cls = 'json-string'
        }
      } else if (/true|false/.test(match)) {
        cls = 'json-boolean'
      } else if (/null/.test(match)) {
        cls = 'json-null'
      }
      return '<span class="' + cls + '">' + match + '</span>'
    }
  )
}

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

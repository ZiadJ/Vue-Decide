export const useVueConsole = (
  channelName = 'console-log',
  funcEvaluateCode: { (code: string): string }
) => {
  //   const mainBc = new BroadcastChannel('vueconsole-main')
  //   setTimeout(() => {
  //     mainBc.postMessage({
  //       action: 'add',
  //       channel: channelName
  //     })
  //   })

  const bc = new BroadcastChannel('vue-console')

  bc.addEventListener('message', (e: MessageEvent) => {
    if (e.data.action === 'eval' && e.data.channel === channelName) {
      const evaluatedResult = funcEvaluateCode(e.data)
      bc.postMessage({
        channel: channelName,
        title: '',
        data: evaluatedResult,
        evalCode: e.data,
        type: 'eval'
      })
    }
  })

  return {
    close: () => {
      //   mainBc.postMessage({
      //     action: 'remove',
      //     channel: channelName
      //   })
      //   mainBc.close()
      bc.close()
    },
    log: (data: any = '', title: string = '', type: string = ''): string => {
      const text = json(data)

      bc.postMessage({
        channel: channelName,
        title: title,
        data: text,
        type: type
      })

      return !title.length ? text : title + ': ' + text
    }
    //   ,
    // json: (
    //   obj: object | string | number | any,
    //   tabChar: string | number = 2 // -1 to highlight syntax
    // ) => {
    //   return json(obj, tabChar)
    // }
  }
}

export const json = (
  obj: object | string | number | any,
  tabChar: string | number = 2 // -1 to highlight syntax
) => {
  if (typeof obj == 'string') return obj

  try {
    const text = JSON.stringify(obj, null, tabChar)
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

  return text
}

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

export const str = json

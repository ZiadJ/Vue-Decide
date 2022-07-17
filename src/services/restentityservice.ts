interface HttpResponse<T> extends Response {
  result?: T
  errorMessage?: string
}

type failureCallback = (r: Response, e: string) => void

export class RestEntityService<T> {
  path = ''
  entityName = ''
  requestParams: RequestInit = {}
  debug = false
  onFailureCallback: failureCallback | undefined = undefined

  constructor(
    path: string,
    entityName: string,
    debug = false,
    requestParams: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }
  ) {
    this.path = path
    this.entityName = entityName
    this.debug = debug
    this.requestParams = requestParams
  }

  onFailure(onFailure: failureCallback): RestEntityService<T> {
    this.onFailureCallback = onFailure
    return this
  }

  static async fetch<T>(
    path: string,
    entityName: string,
    id: string | number = '',
    requestParams: RequestInit = {},
    queryParams: string = '',
    onFailure: failureCallback | undefined,
    debug: boolean = false
  ): Promise<Response> {
    let response: HttpResponse<T> | null = null

    try {
      const url =
        [path, entityName, id].join('/') +
        (queryParams.length ? '?' + queryParams : '')

      response = await fetch(url, requestParams)

      response.result = (await response.json()) as T
    } catch (error: any) {
      response!.errorMessage = error.message
      if (onFailure) {
        onFailure(response as Response, error.message)
      }

      if (debug) {
        debugger
      }
    }

    if (!response?.ok) {
      if (onFailure) onFailure(response as Response, '')
    }

    return response!
  }

  makeRequest(
    method: string,
    body: object | string | number | null,
    requestParams: RequestInit = {}
  ): RequestInit {
    const params = { ...this.requestParams, ...requestParams }

    params.method = method

    if (body !== null && body !== '') {
      params.body = JSON.stringify(body)
    }

    return params
  }

  async getAll(requestParams: RequestInit = {}): Promise<HttpResponse<[T[]]>> {
    const request = this.makeRequest('get', null, requestParams)
    return await RestEntityService.fetch<[T[]]>(
      this.path,
      this.entityName,
      '',
      request,
      '',
      this.onFailureCallback,
      this.debug
    )
  }

  async get(
    id: number | string,
    requestParams: RequestInit = {}
  ): Promise<HttpResponse<T>> {
    const request = this.makeRequest('get', null, requestParams)
    return await RestEntityService.fetch<T>(
      this.path,
      this.entityName,
      id,
      request,
      '',
      this.onFailureCallback,
      this.debug
    )
  }

  async create(
    body: object | string | number,
    requestParams: RequestInit = {}
  ): Promise<HttpResponse<T>> {
    const request = this.makeRequest('post', body, requestParams)
    return await RestEntityService.fetch<T>(
      this.path,
      this.entityName,
      '',
      request,
      '',
      this.onFailureCallback,
      this.debug
    )
  }

  async update(
    id: number | string,
    body: object | string | number,
    requestParams: RequestInit = {}
  ): Promise<HttpResponse<T>> {
    const request = this.makeRequest('put', body, requestParams) // alternatively 'patch'
    return await RestEntityService.fetch<T>(
      this.path,
      this.entityName,
      id,
      request,
      '',
      this.onFailureCallback,
      this.debug
    )
  }

  async delete(
    id: number | string,
    requestParams: RequestInit = {}
  ): Promise<HttpResponse<T>> {
    const request = this.makeRequest('delete', null, requestParams)
    return await RestEntityService.fetch<T>(
      this.path,
      this.entityName,
      id,
      request,
      '',
      this.onFailureCallback,
      this.debug
    )
  }

  async query(params: Record<string, any>, requestParams: RequestInit = {}) {
    const request = this.makeRequest('post', null, requestParams)
    const query = new URLSearchParams(params).toString()
    return await RestEntityService.fetch(
      this.path,
      this.entityName,
      '',
      request,
      query,
      this.onFailureCallback,
      this.debug
    )
  }
}

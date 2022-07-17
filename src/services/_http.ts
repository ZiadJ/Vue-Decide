export interface HttpResponse<T> extends Response {
  parsedBody?: T
}

export default class Http {
  static async http<T>(
    path: RequestInfo | string,
    requestParams: RequestInit = {}
  ): Promise<Response> {
    let response: HttpResponse<T> | null = null
    try {
      response = await fetch(path, requestParams)
      // may error if there is no body
      response.parsedBody = await response.json()
    } catch (error: any) {
      console.log(error)
      debugger
      throw new Error(error.message)
    }

    if (!response?.ok) {
      console.log(response?.statusText)
      debugger
      throw new Error(response?.statusText)
    }
    return response
  }

  static makeRequest(
    method: string,
    body: object | string | number | null,
    requestParams: RequestInit = {}
  ): RequestInit {
    const params = { ...requestParams } // clone to avoid modifying caller properties by reference

    params.method = method

    if (body !== null && body !== '') {
      params.body = JSON.stringify(body)
    }

    return params
  }

  static async get<T>(
    path: string,
    id: number | string,
    requestParams: RequestInit
  ): Promise<HttpResponse<T>> {
    const requestInit = this.makeRequest('get', null, requestParams)
    return await this.http<T>(path + '/' + id, requestInit)
  }

  static async post<T>(
    path: string,
    body: object | string | number,
    requestParams: RequestInit
  ): Promise<HttpResponse<T>> {
    const requestInit = this.makeRequest('post', body, requestParams)
    return await this.http<T>(path, requestInit)
  }

  static async patch<T>(
    path: string,
    id: number | string,
    body: object | string | number,
    requestParams: RequestInit
  ): Promise<HttpResponse<T>> {
    const requestInit = this.makeRequest('patch', body, requestParams)
    return await this.http<T>(path + '/' + id, requestInit)
  }

  /*  static async put<T>(
    path: string,
    body: object | string | number
  ): Promise<HttpResponse<T>> {
    const requestInit = this.makeRequest('put', body, requestParams)
    return await this.http<T>(path, requestInit)  
  } */

  static async delete<T>(
    path: string,
    id: number | string,
    requestParams: RequestInit
  ): Promise<HttpResponse<T>> {
    const requestInit = this.makeRequest('delete', null, requestParams)
    return await this.http<T>(path + '/' + id, requestInit)
  }
}

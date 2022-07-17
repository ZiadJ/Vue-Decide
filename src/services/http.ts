export interface HttpResponse<T> extends Response {
  parsedBody?: T
}

class Http {
  async http<T>(request: RequestInfo): Promise<Response> {
    // fetch
    const response: HttpResponse<T> = await fetch(request)

    try {
      // may error if there is no body
      response.parsedBody = await response.json()
    } catch {}

    if (!response.ok) {
      throw new Error(response.statusText)
    }
    return response
  }

  async get<T>(
    path: string,
    args: RequestInit = { method: 'get' }
  ): Promise<HttpResponse<T>> {
    return await this.http<T>(new Request(path, args))
  }

  async post<T>(
    path: string,
    body: object | string | number,
    args: RequestInit = { method: 'post', body: JSON.stringify(body) }
  ): Promise<HttpResponse<T>> {
    return await this.http<T>(new Request(path, args))
  }

  async put<T>(
    path: string,
    body: object | string | number,
    args: RequestInit = { method: 'put', body: JSON.stringify(body) }
  ): Promise<HttpResponse<T>> {
    return await this.http<T>(new Request(path, args))
  }

  async patch<T>(
    path: string,
    body: object | string | number,
    args: RequestInit = { method: 'patch', body: JSON.stringify(body) }
  ): Promise<HttpResponse<T>> {
    return await this.http<T>(new Request(path, args))
  }

  async delete<T>(
    path: string,
    args: RequestInit = { method: 'delete' }
  ): Promise<HttpResponse<T>> {
    return await this.http<T>(new Request(path, args))
  }
}
export default new Http()

import http from "./http";

export class CrudService<T> {
  url = '';

  constructor(url: string) {
    this.url = url;
  }

  getAll<T>() { 
    return http.get<T>(this.url); 
  }
  get<T>(id: number) {
    return http.get<T>(`${this.url}/${id}`);
  }
  create<T>(data: any) {
    return http.post<T>(this.url, data);
  }
  update<T>(id: number, data: any) {
    return http.patch<T>(`${this.url}/${id}`, data);
  }
  delete<T>(id: number) {
    return http.delete<T>(`${this.url}/${id}`);
  }
  deleteAll<T>() {
    return http.delete<T>(this.url);
  }
  find(searchText: string) {
    return http.get(`${this.url}?title=${searchText}`);
  }
}

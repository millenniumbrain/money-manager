export class HTTP {
  static get(url: string, data: any = null, headers = null) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      if (headers) {
        Object.keys(headers).forEach(key => {
          xhr.setRequestHeader(key, headers[key]);
        })
      }
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(xhr.statusText);
        }
      }
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send(data);
    });
  }

  static post(url, data, headers = null) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url);
      if (headers) {
        Object.keys(headers).forEach(key => {
          xhr.setRequestHeader(key, headers[key]);
        })
      }
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(xhr.statusText);
        }
      }
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send(data);
    });
  }

  static put(url: string, data, headers = null) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      if (headers) {
        Object.keys(headers).forEach(key => {
          xhr.setRequestHeader(key, headers[key]);
        })
      }
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(xhr.statusText);
        }
      }
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send(data);
    });
  }

  static delete(url: string, data, headers = null) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      if (headers) {
        Object.keys(headers).forEach(key => {
          xhr.setRequestHeader(key, headers[key]);
        })
      }
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(xhr.statusText);
        }
      }
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send(data);
    });
  }
}
class Storage {
  load(key) {
    return JSON.parse(localStorage.getItem(key));
  }
  save(key, value) {
    return new Promise((resolve, reject) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        resolve(this.load(key));
      } catch {
        reject();
      }
    });
  }
}

const storage = new Storage();
export default storage;

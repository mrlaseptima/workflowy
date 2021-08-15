class Collection {
  clone(data) {
    return JSON.parse(JSON.stringify(data));
  }

  update(array, object, indicator = "id") {
    const condition = (item) => item[indicator] === object[indicator];
    const isItemExist = array.some(condition);

    if (isItemExist) {
      let arrayClone = collection.clone(array);
      const foundedItem = arrayClone.find(condition);
      const foundedIdx = arrayClone.findIndex(condition);
      arrayClone[foundedIdx] = { ...foundedItem, ...object };

      return arrayClone;
    } else {
      console.log(
        `Failed to update a collection - cant find item with ${indicator}`
      );
      return array;
    }
  }

  remove(array, object, indicator = "id") {
    const isItemExist = array.some(
      (item) => item[indicator] === object[indicator]
    );

    if (isItemExist) {
      let arrayClone = collection.clone(array);
      return arrayClone.filter((item) => item[indicator] !== object[indicator]);
    } else {
      console.log(
        `Failed to remove a item in collection - cant find item with ${indicator}`
      );
      return array;
    }
  }

  insert(array, lastIndex, ...objectsToInsert) {
    let arrayClone = collection.clone(array);
    arrayClone.splice(lastIndex + 1, 0, ...objectsToInsert);
    return arrayClone;
  }

  getPrevItem(array, object, indicator = "id") {
    const condition = (item) => item[indicator] === object[indicator];
    const isItemExist = array.some(condition);

    if (isItemExist) {
      let arrayClone = collection.clone(array);
      const foundedIdx = arrayClone.findIndex(condition);

      if (foundedIdx !== 0) return arrayClone[foundedIdx - 1];
      else return undefined;
    } else return undefined;
  }

  getFullItem(array, object, indicator = "id") {
    const condition = (item) => item[indicator] === object[indicator];
    const isItemExist = array.some(condition);
    if (isItemExist) return array.find(condition);
    else {
      console.log(
        `Failed to find a item in collection - cant find item with ${indicator}`
      );
      return false;
    }
  }

  moveItem(array, object, newIdx, indicator = "id") {
    const condition = (item) => item[indicator] === object[indicator];
    let arrayClone = collection.clone(array);
    const itemExist = arrayClone.some(condition);
    if (itemExist) {
      let oldIdx = arrayClone.findIndex(condition);

      while (oldIdx < 0) {
        oldIdx += arrayClone.length;
      }
      while (newIdx < 0) {
        newIdx += arrayClone.length;
      }
      if (newIdx >= arrayClone.length) {
        var k = newIdx - arrayClone.length + 1;
        while (k--) {
          arrayClone.push(undefined);
        }
      }
      arrayClone.splice(newIdx, 0, arrayClone.splice(oldIdx, 1)[0]);
      return arrayClone; // for testing purposes
    } else return array;
  }
}

const collection = new Collection();
export default collection;

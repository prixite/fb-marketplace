let listingQueue = [];

const waitAndExecute = (condition, callback) => {
  let timer = setInterval(() => {
    if (condition()) {
      clearInterval(timer);
      callback();
    }
  }, 100);
}

const moveUp = (element, count) => {
  let result = element;
  for (let i=0; i<count; i++) {
    result = result.parentNode;
  }
  return result;
}

const moveDown = (element, count) => {
  let result = element;
  for (let i=0; i<count; i++) {
    result = result.firstChild;
  }
  return result;
}

const processItem = (element) => {
  element = moveDown(element, 5);
  element.dispatchEvent(new Event('click', { bubbles: true }));
  waitAndExecute(
    () => document.getElementsByClassName("__fb-light-mode").length === 6,
    () => {
      console.log("BOO");
    }
  );
}

const start = () => {
  let spans = document.getElementsByTagName("span");
  for (span of spans) {
    if (span.textContent === "Your Listings") {
      let node = moveUp(span, 6);
      let listParent = moveDown(node.nextSibling, 5); 
      for (child of listParent.childNodes) {
        listingQueue.push(child);
      }
    }
  }
  processItem(listingQueue[0]);
}

window.onload = function () {
  let spans = document.getElementsByTagName("span");

  waitAndExecute(
    () => {
      for (span of spans) {
        if (span.textContent === "Your Listings") {
          return true;
        }
      }
      return false;
    },
    start,
  );
};

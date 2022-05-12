let listingQueue = [];
let listingData = [];

const waitAndExecute = (condition, callback) => {
  let timer = setInterval(() => {
    if (condition()) {
      clearInterval(timer);
      callback();
    }
  }, 100);
}

setInterval(() => {
  if (document.getElementsByClassName("__fb-light-mode").length === 6) {
    let e = document.getElementsByClassName("__fb-light-mode")[4];
    waitAndExecute(
      () => moveDown(e, 2).childNodes[1].getAttribute("aria-busy") !== "true",
      () => {
        let popupDiv = moveDown(e, 2).childNodes[1];
        let parent = moveDown(popupDiv, 4).nextSibling;
        let infoDiv = moveDown(parent.nextSibling, 3);
        if (!infoDiv.querySelector('a.dropified')) {
          const anchor = document.createElement('a');
          anchor.href = 'https://app.dropified.com';
          anchor.appendChild(document.createTextNode("Open Product in Dropified"));
          anchor.classList.add('dropified');
          anchor.target = "_blank";
          infoDiv.appendChild(anchor);
        }
      }
    );
  }
}, 100);

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

const click = (element) => {
  element.dispatchEvent(new Event('click', { bubbles: true }));
}

const processItem = (element) => {
  element = moveDown(element, 5);
  click(element);

  waitAndExecute(
    () => document.getElementsByClassName("__fb-light-mode").length === 6,
    () => {
      let e = document.getElementsByClassName("__fb-light-mode")[4];
      waitAndExecute(
        () => moveDown(e, 2).childNodes[1].getAttribute("aria-busy") !== "true",
        () => {
          let popupDiv = moveDown(e, 2).childNodes[1];
          let parent = moveDown(popupDiv, 4).nextSibling;
          let infoDiv = moveDown(parent.nextSibling, 3);

          let data = {};
          data.url = infoDiv.querySelector('a').href;
          data.image = infoDiv.querySelector('a img').src;

          let spans = infoDiv.querySelectorAll("a span");
          data.title = spans[0].textContent;
          data.sku = spans[6].firstChild.textContent;
          listingData.push(data);

          click(parent.firstChild);
          processNext();
        }
      );
    }
  );
}

const processNext = () => {
  const item = listingQueue.shift();
  if (item) {
    setTimeout(() => processItem(item));
  } else {
    console.log(listingData);
  }
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
  processNext();
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

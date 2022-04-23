const waitAndExecute = (condition, callback) => {
  let timer = setInterval(() => {
    if (condition()) {
      clearInterval(timer);
      callback();
    }
  }, 100);
}


const uploadImages = (element, files) => {
  const extensionMap = {
    "image/png": "png",
    "image/tiff": "tif",
    "image/vnd.wap.wbmp": "wbmp",
    "image/x-icon": "ico",
    "image/x-jng": "jng",
    "image/x-ms-bmp": "bmp",
    "image/svg+xml": "svg",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/jpeg": "jpeg",
  };

  Promise.all(files.map((file) => (
    fetch(file).then((response) => response.blob())
  ))).then((blobs) => {
    const dt = new DataTransfer();
    for (blob of blobs) {
      dt.items.add(new File([blob], `image.${extensionMap[blob.type]}`, {type: blob.type}));
    }
    element.files = dt.files;
    element.dispatchEvent(new Event('change', { bubbles: true }));
  });
}


const updateInput = (element, value) => {
  Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(element, value);
  element.dispatchEvent(new Event('change', { bubbles: true }));
};


const updateTextArea = (element, value) => {
  Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set.call(element, value);
  element.dispatchEvent(new Event('change', { bubbles: true }));
};


const selectDropdown = (element, value) => {
  let checkCleanState = false;

  waitAndExecute(
    () => document.getElementsByClassName("__fb-light-mode").length === 1,
    () => {
      element.dispatchEvent(new Event('click', { bubbles: true }));
      checkCleanState = true;
    }
  )

  waitAndExecute(
    () => (
      document.getElementsByClassName("__fb-light-mode").length === 2 &&
      checkCleanState
    ),
    () => {
      for (element of document.getElementsByClassName("__fb-light-mode")) {
        if (element.tagName === 'DIV') {
          for (span of element.getElementsByTagName("span")) {
            if (span.textContent === value) {
              span.dispatchEvent(new Event('click', { bubbles: true }));
            }
          }
        }
      }
    }
  )
}

const selectLocation = (input, value) => {
  let checkCleanState = false;

  waitAndExecute(
    () => document.getElementsByClassName("__fb-light-mode").length === 1,
    () => {
      updateInput(input, value);
      checkCleanState = true;
    }
  )

  waitAndExecute(
    () => (
      document.getElementsByClassName("__fb-light-mode").length === 2 &&
      checkCleanState
    ),
    () => {
      for (element of document.getElementsByClassName("__fb-light-mode")) {
        if (element.tagName === 'DIV') {
          waitAndExecute(() => {
            return element.getElementsByTagName("span").length > 0;
          }, () => {
            for (span of element.getElementsByTagName("span")) {
              if (span.textContent === value) {
                span.dispatchEvent(new Event('click', { bubbles: true }));
              }
            }
          });
        }
      }
    }
  )
}

window.onload = function () {
  let spans = document.getElementsByTagName("span");

  let imageElement = document.getElementsByTagName('input')[3];

  let titleElement, priceElement,
    descriptionElement, skuElement, categoryElement,
    conditionElement, locationElement;

  for (span of spans) {
    if (span.textContent === 'Title' && !titleElement) {
      titleElement = span.nextSibling;
    }

    if (span.textContent === 'Price' && !priceElement) {
      priceElement = span.nextSibling;
    }

    if (span.textContent === 'Description' && !descriptionElement) {
      descriptionElement = span.nextSibling;
    }

    if (span.textContent === 'SKU' && !skuElement) {
      skuElement = span.nextSibling;
    }

    if (span.textContent === 'Category' && !categoryElement) {
      categoryElement = span;
    }

    if (span.textContent === 'Condition' && !conditionElement) {
      conditionElement = span;
    }

    if (span.textContent === 'Location' && !locationElement) {
      locationElement = span.nextSibling;
    }
  }

  chrome.runtime.sendMessage({"message": "ready"}, (response) => {
    updateInput(titleElement, response.title);
    updateInput(priceElement, response.price);
    updateTextArea(descriptionElement, response.description);
    updateInput(skuElement, response.sku);
    selectDropdown(categoryElement, response.category);
    selectDropdown(conditionElement, response.condition);
    selectLocation(locationElement, response.location);
    uploadImages(imageElement, response.images);
  });
}

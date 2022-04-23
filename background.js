chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const getData = () => {
    const url = "https://i.tribune.com.pk/media/images/Zverev1650715576-0/Zverev1650715576-0-387x262.webp";

    fetch(url).then((response) => {
      response.blob().then((blob) => {
        let fr = new FileReader();
        fr.onload = () => {
          sendResponse({
            title: "Professional Tennis Racket",
            price: "30",
            description: "Great quality racket",
            sku: "Dropified-123",
            category: "Sports & Outdoors",
            condition: "Used - Good",
            location: "Lahore, Pakistan",
            images: [fr.result],
          });
        };
        fr.readAsDataURL(blob);
      });
    });
  }

  if (request.message === "ready") {
    getData();
  }
  return true;

});

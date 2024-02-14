document.addEventListener("DOMContentLoaded", function () {
    function isYouTubeIframe(iframe) {
      const src = iframe.dataset.src || iframe.src || "";
      console.log("Checking iframe src:", src); // Log the source URL being checked
  
      if (src.includes("cdn.embedly.com")) {
        const urlParams = new URLSearchParams(src.split("?")[1]);
        const youtubeUrl = urlParams.get("src");
        return (
          youtubeUrl &&
          (youtubeUrl.includes("youtube.com/embed") ||
            youtubeUrl.includes("youtu.be"))
        );
      }
  
      return src.includes("youtube.com/embed") || src.includes("youtu.be");
    }
  
    function wrapIframeAndAddSibling(iframe, wrapperAttributes, siblingHTML) {
      const iframeParent = iframe.parentNode;
      const iframeGrandParent = iframeParent.parentNode;
      iframeGrandParent.removeAttribute("style");
  
      const siblingDiv = document.createElement("div");
      siblingDiv.className = "placeholder";
      siblingDiv.setAttribute("data-consent", "analytics");
      siblingDiv.setAttribute("data-inverse", "");
      siblingDiv.innerHTML = siblingHTML;
  
      const wrapper = document.createElement("div");
      for (const key in wrapperAttributes) {
        wrapper.setAttribute(key, wrapperAttributes[key]);
      }
      wrapper.className = "frame-youtube"; // Add the class 'frame-youtube' to the wrapper
  
      iframeGrandParent.insertBefore(wrapper, iframeParent);
      wrapper.appendChild(iframe);
  
      wrapper.insertAdjacentElement("afterend", siblingDiv);
      iframeParent.remove();
    }
  
    const iframes = document.querySelectorAll("iframe");
    console.log("Found iframes:", iframes);
  
    iframes.forEach(function (iframe) {
      if (isYouTubeIframe(iframe)) {
        const siblingHTML = `
            <p>Enable analytics cookies to show the embedded YouTube video</p>
            <a href="#" class="ch2-open-settings-btn">Manage my cookie choices</a>
        `;
  
        wrapIframeAndAddSibling(
          iframe,
          { "data-consent": "analytics" },
          siblingHTML
        );
        console.log("Wrapped iframe:", iframe);
      } else {
        console.log("Non-YouTube iframe ignored:", iframe);
      }
    });
  });
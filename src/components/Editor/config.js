export default {
  zIndex: 1,
  iframe: true,
  iframeCSSLinks: [
    "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.0/css/bootstrap.css",
  ],
  uploader: {
    insertImageAsBase64URI: true
  },
  buttons: "source,fullsize,|,bold,italic,underline,paragraph,align,|,ul,ol,outdent,indent,hr,|,image,video,table,link,|,superscript,subscript,strikethrough,font,fontsize,brush,eraser",
  buttonsMD: "source,fullsize,|,bold,italic,underline,paragraph,align,|,ul,ol,outdent,indent,hr,|,image,video,table,link,|,dots",
  buttonsSM: "source,fullsize,|,bold,italic,underline,paragraph,align,|,image,video,table,link,|,dots",
  buttonsXS: "bold,italic,underline,paragraph,align,|,dots",
  toolbarButtonSize: "small",
  events: {
    afterInit: function (editor) {
      setTimeout(() => {
        const iframeJSLinks = [
          "https://code.jquery.com/jquery-2.1.3.min.js",
          "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.0/js/bootstrap.js",
        ];
        editor.iframe.contentDocument.getElementsByTagName("html")[0]
          .setAttribute("style", "overflow-y: auto")
        iframeJSLinks.forEach(href => {
          const script = editor.iframe.contentDocument.createElement("script");

          script.setAttribute("src", href);
          script.setAttribute("type", "text/javascript");

          editor.iframe.contentDocument.head && editor.iframe.contentDocument.head.appendChild(script);
        });
      }, 1000)
    }
  }
}

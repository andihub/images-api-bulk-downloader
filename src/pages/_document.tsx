import NextDocument, { Html, Head, Main, NextScript } from "next/document";
import { ColorModeScript } from "@chakra-ui/react";

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          <title>Image API bulk downloader</title>
          <meta
            property="og:title"
            content="Image API bulk downloader"
            key="title"
          />
          <meta
            name="description"
            content="This tool loads a the JSON content of an API, parses it and extracts
              the image URL, displays all the images and provides the possibility
              to download a single image or download selected images at once as a
              ZIP file."
            key="description"
          />
        </Head>
        <body>
          <ColorModeScript />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

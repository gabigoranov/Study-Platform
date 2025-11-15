import React from "react";
import DocViewer, {
  DocViewerRenderers,
  type IDocument,
} from "@cyntler/react-doc-viewer";

type StableDocViewerProps = {
  documents: IDocument[];
};

function StableDocViewer({ documents }: StableDocViewerProps) {
  return (
    <DocViewer
      documents={documents}
      pluginRenderers={DocViewerRenderers}
      config={{
        header: { disableHeader: true },
        pdfZoom: { defaultZoom: 1.0, zoomJump: 0.2 },
        pdfVerticalScrollByDefault: true,
      }}
    />
  );
}

export default React.memo(StableDocViewer);

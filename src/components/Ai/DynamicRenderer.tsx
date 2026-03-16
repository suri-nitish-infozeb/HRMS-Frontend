import type { Message } from "./types";
import TextRenderer from "./renderers/TextRenderer";
import TableRenderer from "./renderers/TableRenderer";
import ChartRenderer from "./renderers/ChartRenderer";
import LinksRenderer from "./renderers/LinksRenderer";
import FileRenderer from "./renderers/FileRenderer";
import GridRenderer from "./renderers/GridRenderer";
import MultiRenderer from "./renderers/MultiRenderer";

interface Props {
  message: Message;
}

function DynamicRenderer({ message }: Props) {
  switch (message.type) {
    case "text":
      return <TextRenderer message={message} />;
    case "table":
      return <TableRenderer message={message} />;
    case "chart":
      return <ChartRenderer message={message} />;
    case "links":
      return <LinksRenderer message={message} />;
    case "file":
      return <FileRenderer message={message} />;
    case "grid":
      return <GridRenderer message={message} />;
    case "multi":
      return <MultiRenderer message={message} />;
    default:
      return null;
  }
}

export default DynamicRenderer;
import html2canvas from "html2canvas";

export async function downloadNodeAsPNG(
  node: HTMLElement,
  filename = "insight.png"
) {
  const canvas = await html2canvas(node, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#0b0f19",
  });

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = filename;
  link.click();
}
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function downloadNodeAsPDF(
  node: HTMLElement,
  filename = "insight.pdf"
) {
  const canvas = await html2canvas(node, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#0b0f19",
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let y = 0;
  let heightLeft = imgHeight;

  while (heightLeft > 0) {
    pdf.addImage(imgData, "PNG", 0, y, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    if (heightLeft > 0) {
      pdf.addPage();
      y -= pageHeight;
    }
  }

  pdf.save(filename);
}
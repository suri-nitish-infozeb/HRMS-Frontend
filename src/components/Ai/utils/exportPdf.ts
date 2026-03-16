import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function downloadNodeAsPDF(
  node: HTMLElement,
  filename = "insight.pdf",
  theme: "light" | "dark" | string = "dark"
) {
  const rootStyles = getComputedStyle(document.documentElement);
  const bgColor = rootStyles.getPropertyValue("--color-bg").trim() || "#ffffff";
  const textColor =
    rootStyles.getPropertyValue("--color-text-primary").trim() || "#111111";

  const clone = node.cloneNode(true) as HTMLElement;
  clone.setAttribute("data-theme", theme);
  clone.style.background = bgColor;
  clone.style.color = textColor;
  clone.style.position = "fixed";
  clone.style.left = "-99999px";
  clone.style.top = "0";
  clone.style.width = `${node.offsetWidth}px`;
  clone.style.zIndex = "-1";

  document.body.appendChild(clone);

  const canvas = await html2canvas(clone, {
    scale: 2,
    useCORS: true,
    backgroundColor: bgColor,
  });

  document.body.removeChild(clone);

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
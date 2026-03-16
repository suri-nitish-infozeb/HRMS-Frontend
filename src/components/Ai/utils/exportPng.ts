import html2canvas from "html2canvas";

export async function downloadNodeAsPNG(
  node: HTMLElement,
  filename = "insight.png",
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

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = filename;
  link.click();
}
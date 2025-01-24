let toc: {
  title: string;
  url: string;
  items: { title: string; url: string }[];
}[] = [];

// Function to set (update) the TOC
export async function setToc(
  newToc: {
    title: string;
    url: string;
    items: { title: string; url: string }[];
  }[] = []
) {
  if (!Array.isArray(newToc)) {
    throw new Error("Invalid TOC: TOC must be an array.");
  }
  toc = newToc;
}

// Export the TOC
export async function getToc() {
  // Simulate waiting for some async operation, e.g., fetching TOC data
  return toc;
}

export function setupLinkHandler(link: HTMLAnchorElement, onClick: () => void) {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    onClick();
  });
}
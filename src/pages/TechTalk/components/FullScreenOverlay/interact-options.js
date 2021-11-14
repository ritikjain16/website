const options = {
  draggable: dragMoveListener => ({
    onmove: dragMoveListener,
    restrict: {
      restriction: 'parent',
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    },
  }),
  resizable: {
    edges: { left: true, right: true, bottom: true, top: true },
    restrictEdges: {
      outer: 'parent',
      endOnly: true,
    },
    restrictSize: {
      min: { width: 100, height: 50 },
    },
    inertia: true,
  }
}

export default options

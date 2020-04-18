const copyElementsPositions = (elements) => {
  const positions = {};
  Object.entries(elements).forEach(([id, element]) => {
    positions[id] = { ...element.position };
  });
  return positions;
};

export default copyElementsPositions;

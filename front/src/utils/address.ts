
const shorthandAddressForDisplay = (address: string, digits = 4, separator = '...', prefix = '0x'): string => {

  const slicedAddressArray = [
      address.slice(0, digits),
      address.slice(-digits),
  ];

  return slicedAddressArray.join(separator)
};

export { shorthandAddressForDisplay };

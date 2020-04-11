import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import SelectContext from './SelectContext';

const SelectProvider = ({
  children,
}) => {
  const expandingRef = useRef();
  const movingRef = useRef();
  const selectRef = useRef();

  return (
    <SelectContext.Provider
      value={{
        expandingRef,
        movingRef,
        selectRef,
      }}
    >
      {children}
    </SelectContext.Provider>
  );
};

SelectProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SelectProvider;

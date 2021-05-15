import React, { useState, useEffect, useRef } from 'react';

// https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state

function usePreviousState(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

export default usePreviousState;
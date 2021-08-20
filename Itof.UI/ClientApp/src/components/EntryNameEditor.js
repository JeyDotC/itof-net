import React, { useState } from 'react';

export default function EntryNameEditor(props) {
    const { value, onSetEntryName, onFinishEdit } = props;

    const [entryName, setEntryName] = useState(value);

    const handleFocus = e => {
        e.target.select();
    }

    const handleChange = e => {
        setEntryName(e.target.value);
    }

    const handleKeyDown = e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (entryName !== value) {
                onSetEntryName(entryName);
            } else {
                e.target.blur();
            }
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            e.target.blur();
        }
    }

    return (<input
        className="form-control"
        type="text"
        value={entryName}
        ref={input => input && input.focus()}
        onFocus={handleFocus}
        onBlur={onFinishEdit}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onClick={e => e.stopPropagation()} />);
}
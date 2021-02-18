import React, { useState, useEffect } from 'react';

export default function OpenWithMenu({ apps, onOpenFileWith, isOpen}) {

    const [term, setTerm] = useState();

    useEffect(() => {
        if (isOpen) {
            document.querySelector("#open-with-menu-search").focus();
        }
    }, [isOpen]);

    const handleKeyDown = e => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
        if (e.key === 'Delete') {
            e.stopPropagation();
        }
    };

    const handleOnChange = e => {
        setTerm(e.target.value);
    };

    const filter = app => !term || termRegex.test(app.name);

    const termRegex = new RegExp(term, "i");

    return (
        <div>
            <div className="">
                <input id="open-with-menu-search" type="text" className="form-control" value={term} onKeyDown={handleKeyDown} onChange={handleOnChange} placeholder="Search App..." />
            </div>
            <div className="list-group">
                {apps.filter(filter).map(app => <a key={app.name} href="#" className="list-group-item list-group-item-action" onClick={() => onOpenFileWith(app)}>{app.name}</a>)}
            </div>
        </div> 
    );
}
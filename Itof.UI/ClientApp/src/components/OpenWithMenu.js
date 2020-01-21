import React from 'react';

export default function OpenWithMenu({ apps, onOpenFileWith }) {

    return (
        <div className="list-group">
            {apps.map(app => <a key={app.name} href="#" className="list-group-item list-group-item-action" onClick={() => onOpenFileWith(app)}>{app.name}</a>)}
        </div>
    );
}
import React from 'react';
import IconMap from '../services/IconMap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(far);
library.add(fas);
library.add(fab);

export default function FileSystemEntryIcon(props) {

    const { entry, color } = props;
    const isFolder = entry.kind === 0;
    const icon = isFolder ? 'folder' : IconMap.getByMime(entry.mime);

    return (
        <FontAwesomeIcon icon={icon} color={color} size={'1x'} />
    );
}
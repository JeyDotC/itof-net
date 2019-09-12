
const IconMap = {
        'image': ['far', 'image'],
        'audio': ['far', 'volume-up'],
        'video': ['far', 'film'],
        // Text
        'plain': ['far', 'file-alt'],
        'css': ['far', 'css3-alt'],
        'csv': ['far', 'file-csv'],
        'html': ['far', 'file-code'],
        'calendar': ['far', 'calendar'],
        // Application
        'xml': ['fas', 'code'],
        'json': ['fab', 'js'],
        'js': ['fab', 'js'],
        'javascript': ['fab', 'js'],
        'octet-stream': ['far', 'file'],
        'x-compressed': ['far', 'file-archive'],
        'x-zip-compressed': ['far', 'file-archive'],
        'x-zip': ['far', 'file-archive'],
        'zip': ['far', 'file-archive'],
        'pdf': ['far', 'file-pdf'],

        getByMime(mime) {
            if (!mime) {
                return this['octet-stream'];
            }
            const [mainType, subType] = mime.split('/');

            return this[mainType] || this[subType] || this['octet-stream'];
        }
    };

export default IconMap;
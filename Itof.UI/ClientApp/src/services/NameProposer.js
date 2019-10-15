const defaultFileName = 'Untitled';
const defaultFolderName = 'Untitled Folder';
const defaultExtension = 'txt';

function proposeEntryName({ currentPath, entriesInCurrentPath = [], extensionlessEntryName }){
    const proposedName = [...entriesInCurrentPath.filter(p => p.name.startsWith(extensionlessEntryName))].map(d => d.name).pop();
    const lastNumber = proposedName !== undefined ? proposedName.split(' ').pop() : undefined;
    const newNumber = lastNumber === undefined ? '' : (isNaN(lastNumber) ? 1 : parseInt(lastNumber, 10) + 1);
    const newFolderName = proposedName === undefined ? extensionlessEntryName : `${extensionlessEntryName} ${newNumber}`;
    return { fullName: `${currentPath}/${newFolderName}`, name: newFolderName };
}

function proposeFolderName({ currentPath, directoriesAtCurrentPath = [], folderName = defaultFolderName }) {
    return proposeEntryName({ currentPath, entriesInCurrentPath: directoriesAtCurrentPath, extensionlessEntryName: folderName});
}

function proposeFileName({ currentPath, filesAtCurrentPath = [], fileName = defaultFileName, extension =  defaultExtension}) {
    const newExtensionlessFileName = proposeEntryName({
        currentPath,
        entriesInCurrentPath: filesAtCurrentPath.filter(entry => entry.extension === extension).map(file => {
            return {
                ...file,
                name: file.name.substring(0, file.name.lastIndexOf('.')),
            };
        }),
        extensionlessEntryName: fileName
    });
    return { fullName: `${newExtensionlessFileName.fullName}.${extension}`, name: `${newExtensionlessFileName.name}.${extension}` };
}

export { proposeFolderName, proposeFileName };
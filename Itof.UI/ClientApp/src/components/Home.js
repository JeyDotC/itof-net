import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Modal, ModalHeader, ModalBody, Progress } from 'reactstrap';
import { NavMenu } from './NavMenu';
import DirectoryTree from './DirectoryTree';
import TableDirectoryView from './directoryViews/TableDirectoryView';
import ContextMenu from './ContextMenu';
import OpenWithMenu from './OpenWithMenu';

import * as signalR from '@aspnet/signalr';

let osApps = [];
let canUpdateProgress = false;
let connection = undefined;

export function Home() {

    const [currentPath, setCurrentPath] = useState('');
    const [drives, setDrives] = useState([]);
    const [directoriesAtCurrentPath, setDirectoriesAtCurrentPath] = useState([]);
    const [filesAtCurrentPath, setFilesAtCurrentPath] = useState([]);
    const [contextMenuOpen, setContextMenuOpen] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [currentFileSystemEntry, setCurrentFileSystemEntry] = useState(undefined);
    const [selectedForCopy, setSelectedForCopy] = useState(undefined);
    const [isEditingFileSystemEntry, setIsEditingFileSystemEntry] = useState(false);
    const [longRunningTaskName, setLongRunningTaskName] = useState("");
    const [longRunningTaskIsRunning, setLongRunningTaskIsRunning] = useState(false);
    const [longRunningTaskProgress, setLongRunningTaskProgress] = useState({ task: "", currentProgress: 0, total: 0, progressPercentage: 0 });
    const [openWithRequested, setOpenWithRequested] = useState(false);
    const [selectedItem, setSelectedItem] = useState({ fullName: '', name: '' });


    const handleProgress = longRunningTaskProgress => {
        let deferredProgress = longRunningTaskProgress;

        if (canUpdateProgress) {
            setLongRunningTaskProgress(longRunningTaskProgress);
            canUpdateProgress = false;
            setTimeout(() => {
                canUpdateProgress = true;
                setLongRunningTaskProgress(deferredProgress);
            }, 100);
        }
    };

    const handleCompleted = () => {
        setSelectedForCopy(undefined);
        setLongRunningTaskIsRunning(false);
        handleNavigate(currentPath);
    };

    useEffect(() => {
        async function setup() {
            const response = await fetch('api/FileSystem/drives');
            const data = await response.json();

            setDrives(data);

            document.addEventListener('keydown', handleGlobalKeyBoard);

            const applicationsRespone = await fetch('api/Host/applications');
            osApps = await applicationsRespone.json();

            connection = new signalR.HubConnectionBuilder().withUrl("/fileSystemHub").build();

            connection.on('DirectoryChanged', handleDirectoryChanged);
            connection.on('CopyDirectoryProgress', handleProgress);
            connection.on('CopyDirectoryCompleted', handleCompleted);

            try {
                await connection.start();
                console.log('Connected');
            } catch (err) {
                console.log('Connection failed', err);
            }
        }
        setup();

        return function dispose() {
            document.removeEventListener('keydown', handleGlobalKeyBoard);
        };
    }, []);

    const toggleLongRunningTaskIsRunning = () => setLongRunningTaskIsRunning(!longRunningTaskIsRunning);

    const toggleOpenWithRequested = () => setOpenWithRequested(!openWithRequested);

    const handleDirectoryChanged = path => {

        if (isEditingFileSystemEntry) {
            return;
        }

        handleNavigate(currentPath);
    };

    const handleGlobalKeyBoard = event => {
        if (currentFileSystemEntry !== undefined) {
            switch (event.key) {
                case 'F2':
                    setIsEditingFileSystemEntry(true);
                    break;
                case 'Delete':
                    !isEditingFileSystemEntry && !openWithRequested && handleDeleteEntry(currentFileSystemEntry);
                    break;
                case 'c':
                    event.ctrlKey && handleSelectedForCopy({ item: currentFileSystemEntry });
                    break;
                default: break;
            }
        }
        if (selectedForCopy !== undefined) {
            switch (event.key) {
                case 'v':
                    event.ctrlKey && handlePaste({ source: selectedForCopy });
                    break;
                default: break;
            }
        }
    };

    const handleItemOpen = item => {
        const isFolder = item.kind === 0;
        const isFile = item.kind === 1;

        if (isFolder) {
            handleNavigate(item.fullName);
        } else if (isFile) {
            openFile(item.fullName);
        }
    };

    const openFile = (fullName, appName = undefined) => {
        const openWith = appName ? `&openWith=${appName}` : '';
        return fetch(`/api/Process/OsOpen?file=${fullName}${openWith}`, {
            method: 'POST'
        });
    };

    const handleItemSelected = ({ item, edit = false }) => {
        let currentItem = item;
        if (typeof item === 'string') {
            currentItem = directoriesAtCurrentPath.find(d => d.name === item) || filesAtCurrentPath.find(f => f.name === item);
        }
        setContextMenuOpen(false);
        setCurrentFileSystemEntry(currentItem);
        setIsEditingFileSystemEntry(edit);
    };

    const handleSelectedForCopy = ({ item }) => setSelectedForCopy(item);

    const handleNavigate = path => new Promise(async (resolve, reject) => {
        if (!path) {
            resolve(path);
            return;
        }

        const result = await Promise.all([
            fetch(`api/FileSystem/dirs?path=${path}`),
            fetch(`api/FileSystem/files?path=${path}`)
        ]);

        const validResults = result.filter(response => response.ok);
        const inValidResults = result.filter(response => !response.ok);

        if (validResults.length > 0) {
            const [dirs, files] = await Promise.all(validResults.map(response => response.json()));

            setCurrentPath(path);
            setDirectoriesAtCurrentPath(dirs);
            setFilesAtCurrentPath(files);
            setContextMenuOpen(false);

            resolve(path);

            connection && connection.invoke('ListenTo', path).catch(err => console.error(err.toString()));
        }

        if (inValidResults.length > 0) {
            const error = await inValidResults[0].json();
            alert(error.message);
            reject(path);
        }
    });

    const handleContextMenu = (fileSystemEntry, e) => {
        e.preventDefault();
        e.stopPropagation();

        if (fileSystemEntry !== undefined) {
            setContextMenuOpen(true);
            setContextMenuPosition({ x: e.clientX, y: e.clientY });
            setCurrentFileSystemEntry(fileSystemEntry);
        }
    };

    const handleFinishEdit = () => setIsEditingFileSystemEntry(false);

    const handleSetEntryName = async entryName => {
        const response = await fetch(`/api/FileSystem/dirs?path=${currentFileSystemEntry.fullName}&newPath=${currentFileSystemEntry.directory}/${entryName}`, {
            method: 'PUT'
        });

        if (response.ok) {
            handleNavigate(currentFileSystemEntry.directory);
        } else {
            const jsonResults = await response.json();
            alert(jsonResults.message);
        }
    };

    const handleDeleteEntry = fileSystemEntry => new Promise(async (resolve, reject) => {

        const kindName = fileSystemEntry.kind === 0 ? 'directory' : 'file';

        if (!window.confirm(`Are you sure to delete ${kindName} ${fileSystemEntry.name}?\nDeletion is PERMANENT!`)) {
            return reject();
        }

        const apiPart = fileSystemEntry.kind === 0 ? 'dirs' : 'files';

        const response = await fetch(`/api/FileSystem/${apiPart}?path=${fileSystemEntry.fullName}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            handleNavigate(currentPath);
            resolve();
        } else {
            const jsonResults = await response.json();
            alert(jsonResults.message);
            reject();
        }
    });

    const handlePaste = async ({ source }) => {
        const apiPart = source.kind === 0 ? 'dirs' : 'files';
        const destination = `${currentPath}/${source.name}`;

        setLongRunningTaskName(`Copying ${source.name} into ${currentPath}`);
        setLongRunningTaskIsRunning(true);

        const result = await fetch(`/api/FileSystem/${apiPart}/copy?source=${source.fullName}&destination=${destination}`, {
            method: 'POST'
        });

        if (!result.ok) {
            const error = await result.json();
            alert(error.message);
        }
    };

    const handleOpenWith = ({ item }) => {
        setOpenWithRequested(true);
        setSelectedItem(item);
    };

    const handleOpenFileWith = app => {
        console.log(selectedItem);
        openFile(selectedItem.fullName, app.name);
        setOpenWithRequested(false);
    };

    const handleClickOnBlankSpace = () => setContextMenuOpen(false);

    return (
        <div style={{ paddingTop: '70px', minHeight: '600px' }}
            onClick={handleClickOnBlankSpace}
            onContextMenu={e => handleContextMenu({ fullName: currentPath, kind: 0 }, e)}>
            <NavMenu currentPath={currentPath} onNavigate={handleNavigate} />
            <Container fluid={true}>
                <Row noGutters={true}>
                    <Col lg={3} sm={4}>
                        <DirectoryTree drives={drives} onNavigate={handleNavigate} />
                    </Col>
                    <Col lg={9} sm={8}>
                        <TableDirectoryView
                            currentPath={currentPath}
                            currentFileSystemEntry={currentFileSystemEntry}
                            isEditingFileSystemEntry={isEditingFileSystemEntry}
                            directories={directoriesAtCurrentPath}
                            files={filesAtCurrentPath}

                            onItemSelected={handleItemSelected}
                            onSetEntryName={handleSetEntryName}
                            onItemOpen={handleItemOpen}
                            onContextMenu={handleContextMenu}
                            onFinishEdit={handleFinishEdit}
                        />
                        <div id="bottom-gutter" style={{ height: '300px' }} />
                    </Col>
                </Row>
            </Container>
            <ContextMenu
                x={contextMenuPosition.x}
                y={contextMenuPosition.y}

                selectedItem={currentFileSystemEntry}
                selectedForCopy={selectedForCopy}
                show={contextMenuOpen}
                currentPath={currentPath}
                directoriesAtCurrentPath={directoriesAtCurrentPath}
                filesAtCurrentPath={filesAtCurrentPath}

                onNavigate={handleNavigate}
                onDeleteEntry={handleDeleteEntry}
                onItemSelected={handleItemSelected}
                onSelectedForCopy={handleSelectedForCopy}
                onPaste={handlePaste}
                onOpenWith={handleOpenWith}
            />

            <Modal isOpen={longRunningTaskIsRunning}
                toggle={toggleLongRunningTaskIsRunning}>
                <ModalHeader toggle={toggleLongRunningTaskIsRunning}>
                    {longRunningTaskName}
                </ModalHeader>
                <ModalBody>
                    <label>{longRunningTaskProgress.task}</label>
                    <Progress value={longRunningTaskProgress.currentProgress} max={longRunningTaskProgress.total} animated={false} />
                </ModalBody>
            </Modal>

            <Modal isOpen={openWithRequested}
                toggle={toggleOpenWithRequested}>
                <ModalHeader toggle={toggleOpenWithRequested}>
                    Open <em>{openWithRequested && selectedItem.name}</em> with:
                    </ModalHeader>
                <ModalBody>
                    <OpenWithMenu apps={osApps} onOpenFileWith={handleOpenFileWith} isOpen={openWithRequested} />
                </ModalBody>
            </Modal>
        </div>
    );
}

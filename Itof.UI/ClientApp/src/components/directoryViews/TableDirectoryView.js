import React from 'react';
import { Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faFile } from '@fortawesome/free-solid-svg-icons'
import './TableDirectoryView.css';
import classNames from 'classnames';

export default class TableDirectoryView extends React.Component {
    render() {
        return (
            <Table size={'sm'} hover={true} className={'table-directory-view'}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Last Name</th>
                        <th>Username</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.directories.map(d => <tr key={d.fullName} className={classNames('directory-row', { 'text-muted': d.name.startsWith('.') })}
                        onContextMenu={e => this.props.onContextMenu(d, e)}
                        onClick={() => this.props.onNavigate(d.fullName)}>
                        <td>
                            <FontAwesomeIcon icon={faFolder} color={'brown'} />
                        </td>
                        <th scope="row">{d.name}</th>
                        <td>Otto</td>
                        <td>@mdo</td>
                    </tr>)}
                    {this.props.files.map(f => <tr key={f.fullName} className={classNames('file-row', { 'text-muted': f.name.startsWith('.') })}>
                        <td>
                            <FontAwesomeIcon icon={faFile} />
                        </td>
                        <th scope="row">{f.name}</th>
                        <td>Otto</td>
                        <td>@mdo</td>
                    </tr>)}
                </tbody>
            </Table>
        );
    }
}
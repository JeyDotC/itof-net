import React from 'react';
import { Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder } from '@fortawesome/free-solid-svg-icons'

export default class TableDirectoryView extends React.Component {
    render() {
        return (
            <Table size={'sm'}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Username</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.directories.map(d => <tr key={d.fullName}>
                        <td>
                            <FontAwesomeIcon icon={faFolder} />
                        </td>
                        <th scope="row">{d.name}</th>
                        <td>Otto</td>
                        <td>@mdo</td>
                    </tr>)}
                </tbody>
            </Table>
        );
    }
}
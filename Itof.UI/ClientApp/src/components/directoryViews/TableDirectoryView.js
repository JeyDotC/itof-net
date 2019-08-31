import React from 'react';
import { Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
                    {this.props.directories.map(d => <tr>
                        <td>
                            <FontAwesomeIcon icon="folder" />
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
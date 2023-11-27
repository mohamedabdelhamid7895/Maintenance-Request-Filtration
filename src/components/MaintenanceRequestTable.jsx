/* eslint-disable react/prop-types */
const MaintenanceRequestTable = ({ data, onDelete, onAddRow }) => {
    return (
        <div className="table-container">
            <h2>Maintenance Request Table</h2>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Malfunction Types</th>
                        <th>Degree of Importance</th>
                        <th>Delivery Date</th>
                        <th>Supposed Time for Repair Start</th>
                        <th>Supposed Time for Repair End</th>
                        <th>Details of the Malfunction</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{row.malfunctionTypes}</td>
                            <td>{row.degreeOfImportance}</td>
                            <td>{row.deliveryDate}</td>
                            <td>{row.repairStartTime}</td>
                            <td>{row.repairEndTime}</td>
                            <td>{row.malfunctionDetails}</td>
                            <td>
                                <button onClick={() => onDelete(index)}>Delete Row</button>
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan='12' className='addRow'>
                            <button onClick={onAddRow}>Add Row</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default MaintenanceRequestTable;

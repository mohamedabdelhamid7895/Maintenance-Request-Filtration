import { useState, useEffect } from 'react';
import MaintenanceRequestTable from './MaintenanceRequestTable';
import '../App.css'; 

const MaintenanceRequestForm = () => {


    const [malfunctionTypes, setMalfunctionTypes] = useState([]);
    const [degreeOfImportance, setDegreeOfImportance] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [repairStartTime, setRepairStartTime] = useState('');
    const [repairEndTime, setRepairEndTime] = useState('');
    const [submittedRequests, setSubmittedRequests] = useState([]);
    const [tableData, setTableData] = useState([]);

    //here we  Load saved requests from local storage on component mount
    useEffect(() => {
        const savedRequests = JSON.parse(localStorage.getItem('maintenanceRequests')) || [];
        setSubmittedRequests(savedRequests);
    }, []);

    // Update table data when submitted requests change
    useEffect(() => {
        setTableData(submittedRequests.map((request, index) => ({ ...request, id: index })));
    }, [submittedRequests]);

    const malfunctionTypeChange = (event) => {

        const optionValue = event.target.value;

        setMalfunctionTypes((prevTypes) =>
            prevTypes.includes(optionValue)
                ? prevTypes.filter((type) => type !== optionValue)
                : [...prevTypes, optionValue]
        );
    };

    const degreeOfImportanceChange = (event) => {
        const optionValue = event.target.value;
        setDegreeOfImportance(optionValue);
    };

    const deliveryDateChange = (event) => {
        const selectedDate = event.target.value;
        setDeliveryDate(selectedDate);
    };

    const repairStartTimeChange = (event) => {
        const selectedTime = event.target.value;
        setRepairStartTime(selectedTime);
    };

    const repairEndTimeChange = (event) => {
        const selectedTime = event.target.value;
        setRepairEndTime(selectedTime);
    };


    // here check if the time range is valid 
    const isTimeRangeValid = () => {
        if (!repairStartTime || !repairEndTime) {
            return true;
        }

        const startTime = new Date(repairStartTime).getTime();
        const endTime = new Date(repairEndTime).getTime();

        //here  Check for a reasonable range within 1 day
        return Math.abs(startTime - endTime) < 24 * 60 * 60 * 1000;
    };

    // checking for available time 
    const isTimeAvailable = (newRequest) => {
        const newStartTime = new Date(newRequest.deliveryDate + 'T' + newRequest.repairStartTime).getTime();
        for (const request of submittedRequests) {
            const startTime = new Date(request.deliveryDate + 'T' + request.repairStartTime).getTime();
           
           
            // Check for a reasonable range, for example, 1 hour before and after

            if (Math.abs(startTime - newStartTime) < 60 * 60 * 1000) {
                return false; // Scheduling conflict
            }
        }
        return true;
    };


    const addRow = (event) => {
        event.preventDefault();

        // Validation for empty fields
        if (!malfunctionTypes.length || !degreeOfImportance || !deliveryDate || !repairStartTime || !repairEndTime) {
            alert('Please fill  all required fields.');
            return;
        }

        // Validation to check the  delivery date is not in the past
        if (new Date(deliveryDate) < new Date()) {
            alert('Delivery date cannot be in the past.');
            return;
        }

        // Validation for the  Time Range
        if (!isTimeRangeValid()) {
            alert('The repair time range is not valid. Please change  the start and end times.');
            return;
        }

        // Check for the  scheduling conflicts
        const newRequest = {
            malfunctionTypes: malfunctionTypes.join(', '),
            degreeOfImportance,
            deliveryDate,
            repairStartTime,
            repairEndTime,
        };

        if (!isTimeAvailable(newRequest)) {
            alert('Scheduling conflict! The selected time is not available.');
            return;
        }

        //here to  Add a new row to the table data
        const newRow = {
            malfunctionTypes: malfunctionTypes.join(', '),
            degreeOfImportance,
            deliveryDate,
            repairStartTime,
            repairEndTime,
        };

        setSubmittedRequests([...submittedRequests, newRow]);

        //here to  Save to local storage
        localStorage.setItem('maintenanceRequests', JSON.stringify([...submittedRequests, newRow]));

        // Reset form fields after saving to the local storage
        setMalfunctionTypes([]);
        setDegreeOfImportance('');
        setDeliveryDate('');
        setRepairStartTime('');
        setRepairEndTime('');
    };

    // here is a Function to delete a row based on its ID
    const handleDeleteRow = (id) => {
        const updatedRequests = submittedRequests.filter((request, index) => index !== id);
        setSubmittedRequests(updatedRequests);

        // Save to local storage
        localStorage.setItem('maintenanceRequests', JSON.stringify(updatedRequests));
    };

    return (
        <div className="form-container">
            <h2>Maintenance Request Form</h2>

            <form onSubmit={addRow}>
                <label>Type of Malfunction:</label>
                <div className="checkbox-group">
                    <label>
                        <input
                            type="checkbox"
                            value="electrical"
                            checked={malfunctionTypes.includes('electrical')}
                            onChange={malfunctionTypeChange}
                        />
                        Electrical
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="plumbing"
                            checked={malfunctionTypes.includes('plumbing')}
                            onChange={malfunctionTypeChange}
                        />
                        Plumbing
                    </label>
                </div>

                <label>Degree of Importance:</label>
                <div className="radio-group">
                    <label>
                        <input
                            type="radio"
                            value="low"
                            checked={degreeOfImportance === 'low'}
                            onChange={degreeOfImportanceChange}
                        />
                        Low
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="medium"
                            checked={degreeOfImportance === 'medium'}
                            onChange={degreeOfImportanceChange}
                        />
                        Medium
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="high"
                            checked={degreeOfImportance === 'high'}
                            onChange={degreeOfImportanceChange}
                        />
                        High
                    </label>
                </div>

                <label>Delivery Date:</label>
                <input type="date" onChange={deliveryDateChange} value={deliveryDate} />

                <label>Supposed Time for Repair Start:</label>
                <input type="datetime-local" onChange={repairStartTimeChange} value={repairStartTime} />

                <label>Supposed Time for Repair End:</label>
                <input type="datetime-local" onChange={repairEndTimeChange} value={repairEndTime} />

                <button type="submit">Add Maintenance Request</button>
            </form>

            {/* here's the table to show  submitted requests */}
            <MaintenanceRequestTable data={tableData} onDelete={handleDeleteRow} onAddRow={addRow} />
        </div>
    );
};

export default MaintenanceRequestForm;


import React, { useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { Store } from "../Store";
import { toast } from "react-toastify";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

export default function BandProductPrescriptionScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPrescriptions = async () => {
      setLoading(true);
      try {
        // Replace with your actual admin API endpoint that returns band product prescriptions
        const { data } = await axios.get("/api/admin/band-prescriptions", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setPrescriptions(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
        toast.error(`Error loading prescriptions: ${err.response?.data?.message || err.message}`);
      }
    };
    fetchPrescriptions();
  }, [userInfo.token]);

  return (
    <div className="container mt-3 mb-5">
      <Helmet>
        <title>Band Product Prescriptions</title>
      </Helmet>
      <h1>Band Product Prescriptions</h1>

      {loading ? (
        <p>Loading prescriptions...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : prescriptions.length === 0 ? (
        <p>No prescriptions uploaded yet.</p>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Prescription</th>
              <th>Order Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((presc) => (
              <tr key={presc._id}>
                <td>
                  <Link to={`/order/${presc.orderId}`}>
                    {presc.orderId.substring(0, 8)}...
                  </Link>
                </td>
                <td>{presc.userName}</td>
                <td>{presc.productName}</td>
                <td>{presc.quantity}</td>
                <td>
                  {presc.prescriptionUrl ? (
                    <a
                      href={presc.prescriptionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View/Download
                    </a>
                  ) : (
                    "No file"
                  )}
                </td>
                <td>{new Date(presc.createdAt).toLocaleDateString()}</td>
                <td>{presc.status || "Pending"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

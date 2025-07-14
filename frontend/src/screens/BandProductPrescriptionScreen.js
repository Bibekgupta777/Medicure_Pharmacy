import React, { useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { Store } from "../Store";
import { toast } from "react-toastify";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import Card from "react-bootstrap/Card";

// Helper function to format date string "YYYY-MM-DD"
function formatDate(date) {
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Group array of prescriptions by date string
function groupByDate(prescriptions) {
  return prescriptions.reduce((groups, presc) => {
    const dateKey = new Date(presc.createdAt).toDateString();
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(presc);
    return groups;
  }, {});
}

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

  // Group prescriptions by date string
  const grouped = groupByDate(prescriptions);

  return (
    <div className="container mt-4 mb-5">
      <Helmet>
        <title>Band Product Prescriptions</title>
      </Helmet>

      <Card className="shadow">
        <Card.Body>
          <h2 className="mb-4 text-center">📄 Band Product Prescriptions</h2>

          {loading ? (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
              <p>Loading prescriptions...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : prescriptions.length === 0 ? (
            <div className="text-center text-muted">No prescriptions uploaded yet.</div>
          ) : (
            Object.entries(grouped).map(([date, prescList]) => (
              <div key={date} className="mb-5">
                {/* Date Header */}
                <h5 className="mb-3 text-primary border-bottom pb-1">{formatDate(date)}</h5>

                <Table striped bordered hover responsive>
                  <thead className="table-dark">
                    <tr>
                      <th>Order ID</th>
                      <th>User</th>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Prescription</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescList.map((presc) => (
                      <tr key={presc._id}>
                        <td>
                          <Link to={`/order/${presc.orderId}`} className="text-decoration-none">
                            #{presc.orderId.substring(0, 8)}...
                          </Link>
                        </td>
                        <td>{presc.userName}</td>
                        <td>{presc.productName}</td>
                        <td>{presc.quantity}</td>
                        <td>
                          {presc.prescriptionUrl ? (
                            <a
                              href={`http://localhost:5000${presc.prescriptionUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-outline-primary btn-sm"
                            >
                              View File
                            </a>
                          ) : (
                            <span className="text-muted">No file</span>
                          )}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              presc.status === "Approved"
                                ? "bg-success"
                                : "bg-warning text-dark"
                            }`}
                          >
                            {presc.status || "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ))
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

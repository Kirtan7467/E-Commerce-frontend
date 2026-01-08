import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table,Button } from "react-bootstrap";
import AdminNavbar from "../../pages/Admin/AdminNavbar";
import { useAppSelector } from "../../app/hooks";
import { toast } from "react-toastify";

interface vendor {
  status: string;
  _id: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  contact: string;
  shopName: string;
}

const Managevendor = () => {
  const [vendors, setVendors] = useState<vendor[]>([]);
  // const navigate = useNavigate();
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await axios.get("https://e-commerce-backend-1-m0eh.onrender.com/vendor", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("VENDOR API RESPONSE:", res.data);

        setVendors(res.data.vendor || res.data.vendors || res.data.data || []);
      } catch (err) {
        console.error("Failed to load vendors", err);
      }
    };

    fetchVendors();
  }, [token]);

  const approveVendor = async (id: string) => {
    try {
      const res = await axios.patch(
        `https://e-commerce-backend-1-m0eh.onrender.com/vendor/${id}/approve`,
        { status: "approved" }, // what we update
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(res.data);

      setVendors((prev) =>
  prev.map((v) => (v._id === id ? { ...v, status: "approved" } : v))
);
toast.success("Vendor Approved");
    } catch (error) {
      console.error("Approval failed", error);
    }
  };

  const rejectVendor = async (id: string) => {
    try {
      const res = await axios.patch(
        `https://e-commerce-backend-1-m0eh.onrender.com/vendor/${id}/reject`,
        { status: "rejected" }, // what we update
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(res.data);

      setVendors((prev) =>
        prev.map((v) => (v._id === id ? { ...v, status: "rejected" } : v))
      );
      toast.warning("Vendor Rejected");
    } catch (error) {
      console.error("rejection failed", error);
    }
  };

  return (
    <>
      <AdminNavbar />
      <Container style={{ marginTop: 80 }}>
        <h3 className="fw-bold mb-3">Vendors Information</h3>

        <Table bordered hover className="text-center">
          <thead>
            <tr>
              <th>shopName</th>
              <th>Contact</th>
              <th>Email</th>
              <th>status</th>
              <th>approved/reject</th>
            </tr>
          </thead>
          <tbody>
            {vendors.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center">
                  No products available
                </td>
              </tr>
            ) : (
              vendors.map((p) => (
                <tr key={p._id}>
                  <td>{p.shopName}</td>
                  <td>{p.contact}</td>
                  <td>{p.email}</td>
                  <td>{p.status}</td>
                   <td>
                    <Button
                      size="sm"
                      disabled={p.status === "approved"}
                      onClick={() => approveVendor(p._id)}
                      variant={p.status === "approved" ? "secondary" : "success"}
                    >
                      {p.status === "approved" ? "Approved" : "Approve"}
                    </Button>

                  {/* REJECT BUTTON */}
                  
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => rejectVendor(p._id)}
                      disabled={p.status !== "pending"} 
                    >
                      {p.status === "rejected" ? "Rejected" : "Reject"}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default Managevendor;

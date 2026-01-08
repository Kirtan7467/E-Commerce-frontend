import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Container, Table, Modal, Form } from "react-bootstrap";
import AdminNavbar from "../../pages/Admin/AdminNavbar";
import { useAppSelector } from "../../app/hooks";
import { toast } from "react-toastify";
import { validateRequired,validateImage } from "../../utils/validation";

interface Banner {
  _id: string;
  title: string;
  image?: string;
  isActive: boolean;
}

const AdminBanner = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    let mounted = true;

    const fetchBanners = async () => {
      try {
        const res = await axios.get("https://e-commerce-backend-1-m0eh.onrender.com/banner");
        if (mounted) setBanners(res.data.banners);
        console.log("Fetched banners:", res.data);
      } catch (error) {
        console.error("Failed to load banners", error);
      }
    };

    fetchBanners();
    return () => {
      mounted = false;
    };
  }, []);

  const toggleBanner = async (id: string, isActive: boolean) => {
    try {
      await axios.put(
        `https://e-commerce-backend-1-m0eh.onrender.com/banner/${id}`,
        { isActive: !isActive }, // send new status in body
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // update UI instantly
      setBanners((prev) =>
        prev.map((b) => (b._id === id ? { ...b, isActive: !isActive } : b))
      );
    } catch (error) {
      console.error("Failed to toggle banner", error);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;

    try {
      await axios.delete(`https://e-commerce-backend-1-m0eh.onrender.com/banner/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBanners((prev) => prev.filter((b) => b._id !== id));
      toast.success("Banner deleted successfully!");
    } catch (err) {
      console.error("Delete failed", err);
      toast.warning("Unauthorized or failed to delete!");
    }
  };

  const addBanner = async () => {
    if (!title || !image) return alert("Please provide banner title & image");
    if (!validateRequired(title)) return;
    if (!validateImage(image)) return;
    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", image);

    try {
      await axios.post("https://e-commerce-backend-1-m0eh.onrender.com/banner", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Banner Added Successfully");

      setShow(false);
      setTitle("");
      setImage(null);

      // refresh list
      const res = await axios.get("https://e-commerce-backend-1-m0eh.onrender.com/banner");
      setBanners(res.data.banners);
    } catch (err) {
      console.log(err);
      toast.error("Failed to upload banner");
    }
  };

  return (
    <>
      <AdminNavbar />

      <Container style={{ marginTop: 80 }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fw-bold">Manage Banners</h3>
          <Button onClick={() => setShow(true)}>+ Add Banner</Button>
        </div>

        <Table bordered hover className="text-center">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {banners.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center">
                  No banners found
                </td>
              </tr>
            ) : (
              banners.map((b) => (
                <tr key={b._id}>
                  <td>{b.title}</td>
                  <td style={{ fontWeight: "600" }}>
                    {b.isActive ? (
                      <span className="text-success">Active</span>
                    ) : (
                      <span className="text-danger">Inactive</span>
                    )}
                  </td>
                  <td>
                    <Button
                      size="sm"
                      variant={b.isActive ? "danger" : "success"}
                      className="me-4"
                      onClick={() => toggleBanner(b._id, b.isActive)}
                    >
                      {b.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="me-4"
                      onClick={() => deleteProduct(b._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Container>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Banner</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Banner Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter banner title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Select Banner Image</Form.Label>
            <Form.Control
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(e) => {
                const file = (e.target as HTMLInputElement).files?.[0] || null;
                if (!validateImage(file)) return;
                setImage(file);
              }}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button onClick={addBanner}>Upload Banner</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdminBanner;

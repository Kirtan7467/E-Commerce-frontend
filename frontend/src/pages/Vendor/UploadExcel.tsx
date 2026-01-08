import { useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router-dom";

const UploadExcel = () => {
  const [file, setFile] = useState<File | null>(null);
  const token = useAppSelector((s) => s.auth.token);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;

    if (!selected) return;

    const allowed = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!allowed.includes(selected.type)) {
      toast.error("Only Excel files (.xls, .xlsx) allowed");
      return;
    }

    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select an Excel file");
      return;
    }

    const formData = new FormData();

    formData.append("file", file);

    try {
      const res = await axios.post(
        "https://e-commerce-backend-1-m0eh.onrender.com/product/upload-excel",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(`${res.data.message} (${res.data.count} products added)`);
      setFile(null);
      navigate("/vendor/dashboard", { replace: true });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err.response?.data);
      toast.error(err.response?.data?.message || "Upload failed");
    }
  };

  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Card className="p-4 shadow" style={{ width: "450px" }}>
        <h4 className="text-center mb-3">Upload Products via Excel</h4>

        <Form.Group className="mb-3">
          <Form.Label>Select Excel File</Form.Label>
          <Form.Control
            type="file"
            accept=".xls,.xlsx"
            onChange={handleFileChange}
          />
        </Form.Group>

        <Button className="w-100" onClick={handleUpload} disabled={!file}>
          Upload Excel
        </Button>
      </Card>
    </Container>
  );
};

export default UploadExcel;

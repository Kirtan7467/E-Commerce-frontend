/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect,useState } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "./api/axiosInstance";
import {Card,Container,Row,Col} from 'react-bootstrap';

const SearchResults=()=>
{
    const[results,setResults] = useState([]);
    const search = new URLSearchParams(useLocation().search).get("search")||"";

    useEffect(() => {
        const fetchResults = async () =>
        {
            const res = await axiosInstance.get(`/product?search=${search}`)
            setResults(res.data.products);
        };
        if(search) fetchResults();
    },[search]);
    return (
    <Container style={{ marginTop: "90px" }}>
      <h3>Search Results for: {search}</h3>

      {results.length === 0 ? (
        <p>No products found</p>
      ) : (
        <Row>
          
          {results.map((p: any) => (
            <Col md={3} key={p._id} className="mb-3">
              <Card>
                <Card.Img variant="top" src={p.imageUrl} />
                <Card.Body>
                  <Card.Title>{p.title}</Card.Title>
                  <Card.Text>₹{p.price}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default SearchResults;
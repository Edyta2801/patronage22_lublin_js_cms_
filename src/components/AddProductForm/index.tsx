import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import {
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  Box,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Stack,
} from "@mui/material";
import classes from "../Layout/AuthLayout/AuthLayout.module.css";
import getCategories from "../lib/categories";
import statuses from "../../types/statuses";
import Dropzone from "../Dropzone";
import * as Yup from "yup";
import uploadRequest from "../lib/uploadImage";
import { addProductRequest } from "../lib/products";
import { useHistory } from "react-router-dom";
import { ROUTES } from "../../types/routes";
import { CONSTANTS } from "../../types/constants";

interface MyFormValues {
  title: string;
  category: string;
  description: string;
  photos: File[];
  price: number;
  quantity: number;
  status: string;
  published: boolean;
}

interface MyCategories {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const AddProductForm = () => {
  const initialValuesForm: MyFormValues = {
    title: "",
    category: "",
    description: "",
    photos: [],
    price: 0,
    quantity: 0,
    status: "",
    published: false,
  };

  const [categories, setCategories] = useState<MyCategories[]>([]);
  const [photosData, setPhotosData] = useState<File[]>([]);
  const history = useHistory();

  useEffect(() => {
    getCategories()
      .then((response) => {
        console.log(response);
        const data = response.data;
        setCategories(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .max(50, "Max number of characters is 50")
      .required("Required"),
    category: Yup.string().required("Required"),
    price: Yup.number()
      .min(0, "Price can not be negative")
      .max(10000, "Max 10000")
      .required("Required"),
    quantity: Yup.number()
      .integer()
      .min(0, "Quantity can not be negative")
      .max(10000, "Max 10000")
      .typeError("Quantity must be an integer")
      .required("Required"),
    description: Yup.string()
      .min(25, "Min number of characters is 25")
      .required("Required"),
    status: Yup.string().required("Required"),
  });

  const formik = useFormik({
    initialValues: initialValuesForm,
    onSubmit(values) {
      const payload = { ...values, photos: photosData };
      console.log(payload);
      addProductRequest(payload)
        .then((response) => {
          console.log(response.data);
          if (response.status === CONSTANTS.RESPONSE_SUCCESS) {
            for (let i = 0; i < photosData.length; i++) {
              const formData = new FormData();
              formData.append("image", photosData[i]);
              formData.append("product_id", `${response.data.id}`);
              uploadRequest(formData)
                .then((response) => {
                  if (response.status === CONSTANTS.RESPONSE_SUCCESS) {
                    console.log(response.data);
                  } else {
                    throw new Error("Something went wrong..");
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
            }
            history.push(ROUTES.PRODUCTS);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    validationSchema,
  });

  const { handleSubmit, getFieldProps, errors } = formik;

  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      <h1>Add Product</h1>
      <FormControl>
        <FormLabel htmlFor="title">Title</FormLabel>
        <TextField
          id="title"
          type="text"
          placeholder="Enter title"
          {...getFieldProps("title")}
        />
        {errors.title && <p className={classes.errors}>{errors.title}</p>}
      </FormControl>
      <Box sx={{ minWidth: 420 }}>
        <FormControl fullWidth>
          <FormLabel htmlFor="demo-simple-select">Select Category</FormLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Category"
            {...getFieldProps("category")}
          >
            {categories.map((item) => (
              <MenuItem key={item.id} value={item.title}>
                {item.title}
              </MenuItem>
            ))}
          </Select>
          {errors.category && (
            <p className={classes.errors}>{errors.category}</p>
          )}
        </FormControl>
      </Box>
      <FormControl>
        <FormLabel htmlFor="description">Description</FormLabel>
        <TextField
          id="description"
          multiline
          placeholder="Enter description"
          rows={4}
          {...getFieldProps("description")}
        />
        {errors.description && (
          <p className={classes.errors}>{errors.description}</p>
        )}
      </FormControl>
      <FormControl>
        <Stack direction="column" alignItems="left" spacing={1}>
          <FormLabel
            htmlFor="contained-button-file"
            style={{ marginTop: "1rem" }}
          >
            Select Image/-s
          </FormLabel>
          <Dropzone setFilesList={setPhotosData} />
        </Stack>
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="price">Price</FormLabel>
        <TextField
          id="price"
          type="number"
          placeholder="Enter price"
          {...getFieldProps("price")}
          InputProps={{
            inputProps: {
              maxLength: 9,
            },
          }}
        />
        {errors.price && <p className={classes.errors}>{errors.price}</p>}
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="quantity">Quantity</FormLabel>
        <TextField
          id="quantity"
          type="number"
          placeholder="Enter quantity"
          {...getFieldProps("quantity")}
          InputProps={{
            inputProps: {
              max: 100,
              min: 1,
            },
          }}
        />
        {errors.quantity && <p className={classes.errors}>{errors.quantity}</p>}
      </FormControl>
      <Box sx={{ minWidth: 420 }}>
        <FormControl fullWidth>
          <FormLabel htmlFor="select-status">Select Status</FormLabel>
          <Select
            labelId="select-label-status"
            id="select-status"
            {...getFieldProps("status")}
          >
            {statuses.map((item) => (
              <MenuItem key={item.id} value={item.status}>
                {item.status}
              </MenuItem>
            ))}
          </Select>
          {errors.status && <p className={classes.errors}>{errors.status}</p>}
        </FormControl>
      </Box>
      <FormControl>
        <FormControlLabel
          control={<Checkbox {...getFieldProps("published")} />}
          label="Published"
        />
      </FormControl>
      <Button type="submit" variant="contained">
        Add Product
      </Button>
    </form>
  );
};

export default AddProductForm;

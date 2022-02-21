import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Container, Grid, Typography } from "@mui/material";
import TextfieldWrapper from "./FormsUI/Textfield/TextfieldWrapper";
import SelectWrapper from "./FormsUI/Select/SelectWrapper";
import categories from "./FormsUI/categories.json";
import ButtonWrapper from "./FormsUI/Button/ButtonWrapper";
import SwitchWrapper from "./FormsUI/Switch/SwitchWrapper";

const products = [
  {
    id: 1,
    title: "First Product",
    category: 3,
    quantity: 10000,
    description: "First Product description...",
    status: false,
    published: false,
  },
];

const INITIAL_FORM_STATE = {
  title: products[0].title,
  category: products[0].category,
  quantity: products[0].quantity,
  description: products[0].description,
  status: products[0].status,
  published: products[0].published,
};

const FORM_VALIDATION = Yup.object().shape({
  title: Yup.string()
    .max(50, "Max number of characters is 50")
    .required("Required"),
  category: Yup.string()
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
  status: Yup.boolean()
    .oneOf([true, false], "Invalid value")
    .required("Required"),
  published: Yup.boolean()
    .oneOf([true, false], "Invalid value")
    .required("Required"),
});

export const EditProductForm = () => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <Container maxWidth="md">
          <Formik
            initialValues={{
              ...INITIAL_FORM_STATE,
            }}
            validationSchema={FORM_VALIDATION}
            onSubmit={(values) => {
              console.log(values);
            }}
          >
            {(props) => (
              <Form>
                <Grid
                  container
                  spacing={2}
                  boxShadow={3}
                  p={2}
                  borderRadius={1}
                  justifyContent="space-between"
                >
                  <Grid item xs={12}>
                    <Typography variant="h4" p={2} sx={{ color: "#0f0f0f" }}>
                      Edit product Form
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <TextfieldWrapper 
                      name="title" 
                      label="Title"
                   />
                  </Grid>

                  <Grid item xs={12}>
                    <SelectWrapper
                      name="category"
                      label="Categories"
                      options={categories}
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <TextfieldWrapper 
                      name="quantity" 
                      label="Quantity" 
                    />
                  </Grid>

                  <Grid item xs={3.5}>
                    <SwitchWrapper
                      name="status"
                      legend="Status"
                      label={props.values.status ? "Available" : "Unavailable"}
                    />
                  </Grid>

                  <Grid item xs={3.5}>
                    <SwitchWrapper
                      name="published"
                      legend="Published"
                      label={
                        props.values.published ? "Published" : "Unpublished"
                      }
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="h6">Description</Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <TextfieldWrapper
                      name="description"
                      label="Description..."
                      multiline={true}
                      rows={5}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <ButtonWrapper>Submit Form</ButtonWrapper>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Container>
      </Grid>
    </Grid>
  );
};

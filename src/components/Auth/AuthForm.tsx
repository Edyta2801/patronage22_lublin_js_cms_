import { FormControl, FormLabel, FormHelperText, Input } from "@mui/material";
import React, { useRef, useContext, useState } from "react";
import { Formik, Form } from "formik";
import { useHistory } from "react-router-dom";
import classes from "../Layout/AuthLayout/AuthLayout.module.css";
import loginUserRequest from "../lib/authorization";
import AuthContext from "../../store/auth-context";

interface MyFormValues {
  email: string;
  password: string;
}

function AuthForm() {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const authCtx = useContext(AuthContext);
  const history = useHistory();

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current!.value;
    const enteredPassword = passwordInputRef.current!.value;
    setIsLoading(true);

    loginUserRequest(enteredEmail, enteredPassword)
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          authCtx.login(response.data.token);
          history.push("/dashboard");
        } else {
          throw new Error("Authenfication Fail!");
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          setError(error.response.data.msg);
        } else {
          setError("Invalid credentials");
        }
        console.log(error);
        setIsLoading(false);
      });
  };

  const initialValues: MyFormValues = { email: "", password: "" };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, actions) => {
        console.log({ values, actions });
        alert(JSON.stringify(values, null, 2));
        actions.setSubmitting(false);
      }}
    >
      <Form onSubmit={submitHandler} className={classes.form}>
        <h1>Login</h1>
        <FormControl>
          <FormLabel htmlFor="email">Email address</FormLabel>
          <p>admin@admin.com</p>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="Enter email"
            inputRef={emailInputRef}
            required
          />
          <FormHelperText>
            We'll never share your email with anyone else.
          </FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="password">Password</FormLabel>
          <p>A12345678</p>
          <Input
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            inputRef={passwordInputRef}
            required
          />
        </FormControl>

        <div className={classes.actions}>
          {!isLoading && <button>Login</button>}
          {isLoading && <p>Sending request...</p>}
          {error && <p className={classes.error}>{error}</p>}
        </div>
      </Form>
    </Formik>
  );
}

export default AuthForm;

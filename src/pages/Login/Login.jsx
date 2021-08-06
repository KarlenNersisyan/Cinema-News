import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link, Redirect } from 'react-router-dom';
import { useFormik } from 'formik';
import { getLocalStorage, setLocalStorage } from '../../helpers/localStorage';
import { storage } from '../../constants/storage';
import { Routes } from '../../constants/routes';
import { validationLogin } from '../../helpers/formValidation';
import { isUserValid } from '../../helpers/genre';
import SignInError from '../../components/Errors/SignInError';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://github.com/KarlenNersisyan">
        {'KarlenNersisyan-GitHub'}
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login() {
  const [errorSignUp, setErrorSignUp] = useState(false);
  const [errorPassEmail, setErrorPassEmail] = useState(false);

  const classes = useStyles();

  let history = useHistory();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationLogin,
    onSubmit: (values) => {
      const users = getLocalStorage(storage.users);
      if (users) {
        setErrorSignUp(!errorSignUp);
        if (isUserValid(users, values)) {
          setLocalStorage(storage.isAuth, true);
          history.push(`${Routes.home.url}`);
          setErrorPassEmail(!errorPassEmail);
        } else {
          setErrorPassEmail(!errorPassEmail);
        }
      } else {
        setErrorSignUp(!errorSignUp);
      }
    },
  });

  return getLocalStorage(storage.isAuth) ? (
    <Redirect to={Routes.home.url} />
  ) : (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          - Welcome to our website -
        </Typography>
        <Typography component="h4" variant="h3">
          Sign up and find out more about your favorite films right here:
        </Typography>
        <Typography component="h2" variant="h4">
          Log In
        </Typography>
        <form
          onSubmit={formik.handleSubmit}
          className={classes.form}
          noValidate
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoFocus
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />

          {errorPassEmail ? (
            <SignInError message={'Wrong password or Email'} />
          ) : errorSignUp ? (
            <SignInError message={'Please Sign Up'} />
          ) : null}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Submit
          </Button>
          <Grid container>
            <Grid item>
              <Link variant="body2" to="/register">
                Don't have an account? Register
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

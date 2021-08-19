import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { useForm } from "react-hook-form";
import getData from "../services/wtData";

const useStyles = makeStyles((theme) => ({
  root: { flexGrow: 1 },
  title: { flexGrow: 1 },
  form: { display: "grid", padding: "10px" },
  menuButton: { marginRight: theme.spacing(2) },
}));

export const TopNav = () => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            onClick={handleDrawerOpen}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Data Visualization
          </Typography>
          {/* <Button>Login</Button> */}
          <Login />
        </Toolbar>
      </AppBar>
      <Drawer variant="persistent" anchor="left" open={open}>
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
        <Divider />
        <ProfileReportList />
        <ProfileReportList profileID="113070" />
      </Drawer>
    </div>
  );
};

const ProfileReportList = ({ profileID = "" }) => {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const response = await getData("", { format: "json" }, profileID);

      if (active) {
        setOptions(response);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading, profileID]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      style={{ width: 300 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={(option) => option.name}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label={profileID ? "Reports" : "Profiles"}
          variant="filled"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
};

const Login = () => {
  const [openLogin, setOpenLogin] = React.useState(false);

  const toggleDrawer = () => {
    setOpenLogin(!openLogin);
  };

  return (
    <div>
      <Button onClick={toggleDrawer}>Login</Button>
      <Drawer
        anchor="right"
        variant="temporary"
        open={openLogin}
        onClose={toggleDrawer}
        // onOpen={toggleDrawer}
      >
        <LoginForm />
      </Drawer>
    </div>
  );
};

const LoginForm = ({ loadReport, handleClose }) => {
  const API_ACCOUNT = process.env.REACT_APP_WT_API_ACCOUNT;
  const API_USERNAME = process.env.REACT_APP_WT_API_USERNAME;
  const API_PASSWORD = process.env.REACT_APP_WT_API_PASSWORD;

  const classes = useStyles();

  // const {
  //   handleSubmit,
  //   register,
  //   formState: { errors },
  // } = useForm();
  // const onSubmit = (values) => {
  //   console.log(values);
  //   loadReport(values);
  //   handleClose();
  // };

  const onSubmit = (event) => {
    event.preventDefault();
    setAccount();
    console.log("Account", account, "Username:", username);
  };

  const [account, setAccount] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    // <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
    <form onSubmit={onSubmit} className={classes.form}>
      <TextField
        required
        label="Account Name"
        defaultValue={API_ACCOUNT}
        onInput={(e) => setAccount(e.target.value)}
        // {...register("accountName", { required: true })}
      />

      <TextField
        required
        label="Username"
        defaultValue={API_USERNAME}
        onInput={(e) => setUsername(e.target.value)}
        // {...register("username", { required: true })}
      />

      <TextField
        required
        type="password"
        label="Password"
        defaultValue={API_PASSWORD}
        onInput={(e) => setPassword(e.target.value)}
        // {...register("password", { required: true })}
      />

      {/* {errors.accountName && <span>Account name is required</span>}
      {errors.username && <span>Username is required</span>}
      {errors.password && <span>Password is required</span>} */}

      <Button type="submit">Login</Button>
    </form>
  );
};

export default TopNav;

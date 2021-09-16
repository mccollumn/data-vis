import React, { useState } from "react";
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
import { useGetData } from "../services/wtData";
import { AuthContext, AuthProvider } from "../providers/AuthProvider";

const useStyles = makeStyles((theme) => ({
  root: { flexGrow: 1 },
  title: { flexGrow: 1 },
  form: { display: "grid", padding: "10px" },
  menuButton: { marginRight: theme.spacing(2) },
}));

export const TopNav = ({
  onLogin,
  setProfile,
  profile,
  setReport,
  setStartDate,
  setEndDate,
}) => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const { auth } = React.useContext(AuthContext);

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
          <Login onLogin={onLogin} isLoggedIn={auth} />
        </Toolbar>
      </AppBar>
      <Drawer variant="persistent" anchor="left" open={open}>
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
        <Divider />
        <DateSelection setStartDate={setStartDate} setEndDate={setEndDate} />
        <ProfileReportList
          auth={auth}
          setProfile={setProfile}
          setReport={setReport}
        />
        <ProfileReportList
          auth={auth}
          profile={profile}
          isReport={true}
          setProfile={setProfile}
          setReport={setReport}
        />
      </Drawer>
    </div>
  );
};

const DateSelection = ({ setStartDate, setEndDate }) => {
  const handleChange = (event) => {
    if (event.target.name === "start_date") {
      setStartDate(event.target.value);
    }
    if (event.target.name === "end_date") {
      setEndDate(event.target.value);
    }
  };

  return (
    <div>
      <TextField
        label="Start Date"
        name="start_date"
        type="date"
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        label="End Date"
        name="end_date"
        type="date"
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
      />
    </div>
  );
};

const ProfileReportList = ({
  profile = {},
  auth,
  isReport,
  setProfile,
  setReport,
}) => {
  const [open, setOpen] = React.useState(false);
  const { response: options = [], loading, error, makeRequest } = useGetData();

  React.useEffect(() => {
    makeRequest({ format: "json" }, profile.ID);
  }, [profile.ID, makeRequest]);

  const handleChange = (event, value) => {
    if (isReport) {
      setReport(value);
      return;
    }
    setProfile(value);
  };

  return (
    <Autocomplete
      disabled={!auth && true}
      style={{ width: 300 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onChange={handleChange}
      getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={(option) => option.name}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label={isReport ? "Reports" : "Profiles"}
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

const Login = ({ onLogin, isLoggedIn }) => {
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
        <LoginForm onLogin={onLogin} />
        {isLoggedIn && <p>Logged In</p>}
      </Drawer>
    </div>
  );
};

const LoginForm = ({ onLogin }) => {
  const API_ACCOUNT = process.env.REACT_APP_WT_API_ACCOUNT;
  const API_USERNAME = process.env.REACT_APP_WT_API_USERNAME;
  const API_PASSWORD = process.env.REACT_APP_WT_API_PASSWORD;

  const classes = useStyles();

  const { setAuth } = React.useContext(AuthContext);

  const onSubmit = async (event) => {
    event.preventDefault();
    const auth = {
      username: `${account}\\${username}`,
      password: password,
    };
    setAuth(auth);
    const response = await getData(auth);
    if (response.status === 200) {
      onLogin(auth);
    }
  };

  const [account, setAccount] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <form onSubmit={onSubmit} className={classes.form}>
      <TextField
        required
        label="Account Name"
        defaultValue={API_ACCOUNT}
        onInput={(e) => setAccount(e.target.value)}
      />

      <TextField
        required
        label="Username"
        defaultValue={API_USERNAME}
        onInput={(e) => setUsername(e.target.value)}
      />

      <TextField
        required
        type="password"
        label="Password"
        defaultValue={API_PASSWORD}
        onInput={(e) => setPassword(e.target.value)}
      />

      <Button type="submit">Login</Button>
    </form>
  );
};

export default TopNav;

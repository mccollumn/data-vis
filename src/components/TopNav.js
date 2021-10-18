import React, { useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import { useGetData } from "../services/wtData";
import { AuthContext, AuthProvider } from "../providers/AuthProvider";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";

const useStyles = makeStyles((theme) => ({
  root: { flexGrow: 1 },
  title: { flexGrow: 1 },
  form: { display: "grid", padding: "10px" },
  menuButton: { marginRight: theme.spacing(2) },
  formControl: {
    margin: theme.spacing(1),
  },
}));

export const TopNav = ({
  setProfile,
  profile,
  setReport,
  dates,
  setDates,
  trend,
  setTrend,
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
          <Login />
        </Toolbar>
      </AppBar>
      <Drawer variant="persistent" anchor="left" open={open}>
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
        <Divider />
        <DateSelection dates={dates} setDates={setDates} />
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
        <TrendSelection setTrend={setTrend} />
      </Drawer>
    </div>
  );
};

const DateSelection = ({ dates, setDates }) => {
  const handleChange = (name) => (date) => {
    setDates({
      ...dates,
      [name]: { date: date, dateStr: dates.createDateStr(date) },
    });
  };

  return (
    <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          label="Start Date"
          value={dates.startDate.date}
          variant="dialog"
          onChange={handleChange("startDate")}
          disableFuture={true}
          format="yyyy-MM-dd"
          showTodayButton={true}
        />
        <KeyboardDatePicker
          label="End Date"
          value={dates.endDate.date}
          variant="dialog"
          onChange={handleChange("endDate")}
          disableFuture={true}
          format="yyyy-MM-dd"
          showTodayButton={true}
        />
      </MuiPickersUtilsProvider>
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
    makeRequest({ params: { format: "json" }, profileID: profile.ID });
  }, [profile.ID, makeRequest]);

  const handleChange = (event, value) => {
    if (value === null) return;
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

const TrendSelection = ({ trend, setTrend }) => {
  const classes = useStyles();

  const handleChange = (event) => {
    setTrend(event.target.value);
  };

  return (
    <FormControl className={classes.formControl}>
      <InputLabel shrink>Trend</InputLabel>
      <Select value={trend} onChange={handleChange} defaultValue={"none"}>
        <MenuItem value={"none"}>None</MenuItem>
        <MenuItem value={"daily"}>Daily</MenuItem>
      </Select>
      <FormHelperText>Trend the table data</FormHelperText>
    </FormControl>
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

const LoginForm = () => {
  // Currently reading input values instead of updating onChange

  const API_ACCOUNT = process.env.REACT_APP_WT_API_ACCOUNT;
  const API_USERNAME = process.env.REACT_APP_WT_API_USERNAME;
  const API_PASSWORD = process.env.REACT_APP_WT_API_PASSWORD;

  const classes = useStyles();

  const { setAuth } = React.useContext(AuthContext);

  const { status, makeRequest } = useGetData();
  const [message, setMessage] = useState();
  const [userCreds, setUserCreds] = useState();

  React.useEffect(() => {
    if (!status) return;
    if (status === 200) {
      setMessage(<p>Login Successful</p>);
      setAuth(userCreds);
    } else {
      setMessage(<p>Login Failed</p>);
    }
  }, [setAuth, userCreds, status]);

  const onSubmit = async (event) => {
    event.preventDefault();

    const auth = {
      username: `${accountRef.current.value}\\${usernameRef.current.value}`,
      password: passwordRef.current.value,
    };

    // const auth = {
    //   username: `${account}\\${username}`,
    //   password: password,
    // };

    makeRequest({ creds: auth });
    setUserCreds(auth);
  };

  const accountRef = useRef("");
  const usernameRef = useRef("");
  const passwordRef = useRef("");

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
        inputRef={accountRef}
      />

      <TextField
        required
        label="Username"
        defaultValue={API_USERNAME}
        onInput={(e) => setUsername(e.target.value)}
        inputRef={usernameRef}
      />

      <TextField
        required
        type="password"
        label="Password"
        defaultValue={API_PASSWORD}
        onInput={(e) => setPassword(e.target.value)}
        inputRef={passwordRef}
      />

      <Button type="submit">Login</Button>
      <div>{message}</div>
    </form>
  );
};

export default TopNav;

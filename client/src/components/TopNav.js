import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import { FormControlLabel } from "@material-ui/core";
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
import { AuthContext } from "../providers/AuthProvider";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";

const useStyles = makeStyles((theme) => ({
  title: { flexGrow: 1 },
  form: { display: "grid", padding: "10px" },
  formField: { margin: theme.spacing(1) },
  menuButton: { marginRight: theme.spacing(2) },
  iconButton: { width: 40, marginLeft: 260 },
  formControl: {
    margin: theme.spacing(1),
    width: 300,
  },
  dates: { width: 300, margin: theme.spacing(1) },
  datePicker: { width: 300, marginTop: theme.spacing(1) },
  textField: { width: 300, margin: theme.spacing(1) },
  loginDrawer: {
    width: 250,
    margin: 10,
  },
  loginDemoSwitch: {
    width: 150,
    paddingLeft: 50,
  },
  loginMessage: {
    width: 200,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 20,
  },
  loginMessageSuccess: { color: "green" },
  loginMessageFail: { color: "red" },
}));

export const TopNav = ({
  setProfile,
  profile,
  report,
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
    <div>
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
        <IconButton onClick={handleDrawerClose} className={classes.iconButton}>
          <ChevronLeftIcon />
        </IconButton>
        <Divider />
        <DateSelection dates={dates} setDates={setDates} auth={auth} />
        <ProfileReportList
          auth={auth}
          profile={profile}
          report={report}
          setProfile={setProfile}
          setReport={setReport}
        />
        <ProfileReportList
          auth={auth}
          profile={profile}
          report={report}
          isReport={true}
          setProfile={setProfile}
          setReport={setReport}
        />
        <TrendSelection trend={trend} setTrend={setTrend} auth={auth} />
      </Drawer>
    </div>
  );
};

const DateSelection = ({ dates, setDates, auth }) => {
  const classes = useStyles();

  const handleChange = (name) => (date) => {
    setDates({
      ...dates,
      [name]: { date: date, dateStr: dates.createDateStr(date) },
    });
  };

  return (
    <div className={classes.dates}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          className={classes.datePicker}
          label="Start Date"
          value={dates.startDate.date}
          variant="dialog"
          onChange={handleChange("startDate")}
          disableFuture={true}
          format="yyyy-MM-dd"
          showTodayButton={true}
          disabled={!auth && true}
        />
        <KeyboardDatePicker
          className={classes.datePicker}
          label="End Date"
          value={dates.endDate.date}
          variant="dialog"
          onChange={handleChange("endDate")}
          disableFuture={true}
          format="yyyy-MM-dd"
          showTodayButton={true}
          disabled={!auth && true}
        />
      </MuiPickersUtilsProvider>
    </div>
  );
};

const ProfileReportList = ({
  profile = {},
  report = {},
  auth,
  isReport,
  setProfile,
  setReport,
}) => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [defaultValue, setDefaultValue] = React.useState();
  const { response: options = [], loading, makeRequest } = useGetData();

  React.useEffect(() => {
    if (!options.length) return;
    if (isReport) {
      const reportOption = options.find((o) => o.ID === report.ID);
      setDefaultValue(reportOption);
    } else {
      const profileOption = options.find((o) => o.ID === profile.ID);
      setDefaultValue(profileOption);
    }
  }, [profile.ID, report.ID, options, isReport]);

  React.useEffect(() => {
    makeRequest({
      params: { format: "json" },
      profileID: isReport ? profile.ID : "",
    });
  }, [profile.ID, isReport, makeRequest]);

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
      value={defaultValue || null}
      renderInput={(params) => (
        <TextField
          {...params}
          className={classes.textField}
          label={isReport ? "Reports" : "Profiles"}
          variant="standard"
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

const TrendSelection = ({ trend, setTrend, auth }) => {
  const classes = useStyles();

  const handleChange = (event) => {
    setTrend(event.target.value);
  };

  return (
    <FormControl className={classes.formControl} disabled={!auth && true}>
      <InputLabel shrink>Trend</InputLabel>
      <Select value={trend} onChange={handleChange} defaultValue={trend}>
        <MenuItem value={"none"}>None</MenuItem>
        <MenuItem value={"daily"}>Daily</MenuItem>
      </Select>
      <FormHelperText>Trend the table data</FormHelperText>
    </FormControl>
  );
};

const Login = () => {
  const classes = useStyles();

  const { setAuth, demoMode, setDemoMode } = React.useContext(AuthContext);
  const [openLogin, setOpenLogin] = React.useState(false);

  const toggleDrawer = () => {
    setOpenLogin(!openLogin);
  };

  const handleDemoChange = (event) => {
    setDemoMode(event.target.checked);
    setAuth(event.target.checked ? { demoMode: true } : null);
  };
  const demoDescription = (
    <div>
      <p>
        Demo mode allows you to explore the interface even if you don't have
        Webtrends credentials.
      </p>
      <p>Limitations:</p>
      <ul>
        <li>
          The date range is static. Selecting dates has no effect on the demo
          data.
        </li>
        <li>Clicking a cell in the table will not update the trend graph.</li>
        <li>
          The demo data isn't real, so the trend graphs are rather boring.
        </li>
      </ul>
    </div>
  );

  return (
    <div>
      <Button onClick={toggleDrawer}>Login</Button>
      <Drawer
        className={classes.loginDrawer}
        anchor="right"
        variant="temporary"
        open={openLogin}
        onClose={toggleDrawer}
      >
        <div className={classes.loginDrawer}>
          <FormControlLabel
            className={classes.loginDemoSwitch}
            control={
              <Switch
                checked={demoMode}
                onChange={handleDemoChange}
                color="primary"
              />
            }
            label="Demo Mode"
          />
          {demoMode ? demoDescription : <LoginForm />}
        </div>
      </Drawer>
    </div>
  );
};

const LoginForm = () => {
  const API_ACCOUNT = process.env.REACT_APP_WT_API_ACCOUNT;
  const API_USERNAME = process.env.REACT_APP_WT_API_USERNAME;
  const API_PASSWORD = process.env.REACT_APP_WT_API_PASSWORD;

  const classes = useStyles();

  const { setAuth } = React.useContext(AuthContext);

  const { status, makeRequest } = useGetData();
  const [message, setMessage] = React.useState();
  const [userCreds, setUserCreds] = React.useState();

  React.useEffect(() => {
    if (!status) return;
    const loginSuccessMessage = () => {
      return <p className={classes.loginMessageSuccess}>Login Successful</p>;
    };
    const loginFailMessage = () => {
      return <p className={classes.loginMessageFail}>Login Failed</p>;
    };

    if (status === 200) {
      setMessage(loginSuccessMessage);
      setAuth(userCreds);
      return;
    }
    setMessage(loginFailMessage);
  }, [
    setAuth,
    userCreds,
    status,
    classes.loginMessageSuccess,
    classes.loginMessageFail,
  ]);

  const onSubmit = async (event) => {
    event.preventDefault();

    const auth = {
      username: `${accountRef.current.value}\\${usernameRef.current.value}`,
      password: passwordRef.current.value,
    };

    makeRequest({ creds: auth });
    setUserCreds(auth);
  };

  const accountRef = React.useRef("");
  const usernameRef = React.useRef("");
  const passwordRef = React.useRef("");

  return (
    <form onSubmit={onSubmit} className={classes.form}>
      <TextField
        className={classes.formField}
        required
        label="Account Name"
        defaultValue={API_ACCOUNT}
        inputRef={accountRef}
      />

      <TextField
        className={classes.formField}
        required
        label="Username"
        defaultValue={API_USERNAME}
        inputRef={usernameRef}
      />

      <TextField
        className={classes.formField}
        required
        type="password"
        label="Password"
        defaultValue={API_PASSWORD}
        inputRef={passwordRef}
      />

      <Button type="submit">Login</Button>
      <div className={classes.loginMessage}>{message}</div>
    </form>
  );
};

export default TopNav;

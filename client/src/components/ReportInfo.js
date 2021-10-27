import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  reportInfo: {
    marginTop: 20,
  },
}));

const ReportInfo = ({ report }) => {
  const classes = useStyles();

  return <div className={classes.reportInfo}>{report?.name}</div>;
};

export default ReportInfo;

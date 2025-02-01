import React, { useEffect } from 'react';
import { makeStyles, Tabs, Tab, Box } from '@material-ui/core';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  }
}));

const TabsLayout = ({
  tabs = [],
  defaultTab = 0,
  setDefaultTab,
  ...others
}) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(defaultTab);

  useEffect(() => {
    setValue(defaultTab);
  }, [defaultTab]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    typeof setDefaultTab === 'function' && setDefaultTab(newValue);
  };
  return (
    <div className={classes.root}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        {...others}
      >
        {tabs.map((tab, index) => {
          return <Tab key={index} label={tab.label} />;
        })}
      </Tabs>
      {tabs.map((tab, index) => {
        return (
          <TabPanel key={index} value={value} index={index}>
            {tab.content}
          </TabPanel>
        );
      })}
    </div>
  );
};
export default TabsLayout;

import { Paper } from '@mui/material';

import styles from './Box.module.css';

const p = { marign: "20px auto" };

function Box(props) {
  const { children } = props;
  return (
    <Paper className={styles.box} elevation={3} style={p}>
      {children}
    </Paper>
  );
}

export default Box; 
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  table: {
    height: '100%',
    width: '100%',
  },
  firstrow: {
    borderBottom: 'none',
    borderRight: '1px solid #e0e0e0',
    height: theme.spacing(2),
  },
  cell: {
    borderRight: '1px solid #e0e0e0',
  },
  lastcell: {
    border: 'none',
  },
  lastcellwidth: {
    width: theme.spacing(4),
  },
  xlabel: {
    borderBottom: 'none',
    transform: 'translateX(-50%)',
    textAlign: 'center',
    padding: 0,
    position: 'absolute',
  },
  ylabel: {
    borderBottom: 'none',
    textAlign: 'right',
    transform: 'translateY(40%)',
    width: theme.spacing(4),
    padding: 0,
  },
  headerrow: {
    height: theme.spacing(4),
  },
  point: {
    height: theme.spacing(1),
    width: theme.spacing(1),
    transform: 'translate(-50%, 0)',
  },
  line: {
    transformOrigin: 'top left',
  },
}));

export default (function SimpleGraph(props) {
  const {
    yLabels,
    yTitle,
    xLabels,
    xTitle,
    points,
    color,
    height,
    width,
    numLines,
  } = props;
  const classes = useStyles();
  var labels = [];
  var max = numLines || 10;
  var factor = 1;
  while (Math.floor(xLabels.length / factor) > max && factor <= xLabels.length) {
    factor++;
  }
  xLabels.forEach((xLabel, idx) => {
    if ((xLabels.length - idx - 1) % factor === 0) {
      labels.push(xLabel);
    }
  });
  return (
    <>
      <Typography variant="h6" color="textPrimary" paragraph={true}>{yTitle}</Typography>
      <Box position="relative" height={height} width={width}>
        <Table className={classes.table}>
          <TableBody>
            {yLabels.map((yLabel, rowIdx) => (
              <TableRow className={rowIdx === 0 ? classes.headerrow : ''}>
                <TableCell className={[classes.ylabel, rowIdx === 0 ? classes.firstrow : classes.cell].join(' ')}>{yLabel}</TableCell>
                {labels.map((xLabel, idx) => (
                  <TableCell className={[idx === labels.length - 1 ? classes.lastcell : '', idx === labels.length - 1 && labels.length > 1 ? classes.lastcellwidth : '', rowIdx === 0 ? classes.firstrow : classes.cell].join(' ')}> </TableCell>
                ))}
              </TableRow>
            ))}
            <TableRow className={classes.headerrow}>
              <TableCell className={[classes.xlabel].join(' ')}> </TableCell>
              {labels.map((xLabel, idx) => (
                <TableCell className={[classes.xlabel].join(' ')} style={{ left: idx / (Math.max(labels.length, 2) - 1) * (width - 12 * 8) + 32 }}>{xLabel}</TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
        {(points || []).map((point, idx) => {
          var lw = 0;
          var lr = 0;
          var lh = 0;
          var ld = 0;
          if (points && idx < points.length - 1) {
            lw = (points[idx+1][0] - point[0]) / 100 * (width - 12 * 8);
            lh = (points[idx+1][1] - point[1]) / 100 * (height - 12 * 8);
            ld = Math.sqrt(lw*lw + lh*lh);
            lr = (lh > 0 ? '-' : '') + Math.acos(lw / ld);
          }
          return (
            <>
              <Box
                className={classes.point}
                position="absolute"
                pl={4}
                pb={4}
                left={`${point[0] / 100 * (width - 12 * 8) + 16}px`}
                bottom={`${point[1] / 100 * (height - 12 * 8) - 4}px`}>
                <svg>
                  <circle fill={color} cx="4" cy="4" r="4"></circle>
                </svg>
              </Box>
              {ld
                ? <Box
                    className={classes.line}
                    position="absolute"
                    borderTop={`3px solid ${color}`}
                    pb={4}
                    left={`${point[0] / 100 * (width - 12 * 8) + 32}px`}
                    bottom={`${point[1] / 100 * (height - 12 * 8) - 4}px`}
                    width={ld+'px'}
                    style={{ transform: `rotate(${lr}rad)` }}
                    height="3px">
                  </Box>
                : null}
            </>
          );
        })}
      </Box>
      <Typography variant="h6" color="textPrimary">{xTitle}</Typography>
    </>
  );
});

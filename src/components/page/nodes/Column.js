import React from 'react';
import Grid from '@material-ui/core/Grid';
import PageNodes from 'src/components/page/nodes/PageNodes';

export default (function Column(props) {
  const { node } = props;
  return (
    <Grid data-key={node.id} item xs={parseInt(node.data.width || 12)}>
      <PageNodes nodes={node.children} />
    </Grid>
  );
});

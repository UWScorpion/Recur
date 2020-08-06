import React from 'react';
import Grid from '@material-ui/core/Grid';
import PageNodes from 'src/components/page/nodes/PageNodes';

export default (function ContentSection(props) {
  const { node } = props;
  return (
    <Grid data-key={node.id} container direction="row" justify="flex-start" alignItems="flex-start" spacing={3}>
      <PageNodes nodes={node.children} />
    </Grid>
  );
});

import React, { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import PageNodes from 'src/components/page/nodes/PageNodes';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { customQuery } from 'src/utils/API/queryAPI';
import { IDContext } from 'src/utils/Context';

export default (function Section(props) {
  const { node } = props;
  const context = useContext(IDContext);
  const selectedFormData = useSelector(state => state.selectedFormData);
  const [isCollapsed, setIsCollapsed] = useState(!!node.data.collapsed);

  useEffect(() => {
    setIsCollapsed(!!node.data.collapsed);
  }, [node]);

  const toggleForm = () => {
    if (context && isCollapsed) {
      customQuery('/custom/log', {
        type: 'Help',
        action: 'Expand',
        context: context,
        id: node.id,
        name: node.data.name,
      }).then();
    }
    setIsCollapsed(!isCollapsed);
  };

  return (
    <ExpansionPanel data-key={node.id} square expanded={!isCollapsed} onChange={() => toggleForm()} style={{ width: '100%' }}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        {node.data.title}
      </ExpansionPanelSummary>
      <ExpansionPanelDetails style={{ display: 'block' }}>
        <PageNodes nodes={node.children} />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
});

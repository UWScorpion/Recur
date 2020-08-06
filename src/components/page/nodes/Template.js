import React, { useState, useEffect } from 'react';
import { readQuery } from 'src/utils/API/queryAPI';
import validate from 'uuid-validate';
import parseData from 'src/utils/conversionCode.js';
import PageNodes from 'src/components/page/nodes/PageNodes';

export default (function Template(props) {
  const { node } = props;
  const [block, setBlock] = useState(null);

  useEffect(() => {
    var id = node?.data?.template_id;
    if (id && validate(id)) {
      readQuery(`project_block(id:"${id}")`).then(res => {
        var blocks = Object.values(res?.data?.objects || {}).filter(o => o.type === 'project_block');
        if (blocks.length === 1) {
          setBlock(blocks.pop());
        } else {
          setBlock({ data: { text: 'INVALID TEMPLATE' } });
        }
      });
    } else {
      setBlock({ data: { text: 'INVALID TEMPLATE' } });
    }
  }, [node]);

  if (!block) {
    return null;
  }
  var root = parseData(block.data.text || '', block.data.blocks || {}, node.context);
  return <PageNodes nodes={root} />;
});

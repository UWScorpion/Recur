import React from 'react';
import { useSelector } from 'react-redux';
import File from 'src/components/page/nodes/File';
import Fitb from 'src/components/page/nodes/Fitb';
import Multiple from 'src/components/page/nodes/Multiple';
import Codeblock from 'src/components/page/nodes/Codeblock';
import Choicebank from 'src/components/page/nodes/Choicebank';
import Video from 'src/components/page/nodes/Video';
import Image from 'src/components/page/nodes/Image';
import PageText from 'src/components/page/nodes/PageText';
import Submission from 'src/components/page/nodes/Submission';
import Project from 'src/components/page/nodes/Project';
import Section from 'src/components/page/nodes/Section';
import SubmitForm from 'src/components/page/nodes/SubmitForm';
import Freetext from 'src/components/page/nodes/Freetext';
import SpecialText from 'src/components/page/nodes/SpecialText';
import Slider from 'src/components/page/nodes/Slider';
import Break from 'src/components/page/nodes/Break';
import Column from 'src/components/page/nodes/Column';
import ContentSection from 'src/components/page/nodes/ContentSection';
import ContentBox from 'src/components/page/nodes/ContentBox';
import ExternalLink from 'src/components/page/nodes/ExternalLink';
import Template from 'src/components/page/nodes/Template';

const CMAP = {
  file: File,
  fitb: Fitb,
  multiple: Multiple,
  slider: Slider,
  codeblock: Codeblock,
  choicebank: Choicebank,
  video: Video,
  image: Image,
  text: PageText,
  submission: Submission,
  project: Project,
  section: Section,
  submitform: SubmitForm,
  freetext: Freetext,
  specialtext: SpecialText,
  'break': Break,
  column: Column,
  contentsection: ContentSection,
  contentbox: ContentBox,
  externallink: ExternalLink,
  template: Template,
};

export default (function PageNodes(props) {
  const selectedPage = useSelector(state => state.selectedPage);
  return (props.nodes || []).map(node => {
      var key = (props.unique || selectedPage?.id) + '_' + node.id + '_main';
      if (node.type in CMAP) {
        const Tag = CMAP[node.type];
        const props = { key: key, node: node };
        return <Tag {...props} />;
      } else {
        return <span key={key}>Unknown component {node.type}</span>;
      }
  });
});

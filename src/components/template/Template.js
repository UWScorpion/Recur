import React, { Component } from 'react';

class Template extends Component {

  componentDidMount() {
    this.refs.iframe.addEventListener('load', function() {
      this.style.height = this.contentWindow.document.body.scrollHeight + 'px';
    });
  }

	render() {
    var template = this.props.match?.params?.templateName;
		return (
      <iframe ref="iframe" style={{ border: 'none', outline: 'none' }} src={`/content/${template}.html`} />
		)
	}
}

export default Template;

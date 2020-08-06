import React, { Component } from 'react';
import { uploadQuery } from 'src/utils/API/queryAPI';

class FileUploader extends Component {

    onChange(event) {
      uploadQuery(event.target.files).then(res => {
        for (var id in res.data.objects) {
          alert(id);
        }
      });
    }

    render() {
      return (
        <input type="file" name="file" onChange={this.onChange.bind(this)} />
      );
    }
}

export default FileUploader

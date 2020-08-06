var TEXT_COUNT = 0;

export default function parseData(text, blocks, context) {
  return _parseData(text || '', blocks || {}, context || {}, {}, {});
}

function _checkTextForContext(text, blocks, context, seen, templates) {
  if (typeof text !== 'string') {
    return text;
  }
  var root = _parseData(text, blocks, context, seen, templates);
  var out = '';
  var s = root;
  while (s.length > 0) {
    var curr = s.pop();
    if (curr.type !== 'text') {
      return text;
    }
    out += (curr.data.text || '');
    for (var ii = curr.children.length - 1; ii >= 0; ii--) {
      s.push(curr.children[ii]);
    }
  }
  return out;
}

function _parseData(text, blocks, context, seen, templates) {
  // extract custom tag format from text, e.g. <{Tag name="value"}>
  // result will be array of tokens, where a token is a normal text string or a
  // custom tag as a raw string.
  var text_pieces = [];
  var index = 0;
  var buffer_pieces = [];
  var found_tag = false;
  while (index < text.length) {
    var next = text.indexOf('<');
    if (next === -1 ) {
      index = text.length;
      buffer_pieces.push(text);
    } else {
      if (next !== 0) {
        buffer_pieces.push(text.substring(0, next));
      }
      text = text.substring(next);
      var end = text.indexOf('>');
      if (end === -1 || text.length <= 2) {
        buffer_pieces.push(text);
        text = '';
        index = 0;
      } else {
        found_tag = true;
        var test_end = text.substring(1).indexOf('<');
        if (test_end !== -1 && test_end < end) {
          end = test_end;
          found_tag = false;
        }
        var temp_piece = text.substring(0, end + 1);
        if (found_tag && (temp_piece.includes(' ') || !temp_piece.includes('_'))) {
          found_tag = false;
        }
        buffer_pieces.push(temp_piece);
        text = text.substring(end + 1);
        index = 0;
      }
    }
    if (found_tag) {
      buffer_pieces.forEach(b => text_pieces.push(b));
    } else {
      var addition = buffer_pieces.join('');
      if (text_pieces.length === 0) {
        text_pieces.push(addition);
      } else {
        var previous = text_pieces[text_pieces.length - 1];
        if (previous[0] === '<' &&
            previous[previous.length -1] === '>' &&
            !previous.includes(' ') &&
            previous.includes('_')) {
          text_pieces[text_pieces.length - 1] = text_pieces[text_pieces.length - 1] + addition;
        } {
          text_pieces.push(addition);
        }
      }
    }
    buffer_pieces = [];
    found_tag = false;
  }

  return text_pieces.map((token) => {
    var piece = '';
    if (token.startsWith('<') && token.indexOf('>') !== -1) {
      var end_of_tag = token.indexOf('>');
      var original_token = token;
      token = token.substring(1, end_of_tag);
      var type = null;
      if (token.includes('id=')) {
        type = token.split(' ')[0];
        token = type + '_' + token.split('id="')[1].slice(0, -1);
      } else if (token.includes('_')) {
        type = token.split('_')[0];
      }
      if (token in seen) {
        return {
          id: 'error_'+Math.random(),
          type: 'text',
          data: { text: original_token },
          children: []
        };
      } else {
        seen[token] = true;
      }
      var attributes = (blocks || {})[token] || {};
      var component = null;
      switch (type) {
        case 'template':
          var template_id = attributes.template_id || '';
          if (template_id in templates) {
            component = {
              id: 'error_'+Math.random(),
              type: 'text',
              data: { text: 'RECURSIVE TEMPLATES' },
              children: [],
              context: context,
            };
          } else {
            templates[template_id] = true;
            component = {
              id: token,
              type: type,
              data: attributes,
              children: [],
              context: context,
            };
          }
          break;
        case 'externallink':
        case 'specialtext':
          var copy = {};
          for (var key in attributes) {
            copy[key] = _checkTextForContext(attributes[key], blocks, context, seen, templates);
          }
          component = {
            id: token,
            type: type,
            data: copy,
            children: [],
            context: context,
          };
          break;
        case 'file':
        case 'video':
        case 'image':
        case 'fitb':
        case 'submission':
        case 'project':
        case 'submitform':
        case 'freetext':
        case 'slider':
        case 'break':
          component = {
            id: token,
            type: type,
            data: attributes,
            children: [],
            context: context,
          };
          break;
        case 'column':
        case 'contentbox':
        case 'contentsection':
        case 'section':
        case 'codeblock':
          var text = String(attributes.text || '');
          var copy = Object.assign({}, attributes);
          delete copy['text'];
          component = {
            id: token,
            type: type,
            data: copy,
            children: _parseData(text, blocks, context, seen, templates),
            context: context,
          };
          break;
        case 'multiple':
        case 'choicebank':
          var copy = Object.assign({}, attributes);
          delete copy.choices;
          component = {
            id: token,
            type: type,
            data: copy,
            children: (attributes.choices || []).map((choice, key) => {
              return {
                id: token+'_'+key,
                type: type+'choice',
                data: { key: key, value: choice.text },
                children: _parseData(choice?.text || '', blocks, context, seen, templates),
                context: context,
              };
            })
          };
          break;
        default:
          component = {
            id: token,
            type: 'text',
            data: { text: original_token },
            children: [],
            context: context,
          };
          break;
      }
      piece = component;
    } else {
      var buffer = '';
      var inside_code = null;
      var parts = [];
      for (var ii = 0; ii < token.length; ii++) {
        if (token[ii] === '\\' &&
            (token[ii+1] === '[' ||
             token[ii+1] === ']' ||
             token[ii+1] === '}' ||
             token[ii+1] === '`' ||
             token[ii+1] === '*' ||
             (token[ii+1] === '$' && token[ii+2] === '{') ||
             (token[ii+1] === '*' && token[ii+2] === '*'))) {
          ii++;
          buffer = buffer + token[ii];
        } else if (
          (!inside_code && token[ii] === '[') ||
          (inside_code && token[ii] === ']') ||
          (inside_code && token[ii] === '}') ||
          token[ii] === '`' ||
          token[ii] === '*' ||
          (token[ii] === '$' && token[ii+1] === '{') ||
          (token[ii] === '*' && token[ii+1] === '*')) {
          if (inside_code) {
            var component = null;
            if (token[ii] === '`') {
              parts.push({
                id: 'text_'+(TEXT_COUNT++),
                type: 'text',
                data: { style: 'code', text: buffer },
                children: []
              });
            } else if (token[ii] === '*') {
              if (token[ii+1] === '*') {
                  parts.push({
                    id: 'text_'+(TEXT_COUNT++),
                    type: 'text',
                    data: { style: 'bold', text: buffer },
                    children: []
                  });
                } else {
                  parts.push({
                    id: 'text_'+(TEXT_COUNT++),
                    type: 'text',
                    data: { style: 'italic', text: buffer },
                    children: []
                  });
                }
            } else if (token[ii] === ']') {
              var check_url = buffer.split(' ')[0];
              if (check_url.match(new RegExp(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi))) {
                parts.push({
                  id: 'text_'+(TEXT_COUNT++),
                  type: 'text',
                  data: { style: 'link', text: buffer },
                  children: [],
                });
              } else {
                parts.push({
                  id: 'text_'+(TEXT_COUNT++),
                  type: 'text',
                  data: { text: '['+buffer+']' },
                  children: [],
                });
              }
            } else if (token[ii] === '}') {
              parts.push({
                id: 'text_'+(TEXT_COUNT++),
                type: 'text',
                data: { text: (context.viewer_data || {})[buffer] || (context.data || {})[buffer] || ('${'+buffer+'}') },
                children: [],
              });
            }
            buffer = '';
            inside_code = null;
          } else {
            if (buffer.length > 0) {
              parts.push({
                id: 'text_'+(TEXT_COUNT++),
                type: 'text',
                data: { text: buffer },
                children: []
              });
            }
            buffer = '';
            inside_code = token[ii];
          }
          if (token[ii] === '*' && token[ii+1] === '*') {
            ii++;
          }
          if (token[ii] === '$' && token[ii+1] === '{') {
            ii++;
          }
        } else {
          buffer = buffer + token[ii];
        }
      }
      if (inside_code) {
        parts.push({
          id: 'text_'+(TEXT_COUNT++),
          type: 'text',
          data: { text: inside_code },
          children: []
        });
        inside_code = null;
      }
      if (buffer.length > 0) {
        parts.push({
          id: 'text_'+(TEXT_COUNT++),
          type: 'text',
          data: { text: buffer },
          children: []
        });
      }
      if (parts.length === 1) {
        piece = parts[0];
      } else {
        piece = {
          id: 'text_'+(TEXT_COUNT++),
          type: 'text',
          data: {},
          children: parts
        };
      }
    }
    return piece;
  });
}

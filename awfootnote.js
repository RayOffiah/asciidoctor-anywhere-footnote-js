/**
 * This file was generated from awfootnote.peg
 * See https://canopy.jcoglan.com/ for documentation
 */

(function () {
  'use strict';

  function TreeNode (text, offset, elements) {
    this.text = text;
    this.offset = offset;
    this.elements = elements;
  }

  TreeNode.prototype.forEach = function (block, context) {
    for (var el = this.elements, i = 0, n = el.length; i < n; i++) {
      block.call(context, el[i], i, el);
    }
  };

  if (typeof Symbol !== 'undefined' && Symbol.iterator) {
    TreeNode.prototype[Symbol.iterator] = function () {
      return this.elements[Symbol.iterator]();
    };
  }

  var TreeNode1 = function (text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['block_id'] = elements[1];
    this['id'] = elements[1];
    this['parameter_list'] = elements[3];
  };
  inherit(TreeNode1, TreeNode);

  var TreeNode2 = function (text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['quote'] = elements[3];
    this['ref_id'] = elements[2];
    this['refid'] = elements[2];
  };
  inherit(TreeNode2, TreeNode);

  var FAILURE = {};

  var Grammar = {
    _read_document () {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._document = this._cache._document || {};
      var cached = this._cache._document[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = [], address1 = null;
      while (true) {
        var index2 = this._offset;
        address1 = this._read_footnote();
        if (address1 === FAILURE) {
          this._offset = index2;
          address1 = this._read_content();
          if (address1 === FAILURE) {
            this._offset = index2;
          }
        }
        if (address1 !== FAILURE) {
          elements0.push(address1);
        } else {
          break;
        }
      }
      if (elements0.length >= 0) {
        address0 = new TreeNode(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      } else {
        address0 = FAILURE;
      }
      this._cache._document[index0] = [address0, this._offset];
      return address0;
    },

    _read_content () {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._content = this._cache._content || {};
      var cached = this._cache._content[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = [], address1 = null;
      while (true) {
        var index2 = this._offset, elements1 = new Array(2);
        var address2 = FAILURE;
        var index3 = this._offset;
        address2 = this._read_footnote();
        this._offset = index3;
        if (address2 === FAILURE) {
          address2 = new TreeNode(this._input.substring(this._offset, this._offset), this._offset, []);
          this._offset = this._offset;
        } else {
          address2 = FAILURE;
        }
        if (address2 !== FAILURE) {
          elements1[0] = address2;
          var address3 = FAILURE;
          if (this._offset < this._inputSize) {
            address3 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset, []);
            this._offset = this._offset + 1;
          } else {
            address3 = FAILURE;
            if (this._offset > this._failure) {
              this._failure = this._offset;
              this._expected = [];
            }
            if (this._offset === this._failure) {
              this._expected.push(['awfootnote::content', '<any char>']);
            }
          }
          if (address3 !== FAILURE) {
            elements1[1] = address3;
          } else {
            elements1 = null;
            this._offset = index2;
          }
        } else {
          elements1 = null;
          this._offset = index2;
        }
        if (elements1 === null) {
          address1 = FAILURE;
        } else {
          address1 = new TreeNode(this._input.substring(index2, this._offset), index2, elements1);
          this._offset = this._offset;
        }
        if (address1 !== FAILURE) {
          elements0.push(address1);
        } else {
          break;
        }
      }
      if (elements0.length >= 1) {
        address0 = new TreeNode(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      } else {
        address0 = FAILURE;
      }
      this._cache._content[index0] = [address0, this._offset];
      return address0;
    },

    _read_footnote () {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._footnote = this._cache._footnote || {};
      var cached = this._cache._footnote[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(5);
      var address1 = FAILURE;
      var chunk0 = null, max0 = this._offset + 11;
      if (max0 <= this._inputSize) {
        chunk0 = this._input.substring(this._offset, max0);
      }
      if (chunk0 === 'awfootnote:') {
        address1 = new TreeNode(this._input.substring(this._offset, this._offset + 11), this._offset, []);
        this._offset = this._offset + 11;
      } else {
        address1 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push(['awfootnote::footnote', '"awfootnote:"']);
        }
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        address2 = this._read_id();
        if (address2 !== FAILURE) {
          elements0[1] = address2;
          var address3 = FAILURE;
          var chunk1 = null, max1 = this._offset + 1;
          if (max1 <= this._inputSize) {
            chunk1 = this._input.substring(this._offset, max1);
          }
          if (chunk1 === '[') {
            address3 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset, []);
            this._offset = this._offset + 1;
          } else {
            address3 = FAILURE;
            if (this._offset > this._failure) {
              this._failure = this._offset;
              this._expected = [];
            }
            if (this._offset === this._failure) {
              this._expected.push(['awfootnote::footnote', '"["']);
            }
          }
          if (address3 !== FAILURE) {
            elements0[2] = address3;
            var address4 = FAILURE;
            address4 = this._read_parameter_list();
            if (address4 !== FAILURE) {
              elements0[3] = address4;
              var address5 = FAILURE;
              var chunk2 = null, max2 = this._offset + 1;
              if (max2 <= this._inputSize) {
                chunk2 = this._input.substring(this._offset, max2);
              }
              if (chunk2 === ']') {
                address5 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset, []);
                this._offset = this._offset + 1;
              } else {
                address5 = FAILURE;
                if (this._offset > this._failure) {
                  this._failure = this._offset;
                  this._expected = [];
                }
                if (this._offset === this._failure) {
                  this._expected.push(['awfootnote::footnote', '"]"']);
                }
              }
              if (address5 !== FAILURE) {
                elements0[4] = address5;
              } else {
                elements0 = null;
                this._offset = index1;
              }
            } else {
              elements0 = null;
              this._offset = index1;
            }
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = this._actions.store_footnote(this._input, index1, this._offset, elements0);
        this._offset = this._offset;
      }
      this._cache._footnote[index0] = [address0, this._offset];
      return address0;
    },

    _read_id () {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._id = this._cache._id || {};
      var cached = this._cache._id[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = [], address1 = null;
      while (true) {
        var chunk0 = null, max0 = this._offset + 1;
        if (max0 <= this._inputSize) {
          chunk0 = this._input.substring(this._offset, max0);
        }
        if (chunk0 !== null && /^[^\[]/.test(chunk0)) {
          address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset, []);
          this._offset = this._offset + 1;
        } else {
          address1 = FAILURE;
          if (this._offset > this._failure) {
            this._failure = this._offset;
            this._expected = [];
          }
          if (this._offset === this._failure) {
            this._expected.push(['awfootnote::id', '[^\\[]']);
          }
        }
        if (address1 !== FAILURE) {
          elements0.push(address1);
        } else {
          break;
        }
      }
      if (elements0.length >= 1) {
        address0 = new TreeNode(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      } else {
        address0 = FAILURE;
      }
      this._cache._id[index0] = [address0, this._offset];
      return address0;
    },

    _read_parameter_list () {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._parameter_list = this._cache._parameter_list || {};
      var cached = this._cache._parameter_list[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset;
      address0 = this._read_textParameter();
      if (address0 === FAILURE) {
        this._offset = index1;
        address0 = this._read_refIdParameter();
        if (address0 === FAILURE) {
          this._offset = index1;
        }
      }
      this._cache._parameter_list[index0] = [address0, this._offset];
      return address0;
    },

    _read_refIdParameter () {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._refIdParameter = this._cache._refIdParameter || {};
      var cached = this._cache._refIdParameter[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(4);
      var address1 = FAILURE;
      var chunk0 = null, max0 = this._offset + 6;
      if (max0 <= this._inputSize) {
        chunk0 = this._input.substring(this._offset, max0);
      }
      if (chunk0 === 'refid=') {
        address1 = new TreeNode(this._input.substring(this._offset, this._offset + 6), this._offset, []);
        this._offset = this._offset + 6;
      } else {
        address1 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push(['awfootnote::refIdParameter', '"refid="']);
        }
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        address2 = this._read_quote();
        if (address2 !== FAILURE) {
          elements0[1] = address2;
          var address3 = FAILURE;
          address3 = this._read_refid();
          if (address3 !== FAILURE) {
            elements0[2] = address3;
            var address4 = FAILURE;
            address4 = this._read_quote();
            if (address4 !== FAILURE) {
              elements0[3] = address4;
            } else {
              elements0 = null;
              this._offset = index1;
            }
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = this._actions.get_ref_id(this._input, index1, this._offset, elements0);
        this._offset = this._offset;
      }
      this._cache._refIdParameter[index0] = [address0, this._offset];
      return address0;
    },

    _read_textParameter () {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._textParameter = this._cache._textParameter || {};
      var cached = this._cache._textParameter[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = [], address1 = null;
      while (true) {
        var index2 = this._offset, elements1 = new Array(2);
        var address2 = FAILURE;
        var index3 = this._offset;
        address2 = this._read_refIdParameter();
        this._offset = index3;
        if (address2 === FAILURE) {
          address2 = new TreeNode(this._input.substring(this._offset, this._offset), this._offset, []);
          this._offset = this._offset;
        } else {
          address2 = FAILURE;
        }
        if (address2 !== FAILURE) {
          elements1[0] = address2;
          var address3 = FAILURE;
          var chunk0 = null, max0 = this._offset + 1;
          if (max0 <= this._inputSize) {
            chunk0 = this._input.substring(this._offset, max0);
          }
          if (chunk0 !== null && /^[^\]]/.test(chunk0)) {
            address3 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset, []);
            this._offset = this._offset + 1;
          } else {
            address3 = FAILURE;
            if (this._offset > this._failure) {
              this._failure = this._offset;
              this._expected = [];
            }
            if (this._offset === this._failure) {
              this._expected.push(['awfootnote::textParameter', '[^\\]]']);
            }
          }
          if (address3 !== FAILURE) {
            elements1[1] = address3;
          } else {
            elements1 = null;
            this._offset = index2;
          }
        } else {
          elements1 = null;
          this._offset = index2;
        }
        if (elements1 === null) {
          address1 = FAILURE;
        } else {
          address1 = new TreeNode(this._input.substring(index2, this._offset), index2, elements1);
          this._offset = this._offset;
        }
        if (address1 !== FAILURE) {
          elements0.push(address1);
        } else {
          break;
        }
      }
      if (elements0.length >= 1) {
        address0 = this._actions.get_text_parameter(this._input, index1, this._offset, elements0);
        this._offset = this._offset;
      } else {
        address0 = FAILURE;
      }
      this._cache._textParameter[index0] = [address0, this._offset];
      return address0;
    },

    _read_refid () {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._refid = this._cache._refid || {};
      var cached = this._cache._refid[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = [], address1 = null;
      while (true) {
        var chunk0 = null, max0 = this._offset + 1;
        if (max0 <= this._inputSize) {
          chunk0 = this._input.substring(this._offset, max0);
        }
        if (chunk0 !== null && /^[^\']/.test(chunk0)) {
          address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset, []);
          this._offset = this._offset + 1;
        } else {
          address1 = FAILURE;
          if (this._offset > this._failure) {
            this._failure = this._offset;
            this._expected = [];
          }
          if (this._offset === this._failure) {
            this._expected.push(['awfootnote::refid', '[^\\\']']);
          }
        }
        if (address1 !== FAILURE) {
          elements0.push(address1);
        } else {
          break;
        }
      }
      if (elements0.length >= 1) {
        address0 = new TreeNode(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      } else {
        address0 = FAILURE;
      }
      this._cache._refid[index0] = [address0, this._offset];
      return address0;
    },

    _read_quote () {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._quote = this._cache._quote || {};
      var cached = this._cache._quote[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var chunk0 = null, max0 = this._offset + 1;
      if (max0 <= this._inputSize) {
        chunk0 = this._input.substring(this._offset, max0);
      }
      if (chunk0 !== null && /^[\']/.test(chunk0)) {
        address0 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset, []);
        this._offset = this._offset + 1;
      } else {
        address0 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push(['awfootnote::quote', '[\\\']']);
        }
      }
      this._cache._quote[index0] = [address0, this._offset];
      return address0;
    }
  };

  var Parser = function(input, actions, types) {
    this._input = input;
    this._inputSize = input.length;
    this._actions = actions;
    this._types = types;
    this._offset = 0;
    this._cache = {};
    this._failure = 0;
    this._expected = [];
  };

  Parser.prototype.parse = function() {
    var tree = this._read_document();
    if (tree !== FAILURE && this._offset === this._inputSize) {
      return tree;
    }
    if (this._expected.length === 0) {
      this._failure = this._offset;
      this._expected.push(['awfootnote', '<EOF>']);
    }
    this.constructor.lastError = { offset: this._offset, expected: this._expected };
    throw new SyntaxError(formatError(this._input, this._failure, this._expected));
  };

  Object.assign(Parser.prototype, Grammar);


  function parse(input, options) {
    options = options || {};
    var parser = new Parser(input, options.actions, options.types);
    return parser.parse();
  }

  function formatError(input, offset, expected) {
    var lines = input.split(/\n/g),
        lineNo = 0,
        position = 0;

    while (position <= offset) {
      position += lines[lineNo].length + 1;
      lineNo += 1;
    }

    var line = lines[lineNo - 1],
        message = 'Line ' + lineNo + ': expected one of:\n\n';

    for (var i = 0; i < expected.length; i++) {
      message += '    - ' + expected[i][1] + ' from ' + expected[i][0] + '\n';
    }
    var number = lineNo.toString();
    while (number.length < 6) number = ' ' + number;
    message += '\n' + number + ' | ' + line + '\n';

    position -= line.length + 10;

    while (position < offset) {
      message += ' ';
      position += 1;
    }
    return message + '^';
  }

  function inherit(subclass, parent) {
    function chain () {};
    chain.prototype = parent.prototype;
    subclass.prototype = new chain();
    subclass.prototype.constructor = subclass;
  }


  var exported = { Grammar: Grammar, Parser: Parser, parse: parse };

  if (typeof require === 'function' && typeof exports === 'object') {
    Object.assign(exports, exported);
  } else {
    var ns = (typeof this === 'undefined') ? window : this;
    ns.awfootnote = exported;
  }
})();

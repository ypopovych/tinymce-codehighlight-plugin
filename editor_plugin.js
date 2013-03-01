(function() {
	tinymce.PluginManager.requireLangPack('codehighlight');

	tinymce.create('tinymce.plugins.CodeHighlightPlugin', {		
		init : function(ed, url) {			
			var t = this;
			t.editor = ed;
			
			ed.addCommand('mceCodeHighlight', function() {
				ed.windowManager.open({
					file : url + '/dialog.htm',
					width : 500 + parseInt(ed.getLang('codehighlight.delta_width', 0)),
					height : 300 + parseInt(ed.getLang('codehighlight.delta_height', 0)),
					inline : 1
				}, {
					plugin_url : url
				});
			});

			ed.addButton('codehighlight', {
				title : 'codehighlight.desc',
				cmd : 'mceCodeHighlight',
				image : url + '/img/icon.gif'
			});

			ed.onNodeChange.add(function(ed, cm, n) {
				var isCode = false;
				if (n.nodeName !== 'CODE') {
					var code_node = ed.dom.getParent(n, function(node) { 
							return node.nodeName == 'CODE';
					}, null);
					isCode = (code_node != null);
				} else {
					isCode = true;
				}
				
				cm.setActive('codehighlight', isCode);
				t._setDisabled(isCode);
				
				var notEmptyNode = n.innerHTML.replace(new RegExp('<\/?[^>]+>', 'gi'), '').replace(new RegExp('&nbsp;', 'gi'), '').match(/.*?[\S].*?/);
				cm.setDisabled('codehighlight', (notEmptyNode != null && !isCode)); 
			});
		},
		
		createControl : function(n, cm) {
			return null;
		},

		getInfo : function() {
			return {
				longname : 'Code Highlight Plugin',
				author : 'Yegor Popovich',
				authorurl : 'http://g.if.ua',
				infourl : 'http://g.if.ua',
				version : "0.1"
			};
		},
		
		
		_block : function(ed, e) {
			var k = e.keyCode;

			// Don't block arrow keys, pg up/down, and F1-F12
			if (k == 46 || (k > 32 && k < 41) || (k > 111 && k < 124))
				return;

			if (e.preventDefault) {
				e.preventDefault();
				e.stopPropagation();
			}
			else {
				e.returnValue = false;
				e.cancelBubble = true;
			}
			return false;
		},

		_setDisabled : function(s) {
			var t = this, ed = t.editor;

			tinymce.each(ed.controlManager.controls, function(c) {
				if(c.settings.cmd != 'mceCodeHighlight') {
					c.setDisabled(s);
				}
			});

			if (s !== t.disabled) {
				if (s) {
					ed.onKeyDown.addToTop(t._block);
					ed.onKeyPress.addToTop(t._block);
					ed.onKeyUp.addToTop(t._block);
					ed.onPaste.addToTop(t._block);
				} else {
					ed.onKeyDown.remove(t._block);
					ed.onKeyPress.remove(t._block);
					ed.onKeyUp.remove(t._block);
					ed.onPaste.remove(t._block);
				}

				t.disabled = s;
			}
		}
	});

	// Register plugin
	tinymce.PluginManager.add('codehighlight', tinymce.plugins.CodeHighlightPlugin);
})();
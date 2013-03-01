tinyMCEPopup.requireLangPack();

var CodeHighlightDialog = {
	wrapper: document.createElement('div'),
	
	getCodeNode: function(ed) {
		var node = ed.selection.getNode();
		if (node.nodeName != 'CODE') {
			node = ed.dom.getParent(node, function(the_node) { 
							return the_node.nodeName == 'CODE';
					}, null);
		}
		return node;
	},
	
	init : function(ed, url) {
		this.resize();
		
		var f = document.forms[0];
		var cnt = '';
		var code_node = this.getCodeNode(ed);
		
		if (code_node != null) {
			cnt = code_node.innerHTML;
			if (code_node.hasAttributes()) {
				f.mlanguage.value = code_node.getAttribute('class');
			}
		}
		cnt = tinyMCEPopup.dom.decode(cnt);
		f.content.value = cnt.replace(new RegExp('<\/?[^>]+>', 'gi'), '').replace(new RegExp('&nbsp;', 'gi'), '')
	},

	wrap : function(code) {
		var data = '<code';
		var f = document.forms[0];
		if (f.mlanguage.value == 'auto') {
    		data += '>'; 
    	} else {
    		data += ' class="' + f.mlanguage.value + '">'; 
    	};
    	data += code + '</code>';
    	this.wrapper.innerHTML = data;
		hljs.highlightBlock(this.wrapper.firstChild, '    ');
		return this.wrapper.innerHTML
	},

	insert : function() {	
		var cnt = tinyMCEPopup.dom.encode(document.forms[0].content.value);
		
		var node = this.getCodeNode(tinyMCEPopup.editor);
		
		if (node != null) {
			if (cnt === '') {
				var parent = node.parentNode;
				parent.parentNode.removeChild(parent);
			} else {
				node.parentNode.innerHTML =  this.wrap(cnt);
			}
		}
		else {
			cnt = '<pre>'+this.wrap(cnt)+'</pre><p></p>';
			tinyMCEPopup.execCommand(tinyMCEPopup.isGecko ? 'insertHTML' : 'mceInsertContent', false, cnt);
		}
		
		tinyMCEPopup.restoreSelection();
		tinyMCEPopup.close();
	},
	
	resize : function() {
		var vp = tinyMCEPopup.dom.getViewPort(window), el;

		el = document.forms[0].content;

		el.style.width  = (vp.w - 20) + 'px';
		el.style.height = (vp.h - 80) + 'px';
	}
};

tinyMCEPopup.onInit.add(CodeHighlightDialog.init, CodeHighlightDialog);

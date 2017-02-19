/*chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) { 
     
    
    }
  }
);
*/

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	console.log(message);
  if(message.popupOpen) { /* do your stuff */ 
	 chrome.runtime.sendMessage({"message": "open_new_tab", "url": "https://www.facebook.com/messages/"});
  }
});

getFriendIds();

function getFriendIds() {

    var domString = DOMtoString(document);
	var friendIdsJson = JSON.parse(domString.match("\"shortProfiles\":(.*),\"nearby\":")[1]);
	var friendIds = []
	for(var id in friendIdsJson){
	  friendIds.push(id);
	}
	console.log(friendIds);
	chrome.runtime.sendMessage({"message": "page_loaded", "friendIds": friendIds});
  
};

// @author Rob W <http://stackoverflow.com/users/938089/rob-w>
// Demo: var serialized_html = DOMtoString(document);

function DOMtoString(document_root) {
    var html = '',
        node = document_root.firstChild;
    while (node) {
        switch (node.nodeType) {
        case Node.ELEMENT_NODE:
            html += node.outerHTML;
            break;
        case Node.TEXT_NODE:
            html += node.nodeValue;
            break;
        case Node.CDATA_SECTION_NODE:
            html += '<![CDATA[' + node.nodeValue + ']]>';
            break;
        case Node.COMMENT_NODE:
            html += '<!--' + node.nodeValue + '-->';
            break;
        case Node.DOCUMENT_TYPE_NODE:
            // (X)HTML documents are identified by public identifiers
            html += "<!DOCTYPE " + node.name + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '') + (!node.publicId && node.systemId ? ' SYSTEM' : '') + (node.systemId ? ' "' + node.systemId + '"' : '') + '>\n';
            break;
        }
        node = node.nextSibling;
    }
    return html;
};

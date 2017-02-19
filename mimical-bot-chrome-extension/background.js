// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
	console.log("clicked")
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  });
});

chrome.runtime.onMessage.addListener(
	  function(request, sender, sendResponse) {
		if( request.message === "open_new_tab" ) {
		  console.log("make new tab")
		  chrome.tabs.create({"url": request.url});
		}
	  }
	);

var getFriendIds = new Promise( function(resolve) {
	chrome.runtime.onMessage.addListener(
	  function(request, sender, sendResponse) {
		if( request.message === "page_loaded" ) {
		  console.log(request.friendIds); 
		  resolve(request.friendIds);
		}
	  }
	);
});

var getCookieValue = new Promise( function(resolve) {
  chrome.webRequest.onSendHeaders.addListener(function(details){
  const headers = details.requestHeaders;
  for( var i = 0, l = headers.length; i < l; ++i ) {
	if	(headers[i].name === "Cookie") {
		//console.log(headers[i].value); 
		resolve(headers[i].value);
	}
  }
 
},
{urls: [ "https://www.facebook.com/ajax/mercury/thread_info.php?dpr=1" ]},['requestHeaders']);
});


var getPostBody = new Promise( function(resolve) {
	chrome.webRequest.onBeforeRequest.addListener(function(details){
	  var formData = decodeURIComponent(String.fromCharCode.apply(null,
										  new Uint8Array(details.requestBody.raw[0].bytes)));
	  var postBody = {};
	  const params = new URLSearchParams(formData);
	  postBody['__user'] = params.get('__user');
	  postBody['__a'] = params.get('__a');
	  postBody['__dyn'] = params.get('__dyn');
	  postBody['__req'] = params.get('__req');
	  postBody['fb_dtsg'] = params.get('fb_dtsg');
	  postBody['ttstamp'] = params.get('ttstamp');
	  postBody['__rev'] = params.get('__rev');
	  //console.log(postBody); 
	  resolve(postBody);

	},
	{urls: [ "https://www.facebook.com/ajax/mercury/thread_info.php?dpr=1" ]},['requestBody']);
});


// This function is called onload in the popup code
function getPageDetails(callback) { 
    // Inject the content script into the current page 
    chrome.tabs.executeScript(null, { file: 'content.js' }); 
    // Perform the callback when a message is received from the content script
    chrome.runtime.onMessage.addListener(function(message)  { 
        // Call the callback function
        callback(message); 
    }); 
};

Promise.all([getFriendIds, getPostBody, getCookieValue]).then(function(payloads) {
	var postData = {}
	postData['facebookId'] = payloads[1]['__user'];
	postData['facebookCookie'] = payloads[2]
	postData['facebookPostBody'] = payloads[1]
	postData['friendIds'] = payloads[0]
    console.log("All my payload", payloads);
	console.log(postData)
});



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
var React = require('react');

function KeysManagement(){
  return(
    <div>
      <div id="pubkey" className="item">Public Key</div>
      <div className="ui fluid popup bottom left transition hidden">
        <textarea id="popupPubkey" rows="10" cols="70">
          LaClavePublicaaaaa
        </textarea>
      </div>
    </div>
  )
}

module.exports = KeysManagement;

var peerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection ||
                       window.webkitRTCPeerConnection || window.msRTCPeerConnection;
var sessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription ||
                       window.webkitRTCSessionDescription || window.msRTCSessionDescription;

RTC = function(caller) {
  var conf = null;
  this._offerOptions = { offerToReceiveAudio: true };
  this._caller = caller || false;

  this._pc = new RTCPeerConnection(conf);

  this._pc.onicecandidate = this._onIceCandidate;
  this._pc.onaddstream = this._onAddStream;

  Tracker.autorun(this._connection);
};

RTC.prototype._onIceCandidate = function(e) {
  //TODO: what the fuck is this?
  console.log(e);
};

RTC.prototype._onAddStream = function(e) {
  //TODO: new stream!! Show it!
};

RTC.prototype._saveLocalDes = function(des, caller) {
  var id = Meteor.userId();

  this._pc.setLocalDescription(des);
  Rooms.update({ $or: [{ owner: id }, { 'person.id':id }, { 'spirit.id':id }] }, { $set: caller ? { 'caller.local':desc } : { 'callee.local':desc } });
};

RTC.prototype._saveRemoteDes = function(des, caller) {
  var id = Meteor.userId();

  this._pc.setRemoteDescription(des);
  Rooms.update({ $or: [{ owner: id }, { 'person.id':id }, { 'spirit.id':id }] }, { $set: caller ? { 'caller.remote':desc } : { 'callee.remote':desc } });
};

RTC.prototype._offerSuccess = function(offer) {
  // Save the offer in local.
  this._saveLocalDes(offer, this._caller);
};

RTC.prototype._createOffer = function() {
  //TODO: create offer
  this._pc.createOffer(this._offerSuccess, this._fail, this._offerOptions);
};

RTC.prototype._createAnswer = function() {
  //TODO: answer
};

RTC.prototype._connection = function() {
  var room = Rooms.findOne({ $or: [{ owner: id }, { 'person.id':id }, { 'spirit.id':id }] },
      { field: this._caller ? { caller:1 } : { callee:1 } });

};

RTC.prototype._handleCall = function(caller) {

};

RTC.prototype._fail = function() {

};
